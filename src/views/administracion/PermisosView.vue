<template>
  <div class="permisos-view">
    <section class="hero">
      <div class="hero__content">
        <div class="hero__eyebrow">Administración</div>
        <h1 class="hero__title">Permisos por perfil</h1>
        <p class="hero__subtitle">
          Administra los accesos del sistema por módulo y opción para cada perfil activo.
        </p>
      </div>

      <div class="hero__selector">
        <label for="perfil">Perfil</label>
        <select id="perfil" v-model="idPerfil" @change="loadPermisos">
          <option value="">SELECCIONA UN PERFIL</option>
          <option
            v-for="perfil in perfiles"
            :key="perfil.id"
            :value="perfil.id"
          >
            {{ perfil.nombre }}
          </option>
        </select>
      </div>
    </section>

    <section v-if="loading" class="state-card">
      <div class="state-card__spinner"></div>
      <div class="state-card__text">Cargando permisos...</div>
    </section>

    <section v-else-if="!idPerfil" class="state-card">
      <div class="state-card__icon">🔐</div>
      <div class="state-card__title">Selecciona un perfil</div>
      <div class="state-card__text">
        Elige un perfil para consultar y administrar sus permisos.
      </div>
    </section>

    <section v-else-if="permisosAgrupados.length" class="modules-grid">
      <article
        v-for="modulo in permisosAgrupados"
        :key="modulo.id_modulo"
        class="module-card"
      >
        <header class="module-card__header">
          <div>
            <h2 class="module-card__title">{{ modulo.modulo }}</h2>
            <p class="module-card__count">
              {{ modulo.opciones.length }}
              {{ modulo.opciones.length === 1 ? "opción" : "opciones" }}
            </p>
          </div>
        </header>

        <div class="table-wrap">
          <table class="permisos-table">
            <thead>
              <tr>
                <th>Opción</th>
                <th>Ruta</th>
                <th class="th-center">Acceso</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="opcion in modulo.opciones" :key="opcion.id_opcion">
                <td>
                  <div class="cell-title">{{ opcion.opcion }}</div>
                </td>
                <td>
                  <span class="ruta-badge">{{ opcion.ruta }}</span>
                </td>
                <td class="td-center">
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="toBool(opcion.permitido)"
                      @change="togglePermiso(opcion, $event)"
                    />
                    <span class="slider"></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <section v-else class="state-card">
      <div class="state-card__icon">📂</div>
      <div class="state-card__title">Sin permisos para mostrar</div>
      <div class="state-card__text">
        Este perfil no tiene opciones disponibles o no se encontraron registros.
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import permisosService from "@/services/permisos.service.js";

const perfiles = ref([]);
const permisos = ref([]);
const idPerfil = ref("");
const loading = ref(false);

onMounted(async () => {
  await loadPerfiles();
});

async function loadPerfiles() {
  try {
    const resp = await permisosService.getPerfiles();
    perfiles.value = resp?.data || [];
  } catch (error) {
    console.error(error);
    alert(error?.message || "Error al cargar perfiles");
  }
}

async function loadPermisos() {
  if (!idPerfil.value) {
    permisos.value = [];
    return;
  }

  try {
    loading.value = true;
    const resp = await permisosService.getPermisosByPerfil(idPerfil.value);
    permisos.value = resp?.data || [];
  } catch (error) {
    console.error(error);
    alert(error?.message || "Error al cargar permisos");
  } finally {
    loading.value = false;
  }
}

const permisosAgrupados = computed(() => {
  const grupos = [];

  for (const item of permisos.value) {
    let modulo = grupos.find((x) => x.id_modulo === item.id_modulo);

    if (!modulo) {
      modulo = {
        id_modulo: item.id_modulo,
        modulo: item.modulo,
        opciones: [],
      };
      grupos.push(modulo);
    }

    modulo.opciones.push(item);
  }

  return grupos;
});

function toBool(valor) {
  return valor === true || valor === 1;
}

async function togglePermiso(opcion, event) {
  const activo = event.target.checked ? 1 : 0;

  try {
    await permisosService.savePermiso({
      id_perfil: Number(idPerfil.value),
      id_opcion: Number(opcion.id_opcion),
      activo,
    });

    opcion.permitido = activo;
  } catch (error) {
    console.error(error);
    event.target.checked = !event.target.checked;
    alert(error?.message || "Error al guardar permiso");
  }
}
</script>

<style scoped>
.permisos-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: var(--text-primary, #0f172a);
}

.hero {
  display: grid;
  grid-template-columns: 1.5fr minmax(280px, 360px);
  gap: 18px;
  align-items: stretch;
}

.hero__content,
.hero__selector {
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--surface-card, rgba(255, 255, 255, 0.08));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 22px;
  backdrop-filter: blur(10px);
}

.hero__eyebrow {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary, #2563eb);
  margin-bottom: 10px;
}

.hero__title {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
}

.hero__subtitle {
  margin: 10px 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary, rgba(15, 23, 42, 0.75));
  max-width: 720px;
}

.hero__selector {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.hero__selector label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
}

.hero__selector select {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--surface-elevated, rgba(255, 255, 255, 0.16));
  color: var(--text-primary, #0f172a);
  padding: 0 14px;
  outline: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.hero__selector select:focus {
  border-color: var(--primary, #2563eb);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.modules-grid {
  display: grid;
  gap: 20px;
}

.module-card {
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--surface-card, rgba(255, 255, 255, 0.08));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.module-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--glass-18, rgba(255, 255, 255, 0.18));
}

.module-card__title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.module-card__count {
  margin: 6px 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary, rgba(15, 23, 42, 0.75));
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.permisos-table {
  width: 100%;
  border-collapse: collapse;
}

.permisos-table thead th {
  text-align: left;
  padding: 14px 20px;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary, rgba(15, 23, 42, 0.75));
  background: var(--surface-elevated, rgba(255, 255, 255, 0.12));
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
}

.permisos-table tbody td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  vertical-align: middle;
}

.permisos-table tbody tr:last-child td {
  border-bottom: none;
}

.permisos-table tbody tr:nth-child(even) {
  background: var(--glass-18, rgba(255, 255, 255, 0.18));
}

.cell-title {
  font-weight: 700;
  color: var(--text-primary, #0f172a);
}

.ruta-badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--surface-elevated, rgba(255, 255, 255, 0.16));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  color: var(--text-secondary, rgba(15, 23, 42, 0.82));
  font-size: 0.9rem;
  word-break: break-all;
}

.th-center,
.td-center {
  text-align: center !important;
}

.state-card {
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--surface-card, rgba(255, 255, 255, 0.08));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 32px 20px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.state-card__icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.state-card__title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
  margin-bottom: 8px;
}

.state-card__text {
  color: var(--text-secondary, rgba(15, 23, 42, 0.75));
}

.state-card__spinner {
  width: 34px;
  height: 34px;
  margin: 0 auto 12px;
  border-radius: 999px;
  border: 3px solid var(--border-color, rgba(255, 255, 255, 0.18));
  border-top-color: var(--primary, #2563eb);
  animation: spin 0.8s linear infinite;
}

.switch {
  position: relative;
  display: inline-flex;
  width: 52px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: absolute;
  inset: 0;
  cursor: pointer;
  border-radius: 999px;
  background: var(--surface-elevated, rgba(255, 255, 255, 0.16));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  transition: all 0.2s ease;
}

.slider::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--text-primary, #0f172a);
  transition: transform 0.2s ease, background 0.2s ease;
}

.switch input:checked + .slider {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
}

.switch input:checked + .slider::before {
  transform: translateX(22px);
  background: #ffffff;
}

.switch input:focus + .slider {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .permisos-table thead th,
  .permisos-table tbody td {
    padding: 14px 12px;
  }
}

@media (max-width: 640px) {
  .hero__title {
    font-size: 1.6rem;
  }

  .module-card__header {
    padding: 16px;
  }

  .ruta-badge {
    font-size: 0.82rem;
  }
}
</style>