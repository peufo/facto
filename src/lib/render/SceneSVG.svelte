<script lang="ts">
	import { type ToolVersionWithChildren, clamp } from '$lib'
	import Scale from './Scale.svelte'
	import Tool from './Tool.svelte'
	import type { View } from './types'

	let { tools }: { tools: ToolVersionWithChildren[] } = $props()
	let width = $state<number>(0)
	let height = $state<number>(0)
	let view = $state<View>({
		origin: { x: 0, y: 0 },
		cursor: { x: 0, y: 0 },
		width: 0,
		height: 0,
		meterToPixel: 10
	})

	$effect(() => {
		view.width = width
		view.height = height
	})

	function onwheel(event: WheelEvent) {
		event.preventDefault()
		if (event.ctrlKey) {
			const z = 1 - clamp(event.deltaY, -12, 12) * 0.005
			view.meterToPixel *= z
			view.origin.x -= (event.clientX - view.origin.x) * (z - 1)
			view.origin.y -= (event.clientY - view.origin.y) * (z - 1)
			return
		}
		view.origin = {
			x: (view.origin.x -= event.deltaX),
			y: (view.origin.y -= event.deltaY)
		}
	}

	function onmousemove(event: MouseEvent) {
		view.cursor = {
			x: event.clientX,
			y: event.clientY
		}
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg {width} {height} class="fixed top-0" {onwheel} {onmousemove}>
	{#each tools as tool}
		<Tool {tool} {view} />
	{/each}
	<Scale {view} />
</svg>
