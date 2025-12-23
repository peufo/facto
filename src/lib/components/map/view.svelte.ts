import { innerHeight, innerWidth } from 'svelte/reactivity/window'
import { clamp } from '$lib/math'
import type { Coord } from './types'

export class View {
	origin = $state<Coord>({ x: 0, y: 0 })
	cursor = $state<Coord>({ x: 0, y: 0 })
	width = $derived(innerWidth.current || 0)
	height = $derived(innerHeight.current || 0)
	meterToPixel = $state(10)

	onwheel = (event: WheelEvent) => {
		event.preventDefault()
		if (event.ctrlKey) {
			const z = 1 - clamp(event.deltaY, -12, 12) * 0.005
			this.meterToPixel *= z
			this.origin.x -= (event.clientX - this.origin.x) * (z - 1)
			this.origin.y -= (event.clientY - this.origin.y) * (z - 1)
			return
		}
		this.origin = {
			x: (this.origin.x -= event.deltaX),
			y: (this.origin.y -= event.deltaY)
		}
	}

	onmousemove = (event: MouseEvent) => {
		this.cursor = {
			x: event.clientX,
			y: event.clientY
		}
	}

	private scale = (direction: keyof Coord) => {
		return <T>(
			init: (inc: { cursor: number }) => T,
			increment: (inc: { cursor: number; size: number; unit: number }, value: T) => T
		) => {
			const unit = this.meterToPixel
			const origin = this.origin[direction]
			let cursor = origin % unit
			if (cursor < 0) cursor += unit
			let counter = Math.round((cursor - origin) / unit) % 10
			let value = init({ cursor })
			while (cursor < view.width) {
				const size = counter % 5 ? 2 : counter % 10 ? 3 : 6
				value = increment({ cursor, size, unit }, value)
				cursor += unit
				counter++
			}
			return value
		}
	}

	scaleX = this.scale('x')
	scaleY = this.scale('y')
}

export const view = new View()
