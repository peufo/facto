import type { Commit } from '$lib/server/prisma'

export type CommitWithChildren = Commit & {
	children?: CommitWithChildren[]
}
