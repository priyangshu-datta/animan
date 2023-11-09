import { router } from "$lib/trpc/router";
import { characterReviewRouter } from "./character";
import { mediaReviewRouter } from "./media";

export const reviewRouter = router({
    mediaReview: mediaReviewRouter,
    characterReview: characterReviewRouter
})