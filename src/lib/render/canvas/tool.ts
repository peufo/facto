import type { ToolModelWithChildren } from '$lib/tool'
import type { View } from '../types'
import { COLORS } from './colors'

export function renderTool(ctx: CanvasRenderingContext2D, view: View, tool: ToolModelWithChildren) {
	const x = view.origin.x + tool.x * view.meterToPixel
	const y = view.origin.y + tool.y * view.meterToPixel
	const width = tool.width * view.meterToPixel
	const height = tool.height * view.meterToPixel
	ctx.fillStyle = COLORS.BASE_200
	ctx.strokeStyle = COLORS.BASE_300
	ctx.lineWidth = 2
	ctx.beginPath()
	ctx.roundRect(x, y, width, height, 6)
	ctx.stroke()
	ctx.fill()
}
