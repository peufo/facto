import z from 'zod'
import { formAction, parseQuery } from 'fuma/server'
import { modelToolVersion, type ToolVersionWithChildren } from '$lib'
import { prisma } from '$lib/server'
import type { ToolVersion } from '$lib/server/prisma/client.js'

export const load = async ({ url }) => {
	const { date } = parseQuery(url, { date: z.coerce.date().default(new Date()) })
	const toolsFlat = await prisma.toolVersion.findMany({
		where: {
			validFrom: { lte: date },
			OR: [{ validTo: null }, { validTo: { gt: date } }]
		}
	})
	const toolsByParentId = Object.groupBy(toolsFlat, ({ parentId }) => parentId || 'root')
	const roots = toolsByParentId['root'] || []

	function getToolVersionWithChildren(tool: ToolVersion): ToolVersionWithChildren {
		return {
			...tool,
			children: (toolsByParentId[tool.id] || []).map(getToolVersionWithChildren)
		}
	}

	return {
		tools: roots.map((root) => getToolVersionWithChildren(root))
	}
}

export const actions = {
	tool_create: formAction(modelToolVersion, async ({ data }) => {
		const parentId = data.path.split('/').at(-2)
		const nodeId = data.nodeId || (await prisma.tool.create({ data: {} })).id
		return prisma.toolVersion.create({
			data: { ...data, parentId, nodeId }
		})
	})
}
