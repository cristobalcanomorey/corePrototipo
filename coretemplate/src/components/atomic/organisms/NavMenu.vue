<script setup lang="ts">
import TraducirTexto from './TraducirTexto.vue';
// import { useRoute } from 'vue-router'
import type { Idioma } from '@/core/types';
import { inject } from 'vue';
// const route = useRoute()
const currentPage = 'NavBar'
// const lang = route.params.lang as Idioma ?? 'es'
const currentLang = inject<Idioma>('currentLang', 'es') // Valor por defecto si no se inyecta
</script>

<template>
	<nav>
		<RouterLink :to="{ name: 'Home', params: { lang: currentLang } }">
			<TraducirTexto  :page="currentPage??''" label="Home">
				Home
			</TraducirTexto>
		</RouterLink>
		<RouterLink :to="{ name: 'About', params: { lang: currentLang } }">
			<TraducirTexto  :page="currentPage??''" label="About">
				About
			</TraducirTexto>
		</RouterLink>
	</nav>
</template>
