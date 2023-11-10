import { trpc } from '$lib/trpc/client'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const ssr = true

export const load: PageServerLoad = async (event) => {
	const id = parseInt(event.params.id)

	if (isNaN(id)) throw error(400, { message: 'ID must be a number.' })
	return {
		...(await trpc(event).character.get.query({ id }))?.data?.Character
	}
}
