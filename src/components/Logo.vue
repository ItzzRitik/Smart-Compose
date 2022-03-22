<template>
	<svg class="logo" viewBox="0 0 738 441" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
		<path d="M390.002 411L390.002 258L435.002 258L494.002 180L424.002 180C424.002 180 409.275 179.216 399.502 167.5C389.729 155.784 390.002 147 390.002 147L390.002 58C390.002 58 389.609 41.893 399.502 31C409.395 20.1069 424.002 20 424.002 20L707.502 20L615.002 134.5L615.002 80L461.002 80L461.002 121.5L547.502 121.5C547.502 121.5 583.992 119.122 587.502 147C589.535 163.141 576.002 180 576.002 180L390.002 411Z" id="s" fill="none" fill-rule="evenodd" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M337.5 411L337.5 258L292.5 258L233.5 180L303.5 180C303.5 180 318.227 179.216 328 167.5C337.773 155.784 337.5 147 337.5 147L337.5 58C337.5 58 337.893 41.893 328 31C318.107 20.1069 303.5 20 303.5 20L20 20L112.5 134.5L112.5 80L266.5 80L266.5 121.5L180 121.5C180 121.5 143.511 119.122 140 147C137.967 163.141 151.5 180 151.5 180L337.5 411Z" id="r" fill="none" fill-rule="evenodd" stroke="#FFFFFF" stroke-linecap="square" stroke-linejoin="round" />
	</svg>
</template>

<style lang="scss">
	.logo {
		position: absolute;
		width: 100px;
		height: 100px;
		margin-top: 12px;
		stroke-width: 15;
		stroke-dasharray: 1790;
		stroke-dashoffset: 1790;

		> path {
			&:first-of-type {
				animation: loadLogo 0.5s ease-in-out both;
			}
			&:last-of-type {
				animation: loadLogo 0.5s ease-in-out both;
			}
		}

	}

	@keyframes loadLogo {
		0% {
			stroke-dashoffset: 1790;
		}
		100% {
			stroke-dashoffset: 0;
		}
	}
</style>
