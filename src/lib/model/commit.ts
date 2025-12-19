import type { Prisma } from '$lib/server/prisma'
import { z } from 'fuma'
import { type ShapeOf } from './utils'

export const modelCommit = {
	processId: z.string()
} satisfies ShapeOf<Prisma.CommitUncheckedCreateInput>
