<script lang="ts">
	import { mdiPlus } from '@mdi/js'
	import { Icon, urlParam } from 'fuma'
	import { ToolTree, ToolDrawer } from '$lib/tool'
	import { SceneSVG, SceneCanvas } from '$lib/render'

	const { data } = $props()

	let mode = $state<'svg' | 'canvas'>('canvas')
</script>

{#if mode === 'svg'}
	<SceneSVG tools={data.tools} />
{:else}
	<SceneCanvas tools={data.tools} />
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
		<span class="grow">Tools</span>
		<a href={$urlParam.with({ form_tool: '{}' })} class="btn btn-square btn-xs">
			<Icon path={mdiPlus} title="New tool" size={16} />
		</a>
	</h2>
	<li>
		<ToolTree tools={data.tools} />
	</li>
</ul>

<ToolDrawer />
