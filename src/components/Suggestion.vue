<template>
	<div class="suggestion" :style="{top: suggestionRect.top, left: suggestionRect.left, transform: `scaleY(${suggestions.length > 0 ? 1 : 0})`}">
		<span v-for="(suggestion, index) in suggestions" :key="index" :class="index === activeSuggestion ? 'active' : ''">{{ suggestion.display }}</span>
	</div>
</template>

<script>
	export default {
		name: 'Suggestion',
		props: ['suggestions', 'activeSuggestion', 'suggestionRect'],
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
		transition: all 0.1s ease-out;

		> span {
			min-width: 150px;
			padding: 8px 20px;
			background-color: white;
			border: 1px solid var(--colorAccent);
			color: black;
			font-size: 14px;
			cursor: pointer;

			&.active {
				background: var(--colorAccent);
				color: white;
			}

			&:first-of-type {
				border-radius: $radius - 1 $radius - 1 0 0;
			}
			&:last-of-type {
				border-radius: 0 0 $radius - 1 $radius - 1;
			}
		}
	}
</style>
