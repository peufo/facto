import type { Prisma } from '@prisma/client'
import z from 'zod'
import { zodCoerceJsonRecord, type ShapeOf } from './utils'

export const modelCommitCreate = {
	process: z.union([
		z.object({ id: z.string() }).transform((connect) => ({ connect }))
		// Maybe not a good idea
		// z.object({ name: z.string() }).transform((create) => ({ create }))
	]),
	changes: zodCoerceJsonRecord
} satisfies ShapeOf<Prisma.CommitCreateInput>
