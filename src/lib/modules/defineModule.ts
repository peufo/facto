import { zodJsonValue, type JsonRecord, type JsonValue } from '$lib/model'
import type { AttributeType, Prisma } from '@prisma/client'
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
	DEPENDENCY: z.object({ id: z.string(), namespace: z.string().nullish() }),
	REFERENCE: z.union([z.string(), z.object({ id: z.string() }).transform(({ id }) => id)]),
	CUSTOM: zodJsonValue
} satisfies Record<AttributeType, ZodType>

const parserUnit = {
	LENGTH: z.enum(['mm', 'cm', 'm', 'km']).default('m'),
	MASS: z.enum(['mg', 'g', 'kg', 't']).default('g'),
	TIME: z.enum(['ms', 's', 'min', 'h', 'd']).default('min'),
	TEMPERATURE: z.enum(['C', 'K']).default('C'),
	PRESSURE: z.enum(['Pa', 'hPa', 'bar', 'psi']).default('bar'),
	SPEED: z.enum(['m/s', 'km/h']).default('m/s'),
	CURRENCY: z.enum(['CHF', 'USD', 'EUR']).default('CHF'),
	COUNT: z.string().default('unit'),
	DEPENDENCY: z.null().default(null),
	REFERENCE: z.null().default(null),
	CUSTOM: z.string()
} satisfies Record<AttributeType, ZodType>

const options = {
	LENGTH: z.object({}).default({}),
	MASS: z.object({}).default({}),
	TIME: z.object({}).default({}),
	TEMPERATURE: z.object({}).default({}),
	PRESSURE: z.object({}).default({}),
	SPEED: z.object({}).default({}),
	CURRENCY: z.object({}).default({}),
	COUNT: z.object({}).default({}),
	DEPENDENCY: z.object({}).default({}),
	REFERENCE: z.object({}).default({}),
	CUSTOM: z.object({}).default({})
} satisfies Record<AttributeType, ZodType<JsonRecord>>

export type AttributeValue<T extends AttributeType> = z.output<(typeof parserValue)[T]>
type ModuleData<Attrs extends AttributesConfig> = {
	[K in keyof Attrs]?: AttributeValue<Attrs[K]['type']>
}

type AttributeConfig<T extends AttributeType> = {
	label: string
	type: T
	unit?: z.input<(typeof parserUnit)[T]>
	options?: z.input<(typeof options)[T]>
}

export type AttributeConfigUnion = { [T in AttributeType]: AttributeConfig<T> }[AttributeType]
export type AttributesConfig = Record<string, AttributeConfigUnion>
export type AttributeOutput = ReturnType<typeof defineAttribute>
export type ModuleConfig<Attrs extends AttributesConfig> = {
	id: string
	attributes: Attrs
}

export function defineAttribute<Attr extends AttributeConfigUnion>(config: Attr) {
	function validation<Attr extends AttributeConfigUnion>(
		value: JsonValue
	): AttributeValue<Attr['type']> {
		return parserValue[config.type].parse(value) as AttributeValue<Attr['type']>
	}
	return {
		...config,
		validation
	}
}

export function defineModule<Attrs extends AttributesConfig>(config: ModuleConfig<Attrs>) {
	type ThisModuleData = ModuleData<Attrs>
	type Keys = keyof Attrs

	const attributes = new Map<string, AttributeOutput>()
	for (const [key, attr] of Object.entries(config.attributes)) {
		attributes.set(getKey(key), defineAttribute(attr))
	}

	function getKey<K extends Keys>(name: K): string {
		return `${config.id}:${String(name)}`
	}

	return {
		id: config.id,
		attributes
	}
}
