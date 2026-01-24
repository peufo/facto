<script lang="ts">
	import { Toaster } from 'svelte-sonner'
	import DrawerProcess from './DrawerProcess.svelte'
	import DrawerCommit from './DrawerCommit.svelte'
	import '../app.css'

	let { children, data } = $props()
</script>

{@render children()}

<DrawerProcess {data} />
<DrawerCommit {data} />

<Toaster />
