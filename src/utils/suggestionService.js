const lineBreak = [' ', '\t', '\n', '\r', '\f', '\v']
const lineEndChar = ['.', ',', '!', '?', ';', ')', ']', '}']

export default async function getSuggestions (sentences = [], text, tokenEndIndex, mode = 'sentence') {
	return new Promise((resolve, reject) => {
		if (!text || !lineBreak.includes(text.charAt(tokenEndIndex))) return resolve([])

		let tokenStartIndex = 0
		let searchToken = ''
		if (mode === 'sentence') {
			for (let i = tokenEndIndex; i >= 0; i--) {
				if (lineEndChar.includes(text.charAt(i))) {
					tokenStartIndex = i + 1
					break
				}
			}
			searchToken = text.substring(tokenStartIndex, tokenEndIndex).toLowerCase()
		} else {
			if (lineBreak.includes(text.charAt(tokenEndIndex - 1))) return resolve([])
			for (let i = tokenEndIndex; i >= 0; i--) {
				if (text.charAt(i) === ' ') {
					tokenStartIndex = i + 1
					break
				}
			}
			searchToken = text.substring(tokenStartIndex, tokenEndIndex).toLowerCase().trim()
		}

		if (!searchToken) return resolve([])

		const suggestions = new Set()
		for (const sentence of sentences) {
			sentence.toLowerCase().startsWith(searchToken) && sentence.substring(searchToken.length, sentence.length).length >= 10 && suggestions.add(sentence)
		}

		if (suggestions.size < 5) {
			for (const sentence of sentences) {
				if (!sentence.includes(searchToken)) continue
				const parseSentence = sentence.substring(sentence.indexOf(searchToken), sentence.length)
				parseSentence.substring(searchToken.length, sentence.length).length >= 10 && suggestions.add(parseSentence)
			}
		}

		let suggestionsArr = Array.from(suggestions)
		suggestionsArr.sort((a, b) => a.length - b.length)
		suggestionsArr = suggestionsArr.slice(0, 5).map((suggestion) => ({
			display: suggestion,
			value: suggestion.substring(searchToken.length, suggestion.length)
		}))

		return resolve(suggestionsArr)
	})
}
