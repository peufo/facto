<script lang="ts">
	import { mouseDragTrigger } from 'fuma/action'
	import type { ToolModelWithChildren } from '$lib/tool'
	import Scale from './Scale.svelte'
	import Tool from './Tool.svelte'
	import type { View } from './types'

	let { tools }: { tools: ToolModelWithChildren[] } = $props()
	let width = $state<number>(0)
	let height = $state<number>(0)
	let view = $state<View>({
		origin: { x: 0, y: 0 },
		width: 0,
		height: 0,
		meterToPixel: 10
	})

	$effect(() => {
		view.width = width
		view.height = height
	})

	function createDragHandler() {
		let origin: { x: number; y: number } = { x: 0, y: 0 }
		return {
			start({ clientX, clientY }: MouseEvent) {
				origin.x = clientX - view.origin.x
				origin.y = clientY - view.origin.y
			},
			move({ clientX, clientY }: MouseEvent) {
				view.origin = {
					x: clientX - origin.x,
					y: clientY - origin.y
				}
			},
			end(event: MouseEvent) {}
		}
	}

	function onwheel(event: WheelEvent) {
		event.preventDefault()
		if (event.ctrlKey) {
			const z = 1 - event.deltaY * 0.005
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
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div {onwheel}>
	<svg {width} {height} class="fixed top-0">
		{#each tools as tool}
			<Tool {tool} {view} />
		{/each}
	</svg>
</div>

<Scale {view} />
