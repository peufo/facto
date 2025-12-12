import type { View } from '../view.svelte'
import { COLORS } from './colors'

export function renderScale(ctx: CanvasRenderingContext2D, view: View) {
	ctx.strokeStyle = COLORS.ACCENT
	ctx.lineWidth = 2
	renderScaleX(ctx, view)
	renderScaleY(ctx, view)
}

function renderScaleX(ctx: CanvasRenderingContext2D, view: View) {
	const unit = view.meterToPixel
	let cursor = view.origin.x % unit
	if (cursor < 0) cursor += unit
	let counter = Math.round((cursor - view.origin.x) / unit) % 10
	ctx.beginPath()
	while (cursor < view.width) {
		const size = counter % 5 ? 2 : counter % 10 ? 3 : 6
		const x = Math.round(cursor)
		ctx.moveTo(x, -1)
		ctx.lineTo(x, size)
		cursor += unit
		counter++
	}
	ctx.stroke()
}

function renderScaleY(ctx: CanvasRenderingContext2D, view: View) {
	const unit = view.meterToPixel
	let cursor = view.origin.y % unit
	if (cursor < 0) cursor += unit
	let counter = Math.round((cursor - view.origin.y) / unit) % 10
	ctx.beginPath()
	while (cursor < view.height) {
		const size = counter % 5 ? 2 : counter % 10 ? 3 : 6
		const y = Math.round(cursor)
		ctx.moveTo(-1, y)
		ctx.lineTo(size, y)
		cursor += unit
		counter++
	}
	ctx.stroke()
}
