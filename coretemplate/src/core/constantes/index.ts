export const API_URL = import.meta.env.VITE_API_URL
export const TOKEN_APP = import.meta.env.VITE_TOKEN_APP
export const TABLE_TRANSLATIONS = JSON.parse(import.meta.env.VITE_TABLE_TRANSLATIONS) // Asegúrate de que VITE_TABLE_TRANSLATIONS sea un JSON válido en tu archivo .env
export const TABLE_FILES = JSON.parse(import.meta.env.VITE_TABLE_FILES) // Asegúrate de que VITE_TABLE_FILES sea un JSON válido en tu archivo .env

export const IDIOMAS: readonly string[] = JSON.parse(import.meta.env.VITE_IDIOMAS) // Asegúrate de que VITE_IDIOMAS sea un JSON válido en tu archivo .env
// export const PAGINAS = ["Home", "About", "Contact", "Carrito", "NavBar"] as const // Las pillaría de la api
