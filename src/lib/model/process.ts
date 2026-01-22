import type { Prisma } from '@prisma/client'
import z from 'zod'
import { type ShapeOf } from './utils'

export const modelProcessCreate = {
	name: z.string()
} satisfies ShapeOf<Prisma.ProcessCreateInput>
