<script lang="ts">
	import type { View } from './types'
	import type { ToolModelWithChildren } from '$lib/tool'
	import { mouseDragTrigger } from 'fuma/action'

	let { tool, view }: { tool: ToolModelWithChildren; view: View } = $props()
	let x = $derived(view.origin.x + tool.x * view.meterToPixel)
	let y = $derived(view.origin.y + tool.y * view.meterToPixel)
	let width = $derived(tool.width * view.meterToPixel)
	let height = $derived(tool.height * view.meterToPixel)

	function createDragHandler() {
		let origin: { x: number; y: number } = { x: 0, y: 0 }
		return {
			start({ clientX, clientY }: MouseEvent) {
				origin.x = clientX - tool.x * view.meterToPixel
				origin.y = clientY - tool.y * view.meterToPixel
			},
			move({ clientX, clientY }: MouseEvent) {
				tool.x = (clientX - origin.x) / view.meterToPixel
				tool.y = (clientY - origin.y) / view.meterToPixel
				tool = { ...tool }
			},
			end(event: MouseEvent) {}
		}
	}
</script>

<rect
	use:mouseDragTrigger={createDragHandler()}
	{x}
	{y}
	{width}
	{height}
	rx={4}
	ry={4}
	class="fill-base-200 stroke-base-300 hover:fill-base-300"
></rect>
