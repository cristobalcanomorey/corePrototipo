<script lang="ts" setup>
import AsyncTraducir from '@/components/atomic/atoms/AsyncTraducir.vue'
import type { Idioma, Pagina } from '@/core/types';
import type { Ref } from 'vue'
import { computed, useSlots, inject, onMounted, ref } from 'vue'
import { useTraducciones } from '@/core/composables/gestorTraducciones';
// import SkeletonLoader from '../atoms/SkeletonLoader.vue';

const slots = useSlots()
const manager = useTraducciones()

const props = defineProps<{
	idioma: Idioma
	page: Pagina
	label: string
}>()

const currentLang = inject<Ref<Idioma>>('currentLang', ref('es')) // Valor por defecto si no se inyecta

// const idiomaActual = computed<Idioma>(() => props.idioma ?? currentLang)
// console.log('Idioma actual:', idiomaActual)

const defaultText = computed<string>(() => {
	if (!slots.default) {
		return ''
	}
	const nodes = slots.default()
	if (nodes.length === 0) {
		return ''
	}

	return slots.default()[0].children as string || '' // Asumimos que el primer nodo es un texto simple

})

onMounted(() => {
	console.log('guardaNueva', currentLang.value, props.page, props.label, defaultText.value)
	// guarda la traducción por defecto al montar el componente como si fuese una nueva
	manager.value.guardaNueva(currentLang.value, props.page, props.label, defaultText.value)
})

</script>

<template>
	<Suspense timeout="0">
		<template #default>
			<AsyncTraducir :key="currentLang" v-bind="props" :defecto="defaultText" :idioma="currentLang" />
		</template>
		<template #fallback>

			<slot name="fallback">
				<!-- <SkeletonLoader height="1.5em" width="100%" borderRadius="0.25em" /> -->
				 {{ defaultText }}
			</slot>
		</template>
	</Suspense>
</template>
