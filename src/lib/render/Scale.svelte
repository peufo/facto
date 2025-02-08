<script lang="ts">
	import type { View } from './types'

	let { view }: { view: View } = $props()

	function drawScaleX(v: View): string {
		const unit = v.meterToPixel
		let cursor = v.origin.x % unit
		if (cursor < 0) cursor += unit
		let path = `M 0,12 H ${cursor} `
		while (cursor < view.width) {
			const value = (cursor - v.origin.x) / unit
			const size = value % 5 ? 8 : value % 10 ? 4 : 0
			path += `V ${size} V 12 h ${unit}`
			cursor += unit
		}
		return path
	}

	function drawScaleY(v: View): string {
		const unit = v.meterToPixel
		let cursor = v.origin.y % unit
		if (cursor < 0) cursor += unit
		let path = `M 12,0 V ${cursor} `
		while (cursor < view.height) {
			const value = (cursor - v.origin.y) / unit
			const size = value % 5 ? 8 : value % 10 ? 4 : 0
			path += `H ${size} H 12 v ${unit}`
			cursor += unit
		}
		return path
	}
</script>

<svg class="stroke-secondary fixed top-0 stroke-1" height={12} width={view.width}>
	<path d={drawScaleX(view)}></path>
</svg>

<svg class="stroke-secondary fixed top-0 left-0 stroke-1" height={view.height} width={12}>
	<path d={drawScaleY(view)}></path>
</svg>
