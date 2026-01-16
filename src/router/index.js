import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/auth.service.js";

const routes = [
  {
    path: "/",
    redirect: () => (authService.isAuthenticatedRef.value ? "/default" : "/login"),
  },
  { 
    path: "/login", 
    name: "Login", 
    component: () => import("@/views/LoginView.vue"),
    meta: {
      FREE: true
    }
  },

 { 
    path: "/default", 
    name: "Inicio", 
    component: () => import("@/views/DefaultView.vue"), 
    meta: { 
      requiresAuth: true 
    } 
  },

 { 
    path: "/panel", 
    name: "Panel", 
    component: () => import("@/views/PanelView.vue"), 
    meta: { 
      requiresAuth: true 
    } 
  },

   { 
    path: "/no-autorizado", 
    name: "NoAutorizado", 
    component: () => import("@/views/NoAuthorized/NoAuthorizedView.vue"), 
    meta: {   
      FREE: true
    } 
  },

  { 
    path: "/administracion", 
    name: "Administracion", 
    component: () => import("@/views/AdministracionView.vue"),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ["administrador"] 
    } 
  },
];

const router = createRouter({
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

  if (to.path === "/login" && isAuth) {
    return { path: "/login" };
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
