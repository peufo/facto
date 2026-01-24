import type { JsonRecord } from '$lib/model'
import { prisma } from '$lib/server'
import { AttributeType, type Prisma } from '@prisma/client'

type TypeOptionUnit = {
	LENGTH: 'mm' | 'cm' | 'm' | 'km'
	MASS: 'mg' | 'g' | 'kg' | 't'
	TIME: 'ms' | 's' | 'min' | 'h' | 'd'
	TEMPERATURE: '°C' | '°F' | 'K'
	PRESSURE: 'Pa' | 'hPa' | 'bar' | 'psi'
	SPEED: 'm/s' | 'km/h' | 'mph'
	CURRENCY: 'USD' | 'EUR' | 'GBP' | 'JPY'
	COUNT: 'unit' | 'dozen' | 'gross'
	DEPENDENCY: never
	REFERENCE: never
	CUSTOM: string
}

export type AttributeDataMap = {
	LENGTH: number
	MASS: number
	TIME: number
	TEMPERATURE: number
	PRESSURE: number
	SPEED: number
	CURRENCY: number
	COUNT: number
	DEPENDENCY: any // Ou un objet complexe fusionné
	REFERENCE: string // L'ID cible
	CUSTOM: any
}

type CreateDef<T extends AttributeType> = {
	label: string
	type: T
	typeOption: {
		// Si T est dans TypeOptionUnit, on utilise ses valeurs, sinon string
		unit?: TypeOptionUnit[T]
		description?: string
	}
	parse?: (value: unknown) => AttributeDataMap[T]
}

export type AttributeDefinition = { [K in AttributeType]: CreateDef<K> }[AttributeType]
export type Definitions = Record<string, AttributeDefinition>

export type CommitPayload = {
	changes: JsonRecord
	connections: Array<{ key: string; targetId: string }>
}

export abstract class Module<Defs extends Definitions> {
	abstract readonly id: string
	abstract readonly definitions: Defs
	abstract validateCommit(payload: CommitPayload): void

	protected getKey(name: keyof Defs): string {
		return `${this.id}.${String(name)}`
	}

	get attributes(): Prisma.AttributeCreateInput[] {
		return Object.entries(this.definitions).map(([name, { parse, ...data }]) => ({
			key: this.getKey(name),
			...data
		}))
	}
}

// Définition locale des attributs du Core pour inférence
const coreDefs = {
	pos_x: {
		label: 'Position X',
		type: AttributeType.LENGTH, // 👈 Si je mets LENGTH...
		typeOption: {
			unit: '', // ✅ ...TS me propose uniquement 'mm', 'm', etc.
			description: 'Position au sol'
		},
		// ✅ ...et parse doit retourner un number
		parse: (v: unknown) => (typeof v === 'number' ? v : Number(v))
	},
	parent: {
		label: 'Parent',
		type: AttributeType.REFERENCE,
		typeOption: {}, // ❌ ERREUR : 'unit' n'existe pas sur REFERENCE (never)
		parse: (v: unknown) => String(v) // Doit retourner string (ID)
	}
} satisfies Record<string, AttributeDefinition> // "satisfies" est vital ici !

export class CoreModule extends Module<typeof coreDefs> {
	readonly id = 'core'
	readonly definitions = coreDefs

	validateCommit(payload: CommitPayload): void {
		const xKey = this.getKey('pos_x') // ✅ Autocomplétion sur 'pos_x' !

		if (payload.changes[xKey]) {
			// Utilisation du parseur défini
			const val = this.definitions.pos_x.parse?.(payload.changes[xKey])
			// val est typé 'number' automatiquement
		}
	}
}
