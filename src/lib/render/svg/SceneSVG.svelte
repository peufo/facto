<script lang="ts">
	import { type ToolVersionWithChildren } from '$lib'
	import Scale from './Scale.svelte'
	import Tool from './Tool.svelte'
	import { view } from '../view.svelte'

	let { tools = $bindable() }: { tools: ToolVersionWithChildren[] } = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	class="fixed top-0"
	width={view.width}
	height={view.height}
	onwheel={view.onwheel}
	onmousemove={view.onmousemove}
>
	{#each tools as tool, i}
		<Tool bind:tool={tools[i]} />
	{/each}
	<Scale />
</svg>
