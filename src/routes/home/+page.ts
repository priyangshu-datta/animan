import { trpc } from '$lib/trpc/client'
import type { PageLoad } from '../$types'

export const ssr = false

export const load: PageLoad = async (event) => {
	console.log("already in home");
	
	// console.log('in home', await trpc(event).user.info.query())

	let data = {
		user: (await trpc(event).user.info.query()).data
	}
	return { ...data }
}
