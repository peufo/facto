<script lang="ts">
	import type { Commit } from '@prisma/client'
	import { dragTrigger } from '../drag'
	import { view } from '../view.svelte'

	let { commit = $bindable() }: { commit: CommitWithChildren} = $props()

	let x = $derived(view.origin.x + commit.x * view.meterToPixel)
	let y = $derived(view.origin.y + commit.y * view.meterToPixel)
	let width = $derived(commit.width * view.meterToPixel)
	let height = $derived(commit.height * view.meterToPixel)

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
	{@attach dragTrigger({commit: commit, view})}
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
	{commit.name || commit.id}
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
