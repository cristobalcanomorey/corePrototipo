// Translator
import { ApiTraductor } from '@/core/services/ApiTraductor'
import { filtrarNuevasTraduccionesNoExistentes } from '@/core/utils/helpers';
import { inject, provide, shallowRef, isRef, ref, type Ref } from 'vue';
import type { NuevasTraducciones, Idioma, TraduccionItem, Pagina } from '@/core/types'
// import { IDIOMAS } from '@/core/constantes';


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
	public messages = ref<NuevasTraducciones>([] as NuevasTraducciones) // Aquí se guardan las traducciones obtenidas de la API
	//recoge los mensajes de los slots de cada componente TraducirTexto
	public nuevasT = ref<NuevasTraducciones>([] as NuevasTraducciones)
	public cargandoTraducciones: Ref<boolean> = ref(false)
	// Los labels que se usan en la página actual
	public labelsRelevantes = ref<string[]>([])
	public paginas = ref<Pagina[]>([])
	private api
	private respuestas = ref<TraduccionItem[][]>([] as TraduccionItem[][])

	public constructor() {
		this.setIdioma(document.documentElement.lang as Idioma)
		this.api = new ApiTraductor()

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


	/**
	 * Guarda una nueva traducción en el array de nuevasT
	 * @param idioma Idioma de la traducción
	 * @param page Página a la que pertenece la traducción
	 * @param label Label de la traducción
	 * @param original Texto original de la traducción
	 */
	public guardaNueva(idioma: Idioma, page: Pagina, label: string, original: string) {
		console.log(idioma)
		// mete dentro de originales
		const nuevaTraduccion = {
			idioma: idioma, // POR HACER: no se guarda el 'es' sino un RefImpl
			page: page,
			label: label,
			traduccion: original
		} as TraduccionItem

		this.nuevasT.value.push(nuevaTraduccion)
		this.addPagina(page)
		console.log('"Nuevas": ', this.nuevasT.value);
		// if (!this.existeTraduccion(idioma, page, label)) {
		// 	this.messages.value.push(nuevaTraduccion);
		// }
	}

	/**
	 * Añade una nueva página al registro de páginas
	 * @param page Página a la que pertenece la traducción
	 */
	public addPagina(page: Pagina) {
		if (!this.existePagina(page)) {
			this.paginas.value.push(page);
			// console.log(`Página añadida: ${page}`);
		}
	}

	/**
	 * Comprueba si una página existe en el registro de páginas
	 * @param page Página a comprobar
	 * @returns Verdadero si la página existe, falso en caso contrario
	 */
	public existePagina(page: Pagina): boolean {
		return this.paginas.value.includes(page);
	}

	/**
	 * Comprueba si una traducción existe en el registro de traducciones
	 * @param idioma Idioma de la traducción
	 * @param page Página a la que pertenece la traducción
	 * @param label Label de la traducción
	 * @returns Verdadero si la traducción existe, falso en caso contrario
	 */
	public existeTraduccion(idioma: Idioma, page: string, label: string): boolean {
		// console.log(`Comprobando si existe traducción para ${idioma}.${page}.${label}...`);
		// console.log(this.messages.value.find(item => item.idioma === idioma && item.page === page && item.label === label));
		return this.messages.value.some(
			item =>
				item.idioma === idioma &&
				item.page === page &&
				item.label === label
		);
	}

	/**
	 * Comprueba si una traducción existe en el registro de traducciones
	 * @param idioma Idioma de la traducción
	 * @param page Página a la que pertenece la traducción
	 * @param label Label de la traducción
	 * @param defecto Texto por defecto a utilizar si no se encuentra la traducción
	 * @returns Verdadero si la traducción existe, falso en caso contrario
	 */
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
		// console.log('Test', this.existeTraduccion(idioma, page, label), this.messages.value, response);
		// return 'Test';
		// console.log(`Buscando traducción para ${idioma}.${page}.${label}...`);
		// console.log('Respuesta encontrada:', response);
		if (response) {
			// console.log(`Traducción encontrada: ${response.traduccion}`);
			return response.traduccion;
		}
		if (defecto === null) {
			console.warn('Hay que poner texto en el slot para que se muestre por defecto y se pueda hacer su insert en la api')
		}
		return defecto ?? ''
	}

	/**
	 * Obtiene la traducción de la API
	 * @param idioma Idioma de la traducción
	 * @param page Página a la que pertenece la traducción
	 * @param label Label de la traducción
	 * @returns La traducción obtenida o null si no se encuentra
	 */
	public async getApiTraduccion(idioma: Idioma, page: Pagina, label: string): Promise<string | null> {
		let traduccion
		try {
			traduccion = await this.api.getTraduccionAsync(idioma, page, label);
		} catch (error) {
			console.error(`Error al obtener la traducción de la API para ${idioma}.${page}.${label}:`, error);
			return null;
		}
		if (traduccion) {
			this.messages.value.push({
				idioma: idioma,
				page: page,
				label: label,
				traduccion: traduccion
			} as TraduccionItem);
			// console.log(`Traducción obtenida de la API: ${traduccion}`);
			return traduccion;
		} else {
			console.warn(`No se encontró traducción en la API para ${idioma}.${page}.${label}`);
			return null;
		}

	}

	//no se usa
	// public async getApiTraducciones(idioma: Idioma, page: string): Promise<TraduccionItem[]> {
	// 	this.cargandoTraducciones.value = true

	// 	// Llama a la API
	// 	const trad = this.api.getTraduccionesPaginaAsync(idioma, page)
	// 	return trad
	// }

	//no se usa
	// public async getTraduccionesDeApi(idioma: Idioma, page: string) {
	// 	this.messages.value = await this.api.getTraduccionesPaginaAsync(idioma, page)
	// }

	/**
	 * Obtiene las traducciones que han recopilado los componentes TraducirTexto
	 * y las guarda en messages y las envía a la API
	 * @returns Devuelve las traducciones de la API
	 */
	public setNuevasTraducciones(): TraduccionItem[] {
		/**
		 * Evita guardar duplicadas (this.messages.value = this.nuevasT.value ?)
		*/
		const diferencia = filtrarNuevasTraduccionesNoExistentes(this.messages.value, this.nuevasT.value);
		console.log(this.messages.value, this.nuevasT.value, diferencia);
		if (diferencia.length !== 0) {
			this.setApiTraducciones(diferencia); // Guarda las nuevas traducciones en la API
			// this.messages.value.push(...diferencia);
		}

		return this.messages.value;

	}

	//no se usa
	// public appendTraducciones(trad: TraduccionItem[][]) {
	// 	for (const traducciones of trad) {
	// 		for (const t of traducciones) {
	// 			t.idioma = t.idioma || this.idioma.value; // Aseguramos que cada item tenga el idioma
	// 			if (t.page && t.label && !this.existeTraduccion(t.idioma, t.page, t.label)) {
	// 				this.messages.value.push(t);
	// 				this.deLaApi.value.push(t); // Guardamos también en deLaApi
	// 			}
	// 		}
	// 	}
	// }


	/**
	 * Establece las nuevas traducciones en la API
	 * @param trad Traducciones a añadir
	 */
	private setApiTraducciones(trad: NuevasTraducciones) {
		for (const nueva of trad) {
			this.api.insertTraduccion(nueva.idioma ? nueva.idioma : '', nueva.page, nueva.label, nueva.traduccion)
		}
	}

}
