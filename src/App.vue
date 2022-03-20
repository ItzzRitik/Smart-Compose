<template>
	<div class="smartCompose">
		<VueEditor ref="vEditor" v-model="editorContent"/>
		<SuggestionOverlay ref="suggestionRef" :suggestions=suggestions />
	</div>
</template>

<script>
	import { VueEditor } from 'vue2-editor'
	import SuggestionOverlay from './components/Suggestion.vue'
	import getSuggestions from './utils/suggestionService'

	export default {
		name: 'App',
		data: () => ({
			editorContent: '<p>Some Initial Content</p>',
			suggestions: []
		}),
		mounted () {
			const app = this
			const editor = app.$refs.vEditor.quill
			const suggestionRef = app.$refs.suggestionRef
			let suggestionService

			editor.on('editor-change', async function (event, data) {
				const selection = editor.root.ownerDocument.getSelection()
				const text = editor.getText()
				app.suggestions.length && (app.suggestions = [])

				if (selection.rangeCount > 0) {
					const rects = selection.getRangeAt(0).getClientRects()
					if (rects.length > 0) {
						suggestionRef.$el.style.top = (rects[0].top + rects[0].height) + 'px'
						suggestionRef.$el.style.left = rects[0].left + 'px'
					}
				}

				if (event === 'selection-change') {
					clearTimeout(suggestionService)
					suggestionService = setTimeout(() => getSuggestions(text, data?.index)
						.then((suggestionList) => (app.suggestions = suggestionList)), 100)
				}
			})
		},
		watch: {
			suggestions: function (newContent) {

			}
		},
		components: { VueEditor, SuggestionOverlay }
	}
</script>

<style lang="scss">
	html, body {
		width: 100vw;
		height: 100vh;
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}
	}
	.smartCompose {
		position: relative;
		width: 95%;
		height: 90%;

		display: flex;
		justify-content: center;

		> .quillWrapper {
			position: relative;
			width: 90%;
			height: 95%;
		}
	}
</style>
