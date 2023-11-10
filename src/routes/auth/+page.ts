import type { authCodeValidator } from '$lib/types'
import { fail, redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { z } from 'zod'

export const ssr = false

export const load: PageLoad = async ({ url, fetch }) => {
	let code = url.searchParams.get('code')
	if (code !== null) {
		let body: z.infer<typeof authCodeValidator> = {
			code
		}
		fetch('/auth', {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then((res) => res.text())
			.catch((er) => {
				console.log("Auth error:", er)	
				throw fail(500)
			})
			.then((res) => {
				
				console.log("Auth suc", res)
			})
	}
}
