<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Marcas</h2>
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
            <span v-if="col.key === 'activo'">
              {{ normalizeActivo(row.activo) ? 'SI' : 'NO' }}
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

            <BaseButton
              :variant="normalizeActivo(row.activo) ? 'ghost' : 'primary'"
              @click="toggleActivo(row)"
            >
              {{ normalizeActivo(row.activo) ? 'Desactivar' : 'Activar' }}
            </BaseButton>
          </td>
        </tr>
      </template>

      <template #actions />
    </DataTable>

    <BaseModal
      v-model:open="dialog"
      :title="form.id ? 'Editar Marca' : 'Agregar Marca'"
    >
      <form class="form-grid" @submit.prevent="save">
        <BaseInput
          v-model="form.marca"
          label="Marca"
          :required="true"
          :error="errors.marca"
          placeholder="Ej. TOYOTA"
        />

        <label class="check col-span-2">
          <input type="checkbox" v-model="form.activa" />
          <span>Activa</span>
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
import BaseModal from "@/components/ui/BaseModal.vue";
import DataTable from "@/components/ui/DataTable.vue";
import { useToast } from "@/composables/useToast";

const { show } = useToast();

const rows = ref([]);
const search = ref("");
const dialog = ref(false);
const saving = ref(false);

const form = reactive(emptyForm());
const errors = reactive(emptyErrors());

function emptyForm() {
  return {
    id: null,
    marca: "",
    activa: true,
  };
}

function emptyErrors() {
  return {
    marca: "",
    activa: "",
  };
}

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "marca", label: "Marca", sortable: true },
  { key: "activo", label: "Activa", sortable: true },
];

const filtered = computed(() => {
  const s = search.value.trim().toUpperCase();
  if (!s) return rows.value;

  return rows.value.filter((r) =>
    [
      r.id,
      r.marca,
      normalizeActivo(r.activo) ? "SI" : "NO",
    ]
      .filter((e) => e !== null && e !== undefined)
      .some((e) => String(e).toUpperCase().includes(s))
  );
});

function normalizeActivo(value) {
  return value === true || value === 1;
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

async function loadMarcas() {
  const r = await apiGet("/api/marcas");

  if (r.ok) {
    rows.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar las marcas.", "danger");
  }
}

function openCreate() {
  Object.assign(form, emptyForm());
  Object.assign(errors, emptyErrors());
  dialog.value = true;
}

function openEdit(item) {
  Object.assign(errors, emptyErrors());

  Object.assign(form, {
    id: item.id,
    marca: item.marca ?? "",
    activa: normalizeActivo(item.activo),
  });

  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

function validate() {
  Object.assign(errors, emptyErrors());

  const marca = String(form.marca || "").trim();

  if (!marca) {
    errors.marca = "La marca es requerida";
  } else if (marca.length > 50) {
    errors.marca = "Máximo 50 caracteres";
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
      ...form,
      marca: String(form.marca).trim().toUpperCase(),
      activa: !!form.activa,
    };

    let r;

    if (!payload.id) {
      r = await apiSend("/api/marcas", "POST", payload);

      if (r.ok) {
        show("Marca agregada", "success");
        dialog.value = false;
        await loadMarcas();
      } else {
        show(r.msg || "Error insertando marca, marque a Sistemas", "danger");
        console.error("Error POST /api/marcas:", r);
      }
    } else {
      r = await apiSend(`/api/marcas/${payload.id}`, "PUT", payload);

      if (r.ok) {
        show("Marca actualizada", "success");
        dialog.value = false;
        await loadMarcas();
      } else {
        show(r.msg || "No se pudo actualizar la marca", "warning");
        console.error(`Error PUT /api/marcas/${payload.id}:`, r);
      }
    }
  } catch (error) {
    console.error("Error al guardar marca:", error);
    show("Ocurrió un error al guardar la marca", "danger");
  } finally {
    saving.value = false;
  }
}

async function toggleActivo(row) {
  const id = Number(row.id);
  const activa = !normalizeActivo(row.activo);

  try {
    const r = await apiSend(`/api/marcas/${id}/activo`, "PUT", { activa });

    if (r.ok) {
      show(
        activa ? "Marca activada" : "Marca desactivada",
        "success"
      );
      await loadMarcas();
    } else {
      show(r.msg || "No se pudo actualizar el estatus", "warning");
      console.error(`Error PUT /api/marcas/${id}/activo:`, r);
    }
  } catch (error) {
    console.error("Error al cambiar estatus de marca:", error);
    show("Ocurrió un error al cambiar el estatus", "danger");
  }
}

onMounted(async () => {
  await loadMarcas();
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
  grid-template-columns: 1fr;
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

@media (max-width: 768px) {
  .toolbar {
    flex-wrap: wrap;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>