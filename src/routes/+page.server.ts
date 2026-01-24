import z from 'zod'
import { formAction, parseQuery } from 'fuma/server'
import { modelCommitCreate, modelProcessCreate, zodCoerceJson } from '$lib/model'
import { prisma } from '$lib/server/db'
import { system } from '$lib/server/system'

export const load = async ({ url }) => {
	const { pids } = parseQuery(url, { pids: zodCoerceJson.pipe(z.array(z.string())).default([]) })
	const ps = await prisma.process.findMany()
	const processes = await prisma.process.findMany({
		where: { id: { in: pids } },
		include: { commits: true }
	})
	return {
		ps,
		processes
	}
}

export const actions = {
	process_create: formAction(modelProcessCreate, async ({ data }) => {
		return prisma.process.create({ data })
	}),
	commit_create: formAction(modelCommitCreate, async ({ data }) => {
		console.log('before', data.changes)
		data.changes = system.processCommit(data.changes)
		console.log('cleaned', data.changes)
		return prisma.commit.create({ data })
	})
}
