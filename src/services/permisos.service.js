import { apiFetch } from "@/services/api.js";

const permisosService = {
  async getPerfiles() {
    return await apiFetch("/permisos/perfiles");
  },

  async getModulos() {
    return await apiFetch("/permisos/modulos");
  },

  async getPermisosByPerfil(idPerfil) {
    return await apiFetch(`/permisos/${idPerfil}`);
  },

  async savePermiso(payload) {
    return await apiFetch("/permisos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export default permisosService;