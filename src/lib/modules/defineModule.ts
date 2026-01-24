import { zodJsonValue, type JsonRecord, type JsonValue } from '$lib/model'
import type { AttributeType } from '@prisma/client'
import { z, ZodError, type ZodType } from 'zod'

const parserValue = {
	LENGTH: z.number(),
	MASS: z.number(),
	TIME: z.number(),
	TEMPERATURE: z.number(),
	PRESSURE: z.number(),
	SPEED: z.number(),
	CURRENCY: z.number(),
	COUNT: z.number(),
	DEPENDENCY: z.union([z.string(), z.object({ id: z.string() }).transform(({ id }) => id)]),
	REFERENCE: z.string(),
	CUSTOM: zodJsonValue
} satisfies Record<AttributeType, ZodType>

const parserUnit = {
	LENGTH: z.enum(['mm', 'cm', 'm', 'km']).default('m'),
	MASS: z.enum(['mg', 'g', 'kg', 't']).default('g'),
	TIME: z.enum(['ms', 's', 'min', 'h', 'd']).default('min'),
	TEMPERATURE: z.enum(['C', 'K']).default('C'),
	PRESSURE: z.enum(['Pa', 'hPa', 'bar', 'psi']).default('bar'),
	SPEED: z.enum(['m/s', 'km/h']).default('m/s'),
	CURRENCY: z.enum(['CHF', 'USD', 'EUR', 'GBP', 'JPY']).default('CHF'),
	COUNT: z.string().default('unit'),
	DEPENDENCY: z.null().default(null),
	REFERENCE: z.null().default(null),
	CUSTOM: z.string()
} satisfies Record<AttributeType, ZodType>

type AttributeOutput<T extends AttributeType> = z.output<(typeof parserValue)[T]>
type NamespacedKey<ID extends string, K extends string> = `${ID}.${K}`
type ModuleData<ID extends string, Attrs extends Record<string, any>> = {
	[K in keyof Attrs as NamespacedKey<ID, K & string>]?: AttributeOutput<Attrs[K]['type']>
}

type AttributeConfig<T extends AttributeType> = {
	label: string
	type: T
	unit?: z.input<(typeof parserUnit)[T]>
	validation?: (value: AttributeOutput<T>) => void
}

type AttributeConfigUnion = { [T in AttributeType]: AttributeConfig<T> }[AttributeType]
export type AttributesConfig = Record<string, AttributeConfigUnion>

export type ModuleConfig<ID extends string, Attrs extends AttributesConfig> = {
	id: ID
	attributes: Attrs
}

export function defineModule<ID extends string, Attrs extends AttributesConfig>(
	config: ModuleConfig<ID, Attrs>
) {
	type ThisModuleData = ModuleData<ID, Attrs>

	function getKey<K extends keyof Attrs>(name: K): string {
		return `${config.id}:${String(name)}`
	}

	function getAttribute(key: string): AttributeConfigUnion | undefined {
		const [moduleId, name] = key.split(':')
		if (moduleId !== config.id) return undefined
		return config.attributes[name]
	}

	function validAttributeValue<T extends AttributeType>(
		attribute: AttributeConfig<T>,
		value: JsonValue
	): AttributeOutput<T> {
		const parsedValue = parserValue[attribute.type].parse(value) as AttributeOutput<T>
		attribute.validation?.(parsedValue)
		return parsedValue
	}

	function parseChanges(changes: JsonRecord): ThisModuleData {
		const result: JsonRecord = {}
		for (const key in changes) {
			const attribute = getAttribute(key)
			if (!attribute) continue
			try {
				result[key] = validAttributeValue(attribute, changes[key])
			} catch (err: unknown) {
				console.error(`Commit: Validation failed for key "${key}"`)
				if (err instanceof ZodError) console.error(err.message)
			}
		}
		return result as ThisModuleData
	}

	return {
		id: config.id,
		config,
		getKey,
		parseChanges
	}
}
