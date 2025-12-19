import z from 'zod'
import { formAction, parseQuery } from 'fuma/server'
import { modelCommit, zodCoerceJSON, type CommitWithChildren } from '$lib'
import type { Commit } from '$lib/server/prisma'
import { prisma } from '$lib/server'

export const load = async ({ url }) => {
	const { processes } = parseQuery(url, { processes: zodCoerceJSON.pipe(z.array(z.string())) })
	const commitsArray = await prisma.commit.findMany({
		where: { processId: { in: processes } }
	})
	const commitsByContainer = Object.groupBy(commitsArray, ({ parentId }) => parentId || 'root')
	const roots = commitsByContainer['root'] || []

	function getCommitWithChildren(commit: Commit): CommitWithChildren {
		return {
			...commit,
			children: (commitsByContainer[commit.id] || []).map(getCommitWithChildren)
		}
	}

	return {
		commits: roots.map((root) => getCommitWithChildren(root))
	}
}

export const actions = {
	commit_create: formAction(modelCommit, async ({ data }) => {
		return prisma.commit.create({
			data
		})
	})
}
