<script lang="ts" setup>
import { computed, useSlots, onMounted,  watch } from 'vue'
import { useTraducciones } from '@/core/composables/gestorTraducciones.ts'
import { ref } from 'vue';
import type { Idioma, Pagina } from '@/core/types';


const slots = useSlots()

// const manager = useTraducciones()
const props = defineProps<{
	idioma?: Idioma
	page: Pagina
	label: string
}>()

const manager = useTraducciones();

//usar param url para idioma
const existeTraduccion = computed(()=>manager.value.existeTraduccion(manager.value.getIdioma(), props.page, props.label))

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

const cargando = ref<boolean>(manager.value.cargandoTraducciones.value)

const traduccion = computed(() => {
	// console.log('cambiaComputed traduccion', props.page, props.label, defaultText.value)
	const idm = props.idioma ?? manager.value.idioma.value
	// console.log('idioma actual', idm)
	return manager.value.getTraduccion(idm, props.page, props.label, defaultText.value)
})

watch(manager.value.cargandoTraducciones, (nuevo) => {
  console.log('Estado de carga:', nuevo)
  cargando.value = nuevo
})

onMounted(()=>{
	manager.value.guardaNueva('es', props.page, props.label, defaultText.value)
})


</script>

<template>
	<template v-if="cargando">
		<!-- Hacer que muestre un esqueleto mientras carga -->
		 <!-- nunca sale del esqueleto -->
		<p>Cargando con skeleton ...</p>
	</template>
	<template v-else>
		<template v-if="existeTraduccion">
			{{ traduccion }}
		</template>
		<template v-else>
			<!-- por defecto pilla lo del slot -->
			<slot> </slot>
		</template>
	</template>
</template>
