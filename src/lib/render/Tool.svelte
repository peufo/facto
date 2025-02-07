<script lang="ts">
	import type { View } from './types'
	import type { ToolModelWithChildren } from '$lib/tool'

	let { tool, view }: { tool: ToolModelWithChildren; view: View } = $props()

	$inspect(tool, view)
</script>

<rect
	x={view.origin.x + tool.absoluteX * view.pixelToMm}
	y={view.origin.y + tool.absoluteY * view.pixelToMm}
	width={tool.sizeX * view.pixelToMm}
	height={tool.sizeY * view.pixelToMm}
	rx={4}
	ry={4}
	class="fill-base-200 stroke-base-300"
></rect>
