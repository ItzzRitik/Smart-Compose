<template>
	<div class="smartCompose">
		<VueEditor ref="vEditor" v-model="editorContent"/>
		<SuggestionOverlay :suggestions=suggestions :activeSuggestion=activeSuggestion :suggestionRect=suggestionRect />
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
			suggestions: [],
			activeSuggestion: 0,
			suggestionRect: { top: 0, left: 0 }
		}),
		mounted () {
			const app = this
			const editor = app.$refs.vEditor.quill
			this.editor = editor
			let suggestionService

			editor.on('editor-change', async function (event, data) {
				const selection = editor.root.ownerDocument.getSelection()
				const text = editor.getText()

				if (selection.rangeCount > 0) {
					const rects = selection.getRangeAt(0).getClientRects()
					if (rects.length > 0) {
						app.suggestionRect = {
							top: (rects[0].top + rects[0].height) + 'px',
							left: rects[0].left + 'px'
						}
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
			suggestions: function () {
				this.editor.keyboard.addBinding({ key: 'up', handler: this.suggestionUp })
				this.editor.keyboard.addBinding({ key: 'down', handler: this.suggestionDown })
				this.editor.keyboard.bindings[9].unshift({ key: 9, handler: this.acceptSuggestion })
				this.editor.keyboard.bindings[13].unshift({ key: 13, handler: this.acceptSuggestion })
			}
		},
		methods: {
			suggestionUp: function () {
				if (!this.suggestions.length) return true
				this.activeSuggestion = Math.max(this.activeSuggestion - 1, 0)
			},
			suggestionDown: function () {
				if (!this.suggestions.length) return true
				this.activeSuggestion = Math.min(this.activeSuggestion + 1, this.suggestions.length - 1)
			},
			acceptSuggestion: function () {
				if (!this.suggestions.length) return true
				this.editor.insertText(this.editor.getSelection().index, this.suggestions[this.activeSuggestion].value)
			}
		},
		components: { VueEditor, SuggestionOverlay }
	}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');
	html, body {
		width: 100vw;
		height: 100vh;
		font-family: Quicksand, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		--gradientViolet: linear-gradient(320deg, #3F00E6, #962CFF);
		--colorAccentRGB: 127 81 255;
		--colorAccent: rgb(var(--colorAccentRGB));

		* {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}
	}
	body {
		background: var(--gradientViolet);
	}
	.smartCompose {
		position: relative;
		width: 95%;
		height: 90%;

		display: flex;
		justify-content: center;
		border-radius: 20px;
		box-shadow: 0 0 30px 2px rgb(0 0 0 / 40%);
		overflow: hidden;

		> .quillWrapper {
			position: relative;
			width: 100%;
			background: white;
			display: flex;
			flex-direction: column;

			> .ql-toolbar {
				text-align: center;
				border: none;
				padding: 25px 0 15px 0 !important;
			}
			> .ql-container {
				border-radius: 18px;
				margin: 0 10px 10px 10px;
				padding: 10px;
				border: none;
				box-shadow: inset 0 0 10px 0px rgb(0 0 0 / 30%);
			}
		}
	}
</style>
