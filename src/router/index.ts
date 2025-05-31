import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/user";
import { isVisible } from "element-plus/es/utils/index.mjs";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
export const routes = [
  
  {
    path: "/",
    name: "hello",
    component: () => import("@/components/HelloWorld.vue"),
  },
  {
    path: "/problems",
    name: "problems",
    component: () => import("@/views/problem/ProblemList.vue"),
  },
  // 注册和登录不需要权限
  {
    path: "/user/register",
    name: "register",
    component: () => import("@/views/user/Register.vue"),
    meta: {
      needLogin: false,
    },
  },
  {
    path: "/user/login",
    name: "login",
    component: () => import("@/views/user/Login.vue"),
    meta: {
      needLogin: false,
    },
  },
  {
    path: "/problem/:id",
    name: "ProblemDetail",
    component: () => import("@/views/problem/ProblemDetail.vue"),
    props: true,
    meta: {
      hiddenInMenu: true,
    },
  },
  {
    path: "/problem/edit/:id",
    name: "ProblemEdit",
    component: () => import("@/views/problem/ProblemEdit.vue"),
    props: true,
    meta: {
      hiddenInMenu: true,
    },
  },
  {
    path: "/problem/add",
    name: "ProblemAdd",
    component: () => import("@/views/problem/ProblemAdd.vue"),
    props: true,
    meta: {
      hiddenInMenu: true,
    },
  },
  {
    path: "/submission",
    name: "SubmissionList",
    component: () => import("@/views/submission/SubmissionList.vue"),
    props: true,
  },
  {
    path: "/contest",
    name: "ContestList",
    component: () => import("@/views/contest/ContestList.vue"),
    props: true,
  },
  {
    path: "/contest/:id",
    name: "ContestDetail",
    component: () => import("@/views/contest/ContestDetail.vue"),
    props: true,
    meta: {
      hiddenInMenu: true,
    },
  },
  {
    path: "/contest/add",
    name: "ContestAdd",
    component: () => import("@/views/contest/ContestAdd.vue"),
    props: true,
  },
  {
    path: "/contest/submission/:id",
    name: "ContestSubmissionDetail",
    component: () => import("@/views/contest/ContestSubmissionDetail.vue"),
    props: true,
    meta: {
      hiddenInMenu: true,
    },
  },
  {
    path: "/contest/:cid/problem/:idx",
    name: "ContestProblemDetail",
    component: () => import("@/views/contest/ContestProblemDetail.vue"),
    meta: {
      hiddenInMenu: true,
    },

  },
  {
    path: "/submission/:id",
    name: "SubmissionDetail",
    component: () => import("@/views/submission/SubmissionDetail.vue"),
    props: true,
    meta: {
      hiddenInMenu: true,
    },
  },
  {
    path:'/problem/edit/:pid',
    name:'ProblemEdit',
    component: () => import('@/views/problem/ProblemEdit.vue'),
    props:true,
    meta:{
      hiddenInMenu:true,
    }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})
/**
 * beforeEach 是全局前置守卫，它会在每次路由切换之前被调用。
 * 你可以利用它进行一些前置操作，像身份验证、权限检查等。
 */
// router.beforeEach((to, from, next) => {
//   const userStrore = useUserStore()

//   // 如果用户已经登陆过了，或者当前页面不需要登陆，则继续访问
//   if (userStrore.isLogin() || !to.meta.needLogin) {
//     next()
//   } else { 
//     // 否则跳转到登录页面
//     next('/user/login')
//   }
// })


export default router