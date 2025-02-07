<script lang="ts">
	import type { View } from './types'

	let { view }: { view: View } = $props()

	function drawScaleX(v: View): string {
		const unit = v.meterToPixel
		let cursor = v.origin.x % unit
		if (cursor < 0) cursor += unit
		let path = `M 0,0 H ${cursor} `
		while (cursor < view.width) {
			const value = (cursor - v.origin.x) / unit
			const size = value % 5 ? 4 : value % 10 ? 8 : 16
			path += `V ${size} V 0 h ${unit}`
			cursor += unit
		}
		return path
	}

	function drawScaleY(v: View): string {
		const unit = v.meterToPixel
		let cursor = v.origin.y % unit
		if (cursor < 0) cursor += unit
		let path = `M 16,0 V ${cursor} `
		while (cursor < view.width) {
			const value = (cursor - v.origin.y) / unit
			const size = value % 5 ? 12 : value % 10 ? 8 : 0
			path += `H ${size} H 16 v ${unit}`
			cursor += unit
		}
		return path
	}
</script>

<svg class="stroke-secondary fixed bottom-0 stroke-1" height={16} width={view.width}>
	<path d={drawScaleX(view)}></path>
</svg>

<svg class="stroke-secondary fixed top-0 left-0 stroke-1" height={view.height} width={16}>
	<path d={drawScaleY(view)}></path>
</svg>
