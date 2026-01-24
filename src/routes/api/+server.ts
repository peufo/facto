import { stringify } from 'devalue'
import { parseQuery } from 'fuma/server'
import z from 'zod'
import { prisma } from '$lib/server/db'
import type { API } from '$lib/api'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import type { ShapeOf } from '$lib/model'

type APIServer = {
	[K in keyof API]: {
		schemaQuery: ShapeOf<API[K]['query']>
		getData: (
			query: API[K]['query'] & { take: number; skip: number; locals: App.Locals }
		) => Promise<API[K]['data']>
	}
}

const apiServer = {
	processes: {
		schemaQuery: { search: z.string().default('') },
		getData: ({ search, take, skip }) =>
			prisma.process.findMany({
				where: { name: { contains: search } },
				take,
				skip
			})
	},
	commits: {
		schemaQuery: { search: z.string().default(''), processId: z.string() },
		getData: ({ search, take, skip, processId }) =>
			prisma.commit.findMany({
				where: { processId },
				take,
				skip
			})
	}
} as const satisfies APIServer

const schemaBase = {
	resource: z.enum(
		Object.keys(apiServer) as [keyof typeof apiServer, ...Array<keyof typeof apiServer>]
	),
	take: z.coerce.number().default(6),
	skip: z.coerce.number().default(0)
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const { resource, take, skip } = parseQuery(url, schemaBase)
	const { schemaQuery, getData } = apiServer[resource]
	const query = parseQuery(url, schemaQuery)
	try {
		// @ts-ignore
		const data = await getData({ ...query, take, skip, locals })
		return json({ data: stringify(data) })
	} catch (err: unknown) {
		if (err instanceof Error) {
			error(500, err.message)
		}
		error(500)
	}
}
