import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/auth.service.js";

const routes = [
  {
    path: "/",
    redirect: () =>
      authService.isAuthenticatedRef.value ? "/default" : "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: {
      FREE: true,
    },
  },

  {
    path: "/default",
    name: "Inicio",
    component: () => import("@/views/DefaultView.vue"),
    meta: {
      requiresAuth: true,
      viewDesc: "Página de Inicio",
    },
  },

  {
    path: "/vehiculos",
    component: () => import("@/views/vehiculos/VehiculosView.vue"),
    meta: { requiresAuth: true, viewDesc: "Vehículos" },
    children: [
      {
        path: "",
        name: "VehiculosIndex",
        redirect: { name: "VehiculoConsultarVehiculo" },
        meta: { requiresAuth: true, viewDesc: "Vehículos" },
      },
      {
        path: "registrar-carga",
        name: "VehiculoRegistrarCarga",
        component: () => import("@/views/vehiculos/RegistrarCargaView.vue"),
        meta: { requiresAuth: true, viewDesc: "Registrar Carga de Vehículo" },
      },
      {
        path: "consultar-vehiculo",
        name: "VehiculoConsultarVehiculo",
        component: () => import("@/views/vehiculos/ConsultarVehiculoView.vue"),
        meta: { requiresAuth: true, viewDesc: "Consultar Vehículo" },
      },
      {
        path: "consultar-flotilla",
        name: "FlotillaConsultarFlotilla",
        component: () => import("@/views/vehiculos/ConsultarFlotillaView.vue"),
        meta: { requiresAuth: true, viewDesc: "Consultar Flotilla" },
      },
      {
        path: "reporte-rendimiento-vehiculo",
        name: "ReporteRendimientoVehiculo",
        component: () =>
          import("@/views/vehiculos/RendimientoVehiculoView.vue"),
        meta: { requiresAuth: true, viewDesc: "Reporte Rendimiento Vehículo" },
      },
    ],
  },

  {
    path: "/administracion",
    name: "Administracion",
    component: () => import("@/views/administracion/AdministracionView.vue"),
    meta: { requiresAuth: true, viewDesc: "Administración" },
    children: [
      {
        path: "sucursales",
        name: "AdministracionSucursales",
        component: () => import("@/views/administracion/SucursalesView.vue"),
        meta: { requiresAuth: true, viewDesc: "Sucursales" },
      },
      {
        path: "departamentos",
        name: "AdministracionDepartamentos",
        component: () => import("@/views/administracion/DepartamentosView.vue"),
        meta: { requiresAuth: true, viewDesc: "Departamentos" },
      },
      {
        path: "puestos",
        name: "AdministracionPuestos",
        component: () => import("@/views/administracion/PuestosView.vue"),
        meta: { requiresAuth: true, viewDesc: "Puestos" },
      },
      {
        path: "empresas",
        name: "AdministracionEmpresas",
        component: () => import("@/views/administracion/EmpresasView.vue"),
        meta: { requiresAuth: true, viewDesc: "Empleados" },
      },
      {
        path: "empleados",
        name: "AdministracionEmpleados",
        component: () => import("@/views/administracion/EmpleadosView.vue"),
        meta: { requiresAuth: true, viewDesc: "Empleados" },
      },

      {
        path: "vehiculos",
        name: "AdministracionVehiculos",
        component: () => import("@/views/administracion/VehiculosView.vue"),
        meta: { requiresAuth: true, viewDesc: "Catálogos Vehicular" },
        children: [
          {
            path: "",
            redirect: { name: "AdministracionVehiculosMarcas" },
          },
          {
            path: "marcas",
            name: "AdministracionVehiculosMarcas",
            component: () =>
              import("@/views/administracion/vehiculos/MarcasView.vue"),
            meta: { requiresAuth: true, viewDesc: "Marcas" },
          },
          {
            path: "submarcas",
            name: "AdministracionVehiculosSubmarcas",
            component: () =>
              import("@/views/administracion/vehiculos/SubmarcasView.vue"),
            meta: { requiresAuth: true, viewDesc: "Submarcas" },
          },
          {
            path: "combustibles",
            name: "AdministracionVehiculosCombustibles",
            component: () =>
              import("@/views/administracion/vehiculos/CombustiblesView.vue"),
            meta: { requiresAuth: true, viewDesc: "Combustibles" },
          },
          {
            path: "catalogo",
            name: "AdministracionVehiculosCatalogo",
            component: () =>
              import("@/views/administracion/vehiculos/VehiculosCatalogoView.vue"),
            meta: { requiresAuth: true, viewDesc: "Vehículos" },
          },
        ],
      },

      {
        path: "usuarios",
        name: "AdministracionUsuarios",
        component: () => import("@/views/administracion/UsuariosView.vue"),
        meta: { requiresAuth: true, viewDesc: "Usuarios" },
      },
      {
        path: "perfiles",
        name: "AdministracionPerfiles",
        component: () => import("@/views/administracion/PerfilesView.vue"),
        meta: { requiresAuth: true, viewDesc: "Perfiles" },
      },
    ],
  },

  {
    path: "/no-autorizado",
    name: "NoAutorizado",
    component: () => import("@/views/NoAuthorized/NoAuthorizedView.vue"),
    meta: {
      FREE: true,
    },
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

  if (
    allowedperfils &&
    allowedperfils.length > 0 &&
    !allowedperfils.includes(perfil)
  ) {
    return { path: "/default" };
  }

  return true;
});

export default router;
