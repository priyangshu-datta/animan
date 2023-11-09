import type {
	CharacterByQueryStringQuery,
	CharacterByQueryStringQueryVariables,
	CharacterByIdQuery,
	CharacterByIdQueryVariables,
	CharacterByIDminQuery,
	CharacterByIDminQueryVariables
} from '../../graphql';
import { fetch_gql } from '$lib/helpers';
import { router, publicProcedure } from '../router';
import { z } from 'zod';

export const characterRouter = router({
	search: publicProcedure
		.input(
			z.object({
				query_string: z.string(),
				page: z.optional(z.number()),
				limit: z.optional(z.number())
			})
		)
		.query(async ({ input: { ...variables } }) => {
			return await fetch_gql<CharacterByQueryStringQuery, CharacterByQueryStringQueryVariables>(
				'search_characters',  true,
				variables
			);
		}),
	get: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input: { ...variables } }) => {
			return await fetch_gql<CharacterByIdQuery, CharacterByIdQueryVariables>(
				'get_character', true,
				variables
			);
		}),

	get_min: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input: { ...variables } }) => {
			return await fetch_gql<CharacterByIDminQuery, CharacterByIDminQueryVariables>(
				'get_character_min', true,
				variables
			);
		})
});
