<script lang="ts" setup>
import NuevoTraducir from '@/components/atomic/atoms/NuevoTraducir.vue'
import { useRoute } from 'vue-router';
import type { Idioma, Pagina } from '@/core/types';
import { computed } from 'vue'
import { useSlots } from 'vue'

const route = useRoute()
const slots = useSlots()

const props = defineProps<{
	idioma?: Idioma
	page: Pagina
	label: string
}>()
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

</script>

<template>
	<NuevoTraducir :key="route.params.lang as string || 'es'" v-bind="props" :defecto="defaultText" />
</template>
