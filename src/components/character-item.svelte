<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import { ExternalLink } from 'lucide-svelte';
	import type { CharacterByIDminQuery, CharacterByIdQuery, CharacterByQueryStringQuery } from '$lib/graphql';

	export let item:
		| {
				type: 'search';
				data: NonNullable<NonNullable<CharacterByQueryStringQuery['Page']>['characters']>[0];
				lastEle: boolean;
		  }
		| {
				type: 'min';
				data: CharacterByIDminQuery;
		  };
</script>

{#if item.type === 'search'}
	{@const data_item = item.data}

	<div class="card p-4 result w-fit" class:lastEle={item.lastEle}>
		<figure class="grid mt-4 h-fit place-items-center w-full">
			<img
				src={data_item?.image?.large}
				alt={data_item?.name?.full}
				class="h-auto w-48 rounded-lg aspect-[3_/_4]"
			/>

			<figcaption class="flex text-base w-48 gap-2 justify-between">
				<a href="character/{data_item?.id}"
					class="overflow-hidden [display:_-webkit-box] [-webkit-box-orient:_vertical] [-webkit-line-clamp:_2]"
				>
					{data_item?.name?.full}
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
			</span>
		</div>
	</div>
	<!-- {:else if info_size.type === 'min'}
	{#await media_min(info_size.id)}
		Loading...
	{:then media_item}
		<pre>
			{JSON.stringify(media_item, null, 2)}
		</pre>
	{/await}
{:else}
	{#await media(info_size.id)}
		Loading...
	{:then media_item}
		<pre>
	{JSON.stringify(media_item, null, 2)}
</pre>
	{/await} -->
{/if}

<!-- 

	overflow: hidden;
    transition: color .2s ease;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2
 -->
