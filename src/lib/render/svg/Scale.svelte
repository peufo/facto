<script lang="ts">
	import { view, type View } from '../view.svelte'

	function scaleX(v: View): string {
		const unit = v.meterToPixel
		let cursor = v.origin.x % unit
		if (cursor < 0) cursor += unit
		let counter = Math.round((cursor - v.origin.x) / unit) % 10
		let path = `M 0,-1 H ${cursor} `
		while (cursor < view.width) {
			const size = counter % 5 ? 2 : counter % 10 ? 3 : 6
			path += `V ${size} V -1 h ${unit}`
			cursor += unit
			counter++
		}
		return path
	}

	function scaleY(v: View): string {
		const unit = v.meterToPixel
		let cursor = v.origin.y % unit
		if (cursor < 0) cursor += unit
		let counter = Math.round((cursor - v.origin.y) / unit) % 10
		let path = `M -1,0 V ${cursor} `
		while (cursor < view.height) {
			const size = counter % 5 ? 2 : counter % 10 ? 3 : 6
			path += `H ${size} H -1 v ${unit}`
			cursor += unit
			counter++
		}
		return path
	}
</script>

<path class="stroke-secondary" d={scaleX(view)}></path>
<path class="stroke-secondary" d={scaleY(view)}></path>
