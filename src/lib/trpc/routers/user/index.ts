import type { UserQuery, UserQueryVariables } from '$lib/graphql'
import { fetch_gql } from '$lib/helpers'
import { publicProcedure, router } from '$lib/trpc/router'
import { userMediaRouter } from './media'

export const userRouter = router({
	info: publicProcedure.query(async ({ ctx }) => {
		let result = await fetch_gql<UserQuery, UserQueryVariables>('user_object', true, {}, ctx.user.anilist_token)
		
		return result
	}),
	media: userMediaRouter
})
