<template>
	<div :class="`smartCompose ${appLoading ? '' : 'loaded'}`">
		<span v-if="appLoading" class="loader" />
		<Logo v-if="appLoading" />
		<VueEditor ref="vEditor" v-model="editorContent" />
		<SuggestionOverlay :suggestions=suggestions :activeSuggestion=activeEditorState.suggestion
			:suggestionRect=suggestionRect :updateActiveSuggestion=updateActiveSuggestion />
	</div>
</template>

<script>
	import { VueEditor } from 'vue2-editor'
	import SuggestionOverlay from './components/Suggestion.vue'
	import Logo from './components/Logo.vue'
	import getSuggestions from './utils/suggestionService'

	let editor

	export default {
		name: 'App',
		data: () => ({
			appLoading: true,
			sentences: [],
			editorContent: '<p>Hello There, Welcome to Smart Compose Demo!</p>',
			suggestions: [],
			activeEditorState: { suggestion: 0, index: 0 },
			suggestionRect: { top: 0, left: 0 }
		}),
		async created () {
			const res = await fetch('/sentences.json')
			const sentences = await res.json()
			this.sentences = sentences
			setTimeout(() => (this.appLoading = false), 500)
		},
		mounted () {
			const app = this
			editor = app.$refs.vEditor.quill
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
					suggestionService = setTimeout(() => getSuggestions(app.sentences, text, data?.index)
						.then((suggestionList) => {
							app.activeEditorState.index = data?.index
							app.suggestions = suggestionList
						}), 100)
				}
			})
		},
		watch: {
			editorContent: function () {},
			suggestions: function () {
				editor.keyboard.addBinding({ key: 'up', handler: this.suggestionUp })
				editor.keyboard.addBinding({ key: 'down', handler: this.suggestionDown })
				editor.keyboard.bindings[9].unshift({ key: 9, handler: this.acceptSuggestion })
				editor.keyboard.bindings[13].unshift({ key: 13, handler: this.acceptSuggestion })
			}
		},
		methods: {
			suggestionUp: function () {
				if (!this.suggestions.length) return true
				this.activeEditorState.suggestion = Math.max(this.activeEditorState.suggestion - 1, 0)
			},
			suggestionDown: function () {
				if (!this.suggestions.length) return true
				this.activeEditorState.suggestion = Math.min(this.activeEditorState.suggestion + 1, this.suggestions.length - 1)
			},
			acceptSuggestion: function () {
				if (!this.suggestions.length) return true
				const suggestion = this.suggestions[this.activeEditorState.suggestion].value
				editor.insertText(this.activeEditorState.index, suggestion)
				editor.setSelection(this.activeEditorState.index + suggestion.length, 0)
				this.activeEditorState.suggestion = 0
			},
			updateActiveSuggestion: function (newSuggestion) {
				this.activeEditorState.suggestion = newSuggestion
				this.acceptSuggestion()
				this.suggestions = []
			}
		},
		components: { VueEditor, SuggestionOverlay, Logo }
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
		$duration: 0.28s;

		position: relative;
		width: 150px;
		height: 150px;
		background: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 0px 0px rgb(0 0 0 / 40%);
		border-radius: 999px;
		will-change: width, height, background;
		transition: all $duration ease-out, border-radius 0.05s ease-out;
		overflow: hidden;

		> .loader {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 999px;
			border: 2px solid white;
			border-top-color: transparent;
			border-bottom-color: transparent;
			animation: spinner 0.5s linear infinite;
		}

		@keyframes spinner {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}

		> .quillWrapper {
			position: relative;
			width: 100%;
			height: 100%;
			background: white;
			display: flex;
			flex-direction: column;
			opacity: 0;
			transition: opacity $duration ease-out;

			> .ql-toolbar {
				text-align: center;
				border: none;
				padding: 25px 0 15px 0 !important;
			}
			> .ql-container {
				$borderWidth: 8px;
				border-radius: 16px;
				margin: 0 $borderWidth $borderWidth 10px;
				padding: 10px;
				border: none;
				box-shadow: inset 0 0 10px 0px rgb(0 0 0 / 40%);
			}
		}

		&.loaded {
			width: 95%;
			height: 90%;
			background: white;
			box-shadow: 0 0 30px 2px rgb(0 0 0 / 40%);
			border-radius: 20px;

			> .quillWrapper {
				opacity: 1;
			}
		}
	}
</style>
