import type {
	MediaType,
	MediaByIDminQuery,
	MediaByIDminQueryVariables,
	MediaByIdQuery,
	MediaByIdQueryVariables,
	MediaByQueryStringQuery,
	MediaByQueryStringQueryVariables
} from '../../graphql'
import { fetch_gql } from '$lib/helpers'
import { router, publicProcedure } from '../router'
import { z } from 'zod'

export const mediaRouter = router({
	search: publicProcedure
		.input(
			z.object({
				query_string: z.string(),
				page: z.optional(z.number()),
				limit: z.optional(z.number()),
				media_type: z.optional(z.enum(['ANIME', 'MANGA']))
			})
		)
		.query(async ({ input: { ...variables } }) => {
			console.log(variables);
			
			let result = await fetch_gql<MediaByQueryStringQuery, MediaByQueryStringQueryVariables>(
				'search_medias',
				true,
				{
					...variables,
					media_type: variables.media_type as MediaType
				}
			)

			return result
		}),
	get: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input: { ...variables } }) => {
			return await fetch_gql<MediaByIdQuery, MediaByIdQueryVariables>('get_media', true, variables)
		}),
	get_min: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input: { ...variables } }) => {
			return await fetch_gql<MediaByIDminQuery, MediaByIDminQueryVariables>(
				'get_media_min',
				true,
				variables
			)
		})
})
