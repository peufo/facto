<script lang="ts">
	import { tip, urlParam } from 'fuma'
	import { PlusIcon } from 'lucide-svelte'
	import { fromStore } from 'svelte/store'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	let pids = $derived(data.processes.map((p) => p.id))
	let toggleProccesId = $derived((pid: string) =>
		pids.includes(pid) ? pids.filter((id) => id !== pid) : [...pids, pid]
	)
</script>

<div class="border-base-content/30 flex min-w-44 flex-col rounded-md border p-2">
	<div class="flex items-center gap-2">
		<h3 class="menu-title">Processes</h3>

		<a
			href={fromStore(urlParam).current.with({ form_process: '{}' })}
			class="btn btn-square btn-sm ml-auto"
			use:tip={{ content: 'Create process' }}
		>
			<PlusIcon />
		</a>
	</div>

	<ul class="menu w-full">
		{#each data.ps as { name, id }}
			<li>
				<a
					class:menu-active={pids.includes(id)}
					href="/?pids={JSON.stringify(toggleProccesId(id))}"
				>
					{name}
				</a>
			</li>
		{/each}
	</ul>
</div>
