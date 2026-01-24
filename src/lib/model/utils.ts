import z from 'zod'

export type ShapeOf<T extends Record<string, unknown>> = Readonly<
	Readonly<{
		[K in keyof T]: z.core.$ZodType<T[K], unknown, z.core.$ZodTypeInternals<T[K], unknown>>
	}>
>

export type JsonValue = string | number | boolean | null | JsonValue[] | JsonRecord
export type JsonRecord = { [key: string]: JsonValue }

export const zodJsonValue: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.null(),
		z.string(),
		z.number(),
		z.boolean(),
		zodJsonRecord,
		z.array(z.string()),
		z.array(z.number()),
		z.array(z.boolean()),
		z.array(zodJsonRecord)
	])
)
export const zodJsonRecord: z.ZodType<JsonRecord> = z.record(z.string(), zodJsonValue)

export const zodCoerceJson = z.string().transform((str, ctx) => {
	try {
		return JSON.parse(str)
	} catch (e) {
		ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
		return z.NEVER
	}
})

export const zodCoerceJsonValue = zodCoerceJson.pipe(zodJsonValue)
export const zodCoerceJsonRecord = zodCoerceJson.pipe(zodJsonRecord)
