<script lang="ts">
	import { tip, urlParam } from 'fuma'
	import { PlusIcon } from 'lucide-svelte'
	import { fromStore } from 'svelte/store'
	import type { ProcessWithCommits } from '../types'

	let { process }: { process: ProcessWithCommits } = $props()

	const intl = new Intl.DateTimeFormat('ch-fr', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
</script>

<div class="border-base-content/30 rounded border p-2">
	<div class="flex items-center">
		<h3 class="ml-2 text-lg italic">{process.name}</h3>

		<a
			href={fromStore(urlParam).current.with({ form_commit: JSON.stringify({ process }) })}
			class="btn btn-square btn-sm ml-auto"
			use:tip={{ content: 'Create commit' }}
		>
			<PlusIcon />
		</a>
	</div>

	<table class="table">
		<thead>
			<tr>
				<th>createdAt</th>
				<th>changes</th>
				<th>snapshot</th>
			</tr>
		</thead>
		<tbody>
			{#each process.commits as commit}
				<tr>
					<td>{intl.format(commit.createdAt)}</td>
					<td><pre>{JSON.stringify(commit.changes, null, 2)}</pre></td>
					<td><pre>{JSON.stringify(commit.snapshot, null, 2)}</pre></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
