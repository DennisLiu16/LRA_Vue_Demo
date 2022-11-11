import { createRouter, createWebHistory } from "vue-router";
import LRAHomeView from "@/views/LRAHomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LRAHomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/base",
      name: "base",
      component: () => import("../views/LRABaseView.vue"),
      redirect: "/base/real-time-plot",
      children: [
        {
          path: "registers/:uuid",
          name: "registers",
          component: () => import("../views/LRARegisterView.vue"),
        },
        {
          path: "real-time-plot/:uuid",
          name: "real-time-plot",
          component: () => import("../views/LRARealTimePlotView.vue"),
        },
      ],
    },
  ],
});

export default router;
