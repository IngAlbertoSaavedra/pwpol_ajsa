import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/auth.service.js";

const routes = [
  {
    path: "/",
    redirect: () => (authService.isAuthenticated() ? "/default" : "/login"),
  },
  { 
    path: "/login", 
    name: "Login", 
    component: () => import("@/views/LoginView.vue"),
    meta: {
      FREE: true
    }
  },

  // ejemplo:
  //{ path: "/", name: "home", component: () => import("../views/HomeView.vue"), meta: { requiresAuth: true } },

  { 
    path: "/default", 
    name: "Inicio", 
    component: () => import("@/views/DefaultView.vue"), 
    meta: { 
      requiresAuth: true 
    } 
  },

  { 
    path: "/administracion", 
    name: "Administracion", 
    component: () => import("@/views/AdministracionView.vue"),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ["admin"] 
    } 
  },
];

const router = createRouter({
  //history: createWebHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const isAuth = authService.isAuthenticated();
  const role = authService.getRole();
  document.title = `PWPOL_AJSA | ${to.name}`;

  if (to.path === "/login" && isAuth) {
    return { path: "/" };
  }

  // // ✅ 2) Si la ruta requiere auth y no está logueado -> manda a login
  // if (to.meta?.requiresAuth && !isAuth) {
  //   return { path: "/login", query: { redirect: to.fullPath } };
  // }

  // // ✅ 3) Si la ruta tiene roles permitidos
  // const allowed = to.meta?.allowedRoles;
  // if (allowed && allowed.length && !allowed.includes(role)) {
  //   return { path: "/" };
  // }

  return true;
});

export default router;
