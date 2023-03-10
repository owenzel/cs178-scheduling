<!-- CONCEPT: Editing: an alert for providing feedback to users about whether their results were successfully saved -->
<script>
    import { Alert } from "sveltestrap";

    export let color;
    export let message;
</script>

<Alert color={color}>
    {message}
</Alert>