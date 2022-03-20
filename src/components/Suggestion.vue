<template>
	<div class="suggestion">
		<span v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</span>
	</div>
</template>

<script>
	export default {
		name: 'Suggestion',
		props: ['suggestions'],
		mounted () {
		}
	}
</script>

<style lang="scss">
	.suggestion {
		$radius: 6px;

		position: fixed;
		background-color: black;
		border-radius: $radius;
		display: flex;
		padding: 1px 0;
		flex-direction: column;
		transition: top 0.05s ease-out, left 0.05s ease-out;

		> span {
			padding: 5px;
			margin: 1px 2px 1px 2px;
			background-color: white;
			font-size: 14px;
			cursor: pointer;

			&:first-of-type {
				border-radius: $radius - 2 $radius - 2 0 0;
			}
			&:last-of-type {
				border-radius: 0 0 $radius - 2 $radius - 2;
			}
		}
	}
</style>
