<script setup lang="ts">
import type { Idioma } from '@/core/types';
import { defineEmits, ref } from 'vue';


const emit = defineEmits(['cambio-idioma']);
const prop = defineProps<{
	idioma: Idioma
}>()
const selectedLanguage = ref<Idioma>(prop.idioma); // Default language


function handleCambioIdioma(){
	emit('cambio-idioma', selectedLanguage.value);
};
</script>

<template>
	<select v-model="selectedLanguage" @change="handleCambioIdioma" class="form-select">
		<option value="es">Español</option>
		<option value="en">English</option>
	</select>
</template>
