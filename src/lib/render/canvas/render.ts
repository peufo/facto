import { renderScale } from './scale'
import type { View } from '../types'
import type { ToolModelWithChildren } from '$lib/tool'
import { renderTool } from './tool'
import { COLORS } from './colors'

export function renderScene(
	ctx: CanvasRenderingContext2D,
	view: View,
	tools: ToolModelWithChildren[]
) {
	renderBackground(ctx, view)
	tools.forEach((tool) => {
		renderTool(ctx, view, tool)
	})
	renderScale(ctx, view)
}

function renderBackground(ctx: CanvasRenderingContext2D, view: View) {
	ctx.fillStyle = COLORS.BASE_100
	ctx.fillRect(0, 0, view.width, view.height)
}
