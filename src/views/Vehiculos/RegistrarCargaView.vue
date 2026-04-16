<template>
  <section class="registro-carga">
    <div class="page-header">
      <h1>Registrar Carga de Combustible</h1>
      <p>Busca la unidad por clave de vehículo o por placa y registra la carga.</p>
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

          <button class="btn btn-secondary" :disabled="loadingBusqueda || loadingGuardado" @click="limpiarTodo">
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
          <span class="field-label">Último Odómetro</span>
          <span class="field-value">{{ formatNumber(vehiculo?.ultimo_odometro) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Rend. Permitido Mínimo</span>
          <span class="field-value">{{ formatDecimal(vehiculo?.rend_minimo) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Rend. Permitido Máximo</span>
          <span class="field-value">{{ formatDecimal(vehiculo?.rend_maximo) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Promedio Histórico</span>
          <span class="field-value">{{ formatDecimal(vehiculo?.rendimiento_promedio) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Rend. Histórico Mínimo</span>
          <span class="field-value">{{ formatDecimal(vehiculo?.rendimiento_minimo) }}</span>
        </div>

        <div class="field">
          <span class="field-label">Rend. Histórico Máximo</span>
          <span class="field-value">{{ formatDecimal(vehiculo?.rendimiento_maximo) }}</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="section-title">
        <h2>Registro de Carga</h2>
      </div>

      <div v-if="mensajeGuardado" class="alert" :class="guardadoOk ? 'alert-success' : 'alert-warning'">
        {{ mensajeGuardado }}
      </div>

      <div class="form-grid">
        <div class="form-field">
          <label>Fecha</label>
          <input v-model="form.fecha" type="date" :disabled="!vehiculo || loadingGuardado" />
        </div>

        <div class="form-field">
          <label>Hora</label>
          <input v-model="form.hora" type="time" step="60" :disabled="!vehiculo || loadingGuardado" />
        </div>

        <div class="form-field">
          <label>Odómetro</label>
          <input
            v-model="form.odometro"
            type="number"
            min="0"
            step="1"
            placeholder="Odómetro actual"
            :disabled="!vehiculo || loadingGuardado"
          />
        </div>

        <div class="form-field">
          <label>Litros</label>
          <input
            v-model="form.litros"
            type="number"
            min="0"
            step="0.01"
            placeholder="Litros cargados"
            :disabled="!vehiculo || loadingGuardado"
          />
        </div>

        <div class="form-field">
          <label>Importe</label>
          <input
            v-model="form.importe"
            type="number"
            min="0"
            step="0.01"
            placeholder="Importe pagado"
            :disabled="!vehiculo || loadingGuardado"
          />
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <span class="summary-label">Precio por litro</span>
          <span class="summary-value">{{ formatMoney(precioLitroCalculado) }}</span>
        </div>

        <div class="summary-card">
          <span class="summary-label">Recorrido</span>
          <span class="summary-value">{{ formatNumber(recorridoCalculado) }}</span>
        </div>

        <div class="summary-card">
          <span class="summary-label">Rendimiento</span>
          <span class="summary-value">{{ formatDecimal(rendimientoCalculado) }}</span>
        </div>
      </div>

      <div class="action-row">
        <button class="btn btn-primary" :disabled="!vehiculo || loadingGuardado" @click="guardar">
          {{ loadingGuardado ? "Guardando..." : "Guardar Carga" }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const tipoBusqueda = ref("clave");
const criterio = ref("");
const loadingBusqueda = ref(false);
const loadingGuardado = ref(false);

const mensajeBusqueda = ref("");
const mensajeGuardado = ref("");
const unidadEncontrada = ref(false);
const guardadoOk = ref(false);

const vehiculo = ref(null);

const form = ref({
  fecha: getFechaHoy(),
  hora: getHoraActual(),
  odometro: "",
  litros: "",
  importe: "",
});

const labelBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Clave de Vehículo" : "Placa"
);

const placeholderBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Número económico" : "Placa de la unidad"
);

const ultimoOdometro = computed(() => Number(vehiculo.value?.ultimo_odometro || 0));
const odometroCapturado = computed(() => Number(form.value.odometro || 0));
const litrosCapturados = computed(() => Number(form.value.litros || 0));
const importeCapturado = computed(() => Number(form.value.importe || 0));

const precioLitroCalculado = computed(() => {
  if (!litrosCapturados.value || !importeCapturado.value) return 0;
  return importeCapturado.value / litrosCapturados.value;
});

const recorridoCalculado = computed(() => {
  if (!odometroCapturado.value || odometroCapturado.value <= ultimoOdometro.value) return 0;
  return odometroCapturado.value - ultimoOdometro.value;
});

const rendimientoCalculado = computed(() => {
  if (!recorridoCalculado.value || !litrosCapturados.value) return 0;
  return recorridoCalculado.value / litrosCapturados.value;
});

function getFechaHoy() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getHoraActual() {
  const today = new Date();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizarTexto(valor) {
  return String(valor ?? "").trim().toUpperCase();
}

function limpiarFormulario() {
  form.value = {
    fecha: getFechaHoy(),
    hora: getHoraActual(),
    odometro: "",
    litros: "",
    importe: "",
  };
}

function limpiarTodo() {
  criterio.value = "";
  vehiculo.value = null;
  unidadEncontrada.value = false;
  guardadoOk.value = false;
  mensajeBusqueda.value = "";
  mensajeGuardado.value = "";
  tipoBusqueda.value = "clave";
  limpiarFormulario();
}

async function buscar() {
  const valor = normalizarTexto(criterio.value);

  mensajeBusqueda.value = "";
  mensajeGuardado.value = "";
  unidadEncontrada.value = false;
  guardadoOk.value = false;
  vehiculo.value = null;
  limpiarFormulario();

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

    const response = await fetch(`/api/cargascombustible/consulta?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensajeBusqueda.value = data.msg || "Unidad no encontrada";
      return;
    }

    vehiculo.value = data.data ?? null;
    unidadEncontrada.value = true;
    mensajeBusqueda.value = "Unidad encontrada";
  } catch (error) {
    console.error(error);
    mensajeBusqueda.value = "Error consultando la unidad";
  } finally {
    loadingBusqueda.value = false;
  }
}

function validarAntesDeGuardar() {
  if (!vehiculo.value?.id) return "Primero debes buscar una unidad válida";
  if (!form.value.fecha) return "La fecha es obligatoria";
  if (!form.value.hora) return "La hora es obligatoria";
  if (!form.value.odometro) return "El odómetro es obligatorio";
  if (!form.value.litros) return "Los litros son obligatorios";
  if (!form.value.importe) return "El importe es obligatorio";
  if (Number(form.value.odometro) <= 0) return "El odómetro debe ser mayor a cero";
  if (Number(form.value.litros) <= 0) return "Los litros deben ser mayores a cero";
  if (Number(form.value.importe) <= 0) return "El importe debe ser mayor a cero";

  if (ultimoOdometro.value > 0 && Number(form.value.odometro) <= ultimoOdometro.value) {
    return "El odómetro debe ser mayor al último registrado";
  }

  const rendMin = Number(vehiculo.value?.rend_minimo || 0);
  const rendMax = Number(vehiculo.value?.rend_maximo || 0);

  if (ultimoOdometro.value > 0 && rendimientoCalculado.value > 0) {
    if (rendimientoCalculado.value < rendMin || rendimientoCalculado.value > rendMax) {
      return "El rendimiento calculado está fuera del rango permitido. No se puede guardar la carga, comuníquese a sistemas.";
    }
  }

  return "";
}

async function guardar() {
  mensajeGuardado.value = "";
  guardadoOk.value = false;

  const error = validarAntesDeGuardar();

  if (error) {
    mensajeGuardado.value = error;
    return;
  }

  loadingGuardado.value = true;

  try {
    const payload = {
      id_vehiculo: vehiculo.value.id,
      clave: vehiculo.value.clave,
      placa: vehiculo.value.placa,
      fecha: form.value.fecha,
      hora: form.value.hora,
      odometro: Number(form.value.odometro),
      litros: Number(form.value.litros),
      importe: Number(form.value.importe),
    };

    const response = await fetch("/api/cargascombustible", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensajeGuardado.value = data.msg || "No se pudo registrar la carga";
      return;
    }

    mensajeGuardado.value = data.msg || "Carga registrada correctamente";
    guardadoOk.value = true;

    vehiculo.value = {
      ...vehiculo.value,
      ultimo_odometro: Number(payload.odometro),
    };

    limpiarFormulario();
  } catch (error) {
    console.error(error);
    mensajeGuardado.value = "Error registrando la carga";
  } finally {
    loadingGuardado.value = false;
  }
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
.registro-carga {
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
.form-field input {
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

.search-field input::placeholder,
.form-field input::placeholder {
  color: var(--input-placeholder);
}

.search-field input:focus,
.form-field input:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px var(--input-focus-shadow);
}

.search-actions,
.action-row {
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
.form-grid,
.summary-grid {
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

.field-label,
.summary-label {
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 700;
}

.field-value,
.summary-value {
  font-size: 1rem;
  color: var(--text);
  font-weight: 600;
  word-break: break-word;
}

.summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

@media (max-width: 768px) {
  .search-actions,
  .action-row {
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