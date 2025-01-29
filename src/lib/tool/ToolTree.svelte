<script lang="ts">
	import { ToolTree, type ToolModelWithChildren } from '.'

	const { tools }: { tools: ToolModelWithChildren[] } = $props()
</script>

<ul class="border-l px-2">
	{#each tools as tool}
		<li>{tool.name || `tool_${tool.id}`}</li>
		{#if tool.children}
			<ToolTree tools={tool.children} />
		{/if}
	{/each}
</ul>
