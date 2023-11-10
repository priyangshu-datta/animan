import { JWT_SECRET } from '$env/static/private'
import type { UserQuery, UserQueryVariables } from '$lib/graphql'
import { fetch_gql } from '$lib/helpers'
import { cookieValidator } from '$lib/types'
import { fail, type RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import * as jose from 'jose'

export async function createContext(event: RequestEvent) {
	const access_token = event.cookies.get('access_token')!

	const cookieData = cookieValidator.safeParse(
		await jose.jwtVerify(access_token, new TextEncoder().encode(JWT_SECRET))
	)

	if (cookieData.success === false) throw fail(401)

	let user = await fetch_gql<UserQuery, UserQueryVariables>(
		'user_object',
		true,
		{},
		cookieData.data.payload.anilist_token
	)

	console.log(user)

	return {
		user: {
			...cookieData.data.payload,
			anilist_id: user.data.Viewer?.id!
		}
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
