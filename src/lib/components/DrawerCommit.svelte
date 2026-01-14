<script lang="ts">
	import { Drawer, Form, InputRelation } from 'fuma'
	import type { Commit, Process } from '$lib/server/prisma'
	import type { CommitWithProcess } from './types'
	import { apiClient } from '$lib/api'

	let { commit }: { commit?: CommitWithProcess } = $props()
</script>

<Drawer
	maxWidth="20em"
	noOverlay
	key="form_commit"
	title="{commit ? 'Edit' : 'New'} commit"
	let:close
	class="m-2 rounded-lg border"
>
	<Form
		action="/process?/commit"
		data={commit}
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
	>
		<InputRelation
			label="Process"
			key="process"
			value={commit?.process}
			slotItem={snippetProcess}
			search={(search) => apiClient.processes({ search })}
		/>
	</Form>
</Drawer>

{#snippet snippetProcess(process: Process)}
	<span>{process.name}</span>
{/snippet}
