<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Vehículos</h2>
      <div class="spacer"></div>

      <BaseInput
        v-model="search"
        label=""
        placeholder="Buscar..."
        style="max-width: 280px;"
      />

      <BaseButton
        class="btn-add"
        variant="primary"
        @click="openCreate"
      >
        AGREGAR
      </BaseButton>
    </div>

    <DataTable
      :rows="filtered"
      :columns="columns"
      rowKey="id"
      :pageSize="10"
      :searchable="false"
    >
      <template #row="{ row, index }">
        <tr :class="index % 2 === 0 ? 'row-even' : 'row-odd'">
          <td v-for="col in columns" :key="col.key" class="td">
            <span v-if="col.key === 'odometro'">
              {{ formatInt(row.odometro) }}
            </span>
            <span v-else-if="col.key === 'activo'">
              {{ normalizeActivo(row.activo) ? "SI" : "NO" }}
            </span>
            <span v-else>
              {{ row[col.key] }}
            </span>
          </td>

          <td class="td actions-cell">
            <BaseButton
              variant="secondary"
              @click="openEdit(row)"
            >
              Editar
            </BaseButton>
          </td>
        </tr>
      </template>

      <template #actions />
    </DataTable>

    <BaseModal
      v-model:open="dialog"
      :title="form.id ? 'Editar Vehículo' : 'Agregar Vehículo'"
    >
      <form class="form-grid" @submit.prevent="save">
        <BaseSelect
          v-model="form.id_sucursal"
          label="Sucursal"
          :options="sucursalOptions"
          :required="true"
          :error="errors.id_sucursal"
          placeholder="Selecciona una sucursal"
        />

        <BaseSelect
          v-model="form.id_modelo"
          label="Modelo"
          :options="modeloOptions"
          :required="true"
          :error="errors.id_modelo"
          placeholder="Selecciona un modelo"
        />

        <BaseSelect
          v-model="form.anio"
          label="Año"
          :options="anioOptions"
          :required="true"
          :error="errors.anio"
          placeholder="Selecciona un año"
        />

        <BaseInput
          v-model="form.clave"
          label="Clave"
          :required="true"
          :error="errors.clave"
          placeholder="Ej. SYS-005"
        />

        <BaseInput
          v-model="form.placa"
          label="Placa"
          :required="true"
          :error="errors.placa"
          placeholder="Ej. JPW3868"
        />

        <BaseInput
          :model-value="formatInt(form.odometro)"
          label="Odómetro"
          placeholder="Solo lectura"
          :disabled="true"
        />

        <BaseSelect
          v-model="form.id_combustible"
          label="Combustible"
          :options="combustibleOptions"
          :required="true"
          :error="errors.id_combustible"
          placeholder="Selecciona un combustible"
        />

        <BaseInput
          v-model="form.rend_minimo"
          label="Rend. mínimo"
          :required="true"
          :error="errors.rend_minimo"
          type="number"
          min="0"
          step="1"
          placeholder="Ej. 9"
        />

        <BaseInput
          v-model="form.rend_maximo"
          label="Rend. máximo"
          :required="true"
          :error="errors.rend_maximo"
          type="number"
          min="0"
          step="1"
          placeholder="Ej. 11"
        />

        <label class="check col-span-2">
          <input type="checkbox" v-model="form.activo" />
          <span>Activo</span>
        </label>
      </form>

      <template #footer>
        <BaseButton variant="ghost" @click="closeDialog">
          Cancelar
        </BaseButton>

        <BaseButton
          class="btn-add"
          variant="primary"
          :loading="saving"
          @click="save"
        >
          Guardar
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import BaseToast from "@/components/ui/BaseToast.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import DataTable from "@/components/ui/DataTable.vue";
import { useToast } from "@/composables/useToast";

const { show } = useToast();

const rows = ref([]);
const sucursales = ref([]);
const modelos = ref([]);
const combustibles = ref([]);

const search = ref("");
const dialog = ref(false);
const saving = ref(false);

const form = reactive(emptyForm());
const errors = reactive(emptyErrors());

function emptyForm() {
  return {
    id: null,
    id_sucursal: "",
    id_modelo: "",
    anio: String(new Date().getFullYear()),
    clave: "",
    placa: "",
    odometro: "",
    id_combustible: "",
    rend_minimo: "",
    rend_maximo: "",
    activo: true,
  };
}

function emptyErrors() {
  return {
    id_sucursal: "",
    id_modelo: "",
    anio: "",
    clave: "",
    placa: "",
    id_combustible: "",
    rend_minimo: "",
    rend_maximo: "",
  };
}

const columns = [
  { key: "sucursal", label: "Sucursal", sortable: true },
  { key: "clave", label: "Clave", sortable: true },
  { key: "odometro", label: "Odómetro", sortable: true },
  { key: "placa", label: "Placa", sortable: true },
  { key: "marca", label: "Marca", sortable: true },
  { key: "submarca", label: "Submarca", sortable: true },
  { key: "modelo", label: "Modelo", sortable: true },
  { key: "rend_minimo", label: "Rend. mínimo", sortable: true },
  { key: "rend_maximo", label: "Rend. máximo", sortable: true },
  { key: "combustible", label: "Combustible", sortable: true },
  { key: "activo", label: "Activo", sortable: true },
];

const sucursalOptions = computed(() => {
  return (sucursales.value || []).map((s) => ({
    label: s.nombre,
    value: String(s.id),
  }));
});

const modeloOptions = computed(() => {
  return (modelos.value || []).map((m) => ({
    label: `${m.marca} - ${m.submarca}`,
    value: String(m.id),
  }));
});

const combustibleOptions = computed(() => {
  return (combustibles.value || []).map((c) => ({
    label: c.nombre,
    value: String(c.id),
  }));
});

const anioOptions = computed(() => {
  const current = new Date().getFullYear();
  const items = [];

  for (let year = current + 1; year >= current - 15; year -= 1) {
    items.push({
      label: String(year),
      value: String(year),
    });
  }

  return items;
});

const filtered = computed(() => {
  const s = search.value.trim().toUpperCase();
  if (!s) return rows.value;

  return rows.value.filter((r) =>
    [
      r.sucursal,
      r.clave,
      r.odometro,
      r.placa,
      r.marca,
      r.submarca,
      r.modelo,
      r.rend_minimo,
      r.rend_maximo,
      r.combustible,
      normalizeActivo(r.activo) ? "SI" : "NO",
    ]
      .filter((e) => e !== null && e !== undefined)
      .some((e) => String(e).toUpperCase().includes(s))
  );
});

function normalizeActivo(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "TRUE"
  );
}

function formatInt(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("es-MX");
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

async function loadVehiculos() {
  const r = await apiGet("/api/vehiculos");

  if (r.ok) {
    rows.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar los vehículos.", "danger");
  }
}

async function loadSucursales() {
  const r = await apiGet("/api/sucursales");

  if (r.ok) {
    sucursales.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar las sucursales.", "danger");
  }
}

async function loadModelos() {
  const r = await apiGet("/api/modelos/combo");

  if (r.ok) {
    modelos.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar los modelos.", "danger");
  }
}

async function loadCombustibles() {
  const r = await apiGet("/api/combustibles/combo");

  if (r.ok) {
    combustibles.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar los combustibles.", "danger");
  }
}

function openCreate() {
  Object.assign(form, emptyForm());
  Object.assign(errors, emptyErrors());
  dialog.value = true;
}

async function openEdit(item) {
  Object.assign(errors, emptyErrors());

  const r = await apiGet(`/api/vehiculos/${item.id}`);

  if (!r.ok || !r.data) {
    show(r.msg || "No se pudo cargar el vehículo.", "danger");
    return;
  }

  const v = r.data;

  Object.assign(form, {
    id: v.id,
    id_sucursal: String(v.id_sucursal ?? ""),
    id_modelo: String(v.id_modelo ?? ""),
    anio: String(v.anio ?? ""),
    clave: v.clave ?? "",
    placa: v.placa ?? "",
    odometro: v.odometro ?? "",
    id_combustible: String(v.id_combustible ?? ""),
    rend_minimo: String(v.rend_minimo ?? ""),
    rend_maximo: String(v.rend_maximo ?? ""),
    activo: normalizeActivo(v.activo),
  });

  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

function validate() {
  Object.assign(errors, emptyErrors());

  if (!String(form.id_sucursal || "").trim()) {
    errors.id_sucursal = "La sucursal es requerida";
  }

  if (!String(form.id_modelo || "").trim()) {
    errors.id_modelo = "El modelo es requerido";
  }

  if (!String(form.anio || "").trim()) {
    errors.anio = "El año es requerido";
  }

  const clave = String(form.clave || "").trim();
  if (!clave) {
    errors.clave = "La clave es requerida";
  } else if (clave.length > 15) {
    errors.clave = "Máximo 15 caracteres";
  }

  const placa = String(form.placa || "").trim();
  if (!placa) {
    errors.placa = "La placa es requerida";
  } else if (placa.length > 15) {
    errors.placa = "Máximo 15 caracteres";
  }

  if (!String(form.id_combustible || "").trim()) {
    errors.id_combustible = "El combustible es requerido";
  }

  const rendMin = Number(form.rend_minimo);
  const rendMax = Number(form.rend_maximo);

  if (!String(form.rend_minimo || "").trim()) {
    errors.rend_minimo = "El rendimiento mínimo es requerido";
  } else if (!Number.isFinite(rendMin) || rendMin < 0) {
    errors.rend_minimo = "Debe ser un número válido";
  }

  if (!String(form.rend_maximo || "").trim()) {
    errors.rend_maximo = "El rendimiento máximo es requerido";
  } else if (!Number.isFinite(rendMax) || rendMax < 0) {
    errors.rend_maximo = "Debe ser un número válido";
  }

  if (
    Number.isFinite(rendMin) &&
    Number.isFinite(rendMax) &&
    String(form.rend_minimo || "").trim() &&
    String(form.rend_maximo || "").trim() &&
    rendMax < rendMin
  ) {
    errors.rend_maximo = "Debe ser mayor o igual al mínimo";
  }

  return !Object.values(errors).some(Boolean);
}

async function save() {
  if (saving.value) return;

  if (!validate()) {
    show("Revisa los campos marcados", "danger");
    return;
  }

  saving.value = true;

  try {
    const payload = {
      id: form.id,
      clave: String(form.clave).trim().toUpperCase(),
      placa: String(form.placa).trim().toUpperCase(),
      anio: Number(form.anio),
      rend_minimo: Number(form.rend_minimo),
      rend_maximo: Number(form.rend_maximo),
      id_modelo: Number(form.id_modelo),
      id_sucursal: Number(form.id_sucursal),
      id_combustible: Number(form.id_combustible),
      activo: !!form.activo,
      chofer: false,
      id_empleado: null,
    };

    let r;

    if (!payload.id) {
      r = await apiSend("/api/vehiculos", "POST", payload);

      if (r.ok) {
        show("Vehículo agregado", "success");
        dialog.value = false;
        await loadVehiculos();
      } else {
        show(r.msg || "Error insertando vehículo, marque a Sistemas", "danger");
        console.error("Error POST /api/vehiculos:", r);
      }
    } else {
      r = await apiSend(`/api/vehiculos/${payload.id}`, "PUT", payload);

      if (r.ok) {
        show("Vehículo actualizado", "success");
        dialog.value = false;
        await loadVehiculos();
      } else {
        show(r.msg || "No se pudo actualizar el vehículo", "warning");
        console.error(`Error PUT /api/vehiculos/${payload.id}:`, r);
      }
    }
  } catch (error) {
    console.error("Error al guardar vehículo:", error);
    show("Ocurrió un error al guardar el vehículo", "danger");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    loadVehiculos(),
    loadSucursales(),
    loadModelos(),
    loadCombustibles(),
  ]);
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.spacer {
  flex: 1;
}

.actions-cell {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 600;
}

.check input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--pol-blue);
}

.col-span-2 {
  grid-column: span 2;
}

.title {
  color: var(--pol-blue);
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .col-span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-wrap: wrap;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>