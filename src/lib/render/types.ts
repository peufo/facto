export type Pixel = {
	x: number
	y: number
}

export type View = {
	origin: Pixel
	cursor: Pixel
	width: number
	height: number
	meterToPixel: number
}

export type Rect = Pixel & {
	width: number
	height: number
}
