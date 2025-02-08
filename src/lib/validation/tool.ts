import type { Prisma } from '@prisma/client'
import { z, type ZodObj } from 'fuma'

export const toolValidation = {
	name: z.string(),
	width: z.number(),
	height: z.number(),
	x: z.number(),
	y: z.number()
} satisfies ZodObj<Prisma.ToolModelCreateInput>
