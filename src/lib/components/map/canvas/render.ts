import type { View } from '../view.svelte'
import type { CommitWithChildren } from '$lib'
import { renderCommit as renderCommit } from './commit'
import { COLORS } from './colors'

export function renderScene(
	ctx: CanvasRenderingContext2D,
	view: View,
	commits: CommitWithChildren[]
) {
	renderBackground(ctx, view)
	for (const commit of commits) {
		renderCommit(ctx, view, commit)
	}
	renderScale(ctx, view)
}

function renderBackground(ctx: CanvasRenderingContext2D, view: View) {
	ctx.fillStyle = COLORS.BASE_100
	ctx.fillRect(0, 0, view.width, view.height)
}

function renderScale(ctx: CanvasRenderingContext2D, view: View) {
	ctx.strokeStyle = COLORS.ACCENT
	ctx.lineWidth = 2

	view.scaleX(
		() => ctx.beginPath(),
		({ cursor, size }) => {
			const x = Math.round(cursor)
			ctx.moveTo(x, -1)
			ctx.lineTo(x, size)
		}
	)
	ctx.stroke()
	view.scaleY(
		() => ctx.beginPath(),
		({ cursor, size }) => {
			const y = Math.round(cursor)
			ctx.moveTo(-1, y)
			ctx.lineTo(size, y)
		}
	)
	ctx.stroke()
}
