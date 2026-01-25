import type { JsonRecord as JsonRecordType } from '$lib/model'

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user']
			session: import('$lib/server/auth').SessionValidationResult['session']
		}
	}

	namespace PrismaJson {
		type JsonRecord = JsonRecordType
	}
}

export {}
