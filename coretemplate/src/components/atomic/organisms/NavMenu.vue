<script setup lang="ts">
import TraducirTexto from './TraducirTexto.vue';

import {inject} from 'vue';

const currentPage = 'NavBar'

</script>

<template>
	<nav>
		<RouterLink to="home">
			<TraducirTexto  :page="currentPage??''" label="Home">
				Home
			</TraducirTexto>
		</RouterLink>
		<RouterLink to="about">
			<TraducirTexto  :page="currentPage??''" label="About">
				About
			</TraducirTexto>
		</RouterLink>
	</nav>
</template>
