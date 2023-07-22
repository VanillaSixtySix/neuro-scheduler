<script lang="ts">
    import { onMount } from "svelte";
	import { base } from "$app/paths";
	import InputDay from "../components/InputDay.svelte";
    import type { InputDayEvent } from "$lib/InputDayEvent";
    import { Button, ButtonGroup, Col, Input, Row, TabContent, TabPane } from "sveltestrap";
    import { getDateStr, getDateWithOffset, getDayWithOffset, getMonday } from "$lib/DateUtils";
    import ScheduleEntry from "$lib/ScheduleEntry";
    import { browser } from '$app/environment';

    let imgElemBase: HTMLImageElement;
    // TODO: Clean this up
    let imgElemOnline1: HTMLImageElement;
    let imgElemOnline2: HTMLImageElement;
    let imgElemOnline3: HTMLImageElement;
    let imgElemOnline4: HTMLImageElement;
    let imgElemOnline5: HTMLImageElement;
    let imgElemOnline6: HTMLImageElement;
    let imgElemOnline7: HTMLImageElement;
    let imgElemOffline1: HTMLImageElement;
    let imgElemOffline2: HTMLImageElement;
    let imgElemOffline3: HTMLImageElement;
    let imgElemOffline4: HTMLImageElement;
    let imgElemOffline5: HTMLImageElement;
    let imgElemOffline6: HTMLImageElement;
    let imgElemOffline7: HTMLImageElement;

    let canvas: HTMLCanvasElement;

    const offsets = [
        {
            dayOffset: [50, 35],
            daySpacing: 7,
            dateOffset: [[0, 0], [0, 0]],
            coords: [1192, 78],
        },
        {
            dayOffset: [56, 34],
            daySpacing: 7,
            dateOffset: [[0, 0], [0, 0]],
            coords: [1160, 221],
        },
        {
            dayOffset: [51, 35],
            daySpacing: 5.6,
            dateOffset: [[-1, -1], [-1, -1]],
            coords: [1128, 363],
        },
        {
            dayOffset: [55, 35],
            daySpacing: 5,
            dateOffset: [[-2, 0], [0, -1]],
            coords: [1096, 505],
        },
        {
            dayOffset: [65, 35],
            daySpacing: 5.6,
            dateOffset: [[-1, 0], [0, 0]],
            coords: [1065, 647],
        },
        {
            dayOffset: [63, 35],
            daySpacing: 2,
            dateOffset: [[0, 0], [0, 0]],
            coords: [1034, 789]
        },
        {
            dayOffset: [59, 35],
            daySpacing: 5,
            dateOffset: [[2, 0], [0, -1]],
            coords: [1004, 933],
        }
    ];

    // This is necessary due to spacing between certain letters like S and A
    // Contains two element arrays of # of pixels between each letter
    const dayLetterOffsets = {
        MON: [7, 7],
        TUE: [7, 7],
        WED: [5.6, 5.6],
        THU: [5, 5],
        FRI: [5.6, 5.6],
        SAT: [2, -2],
        SUN: [5, 5],
    };

    // Sadly Firefox doesn't support textBaseline = "hanging" so we have to
    const isFirefox = browser ? navigator.userAgent.indexOf("Firefox") != -1 : false;
    const firefoxDayLetterOffsets = [0, 10];
    const firefoxDateOffsets = [-1, 2];
    const firefoxTitleOffsets = [0, 7];
    const firefoxTimeOffsets = [0, 5];

    // Width of container for day of week text
    const dayContainerWidth = 208;
    const dayContainerHeight = 101;

    // Text colors, emulating gradient from top -> bottom
    const dayTextColors = {
        online: [
            '#5F004D',
            '#60004B',
            '#600047',
            '#630044',
            '#65003D',
            '#690038',
            '#6A0031',
        ],
        offline: [
            '#F949ED',
            '#F949E9',
            '#F948E3',
            '#FA46DD',
            '#FB47D1',
            '#FC45C2',
            '#FD43B3',
        ],
    };

    let startDate = getMonday(new Date());
    // Doing this because toISOString() converts to UTC
    let todayStr = getDateStr(startDate);

    // default to this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()));

    let scheduleEntries: ScheduleEntry[] = [
        new ScheduleEntry(),
        new ScheduleEntry(),
        new ScheduleEntry(),
        new ScheduleEntry(),
        new ScheduleEntry(),
        new ScheduleEntry(),
        new ScheduleEntry(),
    ];

    let ctx: CanvasRenderingContext2D;

    function redraw() {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.drawImage(imgElemBase, 0, 0);

        for (let i = 0; i < scheduleEntries.length; i++) {
            const entry = scheduleEntries[i];
            const offset = offsets[i];
            ctx?.drawImage(entry.online ? eval('imgElemOnline' + (i + 1))! : eval('imgElemOffline' + (i + 1))!, offset.coords[0], offset.coords[1]);
            if (entry.online) {
                drawTitle(i, entry);
                drawTime(i, entry);
            } else {
                drawOffline(i);
            }
            drawDayOfMonth(i, entry);
            drawDayOfWeek(i, entry);
        }
    }

    onMount(() => {
        ctx = canvas.getContext("2d")!;

        canvas.width = 1920;
        canvas.height = 1080;

        redraw();

        // Slight delay to hopefully allow fonts to load
        setTimeout(() => {
            redraw();
        }, 500);
    });

    function drawTitle(i: number, entry: ScheduleEntry) {
        let x = offsets[i].coords[0] + 265 + (isFirefox ? firefoxTitleOffsets[0] : 0);
        const y = offsets[i].coords[1] + 25 + (isFirefox ? firefoxTitleOffsets[1] : 0);
        const text = entry.title;
        ctx.font = "700 18pt Jost";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#FFFFFF";
        for (let char of text) {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + entry.titleCharSpacing;
        }
    }

    function drawTime(i: number, entry: ScheduleEntry) {
        let x = offsets[i].coords[0] + 266 + (isFirefox ? firefoxTimeOffsets[0] : 0);
        const y = offsets[i].coords[1] + 56 + (isFirefox ? firefoxTimeOffsets[1] : 0);
        const text = entry.time;
        ctx.font = "700 14pt Jost";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#3C0036";
        for (let char of text) {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + 5.6;
        }
    }

    function drawOffline(i: number) {
        let x = offsets[i].coords[0] + 265;
        const y = offsets[i].coords[1] + 38;
        const text = 'OFFLINE';
        ctx.font = "700 18pt Jost";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#FFFFFF";
        for (let char of text) {
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + 5.6;
        }
    }

    function drawDayOfMonth(i: number, entry: ScheduleEntry) {
        const x = scheduleEntries.indexOf(entry) * -10 + 1418 + offsets[i].dateOffset[0][0] + (isFirefox ? firefoxDateOffsets[0] : 0);
        const y = offsets[i].coords[1] + 25 + offsets[i].dateOffset[0][1] + (isFirefox ? firefoxDateOffsets[1] : 0);
        const text = getDateWithOffset(startDate, i)
            .getDate()
            .toString()
            .padStart(2, '0')
            .split('');
        ctx.font = "400 17pt 'Engravers MT'";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = "#FFFFFF";
        ctx.setTransform(1, 0, -0.15, 1, 0, 0);
        ctx.fillText(text[0], x, y);
        ctx.fillText(text[1], x + offsets[i].dateOffset[1][0], y + 29 + offsets[i].dateOffset[1][1]);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function drawDayOfWeek(i: number, entry: ScheduleEntry) {
        const text = getDayWithOffset(startDate, i, true);
        // TODO: Update with the proper font
        ctx.font = "400 27pt 'Larissa'";
        // TODO: Change if online/offline and based on offset
        if (entry.online) {
            ctx.fillStyle = dayTextColors.online[i];
        } else {
            ctx.fillStyle = dayTextColors.offline[i];
        }
        const dayLetterOffset = dayLetterOffsets[text as keyof typeof dayLetterOffsets];
        // Before rendering, calculate initial X offset
        //  based on (dayContainerWidth / 2) - (rendered text / 2)
        let renderedTextSize = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            renderedTextSize += ctx.measureText(char).width + (dayLetterOffset[i] || 0);
        }
        let x = offsets[i].coords[0] + ((dayContainerWidth / 2) - (renderedTextSize / 2)) + (isFirefox ? firefoxDayLetterOffsets[0] : 0);
        let y = offsets[i].coords[1] + ((dayContainerHeight / 2) - (27 / 2) - 2) + (isFirefox ? firefoxDayLetterOffsets[1] : 0);
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            ctx.fillText(char, x, y);
            x += ctx.measureText(char).width + (dayLetterOffset[i] || 0);
        }
        // for (let char of text) {
        //     ctx.fillText(char, x, y);
        //     x += ctx.measureText(char).width + offsets[i].daySpacing;
        // }
        // ctx.fillText(text, x, y);
    }

    function inputDayHandler(event: CustomEvent<InputDayEvent>) {
        let { offset, online, title, time, titleCharSpacing } = event.detail;

        const dayOfWeek = scheduleEntries[offset];

        if (typeof online === 'boolean') {
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
        // const date = new Date((event.target as HTMLInputElement).value + 'T00:00:00');
        startDate = new Date((event.target as HTMLInputElement).value + 'T00:00:00');
        redraw();
    }

    function setWeek(date: Date, useMonday = false) {
        startDate = useMonday ? getMonday(date) : date;
        todayStr = getDateStr(startDate);
        redraw();
    }

    function today() {
        startDate = new Date();
        todayStr = getDateStr(startDate);
        redraw();
    }

    function nextWeek() {
        const now = new Date(startDate.getTime());
        now.setDate(now.getDate() + 7);
        setWeek(now);
    }

    function resetDate() {
        setWeek(new Date(), true);
    }

    let copyText = 'Copy';
    if (isFirefox) copyText = 'Copying unavailabile';
    function copy() {
        copyText = 'Copying...';
        const copied = () => {
            copyText = 'Copied!';
            setTimeout(() => {
                copyText = 'Copy';
            }, 3000);
        };
        const copyFailed = () => {
            copyText = 'Error :(';
            setTimeout(() => {
                copyText = 'Copy';
            }, 3000);
        };
        canvas.toBlob(blob => {
            navigator.clipboard.write([
                new ClipboardItem({
                    [blob!.type]: blob!
                })
            ])
            .then(copied)
            .catch(copyFailed);
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
    <link rel="stylesheet" href="https://indestructibletype.com/fonts/Jost.css" type="text/css" />

    <meta property="og:title" content="Neuro Schedule Maker">
    <meta property="og:description" content="Simple tool for making schedule images for Neuro-sama.">
    <meta property="og:image" content="https://flyingsixtysix.github.io/neuro-scheduler/images/schedule.png">
</svelte:head>

<div class="outer-container">
    <canvas id="canvas" bind:this={canvas}></canvas>
    <div class="schedule-input">
        <TabContent>
            <TabPane tabId="main" tab="Main" active>
                <Row noGutters>
                    <Col xs="5">
                        <Input type="date" name="start" id="start" on:change={updateDate} bind:value={todayStr} bsSize="sm" />
                    </Col>
                    <Col xs="7">
                        <Row>
                            <Col>
                                <ButtonGroup class="d-flex">
                                    <Button color="primary" size="sm" on:click={today} title="Changes the starting date to today">Today</Button>
                                    <Button color="secondary" size="sm" on:click={nextWeek} title="Adds a week to the starting date">Week++</Button>
                                    <Button color="danger" size="sm" on:click={resetDate} title="Resets the starting date to this Monday">Reset</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row noGutters>
                    <Col>
                        <ButtonGroup class="d-flex">
                            <Button color="primary" size="sm" on:click={redraw} title="Redraws the canvas (use if fonts are weird)">Redraw</Button>
                            <Button color="success" size="sm" on:click={copy} disabled={isFirefox} title="Copies the rendered canvas to clipboard">{copyText}</Button>
                            <Button color="success" size="sm" on:click={download} title="Downloads the rendered canvas">Download</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <!-- <input type="date" id="start" name="start" value={todayStr} on:change={updateDate} /> -->
                {#each scheduleEntries as entry, i}
                    <InputDay bind:startDate={startDate} offset={i} on:message={inputDayHandler} bind:online={entry.online} />
                {/each}
            </TabPane>
            <TabPane tabId="message" tab="💜 v1.0.0">
                <span>Made with 💜 by <span class="name"><span class="vanilla">Vanilla</span>SixtySix</span></span>
                <span>Stream schedule image base by <a href="https://twitter.com/Frequence_">fFrequence</a></span>
                <span>Watch Bocchi the Rock!</span>
                <div class="boccher">
                    <div class="blue"></div>
                    <div class="yellow"></div>
                </div>
                <img src="{base}/images/nuero.gif" width="350px" height="350px" alt="nuero" />
            </TabPane>
        </TabContent>
    </div>
</div>

<div class="assets">
    <img src="{base}/images/base.png" bind:this={imgElemBase} alt="NeuroSchedule Base" width="1920px" height="1080px">
    <img src="{base}/images/online/1.png" bind:this={imgElemOnline1} alt="NeuroSchedule Online 1">
    <img src="{base}/images/online/2.png" bind:this={imgElemOnline2} alt="NeuroSchedule Online 2">
    <img src="{base}/images/online/3.png" bind:this={imgElemOnline3} alt="NeuroSchedule Online 3">
    <img src="{base}/images/online/4.png" bind:this={imgElemOnline4} alt="NeuroSchedule Online 4">
    <img src="{base}/images/online/5.png" bind:this={imgElemOnline5} alt="NeuroSchedule Online 5">
    <img src="{base}/images/online/6.png" bind:this={imgElemOnline6} alt="NeuroSchedule Online 6">
    <img src="{base}/images/online/7.png" bind:this={imgElemOnline7} alt="NeuroSchedule Online 7">
    <img src="{base}/images/offline/1.png" bind:this={imgElemOffline1} alt="NeuroSchedule Offline 1">
    <img src="{base}/images/offline/2.png" bind:this={imgElemOffline2} alt="NeuroSchedule Offline 2">
    <img src="{base}/images/offline/3.png" bind:this={imgElemOffline3} alt="NeuroSchedule Offline 3">
    <img src="{base}/images/offline/4.png" bind:this={imgElemOffline4} alt="NeuroSchedule Offline 4">
    <img src="{base}/images/offline/5.png" bind:this={imgElemOffline5} alt="NeuroSchedule Offline 5">
    <img src="{base}/images/offline/6.png" bind:this={imgElemOffline6} alt="NeuroSchedule Offline 6">
    <img src="{base}/images/offline/7.png" bind:this={imgElemOffline7} alt="NeuroSchedule Offline 7">
</div>

<style>
:global(body) {
    background: #1F1F4F;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    width: 100vw;
    height: 100vh;
}

:global(a) {
    color: #AAAAFF;
}

:global(a:hover) {
    color: #CCCCFF;
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

:global(.tab-pane.active) {
    display: flex !important;
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

.name {
    color: #DD88DD;
}

.vanilla {
    color: #FFBBFF;
}

.boccher {
    position: relative;
    height: 0;
    transform: translate(100px, 80px);
    filter: blur(5px);
}

.boccher > div {
    width: 30px;
    height: 30px;
}

.boccher .blue {
    background: #4786A9;
    border: 5px solid #78D2EC;
    border-radius: 3px;
    transform: translate(3px, -5px) rotateZ(20deg);
}

.boccher .yellow {
    background: #A48F3E;
    border: 5px solid #E9D757;
    border-radius: 3px;
    transform: rotateZ(5deg);
}
</style>
