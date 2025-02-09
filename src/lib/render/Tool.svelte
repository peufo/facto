<script lang="ts">
	import type { View } from './types'
	import type { ToolModelWithChildren } from '$lib/tool'
	import { mouseDragTrigger, touchDragTrigger } from './action'

	let { tool, view }: { tool: ToolModelWithChildren; view: View } = $props()
	let x = $derived(view.origin.x + tool.x * view.meterToPixel)
	let y = $derived(view.origin.y + tool.y * view.meterToPixel)
	let width = $derived(tool.width * view.meterToPixel)
	let height = $derived(tool.height * view.meterToPixel)

	const dragHandler = (() => {
		let origin: { x: number; y: number } = { x: 0, y: 0 }
		return {
			start({ clientX, clientY }: PointerEvent | Touch) {
				origin.x = clientX - tool.x * view.meterToPixel
				origin.y = clientY - tool.y * view.meterToPixel
			},
			move({ clientX, clientY }: PointerEvent | Touch) {
				tool.x = (clientX - origin.x) / view.meterToPixel
				tool.y = (clientY - origin.y) / view.meterToPixel
				tool = { ...tool }
			},
			end() {}
		}
	})()
</script>

<rect
	use:mouseDragTrigger={dragHandler}
	use:touchDragTrigger={dragHandler}
	{x}
	{y}
	{width}
	{height}
	rx={4}
	ry={4}
	class="fill-base-200 stroke-base-300 hover:fill-base-300"
>
</rect>
<text x={x + 6} y={y + 20} class="fill-base-content">
	{tool.name || tool.id}
</text>
