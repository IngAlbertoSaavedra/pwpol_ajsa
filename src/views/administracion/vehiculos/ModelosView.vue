<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Modelos</h2>
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
      :title="form.id ? 'Editar Modelo' : 'Agregar Modelo'"
    >
      <form class="form-grid" @submit.prevent="save">
        <BaseSelect
          v-model="form.id_marca"
          label="Marca"
          :options="marcaOptions"
          :required="true"
          :error="errors.id_marca"
          placeholder="Selecciona una marca"
        />

        <BaseSelect
          v-model="form.id_submarca"
          label="Submarca"
          :options="submarcaOptions"
          :required="true"
          :error="errors.id_submarca"
          placeholder="Selecciona una submarca"
          :disabled="!form.id_marca"
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
import { computed, onMounted, reactive, ref, watch } from "vue";

import BaseToast from "@/components/ui/BaseToast.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import DataTable from "@/components/ui/DataTable.vue";
import { useToast } from "@/composables/useToast";

const { show } = useToast();

const rows = ref([]);
const marcas = ref([]);
const submarcas = ref([]);
const search = ref("");
const dialog = ref(false);
const saving = ref(false);

const form = reactive(emptyForm());
const errors = reactive(emptyErrors());

function emptyForm() {
  return {
    id: null,
    id_marca: "",
    id_submarca: "",
    activo: true,
  };
}

function emptyErrors() {
  return {
    id_marca: "",
    id_submarca: "",
  };
}

const columns = [
  { key: "marca", label: "Marca", sortable: true },
  { key: "submarca", label: "Submarca", sortable: true },
  { key: "activo", label: "Activo", sortable: true },
];

const marcaOptions = computed(() => {
  return (marcas.value || []).map((m) => ({
    label: m.marca,
    value: String(m.id),
  }));
});

const submarcaOptions = computed(() => {
  return (submarcas.value || []).map((s) => ({
    label: s.submarca,
    value: String(s.id),
  }));
});

const filtered = computed(() => {
  const s = search.value.trim().toUpperCase();
  if (!s) return rows.value;

  return rows.value.filter((r) =>
    [r.marca, r.submarca, normalizeActivo(r.activo) ? "SI" : "NO"]
      .filter((e) => e !== null && e !== undefined)
      .some((e) => String(e).toUpperCase().includes(s))
  );
});

watch(
  () => form.id_marca,
  async (newValue, oldValue) => {
    if (!newValue) {
      submarcas.value = [];
      form.id_submarca = "";
      return;
    }

    if (newValue !== oldValue) {
      form.id_submarca = "";
    }

    await loadSubmarcasCombo(newValue);
  }
);

function normalizeActivo(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "TRUE"
  );
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

async function loadModelos() {
  const r = await apiGet("/api/modelos");

  if (r.ok) {
    rows.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar los modelos.", "danger");
  }
}

async function loadMarcas() {
  const r = await apiGet("/api/marcas/combo");

  if (r.ok) {
    marcas.value = Array.isArray(r.data) ? r.data : [];
  } else {
    show(r.msg || "No se pudieron cargar las marcas.", "danger");
  }
}

async function loadSubmarcasCombo(idMarca) {
  const r = await apiGet(`/api/submarcas/combo?id_marca=${idMarca}`);

  if (r.ok) {
    submarcas.value = Array.isArray(r.data) ? r.data : [];
  } else {
    submarcas.value = [];
    show(r.msg || "No se pudieron cargar las submarcas.", "danger");
  }
}

function openCreate() {
  Object.assign(form, emptyForm());
  Object.assign(errors, emptyErrors());
  submarcas.value = [];
  dialog.value = true;
}

async function openEdit(item) {
  Object.assign(errors, emptyErrors());

  Object.assign(form, {
    id: item.id,
    id_marca: String(item.id_marca ?? ""),
    id_submarca: "",
    activo: normalizeActivo(item.activo),
  });

  dialog.value = true;

  if (form.id_marca) {
    await loadSubmarcasCombo(form.id_marca);
  }

  form.id_submarca = String(item.id_submarca ?? "");
}

function closeDialog() {
  dialog.value = false;
}

function validate() {
  Object.assign(errors, emptyErrors());

  if (!String(form.id_marca || "").trim()) {
    errors.id_marca = "La marca es requerida";
  }

  if (!String(form.id_submarca || "").trim()) {
    errors.id_submarca = "La submarca es requerida";
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
      id_marca: Number(form.id_marca),
      id_submarca: Number(form.id_submarca),
      activo: !!form.activo,
    };

    let r;

    if (!payload.id) {
      r = await apiSend("/api/modelos", "POST", payload);

      if (r.ok) {
        show("Modelo agregado", "success");
        dialog.value = false;
        await loadModelos();
      } else {
        show(r.msg || "Error insertando modelo, marque a Sistemas", "danger");
        console.error("Error POST /api/modelos:", r);
      }
    } else {
      r = await apiSend(`/api/modelos/${payload.id}`, "PUT", payload);

      if (r.ok) {
        show("Modelo actualizado", "success");
        dialog.value = false;
        await loadModelos();
      } else {
        show(r.msg || "No se pudo actualizar el modelo", "warning");
        console.error(`Error PUT /api/modelos/${payload.id}:`, r);
      }
    }
  } catch (error) {
    console.error("Error al guardar modelo:", error);
    show("Ocurrió un error al guardar el modelo", "danger");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadModelos(), loadMarcas()]);
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