<script setup lang="ts">
import LangSelector from '@/components/atomic/atoms/LangSelector.vue';
import NavMenu from '@/components/atomic/organisms/NavMenu.vue';
import BaseLayout from '@/components/templates/BaseLayout.vue';
import HeaderLayout from '@/components/templates/HeaderLayout.vue';
import { mountTraducciones } from '@/core/composables/gestorTraducciones';
import { useRouter } from 'vue-router';
import { IDIOMAS } from '@/core/constantes';
import MainLayout from '@/components/templates/MainLayout.vue';
import TituloPage from '@/components/atomic/atoms/TituloPage.vue';
// import TraducirTexto from '@/components/atomic/organisms/TraducirTexto.vue';
import FooterLayout from '@/components/templates/FooterLayout.vue';
import LogoCorporativo from '@/components/atomic/atoms/icons/LogoCorporativo.vue';
import type { Idioma } from '@/core/types';
import { onMounted } from 'vue';
import TraductorComponent from '@/components/atomic/molecules/TraductorComponent.vue';

const router = useRouter();
const currentPage = 'home';

//Se definirá lo del traductor
const manager = mountTraducciones();

function cambioIdioma(nuevo: Idioma) {
	// manager.value.setIdioma(nuevo)
	const currentPath = router.currentRoute.value.fullPath
	const currentLang = IDIOMAS.find(sub => currentPath.includes(`/${sub}`))

	const newPath = currentPath.replace(`/${currentLang}`, `/${nuevo}`)

	document.documentElement.lang = nuevo
	router.push(newPath)
};

onMounted(async () => {
	manager.value.getTraduccionesDeComponentes(currentPage)
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
					<TraductorComponent page="Carrito" label="carrito">
						Otra forma de traducir
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
						<TraductorComponent page="Home" label="titulo">
							Otra forma de traducir
						</TraductorComponent>
						<!-- <TraducirTexto :page="currentPage" label="titulo">
							Titulo del Home
						</TraducirTexto> -->
					</TituloPage>
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
