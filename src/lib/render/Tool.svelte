<script lang="ts">
	import type { Pixel, Rect, View } from './types'
	import type { ToolModelWithChildren } from '$lib/tool'
	import { mouseDragTrigger, touchDragTrigger } from './drag'

	let { tool, view }: { tool: ToolModelWithChildren; view: View } = $props()
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
	const RESIZE_RANGE = 20
	type SIDE_X = 'E' | 'W'
	type SIDE_Y = 'N' | 'S'

	const dragHandler = (() => {
		let rect: Rect = { x: 0, y: 0, width: 0, height: 0 }
		let start: Pixel = { x: 0, y: 0 }
		let sideX: SIDE_X | null = null
		let sideY: SIDE_Y | null = null
		return {
			start({ clientX, clientY }: PointerEvent | Touch) {
				rect.x = tool.x * view.meterToPixel
				rect.y = tool.y * view.meterToPixel
				rect.width = tool.width * view.meterToPixel
				rect.height = tool.height * view.meterToPixel
				start.x = clientX
				start.y = clientY
				const left = start.x - view.origin.x - rect.x
				const top = start.y - view.origin.y - rect.y
				const right = rect.width - left
				const bottom = rect.height - top
				sideX = null
				sideY = null
				if (right <= RESIZE_RANGE) sideX = 'E'
				else if (left <= RESIZE_RANGE) sideX = 'W'
				if (bottom <= RESIZE_RANGE) sideY = 'S'
				else if (top <= RESIZE_RANGE) sideY = 'N'
			},
			move({ clientX, clientY }: PointerEvent | Touch) {
				const x = clientX - start.x
				const y = clientY - start.y
				if (sideX == 'W') tool.width = (rect.width - x) / view.meterToPixel
				if (sideX == 'E') tool.width = (rect.width + x) / view.meterToPixel
				if (sideX != 'E') tool.x = (rect.x + x) / view.meterToPixel
				if (sideY == 'N') tool.height = (rect.height - y) / view.meterToPixel
				if (sideY == 'S') tool.height = (rect.height + y) / view.meterToPixel
				if (sideY != 'S') tool.y = (rect.y + y) / view.meterToPixel
				tool = { ...tool }
			}
		}
	})()
</script>

<rect
	use:mouseDragTrigger={dragHandler}
	use:touchDragTrigger={dragHandler}
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

{#if isHover && false}
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
