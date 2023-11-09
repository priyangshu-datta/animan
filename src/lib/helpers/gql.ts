import { loadAnilistUser } from '$lib/settings/storage'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function fetch_gql<D, V>(query_schema: string, is_schema_path: boolean, variables: V) {
	const query = is_schema_path
		? await fs.readFile(`${path.dirname('')}/src/gql/${query_schema}.gql`, {
				encoding: 'utf-8'
		  })
		: query_schema

	let access_token: string = ''
	if (typeof window !== 'undefined') {
		access_token = loadAnilistUser(new Set(['anilistAccessToken']))['anilistAccessToken'] ?? ''
	}
	const headers: {
		Authorization?: string
		'Content-Type': string
		Accept: string
	} = {
		Authorization: 'Bearer ' + access_token,
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
	if (access_token === '') {
		delete headers.Authorization
	}
	const result: { data: D } = await (
		await fetch('https://graphql.anilist.co', {
			body: JSON.stringify({ query, variables }),
			headers,
			method: 'post'
		})
	).json()

	
	

	return result
}
