import { publicProcedure, router } from '$lib/trpc/router'
import { z } from 'zod'

export const authRouter = router({
	signup: publicProcedure
		.input(z.object({ code: z.string() }))
		.mutation(({ input: { code }, ctx }) => {
			const formData = new FormData()
			formData.append('grant_type', 'authorization_code')
			formData.append('client_id', '5505')
			formData.append('client_secret', '7nz9PVlPzgMqVCjX290sqiPLo4JviaEuAtgun1OW')
			formData.append('code', code)
			formData.append('redirect_uri', 'http://localhost:5173')

			fetch('https://anilist.co/api/v2/oauth/token', {
				method: 'POST',
				body: formData
			})
				.then((res) => {
					return res.json()
				})
				.then(
					async ({
						access_token
					}: {
						token_type: 'Bearer'
						expires_in: 31622400
						access_token: string
						refresh_token: string
					}) => {
						
						// console.log(ctx.event.cookies.getAll())

						// await ctx.event.cookies.set('access_token', 'access_token', { path: '/' })
					}
				)
				.catch((er) => {
					console.log(er)
				})
		})
})
