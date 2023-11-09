<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import type { Page } from '@sveltejs/kit'
	import { Trash } from 'lucide-svelte'
	import type { Writable } from 'svelte/store'

	export let review_id: string
	export let rating: number
	export let comment: string
	export let createdAt: string
	export let page: Page
	export let updateReviewList: Writable<boolean>

	async function deleteReview() {
		let result
		await trpc(page)
			.review.characterReview.delete.mutate({ review_id })
			.then((res) => (result = res))
			.catch((er) => {
				console.log(`Delete Error, caught in Client: ${er}`)
			})
		updateReviewList.update(() => true)
	}
</script>

<fieldset class="{`${review_id}`} border-[--color-primary-500] border-2 p-2">
	<legend class="flex items-center ml-auto">
		<button on:click={deleteReview}><Trash /></button>
	</legend>
	<span><b>Rating:</b> {rating}/10</span>
	<br />
	<span class="text-justify"><b>Comment:</b> {comment}</span>
	<br />
	<span><b>Dated:</b> {new Date(createdAt)}</span>
</fieldset>
