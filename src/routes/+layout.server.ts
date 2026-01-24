import { prisma } from '$lib/server/db'
import { useFormData } from '$lib/server/useFormData'

export const load = async ({ url }) => {
	return {
		formDataProcess: await useFormData(url, 'form_process', (id) =>
			prisma.process.findFirstOrThrow({ where: { id } })
		),
		formDataCommit: await useFormData(url, 'form_commit', (id) =>
			prisma.commit.findFirstOrThrow({ where: { id }, include: { process: true } })
		)
	}
}
