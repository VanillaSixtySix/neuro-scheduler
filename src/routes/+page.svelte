<script lang="ts">
    import "$lib/fonts.css?inline";

    import { onMount } from "svelte";
	import InputDay from "../components/InputDay.svelte";
    import type { InputDayEvent} from "$lib/InputDayEvent";
    import DateInput from "../components/DateInput.svelte";

    import imgBase from "$lib/images/base.png";
    import imgOnlineMonday from "$lib/images/online/monday.png";
    import imgOnlineTuesday from "$lib/images/online/tuesday.png";
    import imgOnlineWednesday from "$lib/images/online/wednesday.png";
    import imgOnlineThursday from "$lib/images/online/thursday.png";
    import imgOnlineFriday from "$lib/images/online/friday.png";
    import imgOnlineSaturday from "$lib/images/online/saturday.png";
    import imgOnlineSunday from "$lib/images/online/sunday.png";
    import imgOfflineMonday from "$lib/images/offline/monday.png";
    import imgOfflineTuesday from "$lib/images/offline/tuesday.png";
    import imgOfflineWednesday from "$lib/images/offline/wednesday.png";
    import imgOfflineThursday from "$lib/images/offline/thursday.png";
    import imgOfflineFriday from "$lib/images/offline/friday.png";
    import imgOfflineSaturday from "$lib/images/offline/saturday.png";
    import imgOfflineSunday from "$lib/images/offline/sunday.png";

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

    const sampleTitle = 'Sample';
    const sampleTime = '5PM BST';
    const sampleTitleCharSpacing = 4;

    const thisMonday = new Date();
    thisMonday.setDate(thisMonday.getDate() + 6);//(1 - thisMonday.getDay()));

    // find nearest monday
    let today: Date = new Date();
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
            imgOnline: imgOnlineMonday,
            imgOffline: imgOfflineMonday,
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
            imgOnline: imgOnlineTuesday,
            imgOffline: imgOfflineTuesday,
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
            imgOnline: imgOnlineWednesday,
            imgOffline: imgOfflineWednesday,
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
            imgOnline: imgOnlineThursday,
            imgOffline: imgOfflineThursday,
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
            coords: [1064, 648],
            titleCharSpacing: sampleTitleCharSpacing,
            imgOnline: imgOnlineFriday,
            imgOffline: imgOfflineFriday,
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
            imgOnline: imgOnlineSaturday,
            imgOffline: imgOfflineSaturday,
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
            imgOnline: imgOnlineSunday,
            imgOffline: imgOfflineSunday,
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
</script>

<svelte:head>
    <link rel="stylesheet" href="https://indestructibletype.com/fonts/Jost.css" type="text/css" charset="utf-8" />
</svelte:head>

<div class="container">
    <canvas id="canvas" bind:this={canvas}></canvas>
    <div class="schedule-input">
        <!-- <input type="date" id="start" name="start" bind:value={todayStr} /> -->
        <DateInput bind:date={today} />
        {#each daysOfWeek as day}
            <InputDay day={day.name} on:message={inputDayHandler} defaultOnline={day.online} />
        {/each}
    </div>
</div>

<div class="assets">
    <img src="{imgBase}" bind:this={imgElemBase} alt="NeuroSchedule Base" width="1920px" height="1080px">
    {#each daysOfWeek as day}
        <img src="{day.imgOnline}" bind:this={day.imgElemOnline} alt="NeuroSchedule Online {day.name}">
        <img src="{day.imgOffline}" bind:this={day.imgElemOffline} alt="NeuroSchedule Offline {day.name}">
    {/each}
</div>

<style>
:global(body) {
    background: #1F1F4F;
    color: #DEDEDE;
    padding: 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
}

.container {
    position: relative;

    width: 100%;
}

#canvas {
    background: #2F2F5F;
    border: 2px solid #000000;

    width: 80%;
}

.schedule-input {
    display: flex;
    flex-direction: column;
    width: 200px;
    gap: 10px;
    float: right;
}

.assets {
    display: none;
}
</style>
