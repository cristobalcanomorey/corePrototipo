<template>
	<div class="user-card">
		<!-- <div class="card-avatar">
			 <SkeletonLoader height="100px" width="100px" borderRadius="50%" />
		</div> -->
		<div class="card-info">
			<!-- <AnimatedPlaceholder height="36px" width="200px" /> -->
			 <SkeletonLoader height="36px" width="200px" />
			<div class="summary-placeholder">
					<!-- <AnimatedPlaceholder height="16px" />
					<AnimatedPlaceholder height="16px" />
					<AnimatedPlaceholder height="16px" /> -->
					<SkeletonLoader height="16px" />
					<SkeletonLoader height="16px" />
					<SkeletonLoader height="16px" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import SkeletonLoader from '../atoms/SkeletonLoader.vue';

// import AnimatedPlaceholder from "./AnimatedPlaceholder.vue";
</script>

<style scoped>
.summary-placeholder {
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
}
</style>
