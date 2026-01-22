
<template>
  <v-container fluid class="pa-4">
    <!-- Encabezado / Datos del vehículo -->
    <v-card class="mb-4" elevation="2">
      <v-card-text>
        <v-row align="center" class="mb-2">
          <!-- Clave vehículo (entrada principal) -->
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <div class="clave-box mr-4">
                <div class="clave-label">Clave</div>
                <div class="clave-value">{{ vehiculo.clave || "—" }}</div>
              </div>

              <div class="flex-grow-1">
                <v-text-field
                  v-model.trim="claveInput"
                  label="Clave de Vehículo"
                  placeholder="Ej. SYS-001"
                  variant="outlined"
                  density="compact"
                  :loading="loadingVehiculo"
                  :error="!!vehiculoError"
                  :error-messages="vehiculoError"
                  @keyup.enter="buscarVehiculo"
                >
                  <template #append-inner>
                    <v-btn
                      size="small"
                      variant="text"
                      :disabled="!claveInput || loadingVehiculo"
                      @click="buscarVehiculo"
                    >
                      Buscar
                    </v-btn>
                  </template>
                </v-text-field>
                <div class="hint">Escribe la clave y presiona <strong>Enter</strong>.</div>
              </div>
            </div>
          </v-col>

          <!-- Datos consultados -->
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <div class="kv">
                  <div class="k">Placa</div>
                  <div class="v">{{ vehiculo.placa || "—" }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="kv">
                  <div class="k">Último Kms registrado</div>
                  <div class="v">{{ formatInt(vehiculo.ultimoKm) }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="kv">
                  <div class="k">Rend. Mín.</div>
                  <div class="v">{{ formatNum(vehiculo.rendMin) }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="kv">
                  <div class="k">Rend. Máx.</div>
                  <div class="v">{{ formatNum(vehiculo.rendMax) }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="kv">
                  <div class="k">Rend. Prom.</div>
                  <div class="v">{{ formatNum(vehiculo.rendProm) }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="kv">
                  <div class="k">Recorrido Km.</div>
                  <div class="v">{{ formatNum(recorridoKm) }}</div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Información de la carga -->
    <v-card elevation="2">
      <v-card-title class="section-title">Información de la Carga</v-card-title>
      <v-divider />

      <v-card-text>
        <v-row>
          <!-- Fecha -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="form.fecha"
              type="date"
              label="Fecha"
              variant="outlined"
              density="compact"
              :disabled="!vehiculoListo"
              :error="touched && !form.fecha"
            />
            <div v-if="touched && !form.fecha" class="req">* requerido</div>
          </v-col>

          <!-- Hora -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="form.hora"
              type="time"
              label="Hora"
              variant="outlined"
              density="compact"
              :disabled="!vehiculoListo"
            />
          </v-col>

          <!-- Combustible (litros) -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="form.litros"
              label="Combustible (Litros)"
              placeholder="0.00"
              variant="outlined"
              density="compact"
              :disabled="!vehiculoListo"
              inputmode="decimal"
              :error="touched && !isPositive(form.litros)"
            />
            <div v-if="touched && !isPositive(form.litros)" class="req">* requerido</div>
          </v-col>

          <!-- Importe -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="form.importe"
              label="Importe"
              placeholder="0.00"
              variant="outlined"
              density="compact"
              :disabled="!vehiculoListo"
              inputmode="decimal"
              :error="touched && !isPositive(form.importe)"
            />
            <div v-if="touched && !isPositive(form.importe)" class="req">* requerido</div>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <!-- Precio x Litro (calculado) -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              :model-value="formatNum(precioPorLitro)"
              label="Precio x Litro"
              variant="outlined"
              density="compact"
              readonly
            />
          </v-col>

          <!-- Kilometraje (actual) -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="form.kilometraje"
              label="Kilometraje (Actual)"
              placeholder="Sin decimales"
              variant="outlined"
              density="compact"
              :disabled="!vehiculoListo"
              inputmode="numeric"
              :error="touched && !isPositiveInt(form.kilometraje)"
            />
            <div v-if="touched && !isPositiveInt(form.kilometraje)" class="req">* requerido</div>
          </v-col>

          <!-- Distancia recorrida (calculado) -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              :model-value="formatNum(recorridoKm)"
              label="Recorrido Km."
              variant="outlined"
              density="compact"
              readonly
            />
          </v-col>

          <!-- Rendimiento (calculado) -->
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              :model-value="formatNum(rendimiento)"
              label="Rend. Kms / Lts."
              variant="outlined"
              density="compact"
              readonly
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- Acciones -->
        <div class="d-flex justify-space-between flex-wrap ga-2">
          <v-btn
            variant="outlined"
            prepend-icon="mdi-broom"
            @click="limpiar"
          >
            Limpiar
          </v-btn>

          <div class="d-flex ga-2">
            <v-alert
              v-if="saveError"
              type="error"
              variant="tonal"
              density="compact"
              class="py-2"
            >
              {{ saveError }}
            </v-alert>

            <v-alert
              v-if="saveOk"
              type="success"
              variant="tonal"
              density="compact"
              class="py-2"
            >
              Guardado correctamente.
            </v-alert>

            <v-btn
              color="primary"
              prepend-icon="mdi-content-save"
              :loading="saving"
              :disabled="!vehiculoListo || saving"
              @click="guardar"
            >
              Guardar
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

/**
 * Ajusta estas URLs a tus endpoints reales.
 * - Buscar vehículo: GET /api/vehiculos/:clave
 * - Guardar consumo: POST /api/consumos
 *
 * Si tu backend usa otra base (/vehiculos, /captura-consumo, etc.), cámbialo aquí.
 */
const API_BASE = import.meta.env.VITE_API_URL || ""; // opcional

const claveInput = ref("");
const loadingVehiculo = ref(false);
const vehiculoError = ref("");

const vehiculo = reactive({
  clave: "",
  placa: "",
  ultimoKm: null,  // número
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

/** 3) precio x litro = importe / litros */
const precioPorLitro = computed(() => {
  const litros = toNumber(form.litros);
  const importe = toNumber(form.importe);
  if (!litros || !importe) return 0;
  return importe / litros;
});

/** 4) recorrido = kmActual - ultimoKm */
const recorridoKm = computed(() => {
  const kmActual = toInt(form.kilometraje);
  const kmAnterior = toInt(vehiculo.ultimoKm);
  if (!kmActual || kmAnterior == null) return 0;
  const diff = kmActual - kmAnterior;
  return diff > 0 ? diff : 0;
});

/** 4) rendimiento = recorrido / litros */
const rendimiento = computed(() => {
  const litros = toNumber(form.litros);
  const rec = toNumber(recorridoKm.value);
  if (!litros || !rec) return 0;
  return rec / litros;
});

/** 1) buscar vehículo al Enter */
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
    // Ejemplo de respuesta esperada del backend:
    // {
    //   clave: "SYS-001",
    //   placa: "UTJ030A",
    //   ultimoKm: 393951,
    //   rendMin: 12,
    //   rendMax: 15,
    //   rendProm: 0
    // }
    const res = await fetch(`${API_BASE}/api/vehiculos/${encodeURIComponent(clave)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // si usas auth por token, agrega Authorization aquí
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error("Vehículo no encontrado.");
      throw new Error("No se pudo consultar el vehículo.");
    }

    const data = await res.json();

    vehiculo.clave = data.clave ?? clave;
    vehiculo.placa = data.placa ?? "";
    vehiculo.ultimoKm = data.ultimoKm ?? data.ultimo_km ?? null;
    vehiculo.rendMin = data.rendMin ?? data.rend_min ?? null;
    vehiculo.rendMax = data.rendMax ?? data.rend_max ?? null;
    vehiculo.rendProm = data.rendProm ?? data.rend_prom ?? null;

    // Limpia campos de captura al cargar vehículo
    form.litros = "";
    form.importe = "";
    form.kilometraje = "";
    touched.value = false;
  } catch (e) {
    vehiculoError.value = e?.message || "Error consultando vehículo.";
    // resetea datos si falla
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

/** 2) validación requeridos */
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

  // Validación útil: km actual debe ser mayor que el último registrado (si existe)
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

/** 5) Guardar en BD */
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
      precioLitro: precioPorLitro.value,
      kilometrajeActual: toInt(form.kilometraje),
      kilometrajeAnterior: toInt(vehiculo.ultimoKm),
      recorridoKm: recorridoKm.value,
      rendimiento: rendimiento.value,
      placa: vehiculo.placa, // opcional (por si lo quieres guardar)
    };

    const res = await fetch(`${API_BASE}/api/consumos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Authorization si aplica
    });

    if (!res.ok) {
      const txt = await safeText(res);
      throw new Error(txt || "No se pudo guardar la captura.");
    }

    // si el backend regresa el nuevo último km, actualízalo
    // const saved = await res.json().catch(() => null);
    // if (saved?.ultimoKm) vehiculo.ultimoKm = saved.ultimoKm;

    saveOk.value = true;

    // comportamiento típico: limpiar inputs de captura pero mantener el vehículo
    form.litros = "";
    form.importe = "";
    form.kilometraje = "";
    touched.value = false;
  } catch (e) {
    saveError.value = e?.message || "Error al guardar.";
  } finally {
    saving.value = false;
  }
}

function limpiar() {
  saveOk.value = false;
  saveError.value = "";
  touched.value = false;

  form.fecha = todayISO();
  form.hora = nowTime();
  form.litros = "";
  form.importe = "";
  form.kilometraje = "";
}

/* Helpers */
function toNumber(v) {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function toInt(v) {
  const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}
function isPositive(v) {
  return toNumber(v) > 0;
}
function isPositiveInt(v) {
  return toInt(v) > 0;
}
function formatNum(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("es-MX", { maximumFractionDigits: 2 });
}
function formatInt(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
}
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function nowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
}
async function safeText(res) {
  try {
    const t = await res.text();
    return (t || "").slice(0, 300);
  } catch {
    return "";
  }
}
</script>

<style scoped>
.section-title {
  font-weight: 700;
  font-size: 14px;
}

.hint {
  font-size: 12px;
  opacity: 0.7;
  margin-top: -6px;
}

.req {
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
}

/* Caja tipo "SYS-001" */
.clave-box {
  width: 140px;
  border: 1px solid rgba(0,0,0,0.2);
  background: #f2f2f2;
  padding: 6px 10px;
  border-radius: 4px;
}
.clave-label {
  font-size: 11px;
  opacity: 0.7;
  line-height: 1.2;
}
.clave-value {
  font-weight: 800;
  font-size: 18px;
}

/* Key-Value */
.kv .k {
  font-size: 12px;
  opacity: 0.7;
}
.kv .v {
  font-size: 14px;
  font-weight: 700;
}
</style>
