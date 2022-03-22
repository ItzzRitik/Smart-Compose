<template>
	<div class="suggestion" :style="{top: suggestionRect.top, left: suggestionRect.left, transform: `scaleY(${suggestions.length > 0 ? 1 : 0})`}">
		<span v-for="(suggestion, index) in suggestions" :key="index" :class="index === activeSuggestion ? 'active' : ''"
			@click.stop="() => updateActiveSuggestion(index)">{{ suggestion.display }}</span>
	</div>
</template>

<script>
	export default {
		name: 'Suggestion',
		props: ['suggestions', 'activeSuggestion', 'suggestionRect', 'updateActiveSuggestion'],
		mounted () {
		}
	}
</script>

<style lang="scss">
	.suggestion {
		$radius: 10px;

		position: fixed;
		background: var(--colorAccent);
		border-radius: $radius;
		border: 1px solid var(--colorAccent);
		display: flex;
		box-shadow: 0 0 30px 2px rgb(var(--colorAccentRGB) / 40%);
		flex-direction: column;
		transform-origin: 50% 0;
		user-select: none;
		transition: all 0.1s ease-out;

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

			&.active {
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
</style>
