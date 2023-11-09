interface AnilistUser {
	anilistAccessToken?: string
	anilistUserID?: number
}

const storageKeys = {
	anilist: {
		accessToken: 'anilistAccessToken',
		userID: 'anilistUserID',
		userOptions: 'anilistUserOptions'
	}
}

export const saveAnlistUser = ({ anilistAccessToken, anilistUserID }: AnilistUser) => {
	if (anilistAccessToken !== undefined) {
		localStorage.setItem(storageKeys.anilist.accessToken, anilistAccessToken)
	}
	if (
		anilistUserID !== undefined &&
		localStorage.getItem(storageKeys.anilist.accessToken) !== null
	) {
		localStorage.setItem(storageKeys.anilist.userID, anilistUserID.toString())
	}
}

export const logoutAnilistUser = () => {
	localStorage.removeItem(storageKeys.anilist.accessToken)
}

export const loadAnilistUser = (details: Set<keyof AnilistUser>) => {
	let result: Partial<Record<keyof AnilistUser, string | null>> = {}
	for (let key of details) {
		result[key] = localStorage.getItem(key)
	}
	return result
	// return [...details].map((item) => [item, localStorage.getItem(item)])
}
