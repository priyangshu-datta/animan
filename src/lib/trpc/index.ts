import { router } from './router'
import { authRouter } from './routers/auth'
import { characterRouter } from './routers/character'
import { mediaRouter } from './routers/media'
import { reviewRouter } from './routers/review'

export const appRouter = router({
	media: mediaRouter,
	character: characterRouter,
	review: reviewRouter,
	auth: authRouter
})

export type AppRouter = typeof appRouter
