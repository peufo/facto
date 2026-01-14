import { prisma } from '$lib/server'

export const load = async () => {
	const processes = await prisma.process.findMany()

	return {
		processes
	}
}
