import {
	MediaListStatus,
	MediaType,
	type UserMediaByStatusQuery,
	type UserMediaByStatusQueryVariables
} from '$lib/graphql'
import { fetch_gql } from '$lib/helpers'
import { publicProcedure, router } from '$lib/trpc/router'
import { z } from 'zod'

export const userMediaRouter = router({
	current: publicProcedure
		.input(z.object({ page: z.number(), limit: z.number(), type: z.nativeEnum(MediaType) }))
		.query(async ({ input: { ...variables }, ctx }) => {
			let result = await fetch_gql<UserMediaByStatusQuery, UserMediaByStatusQueryVariables>(
				'get_user_media',
				true,
				{
					status: MediaListStatus.Current,
					userId: ctx.user.anilist_id,
					...variables
				},
				ctx.user.anilist_token
			)

			return result
		})
})
