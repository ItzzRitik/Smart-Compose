<template>
	<div class="smartComposeApp">
		<span v-show="appLoading" class="loader" />
		<Logo v-show="appLoading" />
		<div :class="`smartCompose ${appLoading ? '' : 'loaded'}`">
			<VueEditor ref="vEditor" v-model="editorContent" :editor-toolbar="customToolbar" />
			<div class="footer">
				<div :class="`suggestionToggle ${suggestionMode === 'sentence' ? '' : 'flip'}`" @click="toggleSuggestionMode">
					<p class="label">sentence based suggestion</p>
					<p class="label">word based suggestion</p>
				</div>
			</div>
		</div>
		<SuggestionOverlay :suggestions=suggestions :activeSuggestion=activeEditorState.suggestion
			:suggestionRect=suggestionRect :updateActiveSuggestion=updateActiveSuggestion />
	</div>
</template>

<script>
	import { VueEditor, Quill } from 'vue2-editor'
	import SuggestionOverlay from './components/Suggestion.vue'
	import Logo from './components/Logo.vue'
	import getSuggestions from './utils/suggestionService'

	let editor
	const fontList = ['Quicksand', 'Arial', 'Courier', 'Garamond', 'Tahoma', 'Times New Roman', 'Verdana']
	const fontNames = fontList.map(font => font.toLowerCase().replace(/\s/g, '-'))
	const fonts = Quill.import('formats/font')
	fonts.whitelist = fontNames
	Quill.register(fonts, true)

	let fontStyles = ''
	fontList.forEach(function (font) {
		const fontName = font.toLowerCase().replace(/\s/g, '-')
		fontStyles += `
			.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=${fontName}]::before,
			.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=${fontName}]::before {
				content: '${font}';
				font-family: '${font}', sans-serif;
			}
			.ql-font-${fontName} {
				font-family: '${font}', sans-serif;
			}
		`
	})

	const node = document.createElement('style')
	node.innerHTML = fontStyles
	document.body.appendChild(node)

	export default {
		name: 'App',
		data: () => ({
			appLoading: true,
			editorContent: '<p class="ql-font-quicksand"><span class="ql-font-quicksand">Hello There, Welcome to Smart Compose Demo!</span></p>',
			sentences: [],
			suggestions: [],
			suggestionMode: 'sentence',
			suggestionRect: { top: 0, left: 0 },
			activeEditorState: { suggestion: 0, index: 0 },
			customToolbar: [
				[{ font: fonts.whitelist }],
				[{ header: [false, 1, 2, 3, 4, 5, 6] }],
				['bold', 'italic', 'underline', 'strike'],
				[
					{ align: '' },
					{ align: 'center' },
					{ align: 'right' },
					{ align: 'justify' }
				],
				['blockquote', 'code-block'],
				[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
				[{ indent: '-1' }, { indent: '+1' }],
				[{ color: [] }, { background: [] }],
				['link', 'image', 'video'],
				['clean']
			]
		}),
		async created () {
			const res = await fetch('/sentences.json')
			const sentences = await res.json()
			this.sentences = sentences
			setTimeout(() => (this.appLoading = false), 600)
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
					suggestionService = setTimeout(() => getSuggestions(app.sentences, text, data?.index, app.suggestionMode)
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
			},
			toggleSuggestionMode: function () {
				this.suggestionMode = this.suggestionMode === 'sentence' ? 'word' : 'sentence'
			}
		},
		components: { VueEditor, SuggestionOverlay, Logo }
	}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');
	html, body {
		width: 100%;
		height: 100%;
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
	.smartComposeApp {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		.smartCompose {
			$duration: 0.28s;

			position: relative;
			width: 96%;
			height: 94%;
			background: transparent;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 0px 0px rgb(0 0 0 / 40%);
			border-radius: 999px;
			transform: scale(0);
			will-change: transform;
			transition: all $duration ease-out, border-radius 0.05s ease-out;
			overflow: hidden;

			> .quillWrapper {
				position: relative;
				width: 100%;
				height: calc(100% - 40px);
				background: white;
				display: flex;
				flex-direction: column;
				opacity: 0;
				overflow: hidden;
				transition: opacity $duration ease-out;

				> .ql-toolbar {
					$radius: 10px;
					flex-grow: 1;
					flex-shrink: 0;
					text-align: center;
					border: none;
					overflow: hidden;
					padding: 25px 10px 15px 10px !important;

					.ql-picker-label {
						border-radius: 999px;
					}
					.ql-picker-options {
						border-radius: $radius;
						animation: showPicker 0.1s ease-in-out both;
						transform-origin: 50% 0;
						padding: 0;
						background: var(--colorAccent);
						box-shadow: 0 0 30px 2px rgb(var(--colorAccentRGB) / 40%);

						> span {
							min-width: 150px;
							padding: 8px 20px;
							background: white;
							border: 1px solid var(--colorAccent);
							border-top-width: 0px;
							color: black;
							font-size: 14px;
							cursor: pointer;

							&:hover {
								background: rgb(255 255 255 / 80%);
							}
							&:active {
								background: var(--colorAccent);
								color: white;
							}

							&:first-of-type {
								border-top-width: 1px;
								border-top-left-radius: $radius - 1;
								border-top-right-radius: $radius - 1;
							}
							&:last-of-type {
								border-bottom-left-radius: $radius - 1;
								border-bottom-right-radius: $radius - 1;
							}
						}
					}
					@keyframes showPicker {
						0% { transform: scaleY(0); }
						100% { transform: scaleY(1); }
					}
				}
				> .ql-container {
					$borderWidth: 8px;
					border-radius: 16px;
					max-height: calc(100% - 75px);
					flex-shrink: 1;
					margin: 0 $borderWidth 0 $borderWidth;
					padding: 10px;
					border: none;
					box-shadow: inset 0 0 10px 0px rgb(0 0 0 / 40%);
				}
			}

			> .footer {
				width: 100%;
				height: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 4px 20px;
				perspective: 1000px;

				> .suggestionToggle {
					position: relative;
					width: 230px;
					height: 90%;
					user-select: none;
					cursor: pointer;
					transform-style: preserve-3d;
					transition: transform 0.3s ease-out;

					> .label {
						position: absolute;
						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						text-transform: capitalize;
						color: white;
						background: var(--colorAccent);
						box-shadow: 0 0 5px 2px rgb(var(--colorAccentRGB) / 40%);
						border-radius: 999px;
						padding: 0 15px;
						font-size: 14px;
						transition: transform 0.1s ease-out;
						backface-visibility: hidden;

						&::after {
							position: absolute;
							width: 30px;
							height: 100%;
							left: - 30px;
							content: '';
							background: white;
							opacity: 0.3;
							transition: transform 0.3s ease-out;
						}

						&:last-of-type{
							transform: rotateY(180deg);
						}
						&:hover {
							&::after {
								transform: translateX(calc(230px + 30px));
							}
						}
					}

					&.flip {
						transform: rotateY(180deg);
					}
				}
			}

			&.loaded {
				transform: scale(1);
				background: white;
				box-shadow: 0 0 30px 2px rgb(0 0 0 / 40%);
				border-radius: 20px;

				> .quillWrapper {
					opacity: 1;
				}
			}
		}

		.loader {
			position: absolute;
			width: 150px;
			height: 150px;
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
	}
</style>
