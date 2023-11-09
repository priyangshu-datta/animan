<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton'
	import { ExternalLink } from 'lucide-svelte'
	import type { MediaByQueryStringQuery, UserMediaByStatusQuery } from '$lib/graphql'

	export let item:
		| {
				type: 'search'
				data: NonNullable<NonNullable<MediaByQueryStringQuery['Page']>['media']>[0]
				lastEle: boolean
		  }
		| {
				type: 'userMedia'
				data: NonNullable<NonNullable<UserMediaByStatusQuery['Page']>['mediaList']>[0]
				lastEle: boolean
		  }
</script>

{#if item.type === 'search' || item.type === 'userMedia'}
	{@const data_item = item.type === 'search' ? item.data : item.data?.media}

	<div class="card p-4 result w-fit" class:lastEle={item.lastEle}>
		<figure class="grid mt-4 h-fit place-items-center w-full">
			<img
				src={data_item?.coverImage?.large}
				alt={data_item?.title?.romaji}
				class="h-auto w-48 rounded-lg aspect-[3_/_4]"
			/>

			<figcaption class="flex text-base w-48 gap-2 justify-between">
				<a
					href="media/{data_item?.id}"
					class="overflow-hidden [display:_-webkit-box] [-webkit-box-orient:_vertical] [-webkit-line-clamp:_2]"
				>
					{data_item?.title?.romaji}
				</a>
				<button
					class="btn p-0"
					use:popup={{
						event: 'click',
						target: `popupFeatured${data_item?.id}`,
						placement: 'bottom'
					}}><ExternalLink size={20} /></button
				>
			</figcaption>
		</figure>
		<div class="card p-4 shadow-xl text-center" data-popup={`popupFeatured${data_item?.id}`}>
			<span class="grid gap-4">
				<a target="_blank" href={data_item?.siteUrl}>AniList</a>
				<a
					target="_blank"
					href="http://myanimelist.net/{data_item?.type?.toLowerCase()}/{data_item?.idMal}"
				>
					MyAnimeList
				</a>
			</span>
		</div>
	</div>
{/if}
