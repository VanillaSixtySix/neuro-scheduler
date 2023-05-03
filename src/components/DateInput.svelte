<script lang="ts">
    import dayjs from 'dayjs';

    export let format = 'YYYY-MM-DD';
    export let date = new Date();

    let internal: any;

    const input = (x: any) => internal = dayjs(x).format(format);
    const output = (x: any) => date = dayjs(x, format).toDate();

    $: input(date)
    $: output(internal)
</script>

<input type="date" bind:value={internal} />