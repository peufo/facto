import type { ToolModel } from '@prisma/client'

export type ToolModelWithChildren = ToolModel & {
	children?: ToolModelWithChildren[]
}
