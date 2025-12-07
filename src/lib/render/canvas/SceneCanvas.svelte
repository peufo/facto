<script lang="ts">
	import { type ToolVersionWithChildren, clamp } from '$lib'
	import { onDestroy } from 'svelte'
	import type { Pixel, View } from '../types'
	import { renderScene } from './render'

	let { tools }: { tools: ToolVersionWithChildren[] } = $props()
	let canvas = $state<HTMLCanvasElement>()
	let ctx = $derived(canvas?.getContext('2d'))
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
		if (ctx) renderScene(ctx, view, tools)
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

<canvas bind:this={canvas} {width} {height} class="fixed top-0" {onwheel} {onmousemove}> </canvas>

<style>
	/*
	canvas {
		image-rendering: pixelated;
	}
	*/
</style>
