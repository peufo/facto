<script lang="ts">
	import type { ToolVersionWithChildren } from '$lib/tool'
	import { dragTrigger } from '../drag'
	import { view } from '../view.svelte'

	let { tool = $bindable() }: { tool: ToolVersionWithChildren} = $props()

	let x = $derived(view.origin.x + tool.x * view.meterToPixel)
	let y = $derived(view.origin.y + tool.y * view.meterToPixel)
	let width = $derived(tool.width * view.meterToPixel)
	let height = $derived(tool.height * view.meterToPixel)

	let isHover = $derived.by(() => {
		if (x > view.cursor.x) return false
		if (view.cursor.x > x + width) return false
		if (y > view.cursor.y) return false
		if (view.cursor.y > y + height) return false
		return true
	})


	const RAYON = 6
</script>

<rect
	{@attach dragTrigger({tool, view})}
	{x}
	{y}
	{width}
	{height}
	rx={RAYON}
	ry={RAYON}
	class="fill-base-200 stroke-base-300 shadow-2xl"
	class:fill-base-300={isHover}
>
</rect>
<text x={x + 6} y={y + 20} class="fill-base-content">
	{tool.name || tool.id}
</text>

{#if isHover}
	<circle cx={x + RAYON} cy={y + RAYON} r={RAYON} class="drag-button"> </circle>
	<circle cx={x + width - RAYON} cy={y + RAYON} r={RAYON} class="drag-button"></circle>
	<circle cx={x + width - RAYON} cy={y + height - RAYON} r={RAYON} class="drag-button"> </circle>
	<circle cx={x + RAYON} cy={y + height - RAYON} r={RAYON} class="drag-button"> </circle>
{/if}

<style>
	.drag-button {
		fill: var(--color-base-100);
		stroke: color-mix(in oklab, var(--color-base-content) 20%, transparent);
	}
	.drag-button:hover {
		fill: var(--color-base-secondary);
	}
</style>
