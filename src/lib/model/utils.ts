import z from 'zod'

export type ShapeOf<T extends Record<string, unknown>> = Readonly<
	Readonly<{
		[K in keyof T]: z.core.$ZodType<T[K], unknown, z.core.$ZodTypeInternals<T[K], unknown>>
	}>
>

export const zodCoerceJSON = z
	.string()
	.transform((str, ctx): z.infer<ReturnType<typeof z.json>> => {
		try {
			return JSON.parse(str)
		} catch (e) {
			ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
			return z.NEVER
		}
	})
