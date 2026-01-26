<script lang="ts">
	import Process from './Process.svelte'
	import Processes from './Processes.svelte'

	let { data } = $props()
</script>

<div class="flex min-h-screen gap-2 p-2">
	<Processes {data} />

	{#each data.processes as process}
		<Process {process} />
	{/each}
</div>
