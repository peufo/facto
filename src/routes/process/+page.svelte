<script lang="ts">
	import { mdiPlus } from '@mdi/js'
	import { Icon, urlParam } from 'fuma'
	import { DrawerCommit, Hierarchy } from '$lib/components'
	import { SceneSVG, SceneCanvas } from '$lib/components/map/index.js'

	let { data } = $props()

	let mode = $state<'svg' | 'canvas'>('svg')

	// svelte-ignore state_referenced_locally
	let commits = $state(data.commits)
	$effect(() => {
		commits = data.commits
	})
</script>

{#if mode === 'svg'}
	<SceneSVG bind:commits />
{:else}
	<SceneCanvas {commits} />
{/if}

<ul class="menu bg-base-100 fixed m-2 rounded border">
	<div role="tablist" class="tabs tabs-box tabs-sm">
		<button class="tab" class:tab-active={mode === 'svg'} onclick={() => (mode = 'svg')}>
			svg
		</button>
		<button class="tab" class:tab-active={mode === 'canvas'} onclick={() => (mode = 'canvas')}>
			canvas
		</button>
	</div>

	<h2 class="menu-title flex items-center gap-4">
		<span class="grow">Commits</span>
		<a href={$urlParam.with({ form_commit: '{}' })} class="btn btn-square btn-xs">
			<Icon path={mdiPlus} title="New commit" size={16} />
		</a>
	</h2>
	<li>
		<Hierarchy {commits} />
	</li>
</ul>

<DrawerCommit />
