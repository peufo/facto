import type { Commit, Process, State } from '$lib/server/prisma'

export type CommitWithProcess = Commit & { process: Process }

export type CommitWithOutput = Commit & { output: State | null }
export type CommitWithChildren = CommitWithOutput & {
	children?: CommitWithChildren[]
}
