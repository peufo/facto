import { modelToolVersion, type ToolVersionWithChildren } from '$lib'
import { prisma } from '$lib/server'
import type { ToolVersion } from '$lib/server/prisma/client.js'
import { formAction, parseQuery } from 'fuma/server'
import z from 'zod'

export const load = async ({ url }) => {
	const { date } = parseQuery(url, { date: z.coerce.date().default(new Date()) })
	const toolsFlat = await prisma.toolVersion.findMany({
		where: {
			validFrom: { lte: date },
			OR: [{ validTo: null }, { validTo: { gt: date } }]
		}
	})
	const toolsByParentId = Object.groupBy(toolsFlat, ({ parentId }) => parentId || 'root')
	const root = toolsByParentId['root']?.at(0)

	function getToolVersionWithChildren(tool: ToolVersion): ToolVersionWithChildren {
		return {
			...tool,
			children: (toolsByParentId[tool.id] || []).map(getToolVersionWithChildren)
		}
	}

	return {
		tools: root ? [getToolVersionWithChildren(root)] : []
	}
}

export const actions = {
	tool_create: formAction(modelToolVersion, async ({ data }) => {
		const parentId = data.path.split('/').at(-2)
		return prisma.toolVersion.create({
			data: { ...data, parentId }
		})
	})
}
