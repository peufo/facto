import type { JsonRecord } from '$lib/model'
import type { AttributesConfig, defineModule } from '$lib/modules/defineModule'
import { prisma } from './db'

type AnyModule = ReturnType<typeof defineModule<string, AttributesConfig>>

export function createSystem(modulesList: AnyModule[]) {
	const modules = new Map(modulesList.map((m) => [m.id, m]))

	async function seedModule(mod: AnyModule) {
		console.log(`Seed module: ${mod.id}`)
		for (const [localName, attr] of Object.entries(mod.config.attributes)) {
			const key = mod.getKey(localName)
			await prisma.attribute.upsert({
				where: { key },
				create: { key, ...attr },
				update: attr
			})
			console.log(`  Attribute ${key}`)
		}
	}

	async function seed() {
		for (const mod of modules.values()) {
			await seedModule(mod)
		}
		console.log('All modules synced.')
	}

	function processCommit(rawChanges: JsonRecord): JsonRecord {
		const validated: JsonRecord = {}
		for (const mod of modules.values()) {
			const moduleResult = mod.parseChanges(rawChanges)
			Object.assign(validated, moduleResult)
		}
		return validated
	}

	function getModule(id: string) {
		return modules.get(id)
	}

	return {
		seed,
		processCommit,
		getModule
	}
}
