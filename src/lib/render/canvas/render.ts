import { renderScale } from './scale'
import type { View } from '../view.svelte'
import type { ToolVersionWithChildren } from '$lib/tool'
import { renderTool } from './tool'
import { COLORS } from './colors'

export function renderScene(
	ctx: CanvasRenderingContext2D,
	view: View,
	tools: ToolVersionWithChildren[]
) {
	renderBackground(ctx, view)
	for (const tool of tools) {
		renderTool(ctx, view, tool)
	}
	renderScale(ctx, view)
}

function renderBackground(ctx: CanvasRenderingContext2D, view: View) {
	ctx.fillStyle = COLORS.BASE_100
	ctx.fillRect(0, 0, view.width, view.height)
}
