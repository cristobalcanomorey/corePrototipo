// Translator
import { ApiTraductor } from '@/core/services/apiTraductor'
import { filtrarNuevasTraduccionesNoExistentes } from '@/core/utils/helpers';
import { watch, inject, provide, shallowRef, isRef, ref, type Ref } from 'vue';
import type { NuevasTraducciones, Idioma, TraduccionItem } from '@/core/types'
import { PAGINAS } from '@/core/constantes';


export function mountTraducciones() {
	//Parece ser que con ref normal se sacan los value fuera de los refs del objeto TraductorManager y pierde la reactividad
	//Por eso se usa shallowRef, para que no se pierda la reactividad de los refs dentro de TraductorManager
	const manager = shallowRef<TraductorManager>(new TraductorManager())
	provide('TraductorManager', manager)
	return manager
}

export function useTraducciones() {
	const manager = inject("TraductorManager") as Ref<TraductorManager>
	if (!manager) {
		throw new Error("TraductorManager no fue proporcionado")
	}
	return manager
}


class TraductorManager {
	public idioma: Ref<Idioma> = ref(document.documentElement.lang as Idioma)

	public idiomasBuscados: Ref<Idioma[]> = ref([]) // Aquí se guardan los idiomas que se han buscado en la API
	private deLaApi: Ref<TraduccionItem[]> = ref([] as TraduccionItem[]) // Aquí se guardan las traducciones obtenidas de la API
	public messages = ref<TraduccionItem[]>([] as TraduccionItem[]) // Aquí se guardan las traducciones obtenidas de la API
	//recoge los mensajes de los slots de cada componente TraducirTexto
	public nuevasT = ref<NuevasTraducciones>([] as NuevasTraducciones)
	public cargandoTraducciones: Ref<boolean> = ref(false)
	// Los labels que se usan en la página actual
	public labelsRelevantes = ref<string[]>([])
	private api
	private respuestas = ref<TraduccionItem[][]>([] as TraduccionItem[][])

	public constructor() {
		this.setIdioma(document.documentElement.lang as Idioma)

		this.api = new ApiTraductor()

		watch(
			() => this.idioma.value,
			async (idiomaActual) => {
				console.log(`Cambiando idioma a: ${idiomaActual}`);
				if (!this.idiomasBuscados.value.includes(idiomaActual as Idioma)) {
					this.cargandoTraducciones.value = true
					const promises = []
					for (const pagina of PAGINAS) {
						const trads = this.api.getTraduccionesPaginaAsync(idiomaActual as Idioma, pagina)
						promises.push(trads)
					}
					this.respuestas.value = await Promise.all(promises)
				}
			},
			{ immediate: true }
		)
		watch(
			() => this.respuestas.value,
			(newResponse) => {
				console.log('Respuestas de la API recibidas:', newResponse);
				this.cargandoTraducciones.value = false
				this.appendTraducciones(newResponse) //cuando responde la API, añade las traducciones
			}, { immediate: true })

	}

	public getIdioma(): Idioma {
		return this.idioma.value
	}
	public setIdioma(nuevo: Idioma) {
		if (isRef(this.idioma)) {
			this.idioma.value = nuevo;
		} else {
			// En caso de que Vue ya lo envolviera a “string”, lo restauramos:
			this.idioma = ref(nuevo);
		}
		if (!this.idiomasBuscados.value.includes(nuevo)) {
			this.idiomasBuscados.value.push(nuevo);
		}
	}

	public guardaNueva(idioma: Idioma, page: string, label: string, original: string) {
		// mete dentro de originales
		const nuevaTraduccion = {
			idioma: idioma,
			page: page,
			label: label,
			traduccion: original
		} as TraduccionItem

		this.nuevasT.value.push(nuevaTraduccion)
		if (!this.existeTraduccion(idioma, page, label)) {
			this.messages.value.push(nuevaTraduccion);
		}
	}

	public existeTraduccion(idioma: Idioma, page: string, label: string): boolean {
		return this.messages.value.some(
			item =>
				item.idioma === idioma &&
				item.page === page &&
				item.label === label
		);
	}

	public getTraduccion(idioma: Idioma, page: string, label: string, defecto: string | null = null): string {
		/**
		 * Si la traducción existe en messages la devuelve en su idioma
		 *
		 * Si no existe devuelve el defecto
		 */
		// const valor = this.messages.value[idioma]?.[page]?.[label]
		// if (typeof valor === "string") {
		// 	return valor;
		// }
		const response = this.messages.value.find(
			item => item.idioma === idioma && item.page === page && item.label === label
		);
		if (response) {
			// console.log(`Traducción encontrada: ${response.traduccion}`);
			return response.traduccion;
		}
		if (defecto === null) {
			console.warn('Hay que poner texto en el slot para que se muestre por defecto y se pueda hacer su insert en la api')
		}
		return defecto ?? ''
	}

	public async getApiTraducciones(idioma: Idioma, page: string): Promise<TraduccionItem[]> {
		this.cargandoTraducciones.value = true

		// Llama a la API
		const trad = this.api.getTraduccionesPaginaAsync(idioma, page)
		return trad
	}

	public getTraduccionesDeComponentes(page: string): TraduccionItem[] {
		console.log('Obtiene las traducciones de: ' + page);
		// this.cargandoTraducciones.value = true;

		/**
		 * Obtiene las traducciones que han recopilado los componentes TraducirTexto
		 * y las guarda en messages
		 */
		const diferencia = filtrarNuevasTraduccionesNoExistentes(this.messages.value, this.nuevasT.value);
		/**
		 * Evita guardar duplicadas (this.messages.value = this.nuevasT.value ?)
		 */
		if (diferencia.length !== 0) {
			this.setApiTraducciones(diferencia);
			this.messages.value.push(...diferencia);
		}

		return this.messages.value;

	}

	public appendTraducciones(trad: TraduccionItem[][]) {
		for (const traducciones of trad) {
			for (const t of traducciones) {
				t.idioma = t.idioma || this.idioma.value; // Aseguramos que cada item tenga el idioma
				if (t.page && t.label && !this.existeTraduccion(t.idioma, t.page, t.label)) {
					this.messages.value.push(t);
					this.deLaApi.value.push(t); // Guardamos también en deLaApi
				}
			}
		}
	}


	private setApiTraducciones(trad: NuevasTraducciones) {

		for (const nueva of trad) {
			this.api.insertTraduccion(nueva.idioma ? nueva.idioma : '', nueva.page, nueva.label, nueva.traduccion)
		}
	}

}
