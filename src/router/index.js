
import { createRouter, createWebHistory } from "vue-router";
import authService from "../services/auth.service.js";

import DefaultView from "../views/DefaultView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  /**
   * ✅ RUTAS PÚBLICAS (visitante)
   * Aquí pones herramientas que NO requieren sesión.
   */
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: DefaultView,
        meta: {
          requiresAuth: false, // <-- PUBLICA
        },
      },

      /**
       * ✅ LOGIN (publica)
       * NOTA: Aquí lo dejo DENTRO del layout para que el Navbar NO "desaparezca"
       * si tú quieres que SIEMPRE se vea.
       *
       * Si prefieres que login sea SIN navbar, lo movemos fuera del MainLayout.
       */
      {
        path: "login",
        name: "login",
        component: LoginView,
        meta: { requiresAuth: false },
      },

      /**
       * 🔒 Ejemplo de ruta para USUARIO (requiere sesión)
       * Puedes crear una vista real después.
       */
      {
        path: "panel",
        name: "panel",
        component: () => import("../views/PanelView.vue"),
        meta: {
          requiresAuth: true, // <-- requiere sesión
          allowedRoles: ["user", "admin"], // <-- usuario o admin
        },
      },

      /**
       * 🔒 Ruta SOLO ADMIN
       */
      {
        path: "administracion",
        name: "administracion",
        component: () => import("../views/AdministracionView.vue"),
        meta: {
          requiresAuth: true,
          allowedRoles: ["admin"], // <-- solo admin
        },
      },
    ],
  },

  /**
   * Ruta simple para cuando no tienes permisos
   */
  {
    path: "/no-autorizado",
    name: "no-autorizado",
    component: () => import("../views/NoAutorizadoView.vue"),
    meta: { requiresAuth: false },
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * ✅ GUARD:
 * 1) Si requiere auth y no hay sesión -> /login?redirect=...
 * 2) Si requiere rol y no coincide -> /no-autorizado
 */
router.beforeEach((to) => {
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth);
  const allowedRoles = to.matched
    .map((r) => r.meta?.allowedRoles)
    .find((x) => Array.isArray(x)); // toma el primer allowedRoles que encuentre

  // Si ruta requiere sesión y no hay sesión
  if (requiresAuth && !authService.isAuthenticated()) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  // Si hay restricción por roles, validar
  if (allowedRoles && allowedRoles.length > 0) {
    const role = authService.getRole();
    if (!allowedRoles.includes(role)) {
      return { name: "no-autorizado" };
    }
  }

  return true;
});

export default router;
