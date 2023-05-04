<script lang="ts">
    import { onMount } from "svelte";
	import { base } from "$app/paths";
	import InputDay from "../components/InputDay.svelte";
    import type { InputDayEvent } from "$lib/InputDayEvent";
    import { Button, ButtonGroup, Col, Container, FormGroup, Input, Label, Row } from "sveltestrap";

    let imgElemBase: HTMLImageElement;

    let canvas: HTMLCanvasElement;

    interface DayOfWeek {
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
    }

    const sampleTitle = 'TBD';
    const sampleTime = 'TBD BST';
    const sampleTitleCharSpacing = 4;

    const today = new Date();
    // yyyy-mm-dd for input[type=date]
    let todayStr = today.toISOString().split('T')[0];

    // default to this week
    const thisMonday = new Date();
    thisMonday.setDate(thisMonday.getDate() + (1 - thisMonday.getDay()));

    const daysOfWeek: DayOfWeek[] = [
        {
            name: 'Monday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (1 - thisMonday.getDay())),
            dateOffset: [[0, 0], [0, 0]],
            online: true,
            coords: [1192, 78],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/monday.png',
            imgOffline: base + '/images/offline/monday.png',
            imgElemOnline: null,
            imgElemOffline: null
        },
        {
            name: 'Tuesday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (2 - thisMonday.getDay())),
            dateOffset: [[0, 0], [0, 0]],
            online: true,
            coords: [1160, 221],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/tuesday.png',
            imgOffline: base + '/images/offline/tuesday.png',
            imgElemOnline: null,
            imgElemOffline: null
        },
        {
            name: 'Wednesday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (3 - thisMonday.getDay())),
            dateOffset: [[-1, -1], [-1, -1]],
            online: true,
            coords: [1128, 363],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/wednesday.png',
            imgOffline: base + '/images/offline/wednesday.png',
            imgElemOnline: null,
            imgElemOffline: null
        },
        {
            name: 'Thursday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (4 - thisMonday.getDay())),
            dateOffset: [[-2, 0], [0, -1]],
            online: true,
            coords: [1096, 505],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/thursday.png',
            imgOffline: base + '/images/offline/thursday.png',
            imgElemOnline: null,
            imgElemOffline: null
        },
        {
            name: 'Friday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (5 - thisMonday.getDay())),
            dateOffset: [[-1, 0], [0, 0]],
            online: true,
            coords: [1065, 648],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/friday.png',
            imgOffline: base + '/images/offline/friday.png',
            imgElemOnline: null,
            imgElemOffline: null
        },
        {
            name: 'Saturday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (6 - thisMonday.getDay())),
            dateOffset: [[0, 0], [0, 0]],
            online: true,
            coords: [1034, 789],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/saturday.png',
            imgOffline: base + '/images/offline/saturday.png',
            imgElemOnline: null,
            imgElemOffline: null
        },
        {
            name: 'Sunday',
            title: sampleTitle,
            time: sampleTime,
            date: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() + (7 - thisMonday.getDay())),
            dateOffset: [[2, 0], [0, -1]],
            online: true,
            coords: [1004, 933],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: base + '/images/online/sunday.png',
            imgOffline: base + '/images/offline/sunday.png',
            imgElemOnline: null,
            imgElemOffline: null
        }
    ];

    let ctx: CanvasRenderingContext2D;

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
</script>

<svelte:head>
    <link rel="stylesheet" href="https://indestructibletype.com/fonts/Jost.css" type="text/css" charset="utf-8" />
</svelte:head>

<Row>
    <Col xs="10">
        <canvas id="canvas" bind:this={canvas}></canvas>
    </Col>
    <Col xs="2">
        <div class="schedule-input">
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
        </div>
    </Col>
</Row>

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
    /* color: #DEDEDE; */
    padding: 25px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
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

#canvas {
    background: #2F2F5F;
    border: 2px solid #000000;

    width: 100%;
}

.schedule-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.assets {
    display: none;
}
</style>
