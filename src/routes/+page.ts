import { page } from '$app/stores'
import { trpc } from '$lib/trpc/client'
import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
	const code = event.url.searchParams.get('code')
	if (code !== null) {
		await trpc(event).auth.signup.mutate({
			code
        })
	}
}
