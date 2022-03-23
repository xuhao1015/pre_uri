/*
 * @Author: your name
 * @Date: 2022-03-22 16:20:31
 * @LastEditTime: 2022-03-23 20:29:54
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \pre-ui\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
/* Layout */
import Layout from "@/views/layout/Layout";

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/register",
    component: () => import("@/views/login/register"),
    hidden: true
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/bind",
    component: () => import("@/views/login/bind"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true
  },
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index/index"),
        name: "Dashboard",
        meta: { title: "主页", icon: "dashboard", noCache: true, affix: true }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "center",
        component: () => import("@/views/user/index"),
        name: "个人中心",
        meta: { title: "个人中心", icon: "user" }
      }
    ]
  }
];

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});
