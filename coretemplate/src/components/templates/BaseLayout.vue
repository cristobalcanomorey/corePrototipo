<script setup lang="ts">

</script>

<template>
	<div>
		<header>
			<slot name="header"></slot>
		</header>
		<main>
			<slot name="main"></slot>
		</main>
		<footer>
			<slot name="footer"></slot>
		</footer>
	</div>
</template>

<style scoped>
main {
	max-width: 620px;
	margin: 0 auto;
	padding-top: 32px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

</style>
