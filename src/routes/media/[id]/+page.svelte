<script lang="ts">
	import type { PageServerData } from './$types'
	import { getTimeStamp, prettyPrintDateDifference } from '$utils/datetime'
	import { page, updated } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { onDestroy, onMount } from 'svelte'
	import { error } from '@sveltejs/kit'
	import Item from '../../../components/item.svelte'
	import { browser } from '$app/environment'
	import MediaReview from '../../../components/media-review.svelte'
	import { Loader2 } from 'lucide-svelte'
	import { writable } from 'svelte/store'

	export let data: PageServerData

	const addReview = async () => {
		const dialog = document.getElementById('dialog-review') as HTMLDialogElement
		const form = document.getElementById(
			dialog.open ? 'dialog-review-form' : 'addReview'
		) as HTMLFormElement
		const formData = new FormData(form)

		const id = formData.get('id')
		const unit = formData.get('unit')
		const type = formData.get('type')
		const rating = formData.get('rating')
		const comment = formData.get('comment')
		// const createdAt = formData.get('createdAt')

		if (id === null || unit === null || type === null || rating === null || comment === null) return
		if (isNaN(parseInt(id.toString()))) throw error(400, { message: 'ID must be a number.' })
		if (isNaN(parseInt(rating.toString()))) throw error(400, { message: 'ID must be a number.' })
		if (isNaN(parseInt(unit.toString()))) throw error(400, { message: 'ID must be a number.' })

		submittingReview = true

		await trpc($page).review.mediaReview.create.mutate({
			media_id: parseInt(id.toString()),
			type: type.toString() as 'ANIME' | 'MANGA',
			comment: comment.toString(),
			rate: parseInt(rating.toString()),
			unit: parseInt(unit?.toString())

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
		;(document.getElementsByName('unit')[0] as HTMLInputElement).value =
			preFill.unit === '' || preFill.unit === undefined
				? data.nextAiringEpisode?.episode
					? data.nextAiringEpisode.episode - 1
					: ''
				: preFill.unit

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
			const unit = formData.get('unit')?.toString()

			localStorage.setItem(
				$page.params.id,
				JSON.stringify({
					rating,
					comment,
					unit
				})
			)
		}
	})

	async function getReviews() {
		return await trpc($page).review.mediaReview.get.query({ media_id: parseInt($page.params.id) })
	}

	let timeLeft = prettyPrintDateDifference(
		(data.nextAiringEpisode?.airingAt ?? 0) * 1000,
		Date.now()
	)
	setInterval(() => {
		timeLeft = prettyPrintDateDifference(data.nextAiringEpisode?.airingAt * 1000, Date.now())
	}, 1000)

	let maxEpisodes = data.nextAiringEpisode?.episode
		? data.nextAiringEpisode?.episode - 1
		: data.episodes

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

<article class="grid lg:grid-cols-[2fr_1fr] py-4 w-full">
	<fieldset class="p-4 flex flex-col gap-4 w-full">
		<legend class="text-3xl">{data.title?.romaji}</legend>
		<div class="w-full min-[500px]:flex gap-4 items-center grid place-items-center">
			<img
				src={data.coverImage?.large}
				alt={data.title?.romaji}
				class="w-48 rounded-lg aspect-[3_/_4]"
			/>
			<aside class="grid place-items-center min-[500px]:place-items-start">
				<Item key="Format" value={data.format} />
				<Item key="Type" value={data.type} />
				<Item key="Season" value={data.season} />
				<Item key="Year" value={data.seasonYear} />
				{#if data.status !== null && data.status !== undefined}
					<Item key="Status" value={data.status} />
					{#if data.status === 'RELEASING'}
						<Item key="Next Episode" value={data.nextAiringEpisode?.episode} />
						<Item key="Time Remaining" value={timeLeft} />
					{:else}
						<Item key="Episodes" value={data.episodes} />
					{/if}
				{/if}
				<Item key="Generes" value={data.genres?.join(', ')} />
			</aside>
		</div>
		<button
			class="bg-primary-300 w-fit m-auto px-2 rounded-lg lg:hidden"
			on:click={handleDialogReview}
		>
			Add a Review
		</button>
		<p>{@html data.description}</p>
		<div class="w-full">
			{#if showReviews}
				{#if $updateReviewList}
					<button
						class="btn bg-primary-300 w-full"
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
							<MediaReview
								review_id={item.id}
								comment={item.comment}
								rating={item.rating}
								createdAt={item.createdAt}
								unit={item.unit}
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
					class="btn bg-primary-300 w-full"
					on:click={() => {
						showReviews = true
						updateReviewList.update(() => true)
					}}>Show Reviews</button
				>
			{/if}
		</div>
	</fieldset>
	<dialog id="dialog-review" class="bg-surface-600 rounded-lg">
		<form id="dialog-review-form" class="p-4 lg:block" method="post">
			<fieldset class="gap-4 border-[--color-primary-500] rounded-lg grid">
				<legend>Review</legend>
				<input type="hidden" name="id" value={$page.params.id} required />
				<input type="hidden" name="type" value={data.type} required />
				<input
					type="number"
					name="unit"
					max={maxEpisodes}
					required
					placeholder={data.type === 'ANIME' ? 'Episode' : 'Chapter'}
					step={data.type === 'ANIME' ? 1 : 0.1}
				/>
				<input type="number" name="rating" max="10.0" min="0.0" step="0.01" placeholder="Rating" />

				<div hidden>
					<input
						type="datetime-local"
						name="createdAt"
						step="1"
						value={getTimeStamp(new Date().getTime() / 1000)?.slice(0, -5)}
						required
					/>
				</div>

				<textarea name="comment" cols="30" rows="10" placeholder="Comment" />

				<div class="btn-group grid mt-4 md:m-0 sm:flex gap-2 flex-wrap">
					{#if submittingReview}
						<button disabled class="btn bg-primary-200 flex-grow">
							<span class="loader">
								<Loader2 />
							</span>
						</button>
					{:else}
						<button type="submit" class="btn bg-primary-200 flex-grow" on:click={addReview}>
							Submit
						</button>
					{/if}
					<button type="reset" class="btn bg-primary-200 flex-grow">Clear</button>
				</div>
			</fieldset>
		</form>
	</dialog>
	<form class="box-border p-4 h-[100vh] sticky top-8 hidden lg:block" id="addReview" method="post">
		<fieldset class="gap-4 border-[--color-primary-500] rounded-lg grid">
			<legend>Review</legend>
			<input type="hidden" name="id" value={$page.params.id} required />
			<input type="hidden" name="type" value={data.type} required />
			<input
				type="number"
				name="unit"
				max={maxEpisodes}
				required
				placeholder={data.type === 'ANIME' ? 'Episode' : 'Chapter'}
				step={data.type === 'ANIME' ? 1 : 0.1}
			/>
			<input type="number" name="rating" max="10.0" min="0.0" step="0.01" placeholder="Rating" />

			<div hidden>
				<input
					type="datetime-local"
					name="createdAt"
					step="1"
					value={getTimeStamp(new Date().getTime() / 1000)?.slice(0, -5)}
					required
				/>
			</div>

			<textarea name="comment" cols="30" rows="10" placeholder="Comment" />

			<div class="btn-group grid mt-4 md:m-0 sm:flex gap-2 flex-wrap">
				{#if submittingReview}
					<button disabled class="btn bg-primary-200 flex-grow">
						<span class="loader">
							<Loader2 />
						</span>
					</button>
				{:else}
					<button type="submit" class="btn bg-primary-200 flex-grow" on:click={addReview}
						>Submit</button
					>
				{/if}
				<button type="reset" class="btn bg-primary-200 flex-grow">Clear</button>
			</div>
		</fieldset>
	</form>
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
		/* grid-template-columns: 1fr 5fr; */
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
