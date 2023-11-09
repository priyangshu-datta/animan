<script lang="ts">
	export let key: string
	export let value: unknown
</script>

{#if value !== null && value !== undefined}
	<span><b>{key}:</b> {value}</span>
{/if}
