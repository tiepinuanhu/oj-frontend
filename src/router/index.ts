import { createRouter, createWebHashHistory } from "vue-router";

export const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/",
    name: "hello",
    component: () => import("@/components/HelloWorld.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})


export default router