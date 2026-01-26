<script lang="ts">
	import { tip, urlParam, useForm } from 'fuma'
	import { CameraIcon, CameraOffIcon, ImageIcon, PlusIcon } from 'lucide-svelte'
	import { fromStore } from 'svelte/store'
	import type { ProcessWithCommits } from '$lib/types'
	import { toast } from 'svelte-sonner'

	let { process }: { process: ProcessWithCommits } = $props()

	const intl = new Intl.DateTimeFormat('ch-fr', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	const { enhance } = useForm()
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
				<th>id</th>
				<th>createdAt</th>
				<th>changes</th>
				<th>snapshot</th>
			</tr>
		</thead>
		<tbody>
			{#each process.commits as commit}
				<tr>
					<td>{commit.id}</td>
					<td>{intl.format(commit.createdAt)}</td>
					<td><pre>{JSON.stringify(commit.changes, null, 2)}</pre></td>
					<td><pre>{JSON.stringify(commit.snapshot, null, 2)}</pre></td>
					<td class="flex gap-2">
						<button
							onclick={() => toast.warning('TODO: compute snapshot in frontend ?')}
							class="btn btn-square"
							use:tip={{ content: 'Compute the snapshot' }}
						>
							<ImageIcon />
						</button>
						<form method="post" class="contents" use:enhance>
							<input type="hidden" name="id" value={commit.id} />
							{#if !commit.snapshot}
								<button
									type="submit"
									formaction="?/commit_snapshot"
									class="btn btn-square"
									use:tip={{ content: 'Save the snapshot' }}
								>
									<CameraIcon />
								</button>
							{:else}
								<button
									type="submit"
									formaction="?/commit_snapshot_delete"
									class="btn btn-square"
									use:tip={{ content: 'Delete the snapshot' }}
								>
									<CameraOffIcon />
								</button>
							{/if}
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
