import { prisma } from '$lib/server/db'

export const load = async () => {
	const processes = await prisma.process.findMany()
	return {
		processes
	}
}
