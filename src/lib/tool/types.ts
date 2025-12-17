import type { Commit } from '$lib/server/prisma/client'

export type CommitWithChildren = Commit & {
	children?: CommitWithChildren[]
}
