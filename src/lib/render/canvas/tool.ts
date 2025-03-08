import type { ToolModelWithChildren } from '$lib/tool'
import type { View } from '../types'
import { COLORS } from './colors'

export function renderTool(ctx: CanvasRenderingContext2D, view: View, tool: ToolModelWithChildren) {
	const x = view.origin.x + tool.x * view.meterToPixel
	const y = view.origin.y + tool.y * view.meterToPixel
	const width = tool.width * view.meterToPixel
	const height = tool.height * view.meterToPixel

	function isHover() {
		if (x > view.cursor.x) return false
		if (view.cursor.x > x + width) return false
		if (y > view.cursor.y) return false
		if (view.cursor.y > y + height) return false
		return true
	}

	ctx.fillStyle = COLORS.BASE_200
	ctx.strokeStyle = isHover() ? COLORS.ACCENT : COLORS.BASE_300
	ctx.lineWidth = 3
	ctx.beginPath()
	ctx.roundRect(x, y, width, height, 6)
	ctx.stroke()
	ctx.fill()
}
