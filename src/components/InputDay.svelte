<script lang="ts">
  import type { InputDayEvent } from "$lib/InputDayEvent";
    import { createEventDispatcher } from "svelte";

    export const dispatch = createEventDispatcher();

    export let day = '';
    export let defaultOnline: boolean;

    function handleChange(event: any) {
        const message: Partial<InputDayEvent> = { day }
        const valueBefore = event.target.value;
        setTimeout(() => {
            // if input type is text, if value is the same, return
            if (event.target.type === 'text' && event.target.value === valueBefore) return;
            switch (event.target.name) {
                case 'online':
                    message.online = event.target.checked;
                    break;
                case 'title':
                    message.title = event.target.value;
                    break;
                case 'time':
                    message.time = event.target.value;
                    break;
                case 'titleCharSpacing':
                    message.titleCharSpacing = parseFloat(event.target.value);
                    break;
            }
            dispatch('message', message);
        });
    }
</script>

<div class="day">
    <input type="checkbox" name="online" id={`online-${day}`} on:change={handleChange} checked={defaultOnline}>
    <label for={`online-${day}`}>Online</label>
    <input type="text" name="title" placeholder="Title" on:keydown={handleChange}>
    <input type="text" name="time" placeholder="Time" on:keydown={handleChange}>
    <input type="number" name="titleCharSpacing" on:keydown={handleChange} value="4" step="0.1">
</div>

<style>
    label {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    input[name="titleCharSpacing"] {
        width: 50%;
    }
</style>
