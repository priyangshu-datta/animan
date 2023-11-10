<script lang="ts">
	import { page } from '$app/stores'
	import CharacterItem from '../../components/character-item.svelte'
	import MediaItem from '../../components/media-item.svelte'
	import { trpc } from '$lib/trpc/client'
	import type {
		CharacterByQueryStringQuery,
		MediaByQueryStringQuery,
		MediaType
	} from '$lib/graphql'
	import { afterUpdate } from 'svelte'
	import { writable } from 'svelte/store'
	import ItemPlaceholder from '../../components/item-placeholder.svelte'

	let space: 'ANIME' | 'MANGA' | 'character' = 'ANIME'
	let query: string = ''
	let abortController = new AbortController()

	let timer: NodeJS.Timeout

	const debounce = (v: string) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			query = v
			pgno = 1
		}, 750)
	}

	const media_search = async (
		query_string: string,
		media_type: typeof space,
		{ limit = 5, no = 1 } = {}
	) => {
		if (query_string.length > 0) {
			abortController.abort()

			return {
				type: 'media' as const,
				data: (
					await trpc($page).media.search.query(
						{
							query_string,
							limit: limit,
							page: no,
							media_type: media_type as MediaType
						},
						{ signal: abortController.signal }
					)
				).data
			}
		}
	}
	const character_search = async (query_string: string, { limit = 5, no = 1 } = {}) => {
		if (query_string.length > 0) {
			abortController.abort()
			return {
				type: 'character' as const,
				data: (
					await trpc($page).character.search.query(
						{
							query_string,
							limit: limit,
							page: no
						},
						{ signal: abortController.signal }
					)
				).data
			}
		}
	}

	let mediaStore = writable<{
		hasNextPage: boolean
		data: NonNullable<MediaByQueryStringQuery['Page']>['media']
	}>({ hasNextPage: false, data: [] })
	let charStore = writable<{
		hasNextPage: boolean
		data: NonNullable<CharacterByQueryStringQuery['Page']>['characters']
	}>({ hasNextPage: false, data: [] })
	let pgno: number = 1

	$: (async () => {
		if (pgno === 1) {
			loadStart = true
			let trpc_result
			switch (space) {
				case 'ANIME':
				case 'MANGA':
					trpc_result = (await media_search(query, space, { no: pgno }))?.data?.Page
					mediaStore.set({
						hasNextPage: trpc_result?.pageInfo?.hasNextPage!,
						data: trpc_result?.media ?? []
					})
					break
				case 'character':
					trpc_result = (await character_search(query, { no: pgno }))?.data?.Page
					charStore.set({
						hasNextPage: trpc_result?.pageInfo?.hasNextPage!,
						data: trpc_result?.characters ?? []
					})
					break
			}
			loadStart = false
		}
	})()

	let loadMore = false
	let loadStart = false

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(async (entry) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target)

				if (
					($mediaStore.hasNextPage && (space === 'ANIME' || space === 'MANGA')) ||
					($charStore.hasNextPage && space === 'character')
				) {
					if (entry.target === document.querySelector('.lastEle')) {
						loadMore = true
						switch (space) {
							case 'ANIME':
							case 'MANGA':
								const mediaData = (await media_search(query, space, { no: pgno + 1 }))?.data.Page
								mediaStore.update(({ data }) => {
									return {
										data: [...(data ?? []), ...(mediaData?.media ?? [])],
										hasNextPage: mediaData?.pageInfo?.hasNextPage!
									}
								})
								break
							case 'character':
								const charData = (await character_search(query, { no: pgno + 1 }))?.data.Page
								charStore.update(({ data }) => {
									return {
										data: [...(data ?? []), ...(charData?.characters ?? [])],
										hasNextPage: charData?.pageInfo?.hasNextPage!
									}
								})
								break
						}
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

<main class="grid gap-4">
	<div class="flex gap-2 card p-4 rounded-none justify-center">
		<select bind:value={space} on:change={() => (pgno = 1)}>
			<optgroup label="Media">
				<option value="ANIME">Anime</option>
				<option value="MANGA">Manga</option>
			</optgroup>
			<option value="character">Character</option>
		</select>

		<input
			name="query_string"
			type="search"
			on:input={({ currentTarget: { value } }) => debounce(value)}
		/>
	</div>

	<div class="flex flex-wrap gap-4 justify-center result_box">
		{#if loadStart}
			<div class="flex gap-4 flex-wrap justify-center">
				<ItemPlaceholder />
				<ItemPlaceholder />
				<ItemPlaceholder />
			</div>
		{:else if space === 'ANIME' || space === 'MANGA'}
			{#each $mediaStore['data'] ?? [] as item, index}
				<MediaItem
					item={{ type: 'search', data: item, lastEle: index + 1 === $mediaStore['data']?.length }}
				/>
			{/each}
		{:else if space === 'character'}
			{#each $charStore['data'] ?? [] as item, index}
				<CharacterItem
					item={{ type: 'search', data: item, lastEle: index + 1 === $charStore['data']?.length }}
				/>
			{/each}
		{/if}
		{#if loadMore}
			<div class="flex gap-4 flex-wrap justify-center">
				<ItemPlaceholder />
				<ItemPlaceholder />
				<ItemPlaceholder />
			</div>
		{/if}
	</div>
</main>
