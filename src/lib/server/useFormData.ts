import { jsonParse } from 'fuma'
import { parse } from 'devalue'

export async function useFormData<T>(
	url: URL,
	key: `form_${string}`,
	getData: (id: string) => Promise<T>
) {
	const param = url.searchParams.get(key)
	if (param == null) {
		return undefined
	}

	const isObject = param.startsWith('{') && param.endsWith('}')
	if (isObject) {
		return jsonParse<Partial<T>>(param, {})
	}
	const isArray = param.startsWith('[') && param.endsWith(']')
	if (isArray) {
		const value = parse(param) as Partial<T>
		return value
	}

	return getData(param)
}
