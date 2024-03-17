<script lang="ts">
	const {
		delay,
		spinnerText = '',
		defaultText = '',
	} = $props<{ delay: number; spinnerText?: string; defaultText?: string }>();
	const promise = new Promise((resolve) => setTimeout(resolve, delay));
</script>

{#await promise}
	{defaultText}
{:then value}
	{spinnerText}
{/await}
