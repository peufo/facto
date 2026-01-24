<script lang="ts">
	import { urlParam } from 'fuma'
	import type { Commit } from '@prisma/client'
	import Hierarchy from './Hierarchy.svelte'

	const { commits }: { commits: Commit[] } = $props()
</script>

<ul>
	{#each commits as commit}
		<li>
			<a
				class:menu-active={$urlParam.hasValue('commitId', commit.id.toString())}
				href={$urlParam.with({ commitId: commit.id })}
			>
				{commit.snapshot || `commit_${commit.id}`}
			</a>
		</li>
		{#if commit.children}
			<li>
				<Hierarchy commits={commit.children} />
			</li>
		{/if}
	{/each}
</ul>
