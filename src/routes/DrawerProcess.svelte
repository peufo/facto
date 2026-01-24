<script lang="ts">
	import { Drawer, Form } from 'fuma'
	import type { LayoutData } from './$types'

	let { data }: { data: LayoutData } = $props()
	let formData = $derived(data.formDataProcess)
</script>

<Drawer
	maxWidth="20em"
	key="form_process"
	title="{formData ? 'Edit' : 'New'} process"
	let:close
	class="m-2 rounded-lg border"
>
	<Form
		action="/?/process"
		data={formData}
		on:success={() => close()}
		fields={[
			[
				{
					key: 'name',
					colSpan: 4,
					text: { label: 'Name', input: { autocomplete: 'off', autofocus: true } }
				}
			]
		]}
	/>
</Drawer>
