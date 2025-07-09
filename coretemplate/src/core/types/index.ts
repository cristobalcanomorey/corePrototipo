import { IDIOMAS, PAGINAS } from '@/core/constantes';
import type { Ref } from 'vue';
import type { ApiTraductor } from '../services/ApiTraductor';

export type Idioma = typeof IDIOMAS[number];
export type TraduccionItem = {
	idioma?: Idioma;
	page: string;
	label: string;
	traduccion: string;
};
export type NuevasTraducciones = Array<TraduccionItem>;

export type NestedObject = {
	[key: string]: NestedObject | unknown;
};

export type Pagina = typeof PAGINAS[number];

export interface TraductorManager {
	idioma: Idioma;
	idiomasBuscados: Ref<Idioma[]>;
	deLaApi: Ref<TraduccionItem[]>;
	messages: Ref<NuevasTraducciones>;
	nuevasT: Ref<NuevasTraducciones>;
	cargandoTraducciones: Ref<boolean>;
	labelsRelevantes: Ref<string[]>;
	api: ApiTraductor;
	constructor: () => void;
	getIdioma: () => Idioma;
	setIdioma: (idioma: Idioma) => void;
	guardarNueva: (idioma: Idioma, page: string, label: string, original: string) => void;
	existeTraduccion: (idioma: Idioma, page: string, label: string) => boolean;
	getTraduccion: (idioma: Idioma, page: string, label: string, defecto?: string | null) => string;
	getApiTraducciones: (idioma: Idioma, page: string) => Promise<NuevasTraducciones>;
	getTraduccionesDeComponentes: (page: string) => NuevasTraducciones;
	appendTraducciones: (trad: NuevasTraducciones[]) => void;
	setApiTraducciones: (trad: NuevasTraducciones) => void;
}

export type DummyTraduccionesNueva = Record<Idioma, TraduccionItem[]>;
