<script>
    import { Alert } from "sveltestrap";

    export let color;
    export let message;
</script>

<Alert color={color}>
    {message}
</Alert>