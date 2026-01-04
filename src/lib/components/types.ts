import type { Commit, State } from '$lib/server/prisma'

export type CommitWithOutput = Commit & { output: State | null }
export type CommitWithChildren = CommitWithOutput & {
	children?: CommitWithChildren[]
}
