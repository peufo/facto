import { PrismaClient } from '@prisma/client'
import { Module } from './Module'

export class ModulesManager {
	private modules: Map<string, Module> = new Map()

	constructor(private prisma: PrismaClient) {}

	register(module: Module) {
		if (this.modules.has(module.id)) {
			throw new Error(`Module ${module.id} déjà enregistré.`)
		}
		this.modules.set(module.id, module)
	}

	/**
	 * Génère le seed pour TOUS les modules enregistrés
	 */
	async seed() {
		const allAttributes = Array.from(this.modules.values()).flatMap((m) => m.attributes)

		console.log(`Seeding ${allAttributes.length} attributs...`)

		for (const attr of allAttributes) {
			await this.prisma.attribute.upsert({
				where: { key: attr.key },
				create: attr,
				update: attr
			})
		}
	}

	/**
	 * Trouve le module responsable d'une clé (ex: "core.pos_x" -> CoreModule)
	 */
	getModuleByKey(key: string): Module | undefined {
		const [prefix] = key.split('.')
		return this.modules.get(prefix)
	}
}
