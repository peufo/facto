import z from 'zod'
import { formAction, parseQuery } from 'fuma/server'
import {
	modelCommitCreate,
	zodCoerceJSON,
	type CommitWithChildren,
	type CommitWithOutput
} from '$lib'
import { prisma } from '$lib/server'
import { modelProcessCreate } from '$lib/model/process.js'

export const load = async ({ url }) => {
	const { processes } = parseQuery(url, { processes: zodCoerceJSON.pipe(z.array(z.string())) })
	const commitsArray = await prisma.commit.findMany({
		where: { processId: { in: processes } },
		include: { output: true }
	})
	const commitsByContainer = Object.groupBy(commitsArray, ({ parentId }) => parentId || 'root')
	const roots = commitsByContainer['root'] || []

	function getCommitWithChildren(commit: CommitWithOutput): CommitWithChildren {
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
	commit_create: formAction(modelCommitCreate, async ({ data }) => {
		return prisma.commit.create({ data })
	}),
	process_create: formAction(modelProcessCreate, async ({ data }) => {
		return prisma.process.create({ data })
	})
}
