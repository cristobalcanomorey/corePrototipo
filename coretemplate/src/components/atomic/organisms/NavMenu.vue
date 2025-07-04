<script setup lang="ts">
import TraductorComponent from '@/components/atomic/molecules/TraductorComponent.vue';
import SkeletonLoader from '@/components/atomic/atoms/SkeletonLoader.vue'
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
			<TraductorComponent :idioma="currentLang" :page="currentPage" label="Home">
				Home
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent>
			<!-- <TraducirTexto  :page="currentPage??''" label="Home">
				Home
			</TraducirTexto> -->
		</RouterLink>
		<RouterLink :to="{ name: 'About', params: { lang: currentLang } }">
			<!-- <TraducirTexto  :page="currentPage??''" label="About">
				About
			</TraducirTexto> -->
			<TraductorComponent :idioma="currentLang" :page="currentPage" label="Home">
				About
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent>
		</RouterLink>
	</nav>
</template>
