<script lang="ts">
	import { urlParam } from 'fuma'
	import { ToolTree, type ToolModelWithChildren } from '.'

	const { tools }: { tools: ToolModelWithChildren[] } = $props()
</script>

<ul>
	{#each tools as tool}
		<li>
			<a
				class:menu-active={$urlParam.hasValue('toolModelId', tool.id.toString())}
				href={$urlParam.with({ toolModelId: tool.id })}>{tool.name || `tool_${tool.id}`}</a
			>
		</li>
		{#if tool.children}
			<li>
				<ToolTree tools={tool.children} />
			</li>
		{/if}
	{/each}
</ul>
