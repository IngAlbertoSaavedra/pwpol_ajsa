<template>
  <div class="content">
    <BaseToast />

    <div class="card">
      <div class="card-header">
        <h2 class="title">Asignación de Vehículo</h2>
      </div>

      <div class="card-body">
        <div class="vehicle-search-grid">
          <BaseInput
            v-model="claveVehiculo"
            label="Clave de Vehículo"
            placeholder="Ej. SYS-001"
            :disabled="loadingVehiculo"
            @keyup.enter="handleBuscarLimpiar"
          />

          <div class="search-actions">
            <BaseButton
              variant="primary"
              :loading="loadingVehiculo"
              @click="handleBuscarLimpiar"
            >
              {{ vehiculoEncontrado ? "Limpiar" : "Buscar" }}
            </BaseButton>
          </div>

          <div class="status-box">
            <span class="status-label">{{ vehiculo.activo ? "Activo" : "Inactivo" }}</span>
          </div>
        </div>

        <div class="vehicle-info-grid">
          <div class="info-item">
            <div class="info-label">Empresa</div>
            <div class="info-value">{{ vehiculo.empresa || "Empresa" }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Sucursal</div>
            <div class="info-value">{{ vehiculo.sucursal || "Sucursal" }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Marca</div>
            <div class="info-value">{{ vehiculo.marca || "Marca" }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Sub Marca</div>
            <div class="info-value">{{ vehiculo.submarca || "SubMarca" }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Modelo</div>
            <div class="info-value">{{ vehiculo.modelo || "Modelo" }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Combustible</div>
            <div class="info-value">{{ vehiculo.combustible || "Combustible" }}</div>
          </div>
        </div>

        <fieldset class="section-box">
          <legend>Datos del Chofer</legend>

          <div class="driver-top-row">
            <div class="driver-select-wrap">
              <BaseSelect
                v-model="idChofer"
                label="Nombre de Chofer"
                :options="choferOptions"
                placeholder="Selecciona un chofer"
                :disabled="!vehiculoEncontrado || loadingChoferes || !vehiculo.activo || vehiculoTieneChofer"
              />
            </div>

            <div class="driver-actions">
              <BaseButton
                variant="secondary"
                :disabled="!canDesasignar"
                :loading="saving"
                @click="desasignar"
              >
                Desasignar
              </BaseButton>

              <BaseButton
                variant="primary"
                :disabled="!canAsignar"
                :loading="saving"
                @click="asignar"
              >
                Asignar
              </BaseButton>
            </div>
          </div>

          <div class="driver-info-grid">
            <div class="info-item">
              <div class="info-label">Sucursal</div>
              <div class="info-value muted">{{ choferData.sucursal || "Sucursal" }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Licencia</div>
              <div class="info-value muted">{{ choferData.licencia || "Licencia" }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Vencimiento</div>
              <div class="info-value muted">{{ formatFecha(choferData.vencimiento) || "Vencimiento" }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Días para renovar</div>
              <div class="info-value muted">{{ choferData.DiasRenova ?? 0 }}</div>
            </div>
          </div>

          <div class="comment-block">
            <label class="comment-label">Comentario</label>
            <textarea
              v-model="comentario"
              class="comment-box"
              placeholder="comentario adicional (obligatorio)"
              :disabled="!vehiculoEncontrado || saving"
            ></textarea>
            <div v-if="commentError" class="field-error">{{ commentError }}</div>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import BaseToast from "@/components/ui/BaseToast.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import { useToast } from "@/composables/useToast";

const { show } = useToast();

const claveVehiculo = ref("");
const vehiculo = ref(emptyVehiculo());
const choferes = ref([]);
const idChofer = ref("");
const choferData = ref(emptyChoferData());
const comentario = ref("");
const commentError = ref("");

const loadingVehiculo = ref(false);
const loadingChoferes = ref(false);
const loadingChofer = ref(false);
const saving = ref(false);

function emptyVehiculo() {
  return {
    id: null,
    clave: "",
    empresa: "",
    sucursal: "",
    marca: "",
    submarca: "",
    modelo: "",
    combustible: "",
    activo: false,
    id_empleado: 0,
    chofer: 0,
    nombre_chofer_actual: "",
  };
}

function emptyChoferData() {
  return {
    id: null,
    chofer: "",
    sucursal: "",
    licencia: "",
    vencimiento: "",
    DiasRenova: 0,
  };
}

const vehiculoEncontrado = computed(() => !!vehiculo.value.id);

const vehiculoTieneChofer = computed(() => {
  return Number(vehiculo.value.chofer || 0) === 1 && Number(vehiculo.value.id_empleado || 0) > 0;
});

const choferOptions = computed(() => {
  return (choferes.value || []).map((item) => ({
    label: item.chofer,
    value: String(item.id),
  }));
});

const canAsignar = computed(() => {
  return (
    vehiculoEncontrado.value &&
    vehiculo.value.activo &&
    !vehiculoTieneChofer.value &&
    !!String(idChofer.value || "").trim() &&
    !saving.value
  );
});

const canDesasignar = computed(() => {
  return (
    vehiculoEncontrado.value &&
    vehiculo.value.activo &&
    vehiculoTieneChofer.value &&
    !saving.value
  );
});

watch(idChofer, async (newValue) => {
  if (!newValue) {
    choferData.value = emptyChoferData();
    return;
  }

  await loadChoferData(newValue);
});

function getUsuarioSesion() {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return "sistema";
    const session = JSON.parse(raw);
    return session?.user?.usuario || "sistema";
  } catch {
    return "sistema";
  }
}

function formatFecha(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("es-MX");
}

async function apiGet(url) {
  const res = await fetch(url);
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      msg: `Respuesta inválida del servidor (${res.status})`,
      raw: text,
    };
  }
}

async function apiSend(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      msg: `Respuesta inválida del servidor (${res.status})`,
      raw: text,
    };
  }
}

async function buscarVehiculo() {
  const clave = String(claveVehiculo.value || "").trim().toUpperCase();

  if (!clave) {
    show("Escribe la clave del vehículo", "warning");
    return;
  }

  loadingVehiculo.value = true;
  commentError.value = "";

  try {
    const r = await apiGet(`/api/asignacionchofer/vehiculo?clave=${encodeURIComponent(clave)}`);

    if (r.ok && r.data) {
      vehiculo.value = {
        ...emptyVehiculo(),
        ...r.data,
        activo:
          r.data.activo === true ||
          r.data.activo === 1 ||
          r.data.activo === "1",
      };

      comentario.value = "";
      choferData.value = emptyChoferData();
      idChofer.value = "";

      await loadChoferes();

      if (Number(vehiculo.value.id_empleado || 0) > 0) {
        const currentId = String(vehiculo.value.id_empleado);

        if (!choferes.value.some((x) => String(x.id) === currentId) && vehiculo.value.nombre_chofer_actual) {
          choferes.value.unshift({
            id: Number(vehiculo.value.id_empleado),
            chofer: vehiculo.value.nombre_chofer_actual,
          });
        }

        await nextTick();
        idChofer.value = currentId;
        await loadChoferData(currentId);
      }
    } else {
      show("Vehículo no encontrado", "warning");
    }
  } catch (error) {
    console.error("Error buscando vehículo:", error);
    show("Ocurrió un error al buscar el vehículo", "danger");
  } finally {
    loadingVehiculo.value = false;
  }
}

function limpiarPantalla() {
  claveVehiculo.value = "";
  vehiculo.value = emptyVehiculo();
  choferes.value = [];
  idChofer.value = "";
  choferData.value = emptyChoferData();
  comentario.value = "";
  commentError.value = "";
}

function handleBuscarLimpiar() {
  if (vehiculoEncontrado.value) {
    limpiarPantalla();
    return;
  }

  buscarVehiculo();
}

async function loadChoferes() {
  if (!vehiculoEncontrado.value) {
    choferes.value = [];
    return;
  }

  loadingChoferes.value = true;

  try {
    const r = await apiGet("/api/asignacionchofer/choferes");

    if (r.ok) {
      choferes.value = Array.isArray(r.data) ? r.data : [];
    } else {
      choferes.value = [];
      show(r.msg || "No se pudieron cargar los choferes", "danger");
    }
  } catch (error) {
    console.error("Error cargando choferes:", error);
    choferes.value = [];
    show("Ocurrió un error al cargar los choferes", "danger");
  } finally {
    loadingChoferes.value = false;
  }
}

async function loadChoferData(id) {
  loadingChofer.value = true;

  try {
    const r = await apiGet(`/api/asignacionchofer/choferes/${id}`);

    if (r.ok && r.data) {
      choferData.value = {
        ...emptyChoferData(),
        ...r.data,
      };
    } else {
      choferData.value = emptyChoferData();
      show(r.msg || "No se pudo cargar la información del chofer", "warning");
    }
  } catch (error) {
    console.error("Error cargando datos del chofer:", error);
    choferData.value = emptyChoferData();
    show("Ocurrió un error al consultar el chofer", "danger");
  } finally {
    loadingChofer.value = false;
  }
}

function validarComentario() {
  const text = String(comentario.value || "").trim();

  if (!text) {
    commentError.value = "El comentario es obligatorio";
    return false;
  }

  if (text.length < 15) {
    commentError.value = "El comentario debe tener al menos 15 caracteres";
    return false;
  }

  commentError.value = "";
  return true;
}

async function asignar() {
  if (!vehiculoEncontrado.value) {
    show("Primero busca un vehículo", "warning");
    return;
  }

  if (!idChofer.value) {
    show("Selecciona un chofer", "warning");
    return;
  }

  if (!validarComentario()) {
    show("Revisa el comentario", "warning");
    return;
  }

  saving.value = true;

  try {
    const r = await apiSend("/api/asignacionchofer/asignar", "POST", {
      id_vehiculo: vehiculo.value.id,
      id_chofer: Number(idChofer.value),
      usuario: getUsuarioSesion(),
      comentario: String(comentario.value || "").trim(),
    });

    if (r.ok) {
      show("Chofer asignado correctamente", "success");
      await buscarVehiculo();
    } else {
      show(r.msg || "No se pudo asignar el chofer", "danger");
    }
  } catch (error) {
    console.error("Error asignando chofer:", error);
    show("Ocurrió un error al asignar el chofer", "danger");
  } finally {
    saving.value = false;
  }
}

async function desasignar() {
  if (!vehiculoEncontrado.value) {
    show("Primero busca un vehículo", "warning");
    return;
  }

  if (!validarComentario()) {
    show("Revisa el comentario", "warning");
    return;
  }

  saving.value = true;

  try {
    const r = await apiSend("/api/asignacionchofer/desasignar", "POST", {
      id_vehiculo: vehiculo.value.id,
      usuario: getUsuarioSesion(),
      comentario: String(comentario.value || "").trim(),
    });

    if (r.ok) {
      show("Chofer desasignado correctamente", "success");
      await buscarVehiculo();
    } else {
      show(r.msg || "No se pudo desasignar el chofer", "danger");
    }
  } catch (error) {
    console.error("Error desasignando chofer:", error);
    show("Ocurrió un error al desasignar el chofer", "danger");
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  limpiarPantalla();
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 18px 20px 0;
}

.card-body {
  padding: 18px 20px 20px;
}

.title {
  margin: 0;
  color: var(--pol-blue);
}

.vehicle-search-grid {
  display: grid;
  grid-template-columns: minmax(220px, 300px) auto 1fr;
  gap: 12px;
  align-items: end;
  margin-bottom: 18px;
}

.search-actions {
  display: flex;
  align-items: end;
}

.status-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.status-label {
  font-size: 20px;
  font-weight: 800;
  color: var(--pol-blue);
}

.vehicle-info-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.section-box {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.section-box legend {
  padding: 0 8px;
  font-weight: 700;
  color: var(--text);
}

.driver-top-row {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 18px;
}

.driver-select-wrap {
  min-width: 0;
}

.driver-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.driver-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.info-item {
  min-width: 0;
}

.info-label {
  font-size: 14px;
  color: var(--text);
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--brand-blue);
  word-break: break-word;
}

.info-value.muted {
  color: var(--muted);
}

.comment-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-label {
  color: var(--text);
  font-weight: 600;
}

.comment-box {
  min-height: 120px;
  resize: vertical;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  background: var(--surface);
  color: var(--text);
  font: inherit;
  outline: none;
}

.comment-box:focus {
  border-color: var(--brand-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);
}

.field-error {
  color: var(--danger);
  font-size: 13px;
}

@media (max-width: 1100px) {
  .vehicle-info-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .driver-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .driver-top-row {
    grid-template-columns: 1fr;
  }

  .driver-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .vehicle-search-grid,
  .vehicle-info-grid,
  .driver-info-grid {
    grid-template-columns: 1fr;
  }

  .status-box {
    justify-content: flex-start;
  }
}
</style>