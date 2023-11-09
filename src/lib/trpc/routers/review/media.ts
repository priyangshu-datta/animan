import { publicProcedure, router } from '../../router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { prisma_op } from '$lib/helpers'

export const mediaReviewRouter = router({
	create: publicProcedure
		.input(
			z.object({
				media_id: z.number(),
				unit: z.number().min(0),
				type: z.enum(['ANIME', 'MANGA']),
				rate: z
					.number()
					.min(0.0, 'Allowed values are between 0.0 to 10.0.')
					.max(10.0, 'Allowed values are between 0.0 to 10.0.'),
				comment: z.string(),
				createdAt: z.optional(z.union([z.date(), z.string()]))
			})
		)
		.mutation(async ({ input: { media_id, unit, type, rate, comment, createdAt } }) => {
			if (typeof createdAt === 'string') {
				if (isNaN(+new Date(createdAt))) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Bad Date.'
					})
				}
			}

			const data = {
				media_id,
				unit,
				comment,
				rating: rate,
				type,
				createdAt: typeof createdAt === 'string' ? createdAt : createdAt?.toString()
			}
			if (createdAt === undefined) delete data['createdAt']
			try {
				return await prisma_op(async (prisma) => {
					return await prisma.mediaReview.create({
						data
					})
				})
			} catch(error) {
				console.log(`Create Error Caught in Server, ${error}`)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong. Please refresh or wait.'
				})
			}
		}),
	get: publicProcedure
		.input(
			z.object({
				media_id: z.number()
			})
		)
		.query(async ({ input: { media_id } }) => {
			try {
				return await prisma_op(async (prisma) => {
					return await prisma.mediaReview.findMany({
						where: {
							media_id
						}
					})
				})
			} catch(error) {
				console.log(`Get Error Caught in Server, ${error}`)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong. Please refresh or wait.'
				})
			}
		}),
	read: publicProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ input: { id } }) => {
			try {
				return await prisma_op(async (prisma) => {
					return await prisma.mediaReview.findMany({
						where: {
							id
						}
					})
				})
			} catch(error) {
				console.log(`Read Error Caught in Server, ${error}`)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong. Please refresh or wait.'
				})
			}
		}),
	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				rate: z.optional(
					z
						.number()
						.min(0.0, 'Allowed values are between 0.0 to 10.0.')
						.max(10.0, 'Allowed values are between 0.0 to 10.0.')
				),
				comment: z.optional(z.string()),
				createdAt: z.optional(z.date())
			})
		)
		.mutation(async ({ input: { id, rate, comment, createdAt } }) => {
			if (rate === undefined && comment === undefined && createdAt === undefined)
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Nothing to update.'
				})
			try {
				return await prisma_op(async (prisma) => {
					const data = {
						comment,
						rating: rate,
						createdAt
					}
					if (createdAt === undefined) delete data['createdAt']
					return await prisma.mediaReview.update({
						where: {
							id
						},
						data
					})
				})
			} catch(error) {
				console.log(`Update Error Caught in Server, ${error}`)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong. Please refresh or wait.'
				})
			}
		}),
	delete: publicProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ input: { id } }) => {
			try {
				return await prisma_op(async (prisma) => {
					return await prisma.mediaReview.delete({
						where: {
							id
						}
					})
				})
			} catch(error) {
				console.log(`Delete Error Caught in Server, ${error}`)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong. Please refresh or wait.'
				})
			}
		})
})
