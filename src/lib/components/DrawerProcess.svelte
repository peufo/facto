<script lang="ts">
	import { Drawer, Form } from 'fuma'
	import type { Process } from '$lib/server/prisma'

	let { process }: { process?: Process } = $props()
</script>

<Drawer
	maxWidth="20em"
	key="form_process"
	title="{process ? 'Edit' : 'New'} process"
	let:close
	class="m-2 rounded-lg border"
>
	<Form
		action="/process?/process"
		data={process}
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
	></Form>
</Drawer>
