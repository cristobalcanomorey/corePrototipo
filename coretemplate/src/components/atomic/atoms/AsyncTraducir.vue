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

const loadTranslation = async (lang: Idioma, page: Pagina, label: string, defaultText: string): Promise<string> => {
	try {
		if(manager.value.existeTraduccion(lang, page, label)) {
			console.log('Traducción encontrada en caché:', lang, page, label)
			return manager.value.getTraduccion(lang, page, label, defaultText)
		}
		const response = await manager.value.getApiTraduccion(lang, page, label)
		return response ?? defaultText
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
