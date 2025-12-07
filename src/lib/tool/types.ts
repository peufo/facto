import type { ToolVersion } from '$lib/server/prisma/client'

export type ToolVersionWithChildren = ToolVersion & {
	children?: ToolVersionWithChildren[]
}
