import { fail, json, type RequestHandler } from '@sveltejs/kit'
import {
	authCodeValidator,
	ResponseAnilistViewer,
	ResponseAuthAccessTokenValidator
} from '$lib/types'
import { ANILIST_CLIENT_SECRET_CODE, JWT_SECRET } from '$env/static/private'
import * as jose from 'jose'
import { prisma_op } from '$lib/helpers'

export const POST: RequestHandler = async ({ request, cookies }) => {
	/* Already Signed in */
	const jwt = cookies.get('access_token')
	if (jwt !== undefined) {
		try {
			await jose.jwtVerify(jwt, new TextEncoder().encode(JWT_SECRET))
			return json({
				status: 200,
				message: 'Already signed in!'
			})
		} catch {
			throw fail(500)
		}
	}
	/* New Sigin*/
	let body = await request.json()
	let parsedBody = authCodeValidator.safeParse(body)
	if (parsedBody.success === false) {
		throw fail(400)
	}
	let { code } = parsedBody.data

	let accessTokenBody = new FormData()
	accessTokenBody.set('grant_type', 'authorization_code')
	accessTokenBody.set('client_id', '5505')
	accessTokenBody.set('client_secret', ANILIST_CLIENT_SECRET_CODE)
	accessTokenBody.set('code', code)
	accessTokenBody.set('redirect_uri', 'https://pd-animan.vercel.app/auth')

	const authResponse = await fetch('https://anilist.co/api/v2/oauth/token', {
		body: accessTokenBody,
		method: 'POST'
	})
	const authResponseData = ResponseAuthAccessTokenValidator.safeParse(await authResponse.json())
	if (authResponseData.success === false) throw fail(401)
	let { access_token: anilist_token } = authResponseData.data

	let userFetchResponse = await fetch('https://graphql.anilist.co/', {
		headers: {
			Authorization: 'Bearer ' + anilist_token,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `query{
				Viewer {
				  id
				  name
				}
			  }
			  `,
			variables: {}
		}),
		method: 'POST'
	})

	let userFetchResponseData = await userFetchResponse.json()
	let userParsedData = ResponseAnilistViewer.safeParse(userFetchResponseData)
	if (userParsedData.success === false) throw fail(500)
	if (userParsedData.data.errors !== undefined) {
		console.log(userParsedData.data.errors)
		throw fail(500)
	}
	let { Viewer } = userParsedData.data.data

	let userInDB = await prisma_op((prisma) => {
		return prisma.user.findUnique({
			where: {
				anilist_id: Viewer.id
			}
		})
	})

	if (userInDB === null || userInDB === undefined) {
		userInDB = await prisma_op((prisma) => {
			return prisma.user.create({
				data: {
					anilist_id: Viewer.id
				}
			})
		})
	}

	let access_token = await new jose.SignJWT({
		anilist_token: anilist_token,
		user_id: userInDB.id
	})
		.setProtectedHeader({
			alg: 'HS256'
		})
		.sign(new TextEncoder().encode(JWT_SECRET))

	cookies.set('access_token', access_token)
	return json({
		status: 200,
		message: 'Signed in!'
	})
}

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('access_token')
	return new Response('Redirect', { status: 303, headers: { Location: '/' } })
}
