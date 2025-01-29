<script lang="ts">
	import { Drawer, Form } from 'fuma'
	import { toolValidation } from '$lib'
	import type { ToolModel } from '@prisma/client'

	let { toolModel }: { toolModel?: ToolModel } = $props()
</script>

<Drawer noOverlay key="tool_drawer" title="{toolModel ? 'Edit' : 'New'} tool" let:close>
	<Form
		action="/model?/tool_model"
		model={toolValidation}
		data={toolModel}
		on:success={() => close()}
		fields={[
			[
				{
					key: 'name',
					colSpan: 4,
					text: { label: 'Name', input: { autocomplete: 'off', autofocus: true } }
				},
				{ key: 'sizeX', number: { label: 'Size X', value: 60 } },
				{ key: 'sizeY', number: { label: 'Size Y', value: 60 } },
				{ key: 'relatifX', number: { label: 'Pos. relative X', value: 10 } },
				{ key: 'relatifY', number: { label: 'Pos. relative Y', value: 10 } },
				{ key: 'absoluteX', number: { label: 'Pos. absolute X', value: 10 } },
				{ key: 'absoluteY', number: { label: 'Pos. absolute Y', value: 10 } }
			]
		]}
	/>
</Drawer>
