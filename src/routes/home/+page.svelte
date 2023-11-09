<script lang="ts">
	import type { UserMediaByStatusQuery } from '$lib/graphql'
	import { writable } from 'svelte/store'
	import type { PageData } from '../$types'
	import MediaItem from '../../components/media-item.svelte'
	import { loadAnilistUser, logoutAnilistUser } from '../../lib/settings/storage'
	import { invalidateAll } from '$app/navigation'

	export let data: PageData

	$: mediaStore = writable<{
		hasNextPage: boolean
		data: NonNullable<UserMediaByStatusQuery['Page']>['mediaList']
	}>({
		hasNextPage: data?.userData?.Page?.pageInfo?.hasNextPage ?? false,
		data: data?.userData?.Page?.mediaList ?? []
	})
</script>

{#if data.data === null}
	<a href="https://anilist.co/api/v2/oauth/authorize?client_id=5505&response_type=token">
		Login with AniList
	</a>
{:else}
	<h1>Hello {data?.userDetails?.Viewer?.name}</h1>
	<button
		on:click={() => {
			logoutAnilistUser()
			invalidateAll()
		}}>Logout</button
	>
{/if}

<div class="flex flex-wrap gap-4 justify-center">
	{#each $mediaStore['data'] ?? [] as item, index}
		<MediaItem
			item={{ type: 'userMedia', data: item, lastEle: index + 1 === $mediaStore['data']?.length }}
		/>
	{/each}
</div>
