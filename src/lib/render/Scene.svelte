<script lang="ts">
	import type { ToolModelWithChildren } from '$lib/tool'
	import Tool from './Tool.svelte'
	import type { View } from './types'

	let { tools }: { tools: ToolModelWithChildren[] } = $props()
	let width = $state<number>(0)
	let height = $state<number>(0)
	let view = $state<View>({
		origin: { x: 0, y: 0 },
		width: 0,
		height: 0,
		pixelToMm: 10,
		mmToPixel: 0.1
	})

	$effect(() => {
		view.width = width
		view.height = height
	})
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svg {width} {height} class="fixed -z-10">
	{#each tools as tool}
		<Tool {tool} {view} />
	{/each}
</svg>
