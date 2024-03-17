<script lang="ts">
	const { ...props } = $props<{ class: string; 'aria-label'?: string }>();
</script>

<span data-icon {...props} />
