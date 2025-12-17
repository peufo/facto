import z from 'zod'
import { formAction, parseQuery } from 'fuma/server'
import { modelToolVersion, zodCoerceJSON, type CommitWithChildren } from '$lib'
import { prisma } from '$lib/server'
import type { Commit } from '$lib/server/prisma/client.js'

export const load = async ({ url }) => {
	const { processes } = parseQuery(url, { processes: zodCoerceJSON.pipe(z.array(z.string())) })
	const commitsArray = await prisma.commit.findMany({
		where: { processId: { in: processes } }
	})
	const commitsByContainer = Object.groupBy(
		commitsArray,
		({ containerId }) => containerId || 'root'
	)
	const roots = commitsByContainer['root'] || []

	function getCommitWithChildren(commit: Commit): CommitWithChildren {
		return {
			...commit,
			children: (commitsByContainer[commit.id] || []).map(getCommitWithChildren)
		}
	}

	return {
		tools: roots.map((root) => getCommitWithChildren(root))
	}
}

export const actions = {
	commit_create: formAction(modelToolVersion, async ({ data }) => {
		const parentId = data.path.split('/').at(-2)
		const nodeId = data.nodeId || (await prisma.commit.create({ data: {} })).id
		return prisma.toolVersion.create({
			data: { ...data, parentId, nodeId }
		})
	})
}
