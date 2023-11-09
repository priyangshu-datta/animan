import { appRouter } from '$lib/trpc'
import { createContext } from '$lib/trpc/context'
import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'

export const handle: Handle = createTRPCHandle({ router: appRouter, createContext })
