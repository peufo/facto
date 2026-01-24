<script lang="ts">
	import { PlusIcon } from 'lucide-svelte'
	import { urlParam } from 'fuma'
	import { onMount } from 'svelte'

	let { data } = $props()

	onMount(() => {
		console.log(data.bob)
	})
</script>

<div>
	<div class="flex justify-end px-2 pt-2">
		<a href={$urlParam.with({ form_process: '{}' })} class="btn">
			<PlusIcon />
			Create process
		</a>
	</div>

	<div class="flex flex-col gap-2 p-2">
		{#each data.processes as process}
			<a href="/process?processes={JSON.stringify([process.id])}" class="btn btn-soft">
				{process.name}
			</a>
		{/each}
	</div>
</div>
