<script lang="ts">
	import type { PageServerData } from './$types'
	import { getTimeStamp, prettyPrintDateDifference } from '$utils/datetime'
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { onDestroy, onMount } from 'svelte'
	import { error } from '@sveltejs/kit'
	import { browser } from '$app/environment'
	import CharacterReview from '../../../components/character-review.svelte'
	import { Loader2 } from 'lucide-svelte'
	import { writable } from 'svelte/store'

	export let data: PageServerData

	const handleAddReview = async () => {
		const dialog = document.getElementById('dialog-review') as HTMLDialogElement
		const form = document.getElementById(
			dialog.open ? 'dialog-review-form' : 'addReview'
		) as HTMLFormElement


		const formData = new FormData(form)

		const id = formData.get('id')
		const rating = formData.get('rating')
		const comment = formData.get('comment')
		// const createdAt = formData.get('createdAt')
		console.table({ id, rating, comment })

		if (id === null || rating === null || comment === null) return
		if (isNaN(parseInt(id.toString()))) throw error(400, { message: 'ID must be a number.' })
		if (isNaN(parseInt(rating.toString())))
			throw error(400, { message: 'Rating must be a number.' })

		submittingReview = true

		await trpc($page).review.characterReview.create.mutate({
			id: parseInt(id.toString()),
			comment: comment.toString(),
			rate: parseInt(rating.toString())
			// createdAt: getTimeStamp(new Date(createdAt?.toString()!).getTime() / 1000)
		})

		localStorage.clear()
		form.reset()
		if (dialog.open) {
			dialog.close()
		}
		submittingReview = false
		updateReviewList.update(() => true)
	}

	onMount(() => {
		const preFill = JSON.parse(localStorage.getItem($page.params.id) ?? '{}')

		;(document.getElementsByName('rating')[0] as HTMLInputElement).value = preFill.rating ?? ''
		;(document.getElementsByName('comment')[0] as HTMLTextAreaElement).value = preFill.comment ?? ''

		window.addEventListener('beforeunload', () => {
			const form = document.querySelector('form')!
			const formData = new FormData(form)
			const rating = formData.get('rating')?.toString()
			const comment = formData.get('comment')?.toString()
			const unit = formData.get('unit')?.toString()

			localStorage.setItem(
				$page.params.id,
				JSON.stringify({
					rating,
					comment,
					unit
				})
			)
		})
	})

	onDestroy(() => {
		if (browser) {
			const form = document.querySelector('form')!
			const formData = new FormData(form)
			const rating = formData.get('rating')?.toString()
			const comment = formData.get('comment')?.toString()

			localStorage.setItem(
				$page.params.id,
				JSON.stringify({
					rating,
					comment
				})
			)
		}
	})

	async function getReviews() {
		return await trpc($page).review.characterReview.get.query({ id: parseInt($page.params.id) })
	}

	let submittingReview = false
	let showReviews = false
	let updateReviewList = writable(false)
	let reviewList: Awaited<ReturnType<typeof getReviews>> = []

	$: (async () => {
		if ($updateReviewList) {
			reviewList = await getReviews()
			updateReviewList.update(() => false)
		}
	})()

	const parseRichText = (text: string) => {
		let intermediateText = text
			.split('__')
			.map((phrase, index) => {
				if (index % 2 === 1) {
					return `${index !== 1 ? '<br />' : ''}<b>${phrase}</b>`
				}
				return phrase
			})
			.filter((phrase) => phrase.length > 0)
			.join(' ')

		intermediateText = intermediateText
			.split('**')
			.map((phrase, index) => {
				if (index % 2 === 1) {
					return `${index !== 1 ? '<br />' : ''}<b>${phrase}</b>`
				}
				return phrase
			})
			.filter((phrase) => phrase.length > 0)
			.join(' ')

		for (let match of intermediateText.matchAll(/~!.+!~/g)) {
			if (match.index !== undefined && match[0] !== undefined)
				intermediateText = intermediateText.replace(
					match[0],
					`<span class="spoiler">${match[0].slice(2, -2)}</span><br />`
				)
		}

		let spoilerStyle = `<style>
.spoiler {
	border-radius: 10px;
	background-color: grey;
	color: grey;
	cursor: pointer;
	transition: all 300ms ease-in-out;
}
.spoiler:hover{
	background-color: transparent;
	color: inherit;
}
</style>`

		intermediateText = intermediateText.concat(spoilerStyle)

		return intermediateText.replace(/<br \/>\s*\n*\s*<br \/>/g, '<br />')
	}

	const handleDialogReview = () => {
		const dialog = document.getElementById('dialog-review') as HTMLDialogElement

		dialog.showModal()

		const handleClickOutside = (event: PointerEvent) => {
			const rect = dialog.getBoundingClientRect()
			const inDialog =
				rect.top <= event.clientY &&
				event.clientY <= rect.top + rect.height &&
				rect.left <= event.clientX &&
				event.clientX <= rect.left + rect.width
			if (!inDialog) {
				dialog.close()
				dialog.removeEventListener('pointerdown', handleClickOutside)
			}
		}

		dialog.addEventListener('pointerdown', handleClickOutside)
	}
</script>

<article class="grid py-4 w-full">
	<fieldset class="p-4 grid gap-4 w-full">
		<legend class="text-3xl">
			<a href={data.siteUrl}>
				{data.name?.full}
			</a>
		</legend>
		<div class="w-full flex md:gap-4 md:items-center justify-center">
			<img
				src={data.image?.large}
				alt={data.name?.full}
				class="w-40 md:w-46 rounded-lg aspect-[3_/_4]"
			/>
			<dialog id="dialog-review" class="bg-surface-600 p-4 rounded-lg">
				<form id="dialog-review-form" method="post">
					<fieldset class="grid gap-4 border-[--color-primary-500] rounded-lg">
						<legend>Review</legend>
						<input type="hidden" name="id" value={$page.params.id} required />

						<input
							type="number"
							name="rating"
							max="10.0"
							min="0.0"
							step="0.01"
							required
							aria-label="rating"
							placeholder="Rate"
						/>

						<input
							type="datetime-local"
							name="createdAt"
							step="1"
							value={getTimeStamp(new Date().getTime() / 1000)?.slice(0, -5)}
							required
							aria-label="date"
							hidden
						/>

						<textarea name="comment" rows="5" aria-label="comment" placeholder="Comment" />

						{#if submittingReview}
							<button disabled class="bg-primary-200 flex-grow rounded-lg animate-pulse text-lg">
								⏱️
							</button>
						{:else}
							<button
								type="submit"
								class="py-1 bg-primary-200 flex-grow rounded-lg"
								on:click={handleAddReview}
							>
								Submit
							</button>
							<button type="reset" class="bg-primary-200 flex-grow rounded-lg">Clear</button>
						{/if}
					</fieldset>
				</form>
			</dialog>
			<form id="addReview" class="flex-grow self-stretch hidden md:block" method="post">
				<fieldset class="gap-4 border-[--color-primary-500] rounded-lg grid">
					<legend>Review</legend>
					<input type="hidden" name="id" value={$page.params.id} required />
					<input
						type="number"
						name="rating"
						max="10.0"
						min="0.0"
						step="0.01"
						placeholder="Rating"
					/>

					<input
						type="datetime-local"
						name="createdAt"
						step="1"
						value={getTimeStamp(new Date().getTime() / 1000)?.slice(0, -5)}
						required
						hidden
					/>

					<textarea name="comment" placeholder="Comment" rows="4" />

					<div class="grid sm:flex gap-2 flex-wrap">
						{#if submittingReview}
							<button disabled class="bg-primary-200 flex-grow rounded-lg animate-pulse text-lg">
								⏱️
							</button>
						{:else}
							<button
								type="submit"
								class="py-1 bg-primary-200 flex-grow rounded-lg"
								on:click={handleAddReview}
							>
								Submit
							</button>
							<button type="reset" class="bg-primary-200 flex-grow rounded-lg">Clear</button>
						{/if}
					</div>
				</fieldset>
			</form>
		</div>
		<button class="bg-primary-300 w-fit m-auto px-2 rounded-lg md:hidden" on:click={handleDialogReview}>
			Add a Review
		</button>
		<p class="text-sm lg:text-base text-justify">
			{@html parseRichText(data.description ?? '')}
		</p>
		<div class="grid gap-2">
			{#if showReviews}
				{#if $updateReviewList}
					<button
						class="btn bg-primary-300"
						disabled
						on:click={() => {
							showReviews = true
						}}
					>
						<span class="loader">
							<Loader2 />
						</span>
					</button>
				{:else}
					<fieldset class="[border:_2px_groove] border-[--color-primary-500] p-4 grid">
						<legend class="text-2xl float-right">Comments</legend>
						{#each reviewList as item}
							<CharacterReview
								review_id={item.review_id}
								comment={item.comment}
								rating={item.rating}
								createdAt={item.createdAt}
								page={$page}
								{updateReviewList}
							/>
						{:else}
							So empty.
						{/each}
					</fieldset>
				{/if}
			{:else}
				<button
					class="btn bg-primary-300"
					on:click={() => {
						showReviews = true
						updateReviewList.update(() => true)
					}}>Show Reviews</button
				>
			{/if}
		</div>
	</fieldset>
</article>

<!-- 

	At last a normal strawhats episode. However, Ussop and Franky were missing, they were fixing Sunny. Zoro used Asura to drink. Luffy used some of his signature moves to do the same. Nami allowed Kiku to enter women's bathroom, and Yamato entered the men's bathroom. At long last Momo got the beating from Nami he deserved for using his 8 year old body to grope the ladies of strawhats.

 -->

<style>
	.loader {
		animation: loading infinite ease-in-out 1s;
	}
	@keyframes loading {
		0%,
		100% {
			rotate: 0;
		}
		50% {
			rotate: 180deg;
		}
	}
	form fieldset {
		width: 100%;
		padding: 1rem;
		border: 2px groove;
	}
	form fieldset legend {
		font-size: x-large;
	}
	dialog::backdrop {
		background-color: hsla(0, 0%, 100%, 0.507);
	}
	fieldset input,
	textarea {
		padding-block: 0.5rem;
		padding-inline: 0.5rem;
	}
</style>
