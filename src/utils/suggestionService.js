import sentences from '../assets/sentences.json'

export default async function getSuggestions (text, index) {
	return new Promise((resolve, reject) => {
		if (!text) return resolve([])

		const wordStart = Math.max(text.lastIndexOf(' ', index - 2) + 1, text.lastIndexOf('\n', index - 2) + 1)
		let wordEnd = Math.min(text.indexOf(' ', wordStart), text.indexOf('\n', wordStart))
		wordEnd = wordEnd === -1 ? text.length : wordEnd

		const activeWord = text.substring(wordStart, wordEnd)
		if (!activeWord) return resolve([])

		const suggestions = new Set()
		console.log(activeWord, sentences)
		console.log(sentences.some((sentence) => sentence.startsWith(activeWord)))
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
		suggestionsArr = suggestionsArr.slice(0, 5)
		console.log(suggestionsArr)
		return resolve(suggestionsArr)
	})
}
