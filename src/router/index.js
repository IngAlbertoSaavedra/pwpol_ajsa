import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/auth.service.js";

const routes = [
  {
    path: "/",
    redirect: () => (authService.isAuthenticatedRef ? "/default" : "/login"),
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
  const isAuth = authService.isAuthenticatedRef.value;
  const role = authService.roleRef.value;
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth);
  const allowedRoles = to.matched
    .map((r) => r.meta?.allowedRoles)
    .find((x) => Array.isArray(x));

  //const isAuth = authService.isAuthenticated.value;
  //const role = authService.role.value;

  if (to.path === "/login" && isAuth) {
    return { path: "/default" };
  }

  if (requiresAuth && !isAuth) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return { path: "/default" };
  }

  return true;
});


export default router;
