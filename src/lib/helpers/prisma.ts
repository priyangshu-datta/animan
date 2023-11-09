import { PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'

const prisma = new PrismaClient()

export async function prisma_op<R>(operation: (prisma: PrismaClient) => R) {
	async function main() {
		return await operation(prisma)
	}

	return main()
		.then((result) => {
			return result
		})
		.catch((e) => {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `Prisma Error: 
                ############
                ####${e}####
                ############`
			})
		})
		.finally(async () => {
			await prisma.$disconnect()
		})
}
