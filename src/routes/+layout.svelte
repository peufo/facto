<script lang="ts">
	import { Toaster } from 'svelte-sonner'
	import '../app.css'
	import DrawerProcess from '$lib/components/DrawerProcess.svelte'
	let { children } = $props()
</script>

{@render children()}

<DrawerProcess />

<Toaster />
