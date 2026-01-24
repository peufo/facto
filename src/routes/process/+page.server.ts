import z from 'zod'
import type { Commit } from '@prisma/client'
import { parseQuery } from 'fuma/server'
import { zodCoerceJson } from '$lib'
import { prisma } from '$lib/server/db'

export const load = async ({ url }) => {
	const { pids } = parseQuery(url, { pids: zodCoerceJson.pipe(z.array(z.string())) })
	const commitsArray = await prisma.commit.findMany({
		where: { processId: { in: processes } },
		include: {
			incoming: {
				where: { attributeKey: 'location_parent' }
			}
		}
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
