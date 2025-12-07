<script lang="ts">
	import { Drawer, Form } from 'fuma'
	import { modelToolVersion } from '$lib/model'
	import type { ToolVersion } from '$lib/server/prisma/client'

	let { toolVersion }: { toolVersion?: ToolVersion } = $props()
</script>

<Drawer
	maxWidth="20em"
	noOverlay
	key="tool_drawer"
	title="{toolVersion ? 'Edit' : 'New'} tool"
	let:close
	class="m-2 rounded-lg border"
>
	<Form
		action="/model?/tool_model"
		model={modelToolVersion}
		data={toolVersion}
		on:success={() => close()}
		fields={[
			[
				{
					key: 'name',
					colSpan: 4,
					text: { label: 'Name', input: { autocomplete: 'off', autofocus: true } }
				},
				{ key: 'width', number: { label: 'Size X', value: 60 } },
				{ key: 'height', number: { label: 'Size Y', value: 60 } },
				{ key: 'x', number: { label: 'Pos. relative X', value: 10 } },
				{ key: 'y', number: { label: 'Pos. relative Y', value: 10 } }
			]
		]}
	/>
</Drawer>
