import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import { tools } from './tools.js'

// Hash history (#/base64) is used deliberately: on a static host like
// GitHub Pages, deep links with normal history mode 404 on refresh
// because the server has no file at that path. Hash mode sidesteps that.
const routes = [
  { path: '/', name: 'home', component: Home },
  ...tools.map((t) => ({
    path: `/${t.slug}`,
    name: t.slug,
    component: t.view,
    meta: { title: t.name },
  })),
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · devtoyz` : 'devtoyz'
})

export default router
