<script lang="ts">
	import { Drawer, Form, InputRelation } from 'fuma'
	import type { Commit, Process } from '@prisma/client'
	import type { CommitWithProcess } from './types'
	import { apiClient } from '$lib/api'

	let { commit }: { commit?: CommitWithProcess & { parent: Commit } } = $props()
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
		<InputRelation
			label="Parent"
			key="parent"
			value={commit?.parent}
			slotItem={snippetParent}
			search={(search) => apiClient.commits({ search, processId: commit?.processId || '' })}
		/>
	</Form>
</Drawer>

{#snippet snippetProcess(process: Process)}
	<span>{process.name}</span>
{/snippet}

{#snippet snippetParent(parent: Commit)}
	<span>{parent.id} HOW TO EASILY ACCESS TO parent.output.snapshot.name ?</span>
{/snippet}
