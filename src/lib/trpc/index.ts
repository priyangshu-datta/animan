import { router } from './router'
import { characterRouter } from './routers/character'
import { mediaRouter } from './routers/media'
import { reviewRouter } from './routers/review'
import { userRouter } from './routers/user'

export const appRouter = router({
	media: mediaRouter,
	character: characterRouter,
	review: reviewRouter,
	user: userRouter
})

export type AppRouter = typeof appRouter
