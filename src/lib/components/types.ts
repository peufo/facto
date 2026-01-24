import type { Commit, Process } from '@prisma/client'

export type CommitWithProcess = Commit & { process: Process }
