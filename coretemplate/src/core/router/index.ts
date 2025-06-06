import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import type { Idioma } from "@/core/types";
import { IDIOMAS } from "@/core/constantes";

function checkIdioma(lang: string) {
	return IDIOMAS.includes(lang as Idioma);
}

const routes: RouteRecordRaw[] = [
	{
		path: '/404',
		name: '404',
		component: () => import("@/views/404View.vue"),
	},
	{
		path: '/',
		redirect: '/es'
	},
	{
		path: '/:lang(es|en)',
		name: 'Home',
		component: () => import("@/views/HomeView.vue"),
	},
	{
		path: '/:lang(es|en)/about', //cómo traducir urls?
		name: 'About',
		component: () => import("@/views/AboutView.vue"),
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: '/404'
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_BASE_URL),
	routes
});

router.beforeEach((to, from, next) => {
	if (to.name === '404') {
		return next()
	}
	const lang = to.params.lang as Idioma | undefined
	if (!lang || !checkIdioma(lang)) {
		next({ name: '404' });
	} else {
		document.documentElement.lang = lang; // Set the document language
		next(); // Proceed to the route
	}
})


export default router;
