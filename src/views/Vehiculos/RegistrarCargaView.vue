<template>
  <section class="page">
    <div class="card">
      <div class="card__body">
        <div class="vehicle-header">
          <div class="clave-panel">
            <div class="clave-box">
              <div class="clave-label">Clave</div>
              <div class="clave-value">{{ vehiculo.clave || "—" }}</div>
            </div>

            <div class="clave-search">
              <label class="label" for="claveVehiculo">Clave de Vehículo</label>

              <div class="search-row">
                <input
                  id="claveVehiculo"
                  v-model.trim="claveInput"
                  type="text"
                  class="input"
                  :class="{ 'has-error': !!vehiculoError }"
                  placeholder="Ej. SYS-001"
                  :disabled="loadingVehiculo"
                  @keyup.enter="buscarVehiculo"
                />

                <button
                  type="button"
                  class="btn btn--secondary"
                  :disabled="!claveInput || loadingVehiculo"
                  @click="buscarVehiculo"
                >
                  <span v-if="loadingVehiculo" class="spinner"></span>
                  Buscar
                </button>
              </div>

              <p class="hint">
                Escribe la clave y presiona <strong>Enter</strong>.
              </p>
              <p v-if="vehiculoError" class="error">{{ vehiculoError }}</p>
            </div>
          </div>

          <div class="vehicle-data">
            <div class="kv">
              <div class="k">Placa</div>
              <div class="v">{{ vehiculo.placa || "—" }}</div>
            </div>

            <div class="kv">
              <div class="k">Último Km registrado</div>
              <div class="v">{{ formatInt(vehiculo.ultimoKm) }}</div>
            </div>

            <div class="kv">
              <div class="k">Rend. mín.</div>
              <div class="v">{{ formatNum(vehiculo.rendMin) }}</div>
            </div>

            <div class="kv">
              <div class="k">Rend. máx.</div>
              <div class="v">{{ formatNum(vehiculo.rendMax) }}</div>
            </div>

            <div class="kv">
              <div class="k">Rend. prom.</div>
              <div class="v">{{ formatNum(vehiculo.rendProm) }}</div>
            </div>

            <div class="kv">
              <div class="k">Recorrido Km</div>
              <div class="v">{{ formatNum(recorridoKm) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Información de la Carga</h3>
      </div>

      <div class="card__body">
        <div class="form-grid">
          <div class="field">
            <label class="label" for="fecha">Fecha <span class="req">*</span></label>
            <input
              id="fecha"
              v-model="form.fecha"
              type="date"
              class="input"
              :class="{ 'has-error': touched && !form.fecha }"
              :disabled="!vehiculoListo"
            />
            <p v-if="touched && !form.fecha" class="error">Campo requerido.</p>
          </div>

          <div class="field">
            <label class="label" for="hora">Hora</label>
            <input
              id="hora"
              v-model="form.hora"
              type="time"
              class="input"
              :disabled="!vehiculoListo"
            />
          </div>

          <div class="field">
            <label class="label" for="litros">Combustible (Litros) <span class="req">*</span></label>
            <input
              id="litros"
              v-model="form.litros"
              type="number"
              step="0.01"
              min="0"
              inputmode="decimal"
              class="input"
              :class="{ 'has-error': touched && !isPositive(form.litros) }"
              placeholder="0.00"
              :disabled="!vehiculoListo"
            />
            <p v-if="touched && !isPositive(form.litros)" class="error">Ingresa un valor mayor a cero.</p>
          </div>

          <div class="field">
            <label class="label" for="importe">Importe <span class="req">*</span></label>
            <input
              id="importe"
              v-model="form.importe"
              type="number"
              step="0.01"
              min="0"
              inputmode="decimal"
              class="input"
              :class="{ 'has-error': touched && !isPositive(form.importe) }"
              placeholder="0.00"
              :disabled="!vehiculoListo"
            />
            <p v-if="touched && !isPositive(form.importe)" class="error">Ingresa un valor mayor a cero.</p>
          </div>

          <div class="field">
            <label class="label" for="precioLitro">Precio x Litro</label>
            <input
              id="precioLitro"
              :value="formatNum(precioPorLitro)"
              type="text"
              class="input input--readonly"
              readonly
            />
          </div>

          <div class="field">
            <label class="label" for="kilometraje">Kilometraje (Actual) <span class="req">*</span></label>
            <input
              id="kilometraje"
              v-model="form.kilometraje"
              type="number"
              step="1"
              min="0"
              inputmode="numeric"
              class="input"
              :class="{ 'has-error': touched && !isPositiveInt(form.kilometraje) }"
              placeholder="Sin decimales"
              :disabled="!vehiculoListo"
            />
            <p v-if="touched && !isPositiveInt(form.kilometraje)" class="error">Ingresa un entero mayor a cero.</p>
          </div>

          <div class="field">
            <label class="label" for="recorrido">Recorrido Km</label>
            <input
              id="recorrido"
              :value="formatNum(recorridoKm)"
              type="text"
              class="input input--readonly"
              readonly
            />
          </div>

          <div class="field">
            <label class="label" for="rendimiento">Rend. Kms / Lts.</label>
            <input
              id="rendimiento"
              :value="formatNum(rendimiento)"
              type="text"
              class="input input--readonly"
              readonly
            />
          </div>
        </div>

        <div class="actions">
          <button
            type="button"
            class="btn btn--ghost"
            @click="limpiar"
          >
            Limpiar
          </button>

          <div class="actions__right">
            <div v-if="saveError" class="status status--error">
              {{ saveError }}
            </div>

            <div v-if="saveOk" class="status status--success">
              Guardado correctamente.
            </div>

            <button
              type="button"
              class="btn btn--primary"
              :disabled="!vehiculoListo || saving"
              @click="guardar"
            >
              <span v-if="saving" class="spinner spinner--light"></span>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const API_BASE = import.meta.env.VITE_API_URL || "";

const claveInput = ref("");
const loadingVehiculo = ref(false);
const vehiculoError = ref("");

const vehiculo = reactive({
  clave: "",
  placa: "",
  ultimoKm: null,
  rendMin: null,
  rendMax: null,
  rendProm: null,
});

const form = reactive({
  fecha: todayISO(),
  hora: nowTime(),
  litros: "",
  importe: "",
  kilometraje: "",
});

const touched = ref(false);
const saving = ref(false);
const saveError = ref("");
const saveOk = ref(false);

const vehiculoListo = computed(() => !!vehiculo.clave);

const precioPorLitro = computed(() => {
  const litros = toNumber(form.litros);
  const importe = toNumber(form.importe);
  if (!litros || !importe) return 0;
  return importe / litros;
});

const recorridoKm = computed(() => {
  const kmActual = toInt(form.kilometraje);
  const kmAnterior = toInt(vehiculo.ultimoKm);

  if (!kmActual || kmAnterior == null) return 0;

  const diff = kmActual - kmAnterior;
  return diff > 0 ? diff : 0;
});

const rendimiento = computed(() => {
  const litros = toNumber(form.litros);
  const recorrido = toNumber(recorridoKm.value);

  if (!litros || !recorrido) return 0;
  return recorrido / litros;
});

async function buscarVehiculo() {
  saveOk.value = false;
  saveError.value = "";
  vehiculoError.value = "";

  const clave = (claveInput.value || "").trim();

  if (!clave) {
    vehiculoError.value = "Ingresa la clave del vehículo.";
    return;
  }

  loadingVehiculo.value = true;

  try {
    const res = await fetch(`${API_BASE}/api/vehiculos/${encodeURIComponent(clave)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Vehículo no encontrado.");
      }
      throw new Error("No se pudo consultar el vehículo.");
    }

    const data = await res.json();

    vehiculo.clave = data.clave ?? clave;
    vehiculo.placa = data.placa ?? "";
    vehiculo.ultimoKm = data.ultimoKm ?? data.ultimo_km ?? null;
    vehiculo.rendMin = data.rendMin ?? data.rend_min ?? null;
    vehiculo.rendMax = data.rendMax ?? data.rend_max ?? null;
    vehiculo.rendProm = data.rendProm ?? data.rend_prom ?? null;

    form.litros = "";
    form.importe = "";
    form.kilometraje = "";
    touched.value = false;
  } catch (error) {
    vehiculoError.value = error?.message || "Error consultando vehículo.";

    vehiculo.clave = "";
    vehiculo.placa = "";
    vehiculo.ultimoKm = null;
    vehiculo.rendMin = null;
    vehiculo.rendMax = null;
    vehiculo.rendProm = null;
  } finally {
    loadingVehiculo.value = false;
  }
}

function validar() {
  touched.value = true;
  saveError.value = "";
  saveOk.value = false;

  if (!vehiculoListo.value) {
    saveError.value = "Primero consulta un vehículo por clave.";
    return false;
  }

  if (!form.fecha) return false;
  if (!isPositive(form.litros)) return false;
  if (!isPositive(form.importe)) return false;
  if (!isPositiveInt(form.kilometraje)) return false;

  if (vehiculo.ultimoKm != null) {
    const kmActual = toInt(form.kilometraje);
    const kmAnterior = toInt(vehiculo.ultimoKm);

    if (kmActual <= kmAnterior) {
      saveError.value = "El kilometraje actual debe ser mayor al último km registrado.";
      return false;
    }
  }

  return true;
}

async function guardar() {
  if (!validar()) return;

  saving.value = true;
  saveError.value = "";
  saveOk.value = false;

  try {
    const payload = {
      claveVehiculo: vehiculo.clave,
      fecha: form.fecha,
      hora: form.hora || null,
      litros: toNumber(form.litros),
      importe: toNumber(form.importe),
      precioLitro: toNumber(precioPorLitro.value),
      kilometrajeActual: toInt(form.kilometraje),
      kilometrajeAnterior: toInt(vehiculo.ultimoKm),
      recorridoKm: toNumber(recorridoKm.value),
      rendimiento: toNumber(rendimiento.value),
    };

    const res = await fetch(`${API_BASE}/api/consumos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("No se pudo guardar la carga.");
    }

    saveOk.value = true;
    saveError.value = "";

    vehiculo.ultimoKm = toInt(form.kilometraje);
    vehiculo.rendProm = toNumber(rendimiento.value);

    form.litros = "";
    form.importe = "";
    form.kilometraje = "";
    form.hora = nowTime();
    touched.value = false;
  } catch (error) {
    saveError.value = error?.message || "Ocurrió un error al guardar.";
    saveOk.value = false;
  } finally {
    saving.value = false;
  }
}

function limpiar() {
  saveError.value = "";
  saveOk.value = false;
  vehiculoError.value = "";
  touched.value = false;

  claveInput.value = "";
  vehiculo.clave = "";
  vehiculo.placa = "";
  vehiculo.ultimoKm = null;
  vehiculo.rendMin = null;
  vehiculo.rendMax = null;
  vehiculo.rendProm = null;

  form.fecha = todayISO();
  form.hora = nowTime();
  form.litros = "";
  form.importe = "";
  form.kilometraje = "";
}

function isPositive(value) {
  return toNumber(value) > 0;
}

function isPositiveInt(value) {
  return Number.isInteger(toInt(value)) && toInt(value) > 0;
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toInt(value) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNum(value) {
  const num = toNumber(value);
  if (!num) return "0.00";
  return num.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatInt(value) {
  const num = toInt(value);
  if (!num) return "0";
  return num.toLocaleString("es-MX");
}

function todayISO() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nowTime() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 16px;
  padding: 0;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.card__header {
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
  background: rgba(187, 224, 239, 0.28);
}

.card__title {
  margin: 0;
  color: var(--pol-blue);
  font-size: 18px;
  font-weight: 800;
}

.card__body {
  padding: 18px;
}

.vehicle-header {
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.clave-panel {
  display: grid;
  gap: 14px;
}

.clave-box {
  border: 1px solid var(--border);
  border-radius: 18px;
  background: linear-gradient(135deg, var(--pol-blue), var(--brand-blue));
  color: var(--white);
  padding: 16px;
  min-height: 120px;
  display: grid;
  align-content: center;
  box-shadow: 0 12px 30px rgba(0, 36, 85, 0.18);
}

.clave-label {
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 6px;
}

.clave-value {
  font-size: 28px;
  font-weight: 800;
  word-break: break-word;
}

.clave-search {
  display: grid;
  gap: 6px;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.vehicle-data {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.kv {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  background: var(--surface);
}

.k {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 6px;
}

.v {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.input--readonly {
  background: rgba(15, 23, 42, 0.03);
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.actions__right {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.status {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-size: 14px;
}

.status--error {
  color: var(--alert-font);
  background: var(--alert-bg);
  border-color: var(--red);
}

.status--success {
  color: #166534;
  background: rgba(34, 197, 94, 0.12);
  border-color: var(--success);
}

.spinner--light {
  border-color: rgba(255, 255, 255, 0.35);
  border-top-color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .vehicle-data {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .vehicle-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .card__body,
  .card__header {
    padding: 14px;
  }

  .search-row,
  .form-grid,
  .vehicle-data {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .actions__right {
    width: 100%;
    justify-content: stretch;
  }

  .actions__right > * {
    width: 100%;
  }
}
</style>