<script lang="ts" setup>
import { provide } from 'vue';
const currentPage = 'Header'
provide<string>('currentPage', currentPage);
</script>

<template>
	<div class="flex">
		<slot name="logo"></slot>
		<slot name="title"></slot>
		<slot name="navigation"></slot>
		<slot name="idioma"></slot>
	</div>
</template>

<style scoped>
.header-area {
	position: relative;
	z-index: 999;
	left: 0;
	right: 0;
	top: 0;
	background: #fff;
	transition: .4s;
	width: 100%;
	padding-right: var(--bs-gutter-x, .75rem);
	padding-left: var(--bs-gutter-x, .75rem);
	margin-right: auto;
	margin-left: auto;
}

.flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-area slot[name="logo"] {
	flex: 1;
}
</style>
