import type { JsonRecord, modelCommitCreate } from '$lib/model'
import type {
	AttributeConfigUnion,
	AttributeOutput,
	AttributeValue,
	AttributesConfig,
	defineModule
} from '$lib/modules/defineModule'
import type { Commit, Prisma } from '@prisma/client'
import { prisma } from './db'
import type z from 'zod'
import type { CommitWithSnapshot } from '$lib/types'
import { ZodError, type ZodObject } from 'zod'

type AnyModule = ReturnType<typeof defineModule<AttributesConfig>>

export function createSystem(modulesList: AnyModule[]) {
	const modules = new Map(modulesList.map((m) => [m.id, m]))
	const attributes = new Map<string, AttributeOutput>()
	modules.forEach((mod) => {
		for (const [key, attr] of mod.attributes) {
			attributes.set(key, attr)
		}
	})

	async function seedModule(mod: AnyModule) {
		console.log(`Seed module: ${mod.id}`)
		for (const [key, { label, type }] of mod.attributes) {
			await prisma.attribute.upsert({
				where: { key },
				create: { key, label, type },
				update: { label, type }
			})
			console.log(`OK: ${key}`)
		}
	}

	async function seed() {
		for (const mod of modules.values()) {
			await seedModule(mod)
		}
		console.log('All modules synced.')
	}

	async function createCommit(
		payload: z.output<ZodObject<typeof modelCommitCreate>>
	): Promise<Commit> {
		const data: Prisma.CommitCreateInput = {
			process: payload.process,
			changes: {}
		}
		const incomingCreate: Prisma.ConnectionUncheckedCreateWithoutToInput[] = []
		for (const key in payload.changes) {
			const attribute = attributes.get(key)
			if (!attribute) continue
			try {
				data.changes[key] = attribute.validation(payload.changes[key])
				if (attribute.type === 'DEPENDENCY') {
					const dep = data.changes[key] as AttributeValue<'DEPENDENCY'>
					incomingCreate.push({ fromId: dep.id, attributeKey: key })
				}
			} catch (err: unknown) {
				console.error(`Commit: Validation failed for key "${key}"`)
				if (err instanceof ZodError) console.error(err.message)
			}
		}
		if (incomingCreate.length) data.incoming = { create: incomingCreate }
		return prisma.commit.create({ data })
	}

	async function saveSnapshot(id: string): Promise<Commit> {
		const commit = await prisma.commit.findUniqueOrThrow({ where: { id } })
		if (commit.snapshot) return commit
		const { snapshot } = await computeSnapshot(commit)
		return prisma.commit.update({
			where: { id },
			data: { snapshot }
		})
	}

	async function computeSnapshot(commit: Commit): Promise<CommitWithSnapshot> {
		if (commit.snapshot) return commit as CommitWithSnapshot
		const snapshot: JsonRecord = {}
		for (const changeKey in commit.changes) {
			const { attributeKey } = useKey(changeKey)
			const attr = attributes.get(attributeKey)
			// TODO: I don't need connection ???
			// TODO: What if colision
			if (attr?.type === 'DEPENDENCY') {
				const { id, namespace } = commit.changes[changeKey] as AttributeValue<'DEPENDENCY'>
				const fromCommit = await prisma.commit.findUniqueOrThrow({ where: { id } })
				const { snapshot: fromSnapshot } = await computeSnapshot(fromCommit)

				if (namespace) {
					// TODO: si une clé de fromSnapshot à un namespace, ajouter ce namespace au nouveau pour cette valeur
					for (const k in fromSnapshot) {
						const { namespaces, attributeKey } = useKey(k)
						const snapshotKey = `${[namespace, ...namespaces].join('/')}/${attributeKey}`
						snapshot[snapshotKey] = fromSnapshot[k]
					}

					continue
				}

				Object.assign(snapshot, fromSnapshot)
				continue
			}
			if (attr?.type === 'REFERENCE') {
				// TODO: build materialized path in snapshot from recusive call
				console.warn('attribute.type = REFERENCE not yet implemented')
				continue
			}
			snapshot[changeKey] = commit.changes[changeKey]
		}
		return { ...commit, snapshot }
	}

	function getModule(id: string) {
		return modules.get(id)
	}

	return {
		seed,
		getModule,
		createCommit,
		saveSnapshot,
		computeSnapshot
	}
}

/**
 *
 * @param keyRaw raw key like "namespace2/namespace1/module:localkey"
 */
function useKey(keyRaw: string) {
	const namespaces = keyRaw.split('/')
	const attributeKey = namespaces.pop()
	if (!attributeKey) throw new Error(`Parse key error. Can't extract attributeKey from "${keyRaw}"`)
	const [moduleId, attributeName] = attributeKey.split(':')
	if (!moduleId || !attributeName)
		throw new Error(`Parse key error. Can't extract moduleId and attributeName from "${keyRaw}"`)
	return {
		namespaces,
		moduleId,
		attributeKey,
		attributeName
	}
}
