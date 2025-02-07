<script lang="ts">
	import { mdiPlus } from '@mdi/js'
	import { Icon, urlParam } from 'fuma'
	import { ToolTree, ToolDrawer } from '$lib/tool'
	import { Scene } from '$lib/render'

	const { data } = $props()
</script>

<Scene tools={data.tools} />

<ul class="menu bg-base-100 m-2 rounded border">
	<h2 class="menu-title flex items-center gap-4">
		<span class="grow">Tools</span>
		<a href={$urlParam.with({ tool_drawer: 'new' })} class="btn btn-square btn-xs">
			<Icon path={mdiPlus} title="New tool" size={16} />
		</a>
	</h2>
	<li>
		<ToolTree tools={data.tools} />
	</li>
</ul>

<ToolDrawer />
