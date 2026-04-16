<template>
  <section class="consulta-vehiculo">
    <div class="page-header">
      <h1>Consulta de Vehículos</h1>
      <p>Consulta una unidad por clave de vehículo o por placa.</p>
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
          <button class="btn btn-primary" :disabled="loading" @click="buscar">
            {{ loading ? "Buscando..." : "Buscar" }}
          </button>

          <button class="btn btn-secondary" :disabled="loading" @click="limpiar">
            Limpiar
          </button>
        </div>
      </div>

      <div v-if="mensaje" class="alert" :class="encontrado ? 'alert-success' : 'alert-warning'">
        {{ mensaje }}
      </div>
    </div>

    <div class="content-card">
      <div class="section-title">
        <h2>Datos del Vehículo</h2>
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
          <span class="field-label">Sucursal</span>
          <span class="field-value">{{ vehiculo?.sucursal || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Marca</span>
          <span class="field-value">{{ vehiculo?.marca || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Sub Marca</span>
          <span class="field-value">{{ vehiculo?.submarca || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Modelo</span>
          <span class="field-value">{{ vehiculo?.modelo || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Combustible</span>
          <span class="field-value">{{ vehiculo?.combustible || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Kilometraje Inicial</span>
          <span class="field-value">{{ formatNumber(kilometrajeInicial) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Último Kms registrado</span>
          <span class="field-value">{{ formatNumber(ultimoKilometraje) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Distancia</span>
          <span class="field-value">{{ formatNumber(distanciaRecorrida) }}</span>
        </div>

        <div class="field">
          <span class="field-label">R. Mín.</span>
          <span class="field-value">{{ formatNumber(vehiculo?.rend_minimo) }}</span>
        </div>

        <div class="field">
          <span class="field-label">R. Máx.</span>
          <span class="field-value">{{ formatNumber(vehiculo?.rend_maximo) }}</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: tabActiva === 'cargas' }"
          @click="tabActiva = 'cargas'"
        >
          Histórico de Cargas
        </button>

        <button
          class="tab-btn"
          :class="{ active: tabActiva === 'asignaciones' }"
          @click="tabActiva = 'asignaciones'"
        >
          Histórico de Asignaciones
        </button>
      </div>

      <div v-if="tabActiva === 'cargas'" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Precio</th>
              <th>Odómetro</th>
              <th>Recorrido</th>
              <th>Litros</th>
              <th>Rendimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!historicoCargas.length">
              <td colspan="7" class="empty-cell">Sin cargas registradas</td>
            </tr>

            <tr v-for="item in historicoCargas" :key="item.id">
              <td>{{ formatDate(item.fecha) }}</td>
              <td>{{ formatMoney(item.importe) }}</td>
              <td>{{ formatMoney(item.precio) }}</td>
              <td>{{ formatNumber(item.odometro) }}</td>
              <td>{{ formatNumber(item.recorrido) }}</td>
              <td>{{ formatDecimal(item.litros) }}</td>
              <td>{{ formatDecimal(item.rendimiento) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Odómetro</th>
              <th>Chofer</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!historicoAsignaciones.length">
              <td colspan="5" class="empty-cell">Sin asignaciones registradas</td>
            </tr>

            <tr v-for="item in historicoAsignaciones" :key="item.id">
              <td>{{ formatDate(item.fecha) }}</td>
              <td>{{ formatHora(item.hora) }}</td>
              <td>{{ formatNumber(item.odometro) }}</td>
              <td>{{ item.chofer || "-" }}</td>
              <td>{{ item.comentario || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="content-card">
      <div class="section-title">
        <h2>Chofer Asignado</h2>
      </div>

      <div class="driver-grid">
        <div class="field">
          <span class="field-label">Chofer</span>
          <span class="field-value">{{ vehiculo?.chofer || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Licencia</span>
          <span class="field-value">{{ vehiculo?.licencia || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Vencimiento</span>
          <span class="field-value">{{ formatDate(vehiculo?.fecha_vencimiento) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Días para Renovar</span>
          <span class="field-value">{{ formatNumber(vehiculo?.DiasRenova) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const tipoBusqueda = ref("clave");
const criterio = ref("");
const loading = ref(false);
const mensaje = ref("");
const encontrado = ref(false);

const vehiculo = ref(null);
const historicoCargas = ref([]);
const historicoAsignaciones = ref([]);
const tabActiva = ref("cargas");

const labelBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Clave de Vehículo" : "Placa"
);

const placeholderBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Número económico" : "Placa de la unidad"
);

const kilometrajeInicial = computed(() => {
  if (!historicoCargas.value.length) return 0;

  const ultimaPosicion = historicoCargas.value.length - 1;
  return Number(historicoCargas.value[ultimaPosicion]?.odometro || 0);
});

const ultimoKilometraje = computed(() => {
  return Number(vehiculo.value?.odometro || 0);
});

const distanciaRecorrida = computed(() => {
  const inicial = Number(kilometrajeInicial.value || 0);
  const ultimo = Number(ultimoKilometraje.value || 0);

  if (!inicial || !ultimo || ultimo < inicial) return 0;

  return ultimo - inicial;
});

function normalizarTexto(valor) {
  return String(valor ?? "").trim().toUpperCase();
}

function limpiarDatos() {
  vehiculo.value = null;
  historicoCargas.value = [];
  historicoAsignaciones.value = [];
  tabActiva.value = "cargas";
}

function limpiar() {
  criterio.value = "";
  mensaje.value = "";
  encontrado.value = false;
  limpiarDatos();
}

async function buscar() {
  const valor = normalizarTexto(criterio.value);

  if (!valor) {
    mensaje.value = tipoBusqueda.value === "clave"
      ? "Debes capturar la clave del vehículo"
      : "Debes capturar la placa";
    encontrado.value = false;
    limpiarDatos();
    return;
  }

  loading.value = true;
  mensaje.value = "";
  encontrado.value = false;
  limpiarDatos();

  try {
    const params = new URLSearchParams();
    params.set(tipoBusqueda.value, valor);

    const response = await fetch(`/api/vehiculos/consulta?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensaje.value = data.msg || "Unidad no encontrada";
      encontrado.value = false;
      limpiarDatos();
      return;
    }

    vehiculo.value = data.data.vehiculo ?? null;
    historicoCargas.value = Array.isArray(data.data.historico_cargas)
      ? data.data.historico_cargas
      : [];
    historicoAsignaciones.value = Array.isArray(data.data.historico_asignaciones)
      ? data.data.historico_asignaciones
      : [];

    mensaje.value = "Unidad encontrada";
    encontrado.value = true;
    tabActiva.value = "cargas";
  } catch (error) {
    console.error(error);
    mensaje.value = "Error consultando la unidad";
    encontrado.value = false;
    limpiarDatos();
  } finally {
    loading.value = false;
  }
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("es-MX");
}

function formatHora(value) {
  if (!value) return "-";

  const texto = String(value).trim();

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(texto)) {
    return texto.length >= 5 ? texto.slice(0, 5) : texto;
  }

  const date = new Date(texto);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return texto;
}

function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
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
</script>

<style scoped>
  .consulta-vehiculo {
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

  .search-field label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
  }

  .search-field input {
    width: 100%;
    height: 46px;
    border: 1px solid var(--input-border);
    border-radius: 12px;
    padding: 0 14px;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text);
    background: var(--surface);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .search-field input::placeholder {
    color: var(--input-placeholder);
  }

  .search-field input:focus {
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

  .vehicle-grid,
  .driver-grid {
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
  }

  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .tab-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .tab-btn.active {
    background: var(--btn-primary-bg);
    border-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
  }

  .table-wrap {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 780px;
  }

  .data-table th,
  .data-table td {
    border: 1px solid var(--border);
    padding: 10px 12px;
    text-align: left;
  }

  .data-table th {
    background: var(--table-header-bg);
    font-size: 0.9rem;
  }

  .empty-cell {
    text-align: center;
    color: var(--muted);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .search-actions {
      width: 100%;
    }

    .btn {
      flex: 1;
    }
  }
</style>