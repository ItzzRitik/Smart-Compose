<template>
	<div class="smartCompose">
		<VueEditor ref="vEditor" v-model="editorContent"/>
	</div>
</template>

<script>
	import { VueEditor } from 'vue2-editor'

	export default {
		name: 'App',
		data: () => ({
			editorContent: '<p>Some Initial Content</p>'
		}),
		mounted () {
			const editor = this.$refs.vEditor.quill
			editor.on('text-change', function (delta, oldDelta, source) {
				const selection = editor.root.ownerDocument.getSelection()
				if (selection.rangeCount > 0) {
					const range = selection.getRangeAt(0)
					const rects = range.getClientRects()
					if (rects.length > 0) {
						console.log(rects[0])
					}
				}
			})
		},
		watch: {
			editorContent: function (newContent) {
			}
		},
		components: {
			VueEditor
		}
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
