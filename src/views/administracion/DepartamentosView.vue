<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Departamentos</h2>
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
              {{ row.activo ? 'SI' : 'NO' }}
            </span>

            <span v-else>
              {{ row[col.key] }}
            </span>
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
      :title="form.id ? 'Editar Departamento' : 'Agregar Departamento'"
    >
      <form class="form-grid" @submit.prevent="save">
        <BaseInput
          v-model="form.nombre"
          label="Nombre"
          :required="true"
          :error="errors.nombre"
          placeholder="mayúsculas"
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
import { computed, onMounted, reactive, ref } from 'vue';

import BaseToast from '@/components/ui/BaseToast.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import DataTable from '@/components/ui/DataTable.vue';
import { useToast } from '@/composables/useToast';

const { show } = useToast();

const rows = ref([]);
const search = ref('');
const dialog = ref(false);
const saving = ref(false);

const form = reactive(emptyForm());
const errors = reactive(emptyErrors());

function emptyForm() {
  return {
    id: null,
    nombre: '',
    activo: true,
  };
}

function emptyErrors() {
  return {
    nombre: '',
  };
}

const columns = [
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'activo', label: 'Activo', sortable: true },
];

const filtered = computed(() => {
  const s = search.value.toUpperCase();
  if (!s) return rows.value;

  return rows.value.filter((r) =>
    [r.nombre]
      .filter(Boolean)
      .some((e) => String(e).toUpperCase().includes(s))
  );
});

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
    headers: { 'Content-Type': 'application/json' },
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

async function loadDepartamentos() {
  const r = await apiGet('/api/departamentos');
  if (r.ok) {
    rows.value = r.data;
  } else {
    show(r.msg || 'No se pudieron cargar los departamentos.', 'danger');
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
    nombre: item.nombre ?? '',
    activo: item.activo === 1 || item.activo === true,
  });

  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

function validate() {
  Object.assign(errors, emptyErrors());

  if (!String(form.nombre).trim()) {
    errors.nombre = 'Nombre es requerido';
  } else if (String(form.nombre).trim().length > 100) {
    errors.nombre = 'Máximo 100 caracteres';
  }

  return !Object.values(errors).some(Boolean);
}

async function save() {
  if (saving.value) return;

  if (!validate()) {
    show('Revisa los campos marcados', 'danger');
    return;
  }

  saving.value = true;

  try {
    const payload = {
      ...form,
      nombre: String(form.nombre).trim().toUpperCase(),
    };

    let r;

    if (!payload.id) {
      r = await apiSend('/api/departamentos', 'POST', payload);

      if (r.ok) {
        show('Departamento agregado', 'success');
        dialog.value = false;
        await loadDepartamentos();
      } else {
        show(r.msg || 'Error insertando, marque a Sistemas', 'danger');
        console.error('Error POST /api/departamentos:', r);
      }
    } else {
      r = await apiSend(`/api/departamentos/${payload.id}`, 'PUT', payload);

      if (r.ok) {
        show('Departamento actualizado', 'success');
        dialog.value = false;
        await loadDepartamentos();
      } else {
        show(r.msg || 'No se pudo actualizar, marque a Sistemas', 'warning');
        console.error(`Error PUT /api/departamentos/${payload.id}:`, r);
      }
    }
  } catch (error) {
    console.error('Error al guardar departamento:', error);
    show('Ocurrió un error al guardar el departamento', 'danger');
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadDepartamentos();
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
</style>