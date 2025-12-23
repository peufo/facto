import type { Coord, Rect } from './types'
import type { View } from './view.svelte'
import type { Attachment } from 'svelte/attachments'
import type { CommitWithChildren } from '$lib'

type Handler<T = PointerEvent | Touch> = {
	start?: (event: T) => unknown
	move?: (event: T) => unknown
	end?: (event: T) => unknown
}

function mouseDragTrigger(element: HTMLElement, handlers: Handler<PointerEvent>) {
	function startHandler(event: PointerEvent) {
		if (handlers.start) handlers.start(event)
		if (handlers.move) document.addEventListener('pointermove', handlers.move)
		document.addEventListener('pointerup', endHandler, { once: true })
	}

	function endHandler(event: PointerEvent) {
		if (handlers.move) document.removeEventListener('pointermove', handlers.move)
		if (handlers.end) handlers.end(event)
	}

	function stopPropagation(event: Event) {
		event.stopPropagation()
	}

	element.addEventListener('pointerdown', startHandler)
	element.addEventListener('click', stopPropagation)

	return () => {
		element?.removeEventListener('pointerdown', startHandler)
		element?.removeEventListener('click', stopPropagation)
		if (handlers.move) document.removeEventListener('pointermove', handlers.move)
		document.removeEventListener('pointerup', endHandler)
	}
}

/** Gestion du cycle de vie des évènements de l'écran tactile */
function touchDragTrigger(element: HTMLElement, handlers: Handler<Touch>) {
	let onDrag = false

	function startHandler(event: TouchEvent) {
		onDrag = true
		if (handlers.start) handlers.start(event.touches[0])
	}

	function moveHandler(event: TouchEvent) {
		if (!onDrag) return
		event.preventDefault()
		if (handlers.move) handlers.move(event.touches[0])
	}

	function endHandler(event: TouchEvent) {
		onDrag = false
		if (handlers.end) handlers.end(event.touches[0])
	}

	function stopPropagation(event: Event) {
		event.stopPropagation()
	}

	element.addEventListener('touchstart', startHandler)
	element.addEventListener('touchmove', moveHandler)
	element.addEventListener('touchend', endHandler)
	element.addEventListener('click', stopPropagation)

	return () => {
		if (!element) return
		element.removeEventListener('touchstart', startHandler)
		element.removeEventListener('touchmove', moveHandler)
		element.removeEventListener('touchend', endHandler)
		element.removeEventListener('click', stopPropagation)
	}
}

type SIDE_X = 'E' | 'W'
type SIDE_Y = 'N' | 'S'
const RESIZE_RANGE = 20

export function dragTrigger({
	commit,
	view
}: {
	commit: CommitWithChildren
	view: View
}): Attachment<HTMLElement> {
	return (element: HTMLElement) => {
		let rect: Rect = { x: 0, y: 0, width: 0, height: 0 }
		let start: Coord = { x: 0, y: 0 }
		let sideX: SIDE_X | null = null
		let sideY: SIDE_Y | null = null

		const dragHandler = {
			start({ clientX, clientY }: PointerEvent | Touch) {
				rect.x = commit.x * view.meterToPixel
				rect.y = commit.y * view.meterToPixel
				rect.width = commit.width * view.meterToPixel
				rect.height = commit.height * view.meterToPixel
				start.x = clientX
				start.y = clientY
				const left = start.x - view.origin.x - rect.x
				const top = start.y - view.origin.y - rect.y
				const right = rect.width - left
				const bottom = rect.height - top
				sideX = null
				sideY = null
				if (right <= RESIZE_RANGE) sideX = 'E'
				else if (left <= RESIZE_RANGE) sideX = 'W'
				if (bottom <= RESIZE_RANGE) sideY = 'S'
				else if (top <= RESIZE_RANGE) sideY = 'N'
			},
			move({ clientX, clientY }: PointerEvent | Touch) {
				const x = clientX - start.x
				const y = clientY - start.y
				if (sideX == 'W') commit.width = (rect.width - x) / view.meterToPixel
				if (sideX == 'E') commit.width = (rect.width + x) / view.meterToPixel
				if (sideX != 'E') commit.x = (rect.x + x) / view.meterToPixel
				if (sideY == 'N') commit.height = (rect.height - y) / view.meterToPixel
				if (sideY == 'S') commit.height = (rect.height + y) / view.meterToPixel
				if (sideY != 'S') commit.y = (rect.y + y) / view.meterToPixel
			}
		}

		const destroyMouseTrigger = mouseDragTrigger(element, dragHandler)
		const destroyTouchTrigger = touchDragTrigger(element, dragHandler)

		return () => {
			destroyMouseTrigger()
			destroyTouchTrigger()
		}
	}
}
