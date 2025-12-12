import z from 'zod'
import type { ShapeOf } from './type'

type NodeCreateInput = {
	path: string
	nodeId: string
	validFrom: Date
	validTo?: Date | null
}

export const modelNode = {
	path: z.string(),
	nodeId: z.string(),
	validFrom: z.date().default(new Date()),
	validTo: z.date().nullish()
} satisfies ShapeOf<NodeCreateInput>
