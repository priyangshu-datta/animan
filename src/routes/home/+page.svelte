<script lang="ts">
	import { goto } from '$app/navigation'
	import { MediaType } from '$lib/graphql'
	import { writable, type Writable } from 'svelte/store'
	import MediaItem from '../../components/media-item.svelte'
	import Paginator from '../../components/paginator.svelte'
	import type { PageData } from './$types'
	import { sentenceCase } from '$utils'

	export let data: PageData

	let media_type: Writable<MediaType> = writable(MediaType.Anime)
	const handleLogout = () => {
			fetch('/auth', {
				method: 'delete'
			}).then((res) => {
				// if (res.)
				console.log('logout:', res)
				
			}).then(()=>{
				goto("/")
			})
		}
</script>

<nav class="flex justify-between p-4">
	<h1 class="h3">Hello {sentenceCase(data?.user?.Viewer?.name ?? '')}</h1>
	<button class="h3" on:click={handleLogout}>Logout</button>
</nav>

<select bind:value={$media_type}>
	<option value={MediaType.Anime} selected>{MediaType.Anime}</option>
	<option value={MediaType.Manga}>{MediaType.Manga}</option>
</select>
{#if $media_type === MediaType.Anime}
	<Paginator media_type={MediaType.Anime} />
{:else}
	<Paginator media_type={MediaType.Manga} />
{/if}
