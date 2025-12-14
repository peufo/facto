<script lang="ts">
	import { type ToolVersionWithChildren } from '$lib'
	import { renderScene } from './render'
	import { view } from '../view.svelte'

	let { tools = $bindable() }: { tools: ToolVersionWithChildren[] } = $props()
	let canvas = $state<HTMLCanvasElement>()
	let ctx = $derived(canvas?.getContext('2d'))

	$effect(() => {
		if (ctx) renderScene(ctx, view, tools)
	})
</script>

<canvas
	bind:this={canvas}
	class="fixed top-0"
	width={view.width}
	height={view.height}
	onwheel={view.onwheel}
	onmousemove={view.onmousemove}
>
</canvas>

<style>
	/*
	canvas {
		image-rendering: pixelated;
	}
	*/
</style>
