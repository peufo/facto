import type { Prisma } from '$lib/server/prisma'
import z from 'zod'
import { type ShapeOf } from './utils'

export const modelCommitCreate = {
	process: z.union([
		z.object({ id: z.string() }).transform((connect) => ({ connect })),
		z.object({ name: z.string() }).transform((create) => ({ create }))
	]),

	parent: z.union([
		z.object({ id: z.string() }).transform((connect) => ({ connect })),
		z.undefined()
	]),
	changes: z
		.array(
			z.object({
				value: z.string(), // TODO: implement zod validation for Prisma.InputJsonValue ?,
				field: z.union([
					z.object({ id: z.string() }).transform((connect) => ({ connect })),
					z
						.object({ name: z.string(), type: z.enum(['number', 'text']) })
						.transform((create) => ({ create }))
				])
			})
		)
		.transform((create) => ({ create }))
} satisfies ShapeOf<Prisma.CommitCreateInput>
