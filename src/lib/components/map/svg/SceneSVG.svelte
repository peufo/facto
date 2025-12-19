<script lang="ts">
	import { type CommitWithChildren } from '$lib'
	import Scale from './Scale.svelte'
	import Commit from './Commit.svelte'
	import { view } from '../view.svelte'

	let { commits = $bindable() }: { commits: CommitWithChildren[] } = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	class="fixed top-0"
	width={view.width}
	height={view.height}
	onwheel={view.onwheel}
	onmousemove={view.onmousemove}
>
	{#each commits as commit, i}
		<Commit bind:commit={commits[i]} />
	{/each}
	<Scale />
</svg>
