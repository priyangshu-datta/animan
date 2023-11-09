import { goto } from '$app/navigation'
import type {
	UserMediaByStatusQuery,
	UserMediaByStatusQueryVariables,
	UserQuery,
	UserQueryVariables
} from '$lib/graphql'
import { MediaType, MediaListStatus } from '$lib/graphql'
import { fetch_gql } from '$lib/helpers'
import type { PageLoad } from './$types'
import { loadAnilistUser } from '../../lib/settings/storage'

export const ssr = false

export const load: PageLoad = async () => {
	const { anilistAccessToken } = loadAnilistUser(new Set(['anilistAccessToken']))

	if (anilistAccessToken === undefined || anilistAccessToken === null) {
		return { data: null }
	}

	try {
		let userDetails = await fetch_gql<UserQuery, UserQueryVariables>(
			`
		query User{
			Viewer {
				name
				id
				options {
					displayAdultContent
				}
			}
		}
		
		`,
			false,
			{}
		)

		let userData = await fetch_gql<UserMediaByStatusQuery, UserMediaByStatusQueryVariables>(
			`
query UserMediaByStatus(
	$userId: Int!
	$status: MediaListStatus!
	$type: MediaType!
	$page: Int = 1
	$limit: Int = 10
) {

	Page(page: $page, perPage: $limit) {
		pageInfo {
			currentPage
			hasNextPage
		}
		mediaList(status: $status, userId: $userId, type: $type) {
			media {
				id
				idMal
				title {
					english
					romaji
				}
				coverImage {
					large
				}
				description
				siteUrl
				type
			}
		}
	}
}
			
	`,
			false,
			{
				userId: userDetails.data.Viewer?.id!,
				status: MediaListStatus.Current,
				type: MediaType.Anime
			}
		)

		return { userDetails: userDetails.data, userData: userData.data }
	} catch (er) {
		console.error(er)
	}
}
