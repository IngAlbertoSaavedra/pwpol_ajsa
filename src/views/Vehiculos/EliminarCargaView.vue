<template>
  <section class="eliminar-carga">
    <div class="page-header">
      <h1>Eliminar Cargas de Combustible</h1>
      <p>Busca la unidad, selecciona las cargas a eliminar y captura el motivo de baja.</p>
    </div>

    <div class="search-card">
      <div class="search-options">
        <label class="radio-option">
          <input v-model="tipoBusqueda" type="radio" value="clave" />
          <span>Clave Vehículo</span>
        </label>

        <label class="radio-option">
          <input v-model="tipoBusqueda" type="radio" value="placa" />
          <span>Placa</span>
        </label>
      </div>

      <div class="search-row">
        <div class="search-field">
          <label>{{ labelBusqueda }}</label>
          <input
            v-model.trim="criterio"
            type="text"
            :placeholder="placeholderBusqueda"
            maxlength="15"
            @keyup.enter="buscar"
          />
        </div>

        <div class="search-actions">
          <button class="btn btn-primary" :disabled="loadingBusqueda" @click="buscar">
            {{ loadingBusqueda ? "Buscando..." : "Buscar" }}
          </button>

          <button class="btn btn-secondary" :disabled="loadingBusqueda || loadingEliminar" @click="limpiarTodo">
            Limpiar
          </button>
        </div>
      </div>

      <div v-if="mensajeBusqueda" class="alert" :class="unidadEncontrada ? 'alert-success' : 'alert-warning'">
        {{ mensajeBusqueda }}
      </div>
    </div>

    <div class="content-card">
      <div class="section-title">
        <h2>Unidad y Chofer</h2>
      </div>

      <div class="vehicle-grid">
        <div class="field">
          <span class="field-label">Clave</span>
          <span class="field-value">{{ vehiculo?.clave || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Placa</span>
          <span class="field-value">{{ vehiculo?.placa || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Nomina</span>
          <span class="field-value">{{ empleado?.nomina || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Chofer</span>
          <span class="field-value">{{ empleado?.chofer || "-" }}</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div v-if="mensajeEliminar" class="alert" :class="eliminadoOk ? 'alert-success' : 'alert-warning'">
        {{ mensajeEliminar }}
      </div>

      <div class="delete-layout">
        <div class="table-panel">
          <div class="section-title">
            <h2>Histórico de Cargas</h2>
          </div>

          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="cell-check">Seleccionar</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Odómetro</th>
                  <th>Recorrido</th>
                  <th>Litros</th>
                  <th>Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!cargas.length">
                  <td colspan="7" class="empty-cell">Sin cargas registradas</td>
                </tr>

                <tr v-for="item in cargas" :key="item.id">
                  <td class="cell-check">
                    <input
                      type="checkbox"
                      :value="item.id"
                      v-model="idsSeleccionados"
                      :disabled="loadingEliminar"
                    />
                  </td>
                  <td>{{ formatDate(item.fecha) }}</td>
                  <td>{{ formatMoney(item.importe) }}</td>
                  <td>{{ formatNumber(item.odometro) }}</td>
                  <td>{{ formatNumber(item.recorrido) }}</td>
                  <td>{{ formatDecimal(item.litros) }}</td>
                  <td>{{ formatDecimal(item.rendimiento) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="side-panel">
          <div class="section-title">
            <h2>Modo de Usar</h2>
          </div>

          <div class="help-box">
            <p>1. Escribe la clave de la unidad o la placa y presiona buscar.</p>
            <p>2. Activa el check de las cargas que se van a eliminar.</p>
            <p>3. Escribe el motivo por el que se autoriza la baja.</p>
            <p>4. Haz clic en eliminar cargas seleccionadas.</p>
          </div>

          <div class="counter-box">
            <span class="field-label">Cargas Seleccionadas</span>
            <span class="counter-value">{{ idsSeleccionados.length }}</span>
          </div>

          <div class="form-field">
            <label>Motivo (requerido)</label>
            <textarea
              v-model.trim="comentario"
              rows="5"
              maxlength="250"
              placeholder="¿Por qué se deben borrar?"
              :disabled="!vehiculo || loadingEliminar"
            />
          </div>

          <div class="chars-box">
            Caracteres disponibles
            <strong>{{ caracteresDisponibles }}</strong>
          </div>

          <button
            class="btn btn-danger"
            :disabled="!puedeEliminar || loadingEliminar"
            @click="eliminar"
          >
            {{ loadingEliminar ? "Eliminando..." : "Eliminar Cargas Seleccionadas" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import authService from "@/services/auth.service.js";

const tipoBusqueda = ref("clave");
const criterio = ref("");
const loadingBusqueda = ref(false);
const loadingEliminar = ref(false);

const mensajeBusqueda = ref("");
const mensajeEliminar = ref("");
const unidadEncontrada = ref(false);
const eliminadoOk = ref(false);

const empleado = ref(null);
const vehiculo = ref(null);
const cargas = ref([]);

const idsSeleccionados = ref([]);
const comentario = ref("");

const labelBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Clave de Vehículo" : "Placa"
);

const placeholderBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Número económico" : "Placa de la unidad"
);

const caracteresDisponibles = computed(() => 250 - comentario.value.length);

const usuarioLogeado = computed(() => {
  const session = authService.getSession?.() || null;

  return (
    authService.userRef?.value ||
    session?.userusuario ||
    session?.user?.usuario ||
    ""
  );
});

const puedeEliminar = computed(() => {
  return (
    !!vehiculo.value?.id &&
    idsSeleccionados.value.length > 0 &&
    comentario.value.trim().length >= 15 &&
    !!usuarioLogeado.value
  );
});

function normalizarTexto(valor) {
  return String(valor ?? "").trim().toUpperCase();
}

function limpiarTodo() {
  tipoBusqueda.value = "clave";
  criterio.value = "";
  mensajeBusqueda.value = "";
  mensajeEliminar.value = "";
  unidadEncontrada.value = false;
  eliminadoOk.value = false;
  empleado.value = null;
  vehiculo.value = null;
  cargas.value = [];
  idsSeleccionados.value = [];
  comentario.value = "";
}

async function buscar() {
  const valor = normalizarTexto(criterio.value);

  mensajeBusqueda.value = "";
  mensajeEliminar.value = "";
  unidadEncontrada.value = false;
  eliminadoOk.value = false;
  empleado.value = null;
  vehiculo.value = null;
  cargas.value = [];
  idsSeleccionados.value = [];
  comentario.value = "";

  if (!valor) {
    mensajeBusqueda.value =
      tipoBusqueda.value === "clave"
        ? "Debes capturar la clave del vehículo"
        : "Debes capturar la placa";
    return;
  }

  loadingBusqueda.value = true;

  try {
    const params = new URLSearchParams();
    params.set(tipoBusqueda.value, valor);

    const response = await fetch(`/api/cargascombustible/eliminar/consulta?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensajeBusqueda.value = data.msg || "Unidad no encontrada";
      return;
    }

    empleado.value = data.data.empleado ?? null;
    vehiculo.value = data.data.vehiculo ?? null;
    cargas.value = Array.isArray(data.data.cargas) ? data.data.cargas : [];
    unidadEncontrada.value = true;
    mensajeBusqueda.value = "Unidad encontrada";
  } catch (error) {
    console.error(error);
    mensajeBusqueda.value = "Error consultando la unidad";
  } finally {
    loadingBusqueda.value = false;
  }
}

function validarAntesDeEliminar() {
  if (!vehiculo.value?.id) {
    return "Primero debes consultar una unidad válida";
  }

  if (!idsSeleccionados.value.length) {
    return "Debes seleccionar al menos una carga";
  }

  if (comentario.value.trim().length < 15) {
    return "El motivo es obligatorio y debe tener al menos 15 caracteres";
  }

  if (!usuarioLogeado.value) {
    return "No se encontró el usuario logeado";
  }

  return "";
}

async function eliminar() {
  mensajeEliminar.value = "";
  eliminadoOk.value = false;

  const error = validarAntesDeEliminar();

  if (error) {
    mensajeEliminar.value = error;
    return;
  }

  loadingEliminar.value = true;

  try {
    const response = await fetch("/api/cargascombustible/eliminar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: idsSeleccionados.value,
        comentario: comentario.value,
        usuario: usuarioLogeado.value,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensajeEliminar.value = data.msg || "No se pudieron eliminar las cargas";
      return;
    }

    const seleccionadas = new Set(idsSeleccionados.value.map((id) => Number(id)));

    cargas.value = cargas.value.filter((item) => !seleccionadas.has(Number(item.id)));
    idsSeleccionados.value = [];
    comentario.value = "";
    eliminadoOk.value = true;
    mensajeEliminar.value = data.msg || "Cargas eliminadas correctamente";
  } catch (error) {
    console.error(error);
    mensajeEliminar.value = "Error eliminando cargas";
  } finally {
    loadingEliminar.value = false;
  }
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("es-MX");
}

function formatNumber(value) {
  const number = Number(value || 0);
  return number.toLocaleString("es-MX");
}

function formatDecimal(value) {
  const number = Number(value || 0);

  return number.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
</script>

<style scoped>
.eliminar-carga {
  display: grid;
  gap: 16px;
}

.page-header h1 {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: var(--muted);
}

.search-card,
.content-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.search-options {
  display: flex;
  gap: 18px;
  margin-bottom: 14px;
}

.radio-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
}

.search-field {
  width: 30%;
  min-width: 280px;
  max-width: 420px;
  flex: 0 0 auto;
}

.search-field label,
.form-field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.search-field input,
.form-field textarea {
  width: 100%;
  border: 1px solid var(--input-border);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  background: var(--surface);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-field input {
  height: 46px;
  padding: 0 14px;
}

.search-field input::placeholder,
.form-field textarea::placeholder {
  color: var(--input-placeholder);
}

.search-field input:focus,
.form-field textarea:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px var(--input-focus-shadow);
}

.search-actions {
  display: flex;
  gap: 10px;
}

.btn {
  height: 40px;
  border: 0;
  border-radius: 10px;
  padding: 0 16px;
  font-weight: 700;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
}

.btn-danger {
  background: var(--danger);
  color: var(--btn-primary-text);
}

.alert {
  margin-top: 12px;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
}

.alert-success {
  background: var(--alert-success-bg);
  color: var(--alert-success-text);
  border: 1px solid var(--alert-success-border);
}

.alert-warning {
  background: var(--alert-warning-bg);
  color: var(--alert-warning-text);
  border: 1px solid var(--alert-warning-border);
}

.section-title {
  margin-bottom: 12px;
}

.section-title h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.vehicle-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 52px;
}

.field-label {
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 700;
}

.field-value {
  font-size: 1rem;
  color: var(--text);
  font-weight: 600;
  word-break: break-word;
}

.delete-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 360px);
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border: 1px solid var(--border);
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background: var(--table-header-bg);
  font-size: 0.9rem;
}

.cell-check {
  width: 110px;
  text-align: center;
}

.empty-cell {
  text-align: center;
  color: var(--muted);
  font-weight: 600;
}

.side-panel {
  display: grid;
  gap: 14px;
  align-content: start;
}

.help-box,
.counter-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
}

.help-box p {
  margin: 0 0 10px;
}

.help-box p:last-child {
  margin-bottom: 0;
}

.counter-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.counter-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
}

.chars-box {
  text-align: right;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .delete-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .search-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
  }

  .search-field {
    width: 100%;
    max-width: none;
  }
}
</style>