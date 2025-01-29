<script lang="ts">
	import { mdiPlus } from '@mdi/js'
	import { Icon, urlParam } from 'fuma'
	import { ToolTree, ToolDrawer } from '$lib/tool'

	const { data } = $props()
</script>

<div class="m-2 w-min rounded border p-2 pl-4">
	<div class="flex items-center gap-4">
		<h3 class="card-title">Tools</h3>
		<a href={$urlParam.with({ tool_drawer: 'new' })} class="btn btn-square btn-sm">
			<Icon path={mdiPlus} title="New tool" />
		</a>
	</div>

	<ToolTree tools={data.tools} />
</div>

<ToolDrawer />
