type Handler<T extends PointerEvent | Touch> = {
	start?: (event: T) => unknown
	move?: (event: T) => unknown
	end?: (event: T) => unknown
}

export function mouseDragTrigger(element: SVGRectElement, handlers: Handler<PointerEvent>) {
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

	return {
		destroy() {
			element?.removeEventListener('pointerdown', startHandler)
			element?.removeEventListener('click', stopPropagation)
			if (handlers.move) document.removeEventListener('pointermove', handlers.move)
			document.removeEventListener('pointerup', endHandler)
		}
	}
}

/** Gestion du cycle de vie des évènements de l'écran tactile */
export function touchDragTrigger(element: SVGRectElement, handlers: Handler<Touch>) {
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

	return {
		destroy() {
			if (!element) return
			element.removeEventListener('touchstart', startHandler)
			element.removeEventListener('touchmove', moveHandler)
			element.removeEventListener('touchend', endHandler)
			element.removeEventListener('click', stopPropagation)
		}
	}
}
