<script lang="ts">
	import type { MediaType, UserMediaByStatusQuery } from '$lib/graphql'
	import { writable, type Writable } from 'svelte/store'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { afterUpdate } from 'svelte'
	import ItemPlaceholder from './item-placeholder.svelte'
	import MediaItem from './media-item.svelte'

    export let media_type: MediaType

	let abortController = new AbortController()

	const current_media = async ({ limit = 5, no = 1 } = {}) => {
		abortController.abort()

		return {
			type: 'media' as const,
			data: (await trpc($page).user.media.current.query({ page: no, limit, type: media_type }))
				.data
		}
	}

	let mediaStore = writable<{
		hasNextPage: boolean
		data: NonNullable<UserMediaByStatusQuery['Page']>['mediaList']
	}>({
		hasNextPage: false,
		data: []
	})

	let pgno:  number = 1
	let loadMore = false
	let loadStart = false

	$: (async () => {
		if (pgno === 1) {
			loadStart = true
			let trpc_result = (await current_media({ no: pgno }))?.data?.Page
			mediaStore.set({
				hasNextPage: trpc_result?.pageInfo?.hasNextPage!,
				data: trpc_result?.mediaList ?? []
			})
			loadStart = false
		}
	})()

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(async (entry) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target)
            

				if ($mediaStore.hasNextPage) {
					if (entry.target === document.querySelector('.lastEle')) {
						loadMore = true
						const mediaData = (await current_media({ no: pgno + 1 }))?.data.Page
						mediaStore.update(({ data }) => {
							return {
								data: [...(data ?? []), ...(mediaData?.mediaList ?? [])],
								hasNextPage: mediaData?.pageInfo?.hasNextPage!
							}
						})
						loadMore = false

						pgno = pgno + 1
					}
				}
			}
		})
	})

	afterUpdate(() => {
		document.querySelectorAll('.result').forEach((el) => {
			observer.observe(el)
			el.classList.remove('result')
		})
	})
</script>

<div class="flex gap-4 overflow-auto px-4">
	{#if loadStart}
		<div class="flex gap-4">
			<ItemPlaceholder />
			<ItemPlaceholder />
			<ItemPlaceholder />
		</div>
	{:else}
		{#each $mediaStore['data'] ?? [] as item, index}
			<MediaItem
				item={{ type: 'userMedia', data: item, lastEle: index + 1 === $mediaStore['data']?.length }}
			/>
		{/each}
	{/if}
	{#if loadMore}
		<div class="flex gap-4">
			<ItemPlaceholder />
			<ItemPlaceholder />
			<ItemPlaceholder />
		</div>
	{/if}
</div>
