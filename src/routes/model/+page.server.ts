import { toolValidation } from '$lib'
import { prisma } from '$lib/server'
import { formAction } from 'fuma/server'

export const load = async () => {
	const tools = await prisma.toolModel.findMany({
		where: {
			parentId: null
		},
		include: {
			children: {
				include: {
					children: true
				}
			}
		}
	})
	return {
		tools
	}
}

export const actions = {
	tool_model_create: formAction(toolValidation, async ({ data }) => {
		return prisma.toolModel.create({
			data
		})
	})
}
