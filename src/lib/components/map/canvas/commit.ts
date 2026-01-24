import type { Commit } from '@prisma/client'
import type { View } from '../view.svelte'
import { COLORS } from './colors'

export function renderCommit(ctx: CanvasRenderingContext2D, view: View, commit: Commit) {
	const x = view.origin.x + commit.x * view.meterToPixel
	const y = view.origin.y + commit.y * view.meterToPixel
	const width = commit.width * view.meterToPixel
	const height = commit.height * view.meterToPixel

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
