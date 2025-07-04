export const API_URL = import.meta.env.VITE_API_URL
export const IDIOMAS: readonly string[] = JSON.parse(import.meta.env.VITE_IDIOMAS) // Asegúrate de que VITE_IDIOMAS sea un JSON válido en tu archivo .env
export const PAGINAS = ["Home", "About", "Contact", "Carrito", "NavBar"] as const // Las pillaría de la api
