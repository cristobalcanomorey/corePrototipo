<script lang="ts" setup async>

import { ref, watch, computed } from 'vue'
// import { ApiTraductor } from '@/core/services/apiTraductor'
import type { Idioma, Pagina } from '@/core/types';
import { useTraducciones } from '@/core/composables/gestorTraducciones';

const result = ref<string | null>(null)
const props = defineProps<{
	idioma: Idioma
	page: Pagina
	label: string
	defecto: string
}>()
const manager = useTraducciones()
const lang = computed<Idioma>(() => props.idioma ?? 'es')

const loadTranslation = async (lang: Idioma, page: Pagina, label: string, defaultText: string): Promise<string | null> => {
	try {
		if(manager.value.existeTraduccion(lang, page, label)) {
			console.log('Traducción encontrada en "caché":', lang, page, label)
			setTimeout(() => {
				console.log('Traducción encontrada en "caché":', lang, page, label)
			}, 1)
			return manager.value.getTraduccion(lang, page, label, defaultText)
		}
		const response = await manager.value.getApiTraduccion(lang, page, label)
		// Si la respuesta es nula e idioma es 'es' guarda la traducción por defecto
		// Ya lo hace TraductorComponent cuando se monta
		// if (!response && lang === 'es') {
		// 	console.log('Traducción no encontrada, guardando nueva traducción por defecto:', defaultText)
		// 	manager.value.guardaNueva(lang, page, label, defaultText)
		// 	return defaultText
		// }
		return response
	} catch (error) {
		console.error('Error al obtener la traducción:', error)
		return defaultText
	}
}

result.value = await loadTranslation(lang.value, props.page, props.label, props.defecto)
watch(lang, async (newLang) => {
	console.log('Cambiando idioma a:', newLang)
	result.value = await loadTranslation(newLang, props.page, props.label, props.defecto)
	// if (newLang !== lang.value) {
	// }
})
</script>

<template>
	{{ result ?? defecto }}
</template>
