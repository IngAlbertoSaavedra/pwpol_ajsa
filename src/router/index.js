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
    path: "/vehiculos",
    component: () => import("@/views/vehiculos/VehiculosView.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "VehiculosIndex",
        redirect: { name: "VehiculoConsultarVehiculo" },
      },

      // Vehiculo
      {
        path: "registrar-carga",
        name: "VehiculoRegistrarCarga",
        component: () => import("@/views/vehiculos/RegistrarCargaView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "consultar-vehiculo",
        name: "VehiculoConsultarVehiculo",
        component: () => import("@/views/vehiculos/ConsultarVehiculoView.vue"),
        meta: { requiresAuth: true },
      },

      // Flotilla
      {
        path: "consultar-flotilla",
        name: "FlotillaConsultarFlotilla",
        component: () => import("@/views/vehiculos/ConsultarFlotillaView.vue"),
        meta: { requiresAuth: true },
      },

      // Reportes
      {
        path: "reporte-rendimiento-vehiculo",
        name: "ReporteRendimientoVehiculo",
        component: () => import("@/views/vehiculos/RendimientoVehiculoView.vue"),
        meta: { requiresAuth: true },
      },

    ],
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
    component: () => import("@/views/administracion/AdministracionView.vue")
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const isAuth = authService.isAuthenticatedRef.value;
  const perfil = authService.perfilRef.value;
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth);
  const allowedperfils = to.matched
    .map((r) => r.meta?.allowedperfils)
    .find((x) => Array.isArray(x));

  if (to.path === "/login" && isAuth) {
    return { path: "/default" };
  }

  if (requiresAuth && !isAuth) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (allowedperfils && allowedperfils.length > 0 && !allowedperfils.includes(perfil)) {
    return { path: "/default" };
  }

  return true;
});


export default router;
