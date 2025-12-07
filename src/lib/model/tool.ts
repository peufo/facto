import type { Prisma } from '$lib/server/prisma/client'
import { z } from 'fuma'
import { modelNode } from './node'
import type { ShapeOf } from './type'

export const modelToolVersion = {
	...modelNode,
	name: z.string(),
	width: z.number(),
	height: z.number(),
	x: z.number(),
	y: z.number()
} satisfies ShapeOf<Prisma.ToolVersionUncheckedCreateInput>
