<script lang="ts">
	import { Drawer, Form, InputNumber, InputRelation, InputText } from 'fuma'
	import type { Commit, Process } from '@prisma/client'
	import { apiClient } from '$lib/api'
	import type { LayoutData } from './$types'

	let { data }: { data: LayoutData } = $props()

	let formData = $derived(data.formDataCommit)
</script>

<Drawer
	maxWidth="20em"
	key="form_commit"
	title="{formData ? 'Edit' : 'New'} commit"
	let:close
	class="m-2 rounded-lg border"
>
	<Form action="?/commit" bind:data={formData} on:success={() => close()}>
		<InputRelation
			label="Process"
			key="process"
			value={formData?.process}
			slotItem={snippetProcess}
			search={(search) => apiClient.processes({ search })}
		/>

		<!-- value={formData?.changes['core.input']} -->
		<InputRelation
			label="Input"
			key="changes.core:input"
			slotItem={snippetCommit}
			search={(search) =>
				apiClient.commits({
					search,
					processId: formData?.processId || formData?.process?.id || ''
				})}
		/>

		<InputText label="Namespace" key="changes.core:input.namespace" />

		<InputNumber label="Position X" key="changes.location:position_x" />
		<InputNumber label="Position Y" key="changes.location:position_y" />

		<div class="h-20"></div>
	</Form>
</Drawer>

{#snippet snippetProcess(process: Process)}
	<span>{process.name}</span>
{/snippet}

{#snippet snippetCommit(commit: Commit)}
	<span>
		<!-- TODO: HOW TO EASILY ACCESS TO A TYPED SNAPSHOT: commit.snapshot.name ? -->
		{commit.id} - {commit.createdAt}
	</span>
{/snippet}
