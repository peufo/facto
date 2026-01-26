import z from 'zod'
import { formAction, parseQuery } from 'fuma/server'
import { modelCommitCreate, modelProcessCreate, zodCoerceJson } from '$lib/model'
import { prisma } from '$lib/server/db'
import { system } from '$lib/server/system'
import { Prisma } from '@prisma/client'

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
		return system.createCommit(data)
	}),
	commit_snapshot: formAction({ id: z.string() }, async ({ data }) => {
		return system.saveSnapshot(data.id)
	}),
	commit_snapshot_delete: formAction({ id: z.string() }, async ({ data }) => {
		return prisma.commit.update({
			where: { id: data.id },
			data: { snapshot: Prisma.JsonNull }
		})
	})
}
