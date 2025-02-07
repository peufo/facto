<script lang="ts">
	import type { View } from './types'
	import type { ToolModelWithChildren } from '$lib/tool'

	let { tool, view }: { tool: ToolModelWithChildren; view: View } = $props()
</script>

<rect
	x={view.origin.x + tool.absoluteX * view.meterToPixel}
	y={view.origin.y + tool.absoluteY * view.meterToPixel}
	width={tool.sizeX * view.meterToPixel}
	height={tool.sizeY * view.meterToPixel}
	rx={4}
	ry={4}
	class="fill-base-200 stroke-base-300"
></rect>
