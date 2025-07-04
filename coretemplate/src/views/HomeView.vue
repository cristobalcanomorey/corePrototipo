<script setup lang="ts">
import LangSelector from '@/components/atomic/atoms/LangSelector.vue';
import NavMenu from '@/components/atomic/organisms/NavMenu.vue';
import BaseLayout from '@/components/templates/BaseLayout.vue';
import HeaderLayout from '@/components/templates/HeaderLayout.vue';
import { mountTraducciones } from '@/core/composables/gestorTraducciones';
import { useRouter, useRoute } from 'vue-router';
import { IDIOMAS } from '@/core/constantes';
import MainLayout from '@/components/templates/MainLayout.vue';
import TituloPage from '@/components/atomic/atoms/TituloPage.vue';
// import TraducirTexto from '@/components/atomic/organisms/TraducirTexto.vue';
import FooterLayout from '@/components/templates/FooterLayout.vue';
import LogoCorporativo from '@/components/atomic/atoms/icons/LogoCorporativo.vue';
import type { Idioma } from '@/core/types';
import { onMounted, provide, ref } from 'vue';
import TraductorComponent from '@/components/atomic/molecules/TraductorComponent.vue';
import UserCard from '@/components/atomic/organisms/UserCard.vue';
import UserCardSkeleton from '@/components/atomic/molecules/UserCardSkeleton.vue';
import SkeletonLoader from '@/components/atomic/atoms/SkeletonLoader.vue';

const router = useRouter();
const route = useRoute();
const currentPage = 'home';
const currentLang = ref<Idioma>(route.params.lang as Idioma); // Idioma por defecto

provide('currentLang', currentLang); // Proporcionamos el idioma actual para que pueda ser inyectado en otros componentes

//Se definirá lo del traductor
const manager = mountTraducciones();

function cambioIdioma(nuevo: Idioma) {
	// manager.value.setIdioma(nuevo)
	const currentPath = router.currentRoute.value.fullPath
	const lang = IDIOMAS.find(sub => currentPath.includes(`/${sub}`))

	const newPath = currentPath.replace(`/${lang}`, `/${nuevo}`)
	document.documentElement.lang = nuevo
	currentLang.value = nuevo; // Actualizamos el idioma actual
	console.log('Idioma actual = ', currentLang.value)
	router.push(newPath)
};

onMounted(async () => {
	// await manager.value.getTraduccionesDeApi(currentLang.value, currentPage)
	manager.value.getTraduccionesDeComponentes()
	// const respuestaApi = manager.value.getApiTraducciones(manager.value.getIdioma(), currentPage)
	// const promises = []
	// promises.push(respuestaApi)

	// const response = ref(await Promise.all(promises))
	// watch(response, (newResponse) => {
	// 	manager.value.appendTraducciones(newResponse) //cuando responde la API, añade las traducciones
	// }, { immediate: true })
})
</script>

<template>
	<BaseLayout>
		<template #header>
			<HeaderLayout>
				<template #title>
					<TraductorComponent :idioma="currentLang" page="Carrito" label="carrito">
						Otra forma de traducir
						<template #fallback>
							<SkeletonLoader height="18px" width="109px" borderRadius="0.25em" />
						</template>
					</TraductorComponent>
				</template>
				<template #navigation>
					<NavMenu />
				</template>
				<template #idioma>
					<LangSelector :idioma="manager.getIdioma()" @cambio-idioma="nuevo => cambioIdioma(nuevo)" />
				</template>

				<template #logo>
					<LogoCorporativo />
				</template>

			</HeaderLayout>
		</template>
		<template #main>
			<MainLayout>
				<template #title>
					<TituloPage class="home-title">
						<TraductorComponent :idioma="currentLang" page="Home" label="titulo">
							Texto por defecto
						</TraductorComponent>
						<!-- <TraducirTexto :page="currentPage" label="titulo">
							Titulo del Home
						</TraducirTexto> -->
					</TituloPage>
				</template>
				<template #usercard>
					<Suspense>
						<UserCard />
						<template #fallback>
							<UserCardSkeleton />
						</template>
					</Suspense>
				</template>
			</MainLayout>
		</template>
		<template #footer>
			<FooterLayout>
				<template #logo>
					<LogoCorporativo />
				</template>
				<template name="links">
					(Links del footer)
				</template>
				<template name="kitdigital">
					(Iconos del kit digital)
				</template>
			</FooterLayout>
		</template>
	</BaseLayout>
</template>
