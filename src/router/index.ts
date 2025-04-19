import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  {
    path: "/user/login",
    name: "login",
    component: () => import("@/views/user/Login.vue"),
  },
  {
    path: "/",
    name: "hello",
    component: () => import("@/components/HelloWorld.vue"),
  },
  {
    path: "/problem",
    name: "problem",
    component: () => import("@/views/problem/Problem.vue"),
  },
  {
    path: "/user/register",
    name: "register",
    component: () => import("@/views/user/Register.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})


export default router