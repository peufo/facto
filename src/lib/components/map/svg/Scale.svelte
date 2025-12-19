<script lang="ts">
	import { view } from '../view.svelte'
</script>

<path
	class="stroke-secondary"
	d={view.scaleX(
		({ cursor }) => `M 0,-1 H ${cursor} `,
		({ size, unit }, path) => `${path} V ${size} V -1 h ${unit}`
	)}
></path>
<path
	class="stroke-secondary"
	d={view.scaleY(
		({ cursor }) => `M -1,0 V ${cursor} `,
		({ size, unit }, path) => `${path} H ${size} H -1 v ${unit}`
	)}
></path>
