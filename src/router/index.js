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
      breadcrumb: "Inicio",
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
        meta: { 
          requiresAuth: true, 
          breadcrumb: "Vehículos",
          viewDesc: "Administración de Vehículos", 
        },
      },
      {
        path: "registrar-carga",
        name: "VehiculoRegistrarCarga",
        component: () => import("@/views/vehiculos/RegistrarCargaView.vue"),
        meta: { 
          requiresAuth: true, 
          breadcrumb: "Registrar Carga",
          viewDesc: "Registrar Carga de Vehículo" },
      },
      {
        path: "eliminar-carga",
        name: "VehiculoEliminarCarga",
        component: () => import("@/views/vehiculos/EliminarCargaView.vue"),
        meta: { 
          requiresAuth: true, 
          breadcrumb: "Eliminar Carga",
          viewDesc: "Eliminar Carga de Vehículo" },
      },
      {
        path: "consultar-vehiculo",
        name: "VehiculoConsultarVehiculo",
        component: () => import("@/views/vehiculos/ConsultarVehiculoView.vue"),
        meta: { 
          requiresAuth: true, 
          breadcrumb: "Consultar Vehículo",
          viewDesc: "Consultar Vehículo" },
      },
      {
        path: "consultar-flotilla",
        name: "FlotillaConsultarFlotilla",
        component: () => import("@/views/vehiculos/ConsultarFlotillaView.vue"),
        meta: { 
          requiresAuth: true, 
          breadcrumb: "Consultar Flotilla",
          viewDesc: "Consultar Flotilla" },
      },
      {
        path: "reporte-rendimiento-vehiculo",
        name: "ReporteRendimientoVehiculo",
        component: () =>
          import("@/views/vehiculos/RendimientoVehiculoView.vue"),
        meta: { 
          requiresAuth: true, 
          breadcrumb: "Reporte Rendimiento Vehículo",
          viewDesc: "Reporte Rendimiento Vehículo" },
      },
    ],
  },

  {
    path: "/administracion",
    name: "Administracion",
    component: () => import("@/views/administracion/AdministracionView.vue"),
    meta: { 
        requiresAuth: true, 
        breadcrumb: "Administración",
        viewDesc: "Administración" },
    children: [
      {
        path: "sucursales",
        name: "AdministracionSucursales",
        component: () => import("@/views/administracion/SucursalesView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Sucursales",
          breadcrumb: "Sucursales"
        },
      },
      {
        path: "departamentos",
        name: "AdministracionDepartamentos",
        component: () => import("@/views/administracion/DepartamentosView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Departamentos",
          breadcrumb: "Departamentos"
         },
      },
      {
        path: "puestos",
        name: "AdministracionPuestos",
        component: () => import("@/views/administracion/PuestosView.vue"),
        meta: { 
          requiresAuth: true,
          viewDesc: "Puestos",
          breadcrumb: "Puestos"
         },
      },
      {
        path: "empresas",
        name: "AdministracionEmpresas",
        component: () => import("@/views/administracion/EmpresasView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Empleados", 
          breadcrumb: "Empleados" },
      },
      {
        path: "empleados",
        name: "AdministracionEmpleados",
        component: () => import("@/views/administracion/EmpleadosView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Empleados",
          breadcrumb: "Empleados"
        },
      },

      {
        path: "vehiculos",
        name: "AdministracionVehiculos",
        component: () => import("@/views/administracion/VehiculosView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Catálogos Vehicular",
          breadcrumb: "Catálogos Vehicular"},
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
            meta: { 
              requiresAuth: true, 
              viewDesc: "Marcas", 
              breadcrumb: "Marcas" 
            },
          },
          {
            path: "submarcas",
            name: "AdministracionVehiculosSubmarcas",
            component: () =>
              import("@/views/administracion/vehiculos/SubmarcasView.vue"),
            meta: { 
              requiresAuth: true, 
              viewDesc: "Submarcas",
              breadcrumb: "Submarcas"
            },
          },
          {
            path: "modelos",
            name: "AdministracionVehiculosModelos",
            component: () =>
              import("@/views/administracion/vehiculos/ModelosView.vue"),
            meta: { 
              requiresAuth: true, 
              viewDesc: "Modelos",
              breadcrumb: "Modelos"
             },
          },
          {
            path: "combustibles",
            name: "AdministracionVehiculosCombustibles",
            component: () =>
              import("@/views/administracion/vehiculos/CombustiblesView.vue"),
            meta: { 
              requiresAuth: true, 
              viewDesc: "Combustibles", 
              breadcrumb: "Combustibles" },
          },
          {
            path: "catalogo",
            name: "AdministracionVehiculosCatalogo",
            component: () =>
              import("@/views/administracion/vehiculos/VehiculosCatalogoView.vue"),
            meta: { 
              requiresAuth: true, 
              viewDesc: "Vehículos",
              breadcrumb: "Vehículos"
             },
          },
          {
            path: "asignar-chofer",
            name: "AdministracionVehiculosAsignarChofer",
            component: () =>
              import("@/views/administracion/vehiculos/AsignarChoferView.vue"),
            meta: { 
              requiresAuth: true, 
              viewDesc: "Asignación de Chofer",
              breadcrumb: "Asignación de Chofer"
             },
          },
        ],
      },

      {
        path: "usuarios",
        name: "AdministracionUsuarios",
        component: () => import("@/views/administracion/UsuariosView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Usuarios",
          breadcrumb: "Usuarios"
        },
      },
      {
        path: "perfiles",
        name: "AdministracionPerfiles",
        component: () => import("@/views/administracion/PerfilesView.vue"),
        meta: { 
          requiresAuth: true, 
          viewDesc: "Perfiles",
          breadcrumb: "Perfiles"
        },
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