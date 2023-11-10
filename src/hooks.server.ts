import { appRouter } from '$lib/trpc'
import { createContext } from '$lib/trpc/context'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createTRPCHandle } from 'trpc-sveltekit'

const TRPCHook = createTRPCHandle({ router: appRouter, createContext })
const AuthHook: Handle = async ({ event, resolve }) => {
	const access_token = event.cookies.get('access_token')

	if (access_token === undefined) {
		if (event.url.pathname !== '/' && event.url.pathname !== '/auth')
			return new Response('Redirect', { status: 303, headers: { Location: '/' } })
	} else {
		
		if (event.url.pathname === '/') {
			return new Response('Redirect', { status: 303, headers: { Location: '/home' } })
		}
		event.locals.access_token = access_token
	}

	return resolve(event)
}

export const handle: Handle = sequence(AuthHook, TRPCHook)
