export const isObjectEmpty = (obj: Object) => {
	for (var _ in obj) return false
	return true
}

export const customErrorCodes = { CE_UE: 'user exists', CE_LR: 'length required' } as const

export const customErrorDescs = Object.entries(customErrorCodes).map((k, v) => [v, k])

export const sentenceCase = (word: string) => word.at(0)?.toLocaleUpperCase() + word.slice(1)
