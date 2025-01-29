import type { Prisma } from '@prisma/client'
import { z, type ZodObj } from 'fuma'

export const toolValidation = {
	name: z.string(),
	sizeX: z.number(),
	sizeY: z.number(),
	relatifX: z.number(),
	relatifY: z.number(),
	absoluteX: z.number(),
	absoluteY: z.number()
} satisfies ZodObj<Prisma.ToolModelCreateInput>
