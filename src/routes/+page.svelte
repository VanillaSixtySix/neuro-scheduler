<script lang="ts">
    import { onMount } from "svelte";
	import { base } from "$app/paths";
	import InputDay from "../components/InputDay.svelte";
    import type { InputDayEvent } from "$lib/InputDayEvent";
    import { Button, ButtonGroup, Col, Container, FormGroup, Input, Label, Row, TabContent, TabPane } from "sveltestrap";

    let imgElemBase: HTMLImageElement;

    let canvas: HTMLCanvasElement;

    class DayOfWeek {
        name: string;
        title: string;
        time: string;
        date: Date;
        dateOffset: [[number, number], [number, number]];
        online: boolean;
        coords: [number, number];
        titleCharSpacing: number;
        imgOnline: string;
        imgOffline: string;
        imgElemOnline: HTMLImageElement | null;
        imgElemOffline: HTMLImageElement | null;

        constructor(name: string, dateOffset: number, dateStrOffset: [[number, number], [number, number]], coords: [number, number]) {
            this.name = name;
            this.title = 'TBD';
            this.time = 'TBD BST';
            this.date = new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + dateOffset);
            this.dateOffset = dateStrOffset;
            this.online = true;
            this.coords = coords;
            this.titleCharSpacing = 4;
            this.imgOnline = base + '/images/online/' + name.toLowerCase() + '.png';
            this.imgOffline = base + '/images/offline/' + name.toLowerCase() + '.png';
            this.imgElemOnline = null;
            this.imgElemOffline = null;
        }
    }

    const today = new Date();
    // input[type="date"] requires YYYY-MM-DD
    let todayStr = today.toISOString().split('T')[0];

    // default to this week
    const thisMonday = new Date();
    thisMonday.setDate(thisMonday.getDate() + (1 - thisMonday.getDay()));

    let discordTimestamps = 'TODO';

    const daysOfWeek: DayOfWeek[] = [
        new DayOfWeek('Monday', 0, [[0, 0], [0, 0]], [1192, 78]),
        new DayOfWeek('Tuesday', 1, [[0, 0], [0, 0]], [1160, 221]),
        new DayOfWeek('Wednesday', 2, [[-1, -1], [-1, -1]], [1128, 363]),
        new DayOfWeek('Thursday', 3, [[-2, 0], [0, -1]], [1096, 505]),
        new DayOfWeek('Friday', 4, [[-1, 0], [0, 0]], [1065, 647]),
        new DayOfWeek('Saturday', 5, [[0, 0], [0, 0]], [1034, 789]),
        new DayOfWeek('Sunday', 6, [[2, 0], [0, -1]], [1004, 933])
    ];

    let ctx: CanvasRenderingContext2D;

    function redraw() {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.drawImage(imgElemBase, 0, 0);

        for (const day of daysOfWeek) {
            ctx?.drawImage(day.online ? day.imgElemOnline! : day.imgElemOffline!, day.coords[0], day.coords[1]);
            if (day.online) {
                drawTitle(day);
                drawTime(day);
            } else {
                drawOffline(day);
            }
            drawDayOfMonth(day);
        }
    }

    onMount(() => {
        ctx = canvas.getContext("2d")!;

        canvas.width = 1920;
        canvas.height = 1080;

        redraw();

        // Slight delay to hopefully allow fonts to load
        setTimeout(() => {
            updateTimestamps();
            redraw();
        }, 500);
    });

    function drawTitle(day: DayOfWeek) {
        let x = day.coords[0] + 265;
        const y = day.coords[1] + 25;
        const text = day.title;
        ctx.font = "700 18pt Jost";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#FFFFFF";
        for (let char of text) {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + day.titleCharSpacing;
        }
    }

    function drawTime(day: DayOfWeek) {
        let x = day.coords[0] + 266;
        const y = day.coords[1] + 56;
        const text = day.time;
        ctx.font = "700 14pt Jost";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#3C0036";
        for (let char of text) {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + 5.6;
        }
    }

    function drawOffline(day: DayOfWeek) {
        let x = day.coords[0] + 265;
        const y = day.coords[1] + 38;
        const text = 'OFFLINE';
        ctx.font = "700 18pt Jost";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#FFFFFF";
        for (let char of text) {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + 5.6;
        }
    }

    function drawDayOfMonth(day: DayOfWeek) {
        const x = daysOfWeek.indexOf(day) * -10 + 1418 + day.dateOffset[0][0];
        const y = day.coords[1] + 25 + day.dateOffset[0][1];
        const text = day.date
            .getDate()
            .toString()
            .padStart(2, '0')
            .split('');
        ctx.font = "400 17pt 'Engravers MT'";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#FFFFFF";
        ctx.setTransform(1, 0, -0.15, 1, 0, 0);
        ctx.fillText(text[0], x, y);
        ctx.fillText(text[1], x + day.dateOffset[1][0], y + 29 + day.dateOffset[1][1]);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function inputDayHandler(event: CustomEvent<InputDayEvent>) {
        let { day, online, title, time, titleCharSpacing } = event.detail;

        const dayOfWeek = daysOfWeek.find(d => d.name === day)!;

        if (online != null) {
            dayOfWeek.online = online;
        }
        if (title != null) {
            dayOfWeek.title = title;
        }
        if (time != null) {
            dayOfWeek.time = time;
            setTimeForValidStrings();
        }
        if (titleCharSpacing != null) {
            dayOfWeek.titleCharSpacing = titleCharSpacing;
        } 

        redraw();
    }

    function updateDate(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (value === '' || value.startsWith('0')) {
            return;
        }
        const date = new Date((event.target as HTMLInputElement).value + 'T00:00:00');
        let monday: Date;
        console.log(date.getDay())
        if (date.getDay() === 1) {
            monday = date;
            console.log('day is already monday', date);
        } else {
            monday = new Date(date.setDate(date.getDate() - (date.getDay() || 7) + 1));
            console.log('set to monday', monday);
        }
        for (const day of daysOfWeek) {
            day.date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + daysOfWeek.indexOf(day));
        }
        redraw();
    }

    function setWeek(date: Date) {
        let monday: Date;
        if (date.getDay() === 1) {
            monday = date;
        } else {
            monday = new Date(date.setDate(date.getDate() - (date.getDay() || 7) + 1));
        }
        todayStr = monday.toISOString().split('T')[0];
        for (const day of daysOfWeek) {
            day.date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + daysOfWeek.indexOf(day));
        }
        setTimeForValidStrings();
        updateTimestamps();
        redraw();
    }

    function nextWeek() {
        const now = today;
        now.setDate(now.getDate() + 7);
        setWeek(now);
    }

    function resetDate() {
        setWeek(new Date());
    }

    function copy() {
        canvas.toBlob(blob => {
            navigator.clipboard.write([
                new ClipboardItem({
                    [blob!.type]: blob!
                })
            ]);
        });
    }

    function download() {
        const link = document.createElement('a');
        link.download = 'schedule.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    function setTimeForValidStrings() {
        const regex = /^(\d{1,2})(?::(\d{2}))?\s*([AP]M)\s*([A-Z]{2,4})?$/i;

        for (const day of daysOfWeek) {
            const match = day.time.match(regex);

            console.log(day.time, match);

            if (match) {
                const hour = parseInt(match[1], 10);
                const minute = match[2] ? parseInt(match[2], 10) : 0;
                const isPm = match[3].toLowerCase() === 'pm';

                // Check if hour and minute are valid
                if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
                    const newHour = isPm && hour !== 12 ? hour + 12 : (hour === 12 && !isPm) ? 0 : hour;
                    console.log(newHour, minute);
                    day.date.setHours(newHour, minute, 0, 0);
                }
            }
        }
    }

    function updateTimestamps() {
        // Update discordTimestamps with each day's date on a new line in the format <t:TIMESTAMP:F>
        const timestamps = daysOfWeek.map(day => `<t:${Math.floor(day.date.getTime() / 1000)}:F>`);
        discordTimestamps = timestamps.join('\n');
    }
</script>

<svelte:head>
    <link rel="stylesheet" href="https://indestructibletype.com/fonts/Jost.css" type="text/css" charset="utf-8" />
</svelte:head>

<div class="outer-container">
    <canvas id="canvas" bind:this={canvas}></canvas>
    <div class="schedule-input">
        <TabContent>
            <TabPane tabId="main" tab="Main" active>
                <Row noGutters>
                    <Col xs="6">
                        <Input type="date" name="start" id="start" on:change={updateDate} bind:value={todayStr} bsSize="sm" />
                    </Col>
                    <Col xs="6">
                        <Row>
                            <Col>
                                <ButtonGroup class="d-flex">
                                    <Button color="secondary" size="sm" on:click={nextWeek}>Next Week</Button>
                                    <Button color="danger" size="sm" on:click={resetDate}>Reset</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row noGutters>
                    <Col>
                        <ButtonGroup class="d-flex">
                            <Button color="primary" size="sm" on:click={redraw}>Redraw</Button>
                            <Button color="success" size="sm" on:click={copy}>Copy</Button>
                            <Button color="success" size="sm" on:click={download}>Download</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <!-- <input type="date" id="start" name="start" value={todayStr} on:change={updateDate} /> -->
                {#each daysOfWeek as day}
                    <InputDay day={day.name} on:message={inputDayHandler} bind:online={day.online} />
                {/each}
            </TabPane>
            <TabPane tabId="discord" tab="Discord" disabled>
                <h3>Discord Schedule Maker</h3>
                <Input type="textarea" name="discord" id="discord-timestamps" readonly bind:value={discordTimestamps} rows={7} />
            </TabPane>
        </TabContent>
    </div>
</div>

<div class="assets">
    <img src="{base}/images/base.png" bind:this={imgElemBase} alt="NeuroSchedule Base" width="1920px" height="1080px">
    {#each daysOfWeek as day}
        <img src="{day.imgOnline}" bind:this={day.imgElemOnline} alt="NeuroSchedule Online {day.name}">
        <img src="{day.imgOffline}" bind:this={day.imgElemOffline} alt="NeuroSchedule Offline {day.name}">
    {/each}
</div>

<style>
:global(body) {
    background: #1F1F4F;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    width: 100vw;
    height: 100vh;
}

:global(.form-check-label, .form-label) {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

:global(.card-title .form-check .form-check-label) {
    margin-top: 2px;
}

:global(  input::-webkit-calendar-picker-indicator) {
    cursor: pointer;
}

:global(.btn:focus, .btn:active:focus, .btn.active:focus) {
    outline: none !important;
    box-shadow: none;
}

:global(.bg-blue) {
    background-color: #3F3F8F;
}

:global(.tab-content .nav-link) {
    color: #FFFFFF;
}

:global(.tab-pane) {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    gap: 5px;
}

.outer-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: 25px;
    gap: 25px;
}

#canvas {
    background: #2F2F5F;
    border: 2px solid #000000;
    flex-grow: 0;
    max-width: 100vw;
    aspect-ratio: 16 / 9;
    height: fit-content;
    max-height: 100%;
    position: relative;
    overflow: hidden;
}

.schedule-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 356px;
    flex-shrink: 0;
    overflow-x: hidden;
    color: #FFFFFF;
}

@media (max-width: 1100px) {
    .outer-container {
        flex-direction: column;
        overflow-x: hidden;
    }

    #canvas {
        overflow: visible;
    }

    .schedule-input {
        width: 100%;
    }
}

.assets {
    display: none;
}
</style>
