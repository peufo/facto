import { PrismaMariaDb } from '@prisma/adapter-mariadb'

export function useAdapter(databaseUrl: string) {
	const url = new URL(databaseUrl)
	return new PrismaMariaDb({
		user: url.username,
		password: url.password,
		host: url.hostname,
		port: +(url.port || 3306),
		database: url.pathname.slice(1),
		connectionLimit: 5
	})
}
