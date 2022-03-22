const lineEnd = [' ', '\t', '\n', '\r', '\f', '\v']

export default async function getSuggestions (sentences = [], text, index) {
	return new Promise((resolve, reject) => {
		if (!text || !lineEnd.includes(text.charAt(index)) || lineEnd.includes(text.charAt(index - 1))) return resolve([])

		const wordStart = Math.max(text.lastIndexOf(' ', index - 2) + 1, text.lastIndexOf('\n', index - 2) + 1)
		let wordEnd = Math.min(text.indexOf(' ', wordStart), text.indexOf('\n', wordStart))
		wordEnd = wordEnd === -1 ? text.length : wordEnd

		const activeWord = text.substring(wordStart, wordEnd).trim()
		if (!activeWord) return resolve([])

		const suggestions = new Set()
		for (const sentence of sentences) {
			sentence.startsWith(activeWord) && sentence.substring(activeWord.length, sentence.length).length >= 10 && suggestions.add(sentence)
		}
		if (suggestions.size < 5) {
			for (const sentence of sentences) {
				sentence.split(' ').includes(activeWord) && suggestions.add(sentence)
			}
		}

		let suggestionsArr = Array.from(suggestions)
		suggestionsArr.sort((a, b) => a.length - b.length)
		suggestionsArr = suggestionsArr.slice(0, 5).map((suggestion) => ({ display: suggestion, value: suggestion.replace(activeWord, '') }))

		return resolve(suggestionsArr)
	})
}
