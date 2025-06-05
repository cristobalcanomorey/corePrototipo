<script lang="ts" setup>

// test2
// <template>
// 	<test :key="route.params.lang"></test>
// </template>


// test

// await getTraduccion

// watch


// onMounted(



// <template>
// 	{{  result }}
// </template>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { ApiTraductor } from '@/core/services/apiTraductor'
import type { Idioma, Pagina } from '@/core/types';
import { IDIOMAS } from '@/core/constantes';

const route = useRoute()
const currentPath = route.fullPath
const lang = ref(IDIOMAS.find(sub => currentPath.includes(`/${sub}`)))

const API = new ApiTraductor()
const result = ref<string | null>('cargando')
const props = defineProps<{
	idioma?: Idioma
	page: Pagina
	label: string
	defecto: string
}>()



onMounted(async () => {
	const respuesta = await API.getTraduccionAsync(lang.value ?? 'es', props.page, props.label)
	result.value = respuesta
})
</script>

<template>
	{{ result ?? defecto }}
</template>
