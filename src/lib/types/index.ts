import { z } from 'zod'

export const authCodeValidator = z.object({ code: z.string() })
export const authAccessTokenValidator = z.object({
	grant_type: z.literal('authorization_code'),
	client_id: z.string(),
	client_secret: z.string(),
	redirect_uri: z.string(),
	code: z.string()
})

export const ResponseAuthAccessTokenValidator = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
	expires_in: z.number(),
	token_type: z.literal('Bearer')
})

export const ResponseAnilistViewer = z.object({
	errors: z.optional(
		z.array(
			z.object({
				message: z.string(),
				status: z.number().gt(399).int(),
				validation: z.optional(z.object({}))
			})
		)
	),
	data: z.object({ Viewer: z.object({ id: z.number(), name: z.string() }) })
})

export const searchMediaParametersValidator = z.object({
	query: z.string().max(2),
	offset: z.number().gt(0),
	limit: z.number().gt(1),
	media_type: z.enum(['ANIME', 'MANGA'])
})

export const cookieValidator = z.object({
	payload: z.object({
		anilist_token: z.string(),
		user_id: z.string()
	}),
	protectedHeader: z.object({ alg: z.literal('HS256') })
})
