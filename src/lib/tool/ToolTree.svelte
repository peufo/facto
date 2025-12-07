<script lang="ts">
	import { urlParam } from 'fuma'
	import { ToolTree, type ToolVersionWithChildren } from '.'

	const { tools }: { tools: ToolVersionWithChildren[] } = $props()
</script>

<ul>
	{#each tools as tool}
		<li>
			<a
				class:menu-active={$urlParam.hasValue('toolVersionId', tool.id.toString())}
				href={$urlParam.with({ toolVersionId: tool.id })}>{tool.name || `tool_${tool.id}`}</a
			>
		</li>
		{#if tool.children}
			<li>
				<ToolTree tools={tool.children} />
			</li>
		{/if}
	{/each}
</ul>
