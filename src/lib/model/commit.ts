import type { Prisma } from '$lib/server/prisma/client'
import { z } from 'fuma'
import type { ShapeOf } from './utils'

export const modelCommit = {
	name: z.string(),
	width: z.number(),
	height: z.number(),
	x: z.number(),
	y: z.number()
} satisfies ShapeOf<Prisma.CommitUncheckedCreateInput>
