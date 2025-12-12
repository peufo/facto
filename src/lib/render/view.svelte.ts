import { innerHeight, innerWidth } from 'svelte/reactivity/window'
import { clamp } from '$lib/math'
import type { Pixel } from './types'

export class View {
	origin = $state<Pixel>({ x: 0, y: 0 })
	cursor = $state<Pixel>({ x: 0, y: 0 })
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
}

export const view = new View()
