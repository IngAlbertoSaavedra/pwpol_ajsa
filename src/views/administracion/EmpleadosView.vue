<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Empleados</h2>

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
            {{ formatCell(row, col.key) }}
          </td>
          <td class="td">
            <BaseButton variant="secondary" @click="openEdit(row)">
              Editar
            </BaseButton>
          </td>
        </tr>
      </template>

      <template #actions />
    </DataTable>

    <BaseModal
      v-model:open="dialog"
      :title="form.id ? 'Editar empleado' : 'Agregar empleado'"
    >
      <form class="form-grid" @submit.prevent="save">
        <BaseInput
          v-model="form.nomina"
          label="Nómina"
          :required="true"
          :error="errors.nomina"
          placeholder="Ej. 1001"
        />

        <BaseInput
          v-model="form.nombres"
          label="Nombre(s)"
          :required="true"
          :error="errors.nombres"
          placeholder="Nombre(s)"
        />

        <BaseInput
          v-model="form.apellido_p"
          label="Apellido paterno"
          :required="true"
          :error="errors.apellido_p"
          placeholder="Apellido paterno"
        />

        <BaseInput
          v-model="form.apellido_m"
          label="Apellido materno"
          :error="errors.apellido_m"
          placeholder="Apellido materno"
        />

        <BaseInput
          v-model="form.curp"
          label="CURP"
          :error="errors.curp"
          placeholder="18 caracteres"
        />

        <BaseInput
          v-model="form.rfc"
          label="RFC"
          :error="errors.rfc"
          placeholder="13 caracteres"
        />

        <BaseInput
          v-model="form.fecha_ingreso"
          label="Fecha de ingreso"
          type="date"
          :required="true"
          :error="errors.fecha_ingreso"
        />

        <BaseInput
          v-model="form.fecha_salida"
          label="Fecha de salida"
          type="date"
          :error="errors.fecha_salida"
        />

        <BaseSelect
          v-model="form.id_puesto"
          label="Puesto"
          :required="true"
          :error="errors.id_puesto"
          :options="puestosOptions"
          placeholder="Selecciona puesto"
        />

        <BaseSelect
          v-model="form.id_sucursal"
          label="Sucursal"
          :required="true"
          :error="errors.id_sucursal"
          :options="sucursalesOptions"
          placeholder="Selecciona sucursal"
        />

        <div class="col-span-2 foto-block">
          <label class="foto-label">Foto</label>

          <input
            ref="fileInputRef"
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            class="hidden-file-input"
            @change="handleFotoChange"
          />

          <div class="foto-actions">
            <BaseButton variant="secondary" type="button" @click="openFilePicker">
              Seleccionar foto
            </BaseButton>

            <span class="foto-help">
              PNG o JPG, máximo 1024 KB
            </span>
          </div>

          <div v-if="form.foto_nombre" class="foto-file-name">
            Archivo seleccionado: {{ form.foto_nombre }}
          </div>

          <div v-if="errors.foto" class="field-error">
            {{ errors.foto }}
          </div>

          <div v-if="form.foto_preview" class="foto-preview-wrap">
            <img :src="form.foto_preview" alt="Vista previa de foto" class="foto-preview" />
          </div>
        </div>

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

const MAX_FOTO_BYTES = 1024 * 1024;
const MIME_VALIDOS = ["image/png", "image/jpeg", "image/jpg"];

const { show } = useToast();

const rows = ref([]);
const search = ref("");
const dialog = ref(false);
const saving = ref(false);

const puestos = ref([]);
const sucursales = ref([]);
const catalogosLoading = ref(false);
const catalogosLoaded = ref(false);

const fileInputRef = ref(null);

const form = reactive(emptyForm());
const errors = reactive(emptyErrors());

function emptyForm() {
  return {
    id: null,
    nomina: "",
    nombres: "",
    apellido_p: "",
    apellido_m: "",
    curp: "",
    rfc: "",
    fecha_ingreso: "",
    fecha_salida: "",
    foto: null,
    foto_preview: "",
    foto_nombre: "",
    id_puesto: "",
    id_sucursal: "",
    activo: true,
  };
}

function emptyErrors() {
  return {
    nomina: "",
    nombres: "",
    apellido_p: "",
    apellido_m: "",
    curp: "",
    rfc: "",
    fecha_ingreso: "",
    fecha_salida: "",
    foto: "",
    id_puesto: "",
    id_sucursal: "",
  };
}

const columns = [
  { key: "nomina", label: "Nómina", sortable: true },
  { key: "nombres", label: "Nombres", sortable: true },
  { key: "apellido_p", label: "Apellido paterno", sortable: true },
  { key: "apellido_m", label: "Apellido materno", sortable: true },
  { key: "curp", label: "CURP", sortable: true },
  { key: "rfc", label: "RFC", sortable: true },
  { key: "fecha_ingreso", label: "Ingreso", sortable: true },
  { key: "fecha_salida", label: "Salida", sortable: true },
  { key: "puesto", label: "Puesto", sortable: true },
  { key: "sucursal", label: "Sucursal", sortable: true },
  { key: "activo", label: "Activo", sortable: true },
];

const filtered = computed(() => {
  const q = search.value.trim().toUpperCase();
  if (!q) return rows.value;

  return rows.value.filter((r) =>
    [
      r.nomina,
      r.nombres,
      r.apellido_p,
      r.apellido_m,
      r.curp,
      r.rfc,
      r.fecha_ingreso,
      r.fecha_salida,
      r.puesto,
      r.sucursal,
      r.activo ? "SI" : "NO",
    ]
      .filter((x) => x !== null && x !== undefined)
      .some((x) => String(x).toUpperCase().includes(q))
  );
});

const puestosOptions = computed(() =>
  puestos.value.map((p) => ({
    value: String(p.id),
    label: p.nombre,
  }))
);

const sucursalesOptions = computed(() =>
  sucursales.value.map((s) => ({
    value: String(s.id),
    label: s.nombre,
  }))
);

function normalizeDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function formatCell(row, key) {
  if (key === "activo") return row.activo ? "Sí" : "No";
  if (key === "fecha_ingreso" || key === "fecha_salida") {
    return row[key] ? String(row[key]).slice(0, 10) : "";
  }
  return row[key] ?? "";
}

async function apiGet(url) {
  const res = await fetch(url);
  return res.json();
}

async function apiSend(url, method, body) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { ok: false, msg: text || "Respuesta no válida del servidor" };
    }

    if (!res.ok) {
      throw new Error(data.msg || `Error HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("Error en apiSend:", err);
    throw err;
  }
}

async function loadEmpleados() {
  const r = await apiGet("/api/empleados");
  if (r.ok) rows.value = r.data;
  else show(r.msg || "No se pudo cargar la lista de empleados", "danger");
}

async function ensureCatalogosLoaded() {
  if (catalogosLoaded.value || catalogosLoading.value) return;

  catalogosLoading.value = true;
  try {
    const [rPuestos, rSucursales] = await Promise.all([
      apiGet("/api/puestos"),
      apiGet("/api/sucursales"),
    ]);

    if (!rPuestos.ok) {
      show(rPuestos.msg || "No se pudieron cargar los puestos", "danger");
      return;
    }

    if (!rSucursales.ok) {
      show(rSucursales.msg || "No se pudieron cargar las sucursales", "danger");
      return;
    }

    puestos.value = rPuestos.data ?? [];
    sucursales.value = rSucursales.data ?? [];
    catalogosLoaded.value = true;
  } finally {
    catalogosLoading.value = false;
  }
}

onMounted(async () => {
  await loadEmpleados();
});

function resetFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

function openFilePicker() {
  resetFileInput();
  fileInputRef.value?.click();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;

      resolve({
        mimeType: file.type,
        fileName: file.name,
        size: file.size,
        base64,
        preview: result,
      });
    };

    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

async function handleFotoChange(event) {
  errors.foto = "";

  const file = event.target?.files?.[0];
  if (!file) return;

  if (!MIME_VALIDOS.includes(file.type)) {
    errors.foto = "La foto debe ser un archivo PNG o JPG";
    form.foto = null;
    form.foto_preview = "";
    form.foto_nombre = "";
    resetFileInput();
    return;
  }

  if (file.size > MAX_FOTO_BYTES) {
    errors.foto = "La foto no debe ser mayor a 1 MB";
    form.foto = null;
    form.foto_preview = "";
    form.foto_nombre = "";
    resetFileInput();
    return;
  }

  try {
    const foto = await fileToBase64(file);

    form.foto = {
      mimeType: foto.mimeType,
      fileName: foto.fileName,
      base64: foto.base64,
    };
    form.foto_preview = foto.preview;
    form.foto_nombre = foto.fileName;
  } catch (err) {
    errors.foto = err.message || "No se pudo procesar la imagen";
    form.foto = null;
    form.foto_preview = "";
    form.foto_nombre = "";
  }
}

async function openCreate() {
  Object.assign(form, emptyForm());
  Object.assign(errors, emptyErrors());
  resetFileInput();
  await ensureCatalogosLoaded();
  dialog.value = true;
}

async function openEdit(item) {
  Object.assign(errors, emptyErrors());
  resetFileInput();
  await ensureCatalogosLoaded();

  Object.assign(form, {
    id: item.id ?? null,
    nomina: item.nomina ?? "",
    nombres: item.nombres ?? "",
    apellido_p: item.apellido_p ?? "",
    apellido_m: item.apellido_m ?? "",
    curp: item.curp ?? "",
    rfc: item.rfc ?? "",
    fecha_ingreso: normalizeDate(item.fecha_ingreso),
    fecha_salida: normalizeDate(item.fecha_salida),
    foto: null,
    foto_preview: item.foto_base64 ?? "",
    foto_nombre: "",
    id_puesto:
      item.id_puesto !== null && item.id_puesto !== undefined
        ? String(item.id_puesto)
        : "",
    id_sucursal:
      item.id_sucursal !== null && item.id_sucursal !== undefined
        ? String(item.id_sucursal)
        : "",
    activo: item.activo ?? true,
  });

  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

function validate() {
  Object.assign(errors, emptyErrors());

  if (!String(form.nomina).trim()) {
    errors.nomina = "La nómina es requerida";
  } else if (!/^\d+$/.test(String(form.nomina).trim())) {
    errors.nomina = "La nómina debe ser numérica";
  }

  if (!String(form.nombres).trim()) {
    errors.nombres = "El nombre es requerido";
  }

  if (!String(form.apellido_p).trim()) {
    errors.apellido_p = "El apellido paterno es requerido";
  }

  if (form.curp && String(form.curp).trim().length < 18) {
    errors.curp = "La CURP debe tener 18 caracteres";
  }

  if (form.rfc && String(form.rfc).trim().length < 12) {
    errors.rfc = "RFC inválido";
  }

  if (!String(form.fecha_ingreso).trim()) {
    errors.fecha_ingreso = "La fecha de ingreso es requerida";
  }

  if (
    form.fecha_ingreso &&
    form.fecha_salida &&
    String(form.fecha_salida) < String(form.fecha_ingreso)
  ) {
    errors.fecha_salida = "La fecha de salida no puede ser menor a la de ingreso";
  }

  if (!String(form.id_puesto).trim()) {
    errors.id_puesto = "El puesto es requerido";
  }

  if (!String(form.id_sucursal).trim()) {
    errors.id_sucursal = "La sucursal es requerida";
  }

  if (form.foto) {
    const mimeType = String(form.foto.mimeType || "").toLowerCase().trim();
    const bytesEstimados = Math.ceil((String(form.foto.base64 || "").length * 3) / 4);

    if (!MIME_VALIDOS.includes(mimeType)) {
      errors.foto = "La foto debe ser un archivo PNG o JPG";
    } else if (bytesEstimados > MAX_FOTO_BYTES) {
      errors.foto = "La foto no debe ser mayor a 1 MB";
    }
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
      nomina: Number(form.nomina),
      nombres: String(form.nombres).trim().toUpperCase(),
      apellido_p: String(form.apellido_p).trim().toUpperCase(),
      apellido_m: String(form.apellido_m).trim().toUpperCase(),
      curp: String(form.curp).trim().toUpperCase(),
      rfc: String(form.rfc).trim().toUpperCase(),
      fecha_ingreso: form.fecha_ingreso || null,
      fecha_salida: form.fecha_salida || null,
      foto: form.foto || null,
      id_puesto: Number(form.id_puesto),
      id_sucursal: Number(form.id_sucursal),
      activo: !!form.activo,
    };

    let r = null;

    if (!payload.id) {
      r = await apiSend("/api/empleados", "POST", payload);
      show("Empleado agregado", "success");
    } else {
      r = await apiSend(`/api/empleados/${payload.id}`, "PUT", payload);
      show("Empleado actualizado", "success");
    }

    dialog.value = false;
    await loadEmpleados();
  } catch (err) {
    console.error("Error al guardar empleado:", err);
    show(err.message || "No se pudo guardar el empleado", "danger");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.content {
  padding: 16px;
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

.title {
  margin: 0;
  font-weight: 700;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .col-span-2 {
    grid-column: span 2;
  }
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
}

.btn-add {
  background: var(--pol-blue) !important;
  color: var(--white) !important;
  letter-spacing: 0.12em;
  font-weight: 700;
}

.row-even > td {
  background: var(--surface);
}

.row-odd > td {
  background: var(--row-alt);
}

.foto-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.foto-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.hidden-file-input {
  display: none;
}

.foto-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.foto-help {
  font-size: 13px;
  color: var(--text-soft, #6b7280);
}

.foto-file-name {
  font-size: 13px;
  color: var(--text);
}

.field-error {
  font-size: 13px;
  color: #dc2626;
}

.foto-preview-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 4px;
}

.foto-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
}
</style>