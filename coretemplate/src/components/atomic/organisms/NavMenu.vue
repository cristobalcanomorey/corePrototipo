<script setup lang="ts">
import TraductorComponent from '@/components/atomic/molecules/TraductorComponent.vue';
import SkeletonLoader from '@/components/atomic/atoms/SkeletonLoader.vue'
// import { useRoute } from 'vue-router'
import type { Idioma } from '@/core/types';
import { inject } from 'vue';
// const route = useRoute()
const currentPage = 'Header'
// const lang = route.params.lang as Idioma ?? 'es'
const currentLang = inject<Idioma>('currentLang', 'es') // Valor por defecto si no se inyecta
</script>

<template>
	<nav>
		<span>
			<TraductorComponent :idioma="currentLang" :page="currentPage" label="expertos_riego">
				Expertos en riego, sistemas hidráulicos y energías renovables
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent>
		</span>
		<!-- <RouterLink :to="{ name: 'Home', params: { lang: currentLang } }">
			<TraductorComponent :idioma="currentLang" :page="currentPage" label="home">
				Home
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent>
		</RouterLink>
		<RouterLink :to="{ name: 'Home', params: { lang: currentLang } }">
			<TraductorComponent :idioma="currentLang" :page="currentPage" label="productos">
				Productos
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent>
		</RouterLink>
		<RouterLink :to="{ name: 'Home', params: { lang: currentLang } }">
			<TraductorComponent :idioma="currentLang" :page="currentPage" label="productos">
				Productos
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent>
		</RouterLink> -->
		<RouterLink :to="{ name: 'About', params: { lang: currentLang } }"> texto sin traducir
			<!-- <TraducirTexto  :page="currentPage??''" label="About">
				About
			</TraducirTexto> -->
			<!-- <TraductorComponent :idioma="currentLang" :page="currentPage" label="about">
				Sobre nosotros
				<template #fallback>
					<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
				</template>
			</TraductorComponent> -->
		</RouterLink>
	</nav>
</template>
<style scoped>
nav {
	display: flex;
	gap: 1rem;
}
nav a {
	text-decoration: none;
	color: var(--color-text);
	font-weight: 500;
}
nav a:hover {
	color: var(--color-primary);
}
</style>
