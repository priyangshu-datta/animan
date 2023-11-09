/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query CharacterByID($id: Int!) {\n  Character(id: $id) {\n    name {\n      full\n      first\n      middle\n      last\n    }\n    age\n    dateOfBirth {\n      year\n      month\n      day\n    }\n    description\n    image {\n      large\n      medium\n    }\n    siteUrl\n    media {\n      pageInfo {\n        currentPage\n        hasNextPage\n      }\n      nodes {\n        id\n      }\n    }\n  }\n}": types.CharacterByIdDocument,
    "query CharacterByIDmin($id: Int!) {\n  Character(id: $id) {\n    name {\n      full\n    }\n    image {\n      medium\n    }\n    siteUrl\n    description\n  }\n}": types.CharacterByIDminDocument,
    "query MediaByID($id: Int!) {\n  Media(id: $id) {\n    title {\n      romaji\n      english\n    }\n    coverImage {\n      large\n      medium\n    }\n    format\n    type\n    description\n    season\n    seasonYear\n    episodes\n    chapters\n    genres\n    siteUrl\n    status\n    nextAiringEpisode {\n      airingAt\n      episode\n    }\n  }\n}": types.MediaByIdDocument,
    "query MediaByIDmin($id: Int!) {\n  Media(id: $id) {\n    title {\n      romaji\n    }\n    coverImage {\n      medium\n    }\n    description\n    siteUrl\n  }\n}": types.MediaByIDminDocument,
    "query UserMediaByStatus($userId: Int!, $status: MediaListStatus!, $type: MediaType!, $page: Int = 1, $limit: Int = 10) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      currentPage\n      hasNextPage\n    }\n    mediaList(status: $status, userId: $userId, type: $type) {\n      user {\n        name\n      }\n      media {\n        id\n        idMal\n        title {\n          english\n          romaji\n        }\n        coverImage {\n          large\n        }\n        description\n        siteUrl\n        type\n      }\n    }\n  }\n}": types.UserMediaByStatusDocument,
    "query CharacterByQueryString($query_string: String!, $page: Int = 1, $limit: Int = 10) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      hasNextPage\n      currentPage\n    }\n    characters(search: $query_string) {\n      id\n      name {\n        full\n      }\n      image {\n        large\n      }\n      description\n      siteUrl\n    }\n  }\n}": types.CharacterByQueryStringDocument,
    "query MediaByQueryString($query_string: String!, $page: Int = 1, $limit: Int = 200, $media_type: MediaType) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      currentPage\n      hasNextPage\n    }\n    media(search: $query_string, type: $media_type) {\n      id\n      idMal\n      title {\n        english\n        romaji\n      }\n      coverImage {\n        large\n      }\n      description\n      siteUrl\n      type\n    }\n  }\n}": types.MediaByQueryStringDocument,
    "query User {\n  Viewer {\n    name\n    id\n    options {\n      displayAdultContent\n    }\n  }\n}": types.UserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CharacterByID($id: Int!) {\n  Character(id: $id) {\n    name {\n      full\n      first\n      middle\n      last\n    }\n    age\n    dateOfBirth {\n      year\n      month\n      day\n    }\n    description\n    image {\n      large\n      medium\n    }\n    siteUrl\n    media {\n      pageInfo {\n        currentPage\n        hasNextPage\n      }\n      nodes {\n        id\n      }\n    }\n  }\n}"): (typeof documents)["query CharacterByID($id: Int!) {\n  Character(id: $id) {\n    name {\n      full\n      first\n      middle\n      last\n    }\n    age\n    dateOfBirth {\n      year\n      month\n      day\n    }\n    description\n    image {\n      large\n      medium\n    }\n    siteUrl\n    media {\n      pageInfo {\n        currentPage\n        hasNextPage\n      }\n      nodes {\n        id\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CharacterByIDmin($id: Int!) {\n  Character(id: $id) {\n    name {\n      full\n    }\n    image {\n      medium\n    }\n    siteUrl\n    description\n  }\n}"): (typeof documents)["query CharacterByIDmin($id: Int!) {\n  Character(id: $id) {\n    name {\n      full\n    }\n    image {\n      medium\n    }\n    siteUrl\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MediaByID($id: Int!) {\n  Media(id: $id) {\n    title {\n      romaji\n      english\n    }\n    coverImage {\n      large\n      medium\n    }\n    format\n    type\n    description\n    season\n    seasonYear\n    episodes\n    chapters\n    genres\n    siteUrl\n    status\n    nextAiringEpisode {\n      airingAt\n      episode\n    }\n  }\n}"): (typeof documents)["query MediaByID($id: Int!) {\n  Media(id: $id) {\n    title {\n      romaji\n      english\n    }\n    coverImage {\n      large\n      medium\n    }\n    format\n    type\n    description\n    season\n    seasonYear\n    episodes\n    chapters\n    genres\n    siteUrl\n    status\n    nextAiringEpisode {\n      airingAt\n      episode\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MediaByIDmin($id: Int!) {\n  Media(id: $id) {\n    title {\n      romaji\n    }\n    coverImage {\n      medium\n    }\n    description\n    siteUrl\n  }\n}"): (typeof documents)["query MediaByIDmin($id: Int!) {\n  Media(id: $id) {\n    title {\n      romaji\n    }\n    coverImage {\n      medium\n    }\n    description\n    siteUrl\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query UserMediaByStatus($userId: Int!, $status: MediaListStatus!, $type: MediaType!, $page: Int = 1, $limit: Int = 10) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      currentPage\n      hasNextPage\n    }\n    mediaList(status: $status, userId: $userId, type: $type) {\n      user {\n        name\n      }\n      media {\n        id\n        idMal\n        title {\n          english\n          romaji\n        }\n        coverImage {\n          large\n        }\n        description\n        siteUrl\n        type\n      }\n    }\n  }\n}"): (typeof documents)["query UserMediaByStatus($userId: Int!, $status: MediaListStatus!, $type: MediaType!, $page: Int = 1, $limit: Int = 10) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      currentPage\n      hasNextPage\n    }\n    mediaList(status: $status, userId: $userId, type: $type) {\n      user {\n        name\n      }\n      media {\n        id\n        idMal\n        title {\n          english\n          romaji\n        }\n        coverImage {\n          large\n        }\n        description\n        siteUrl\n        type\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CharacterByQueryString($query_string: String!, $page: Int = 1, $limit: Int = 10) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      hasNextPage\n      currentPage\n    }\n    characters(search: $query_string) {\n      id\n      name {\n        full\n      }\n      image {\n        large\n      }\n      description\n      siteUrl\n    }\n  }\n}"): (typeof documents)["query CharacterByQueryString($query_string: String!, $page: Int = 1, $limit: Int = 10) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      hasNextPage\n      currentPage\n    }\n    characters(search: $query_string) {\n      id\n      name {\n        full\n      }\n      image {\n        large\n      }\n      description\n      siteUrl\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MediaByQueryString($query_string: String!, $page: Int = 1, $limit: Int = 200, $media_type: MediaType) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      currentPage\n      hasNextPage\n    }\n    media(search: $query_string, type: $media_type) {\n      id\n      idMal\n      title {\n        english\n        romaji\n      }\n      coverImage {\n        large\n      }\n      description\n      siteUrl\n      type\n    }\n  }\n}"): (typeof documents)["query MediaByQueryString($query_string: String!, $page: Int = 1, $limit: Int = 200, $media_type: MediaType) {\n  Page(page: $page, perPage: $limit) {\n    pageInfo {\n      currentPage\n      hasNextPage\n    }\n    media(search: $query_string, type: $media_type) {\n      id\n      idMal\n      title {\n        english\n        romaji\n      }\n      coverImage {\n        large\n      }\n      description\n      siteUrl\n      type\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query User {\n  Viewer {\n    name\n    id\n    options {\n      displayAdultContent\n    }\n  }\n}"): (typeof documents)["query User {\n  Viewer {\n    name\n    id\n    options {\n      displayAdultContent\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;