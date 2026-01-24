import { zodJsonValue, type JsonRecord, type JsonValue } from '$lib/model'
import { AttributeType, Prisma } from '@prisma/client'
import { z, type ZodType } from 'zod'

const parserValue = {
	LENGTH: z.number(),
	MASS: z.number(),
	TIME: z.number(),
	TEMPERATURE: z.number(),
	PRESSURE: z.number(),
	SPEED: z.number(),
	CURRENCY: z.number(),
	COUNT: z.number(),
	DEPENDENCY: z.string(),
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
	COUNT: z.number().default(1),
	DEPENDENCY: z.null().default(null),
	REFERENCE: z.null().default(null),
	CUSTOM: z.string()
} satisfies Record<AttributeType, ZodType>

type ParserValue = typeof parserValue
type ParserUnit = typeof parserUnit

type AttributeConfigValue<T extends AttributeType> = z.output<ParserValue[T]>
type AttributeConfig<T extends AttributeType> = {
	label: string
	type: T
	unit?: z.input<ParserUnit[T]>
	validation?: (value: AttributeConfigValue<T>) => void
}

export type AttributeConfigUnion = { [T in AttributeType]: AttributeConfig<T> }[AttributeType]
export type AttributesConfig<Names extends string> = Record<Names, AttributeConfigUnion>

type ModuleConfig<Names extends string> = {
	id: string
	attributes: AttributesConfig<Names>
}

function defineModule<Names extends string>({ id, attributes }: ModuleConfig<Names>) {
	function getKey(name: Names): string {
		return `${id}.${name}`
	}

	function getAttribute(key: string): AttributeConfigUnion | undefined {
		const [moduleId, name] = key.split('.')
		if (moduleId !== id) return undefined
		return attributes[name as Names]
	}

	function getSeedData(): Prisma.AttributeCreateInput[] {
		return Object.entries<AttributeConfigUnion>(attributes).map(([name, def]) => ({
			key: getKey(name as Names),
			type: def.type,
			typeOption: { unit: def.type }
		}))
	}

	function validAttributeValue<T extends AttributeType>(
		attribute: AttributeConfig<T>,
		value: JsonValue
	): AttributeConfigValue<T> {
		const parsedValue = parserValue[attribute.type].parse(value) as AttributeConfigValue<T>
		attribute.validation?.(parsedValue)
		return parsedValue
	}

	function parseChanges(changes: JsonRecord): JsonRecord {
		const result: JsonRecord = {}
		for (const key in changes) {
			const attribute = getAttribute(key)
			if (!attribute) continue
			result[key] = validAttributeValue(attribute, changes[key])
		}
		return result
	}

	return {
		getKey,
		getSeedData,
		parseChanges
	}
}

const locationModule = defineModule({
	id: 'location',
	attributes: {
		position_x: {
			label: 'Position X',
			type: AttributeType.LENGTH
		},
		position_y: {
			label: 'Position Y',
			type: AttributeType.LENGTH
		},
		dimension_x: {
			label: 'Largeur (Dim X)',
			type: AttributeType.LENGTH
		},
		dimension_y: {
			label: 'Profondeur (Dim Y)',
			type: AttributeType.LENGTH
		},
		rotation: {
			label: 'Rotation Z',
			type: AttributeType.CUSTOM
		},
		parent: {
			label: 'Parent (Conteneur)',
			type: AttributeType.REFERENCE
		}
	}
})
