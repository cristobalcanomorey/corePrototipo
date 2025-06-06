<script lang="ts" setup>
import AsyncTraducir from '@/components/atomic/atoms/AsyncTraducir.vue'
import type { Idioma, Pagina } from '@/core/types';
import { computed, useSlots, inject } from 'vue'
// import SkeletonLoader from '../atoms/SkeletonLoader.vue';

const slots = useSlots()

const props = defineProps<{
	idioma?: Idioma
	page: Pagina
	label: string
}>()

const currentLang = inject<Idioma>('currentLang', 'es') // Valor por defecto si no se inyecta

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
