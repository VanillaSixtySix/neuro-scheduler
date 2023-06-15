<script lang="ts">
    import type { InputDayEvent } from "$lib/InputDayEvent";
    import { createEventDispatcher } from "svelte";
    import { Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row } from "sveltestrap";
    import { getDayWithOffset } from "$lib/DateUtils";

    export const dispatch = createEventDispatcher();

    export let startDate: Date = new Date();
    export let offset = 0;
    export let online: boolean;
    let day = '';
    // Variable so we can bind and handle changes live w/o need for blur
    let titleCharSpacing = 4;

    $: (function () {
        day = getDayWithOffset(startDate, offset, false);
    })();

    function handleChange(event: any) {
        const message: Partial<InputDayEvent> = { offset };
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

    $: titleCharSpacing, handleChange({ target: { name: 'titleCharSpacing', value: titleCharSpacing } });
</script>

<Card class="bg-blue text-light">
    <CardHeader>
        <Input type="checkbox" name="online" id={`online-${offset}`} bind:label={day} on:change={handleChange} checked={online} />
    </CardHeader>
    <CardBody class="p-0">
        <Input type="text" name="title" placeholder="Title" bsSize="sm" on:keydown={handleChange} />
        <Row noGutters>
            <Col xs="9">
                <Input type="text" name="time" placeholder="Time" bsSize="sm" on:keydown={handleChange} />
            </Col>
            <Col xs="3">
                <Input type="number" name="titleCharSpacing" bsSize="sm" bind:value={titleCharSpacing} step="0.1" title="Title character spacing" />
            </Col>
        </Row>
    </CardBody>
</Card>
