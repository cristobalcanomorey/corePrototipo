import type { Idioma, TraduccionItem, DummyTraduccionesNueva, NuevasTraducciones } from "@/core/types";
import { TABLE_TRANSLATIONS } from "@/core/constantes";
import { Api } from "@/core/services/Api";
import { ref, type Ref } from 'vue';

export class ApiTraductor extends Api {
	static traducciones: object;
	static dummyTraducciones: Ref<TraduccionItem[][]>;
	static dummyTraduccionesNueva: Ref<DummyTraduccionesNueva>;
	static TABLE_TRANSLATIONS_NAME: string = TABLE_TRANSLATIONS.name;
	static ROW_TRANSLATION: string = TABLE_TRANSLATIONS.row_translate;
	static ROW_LABEL: string = TABLE_TRANSLATIONS.row_label;
	static ROW_PAGE: string = TABLE_TRANSLATIONS.row_page;
	static TABLE_PAGE: string = TABLE_TRANSLATIONS.table_page;
	static TABLE_PAGE_NAME: string = TABLE_TRANSLATIONS.table_page_name;

	private idioma: Idioma;
	private page: string;
	private label: string;
	private default: string;
	constructor() {
		super();
		// this.idioma = idioma as Idioma;
		ApiTraductor.dummyTraduccionesNueva = ref({
			es: [
				{
					page: 'Inventada',
					label: 'de-api',
					traduccion: 'Traducción obtenida de la API',
				},
				{
					page: 'Home',
					label: 'inicio',
					traduccion: ' Inicio ',
				},
				{
					page: 'Home',
					label: 'titulo',
					traduccion: ' Inicio ',
				},
				{
					page: 'NavBar',
					label: 'texto-nav-bar',
					traduccion: 'Texto de NavBar en español',
				},
				{
					page: 'NavBar',
					label: 'home',
					traduccion: 'enlace a Home',
				},
				{
					page: 'Carrito',
					label: 'carrito',
					traduccion: 'Texto de Carrito en español',
				}

			] as TraduccionItem[],
			en: [
				{
					page: 'Inventada',
					label: 'de-api',
					traduccion: 'Translation obtained from the API',
				},
				{
					page: 'Home',
					label: 'inicio',
					traduccion: ' Home ',
				},
				{
					page: 'Home',
					label: 'titulo',
					traduccion: ' Start ',
				},
				{
					page: 'NavBar',
					label: 'texto-nav-bar',
					traduccion: 'NavBar text in English',
				},
				{
					page: 'Carrito',
					label: 'carrito',
					traduccion: 'Shopping Cart text in English',
				}
			] as TraduccionItem[]
		});
		ApiTraductor.dummyTraducciones = ref([
			[
				{
					page: 'Inventada',
					label: 'de-api',
					traduccion: 'Traducción obtenida de la API',
				},
				{
					page: 'Inventada2',
					label: 'NavBar',
					traduccion: 'Traducción obtenida de la API',
				},

				{page: 'NavBar', label: 'inicio', traduccion: ' Inicio '}

			],
			[
				{
					page: 'Inventada',
					label: 'de-api',
					traduccion: 'Translation obtained from the API',
				},
				{
					page: 'Inventada2',
					label: 'NavBar',
					traduccion: 'Translation obtained from the API',
				},
				{
					page: 'NavBar',
					label: 'inicio2',
					traduccion: 'Translation obtained from the API',
				},

				{page: 'NavBar', label: 'inicio', traduccion: ' Home '}


			]

		])
	}

	public async getTraduccionAsync(idioma: Idioma, page: string, label: string): Promise<string | null> {
		// console.log(`Obteniendo traducción para ${idioma}.${page}.${label} ...`);
		return new Promise((resolve) => {
			setTimeout(() => {
				const traduccion = ApiTraductor.getTraduccion(idioma, page, label);
				resolve(traduccion);
			}, 500);
		});
	}

	public static getTraduccion(idioma: Idioma, page: string, label: string): string | null {
		// console.log(`Select traduccion from traducciones_${idioma} where page = '${page}' and label = '${label}'`);
		const traduccion = ApiTraductor.dummyTraduccionesNueva.value[idioma]?.find(
			item => item.page === page && item.label === label
		)?.traduccion;
		if (traduccion) {
			return traduccion;
		}
		// console.warn(`Traducción no encontrada para ${idioma}.${page}.${label}. Usando null por defecto.`);
		return null;
	}

	// static async fetchTraduccionesAsync() {
	// 	ApiTraductor.traducciones = await this.getTraduccionesAsync();
	// }

	// static async getTraduccionesAsync(): Promise<object> {
	// 	return new Promise((resolve) => {
	// 		setTimeout(() => {
	// 			resolve(ApiTraductor.getTraducciones());
	// 		}, 1000);
	// 	});
	// }

	public async getTraduccionesPaginaAsync(idioma: Idioma, page: string): Promise<NuevasTraducciones> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(ApiTraductor.getTraduccionesPagina(idioma, page));
			}, 5000);
		});
	}

	/**
SELECT
seo_paginas.page, traducciones.label ,traducciones.traduccion
FROM `traducciones`
#INNER JOIN traducciones_ca ON traducciones_ca.id = traducciones.id
#INNER JOIN traducciones_en ON traducciones_en.id = traducciones.id
INNER JOIN seo_paginas ON seo_paginas.id = traducciones.seo_pagina_id
	 * @param idioma
	 * @param page
	 * @returns
	 */
	static getTraduccionesPagina(idioma: Idioma, page: string): NuevasTraducciones {
		// Llamada a Api, suponemos que pag es nav
		console.log(`Select todo from traducciones where page = '${page}'`);


		if (idioma === 'es') {
			return ApiTraductor.dummyTraducciones.value[0];
		} else if (idioma === 'en') {
			return ApiTraductor.dummyTraducciones.value[1];
		} else {
			console.warn(`Idioma no soportado: ${idioma}. Usando español por defecto.`);
			return ApiTraductor.dummyTraducciones.value[0].filter(item => item.page === page);
		}
	}

	/**
	 * Todas las traducciones de todas las páginas, no funcionará así
	 * @returns
	 */
	// public static getTraducciones(): object {

	// 	// Llamada a Api
	// 	return {
	// 		es: {
	// 			nav: {
	// 				web: "Página web",
	// 				esUnaWeb: "Esto es una página web",
	// 				es: "es",
	// 				en: "en",
	// 				acerca: "Acerca de",
	// 				nueva: "Nueva",
	// 				inicio: "<span>Inicio</span>",
	// 			},
	// 			home: {
	// 				todoInpLabel: "Nueva tarea",
	// 				prioritario: "Prioritario",
	// 				crear: "Crear",
	// 				todas: "Todas",
	// 				pendientes: "Pendientes",
	// 				completadas: "Completadas",
	// 				prioritarias: "Prioritarias",
	// 				creaNuevaTarea: "Crea una nueva tarea",
	// 				quedanNPendientes: "Quedan <0>{n}</0> pendientes",
	// 				todasCompletadas: "Todas las tareas están completadas",
	// 			}
	// 		},
	// 		en: {
	// 			nav: {
	// 				web: "Website",
	// 				esUnaWeb: "This is a website",
	// 				es: "es",
	// 				en: "en",
	// 				acerca: "About",
	// 				nueva: "New",
	// 				inicio: "Home",
	// 			},
	// 			home: {
	// 				todoInpLabel: "New task",
	// 				prioritario: "Priority",
	// 				crear: "Create",
	// 				todas: "All",
	// 				quedanNPendientes: "<0>{n}</0> tasks remaining",
	// 				completadas: "Completed",
	// 				prioritarias: "Priority",
	// 				creaNuevaTarea: "Create a new task",
	// 				quedan: "Remaining",
	// 				todasCompletadas: "All tasks are completed",
	// 			}
	// 		}
	// 	} as object;
	// }

	// public traducir(page: string, label: string, defecto: null | string = null): string {
	// 	const paginaObj = (ApiTraductor.traducciones as any)[this.idioma]?.[page] as Record<string, string> | undefined;

	// 	if (!paginaObj || !(label in paginaObj)) {
	// 		console.log(`Guardando traducción por defecto para '${label}' en '${this.idioma}.${page}'`);
	// 		// Llamada al API para insertar la traducción por defecto
	// 		ApiTraductor.insertTraduccion(page, label, defecto ?? '');
	// 		return defecto ?? '';
	// 	}

	// 	return paginaObj[label];
	// }

	public insertTraduccion(idioma: string, page: string, label: string, traduccion: string) {
		// Llamada a Api
		console.log(`${idioma}: Insertando traducción: ${label} -> ${traduccion} en ${page}`);
		if (idioma === 'es') {
			ApiTraductor.dummyTraducciones.value[0].push({ page, label, traduccion });
		} else if (idioma === 'en') {
			ApiTraductor.dummyTraducciones.value[1].push({ page, label, traduccion });
		}
		// console.log('Traducciones actuales en API desde ', page, ':', ApiTraductor.dummyTraducciones.value);
	}

	// traducirConHtml(page: string, label: string, defecto: null | string = null): string {
	// 	const translation = this.traducir(page, label, defecto);
	// 	return translation.replace(/<(\w+)>/g, "<$1 class='translated'>");
	// }
}
