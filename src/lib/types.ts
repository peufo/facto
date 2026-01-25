import type { Commit, Process } from '@prisma/client'
import type { JsonRecord } from './model'

type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}

export type CommitWithProcess = Prettify<Commit & { process: Process }>
export type ProcessWithCommits = Prettify<Process & { commits: Commit[] }>
export type CommitWithSnapshot = Prettify<Commit & { snapshot: JsonRecord }>
