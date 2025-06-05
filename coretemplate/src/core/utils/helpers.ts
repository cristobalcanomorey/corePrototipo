// para funciones auxiliares
import type { TraduccionItem, NuevasTraducciones, NestedObject } from "@/core/types";

export function objectHasPath(obj: NestedObject, path: string): boolean {
	return path.split('.').every(key => {
		if (obj && typeof obj === 'object' && key in obj) {
			obj = obj[key] as NestedObject;
			return true;
		}
		return false;
	});
}

export function filtrarNuevasTraduccionesNoExistentes(
	traducciones: TraduccionItem[],
	nuevas: NuevasTraducciones
): NuevasTraducciones {
	const existentes = new Set(
		traducciones.map(t => `${t.idioma ?? ''}|${t.page}|${t.label}`)
	);

	return nuevas.filter(nueva => {
		const clave = `${nueva.idioma ?? ''}|${nueva.page}|${nueva.label}`;
		return !existentes.has(clave);
	});
}
