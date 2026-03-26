<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Usuarios</h2>
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
          <td class="td">{{ row.id }}</td>
          <td class="td">{{ row.empleado }}</td>
          <td class="td">{{ row.usuario }}</td>
          <td class="td">{{ row.perfil }}</td>
          <td class="td">{{ row.activo ? 'SI' : 'NO' }}</td>

          <td class="td actions-cell">
            <BaseButton variant="secondary" @click="openEdit(row)">
              EDITAR
            </BaseButton>

            <BaseButton variant="secondary" @click="openPassword(row)">
              CLAVE
            </BaseButton>

            <BaseButton
              :variant="row.activo ? 'ghost' : 'primary'"
              @click="toggleActivo(row)"
            >
              {{ row.activo ? 'DESACTIVAR' : 'ACTIVAR' }}
            </BaseButton>
          </td>
        </tr>
      </template>

      <template #actions />
    </DataTable>

    <BaseModal
      v-model:open="dialog"
      :title="form.id ? 'Editar Usuario' : 'Agregar Usuario'"
    >
      <form class="form-grid" @submit.prevent="save">
        <BaseInput
          v-model="form.id_empleado"
          label="ID Empleado"
          placeholder="Empleado"
          :required="true"
          :error="errors.id_empleado"
        />

        <BaseInput
          v-model="form.id_perfil"
          label="ID Perfil"
          placeholder="Perfil"
          :required="true"
          :error="errors.id_perfil"
        />

        <BaseInput
          v-model="form.usuario"
          label="Usuario"
          placeholder="Usuario"
          :required="true"
          :error="errors.usuario"
        />

        <BaseInput
          v-if="!form.id"
          v-model="form.clave"
          type="password"
          label="Contraseña"
          placeholder="Contraseña"
          :required="true"
          :error="errors.clave"
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

    <BaseModal
      v-model:open="passwordDialog"
      title="Actualizar contraseña"
    >
      <form class="form-grid" @submit.prevent="savePassword">
        <div class="col-span-2 user-ref">
          Usuario: <strong>{{ passwordForm.usuario }}</strong>
        </div>

        <BaseInput
          v-model="passwordForm.clave"
          type="password"
          label="Nueva contraseña"
          placeholder="Nueva contraseña"
          :required="true"
          :error="passwordErrors.clave"
        />
      </form>

      <template #footer>
        <BaseButton variant="ghost" @click="closePasswordDialog">
          Cancelar
        </BaseButton>

        <BaseButton
          class="btn-add"
          variant="primary"
          :loading="savingPassword"
          @click="savePassword"
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
  const passwordDialog = ref(false);
  const saving = ref(false);
  const savingPassword = ref(false);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'empleado', label: 'Empleado', sortable: true },
    { key: 'usuario', label: 'Usuario', sortable: true },
    { key: 'perfil', label: 'Perfil', sortable: true },
    { key: 'activo', label: 'Activo', sortable: true },
  ];

  function emptyForm() {
    return {
      id: null,
      id_empleado: '',
      id_perfil: '',
      usuario: '',
      clave: '',
      activo: true,
    };
  }

  function emptyErrors() {
    return {
      id_empleado: '',
      id_perfil: '',
      usuario: '',
      clave: '',
    };
  }

  function emptyPasswordForm() {
    return {
      id: null,
      usuario: '',
      clave: '',
    };
  }

  function emptyPasswordErrors() {
    return {
      clave: '',
    };
  }

  const form = reactive(emptyForm());
  const errors = reactive(emptyErrors());

  const passwordForm = reactive(emptyPasswordForm());
  const passwordErrors = reactive(emptyPasswordErrors());

  const filtered = computed(() => {
    const s = search.value.trim().toUpperCase();
    if (!s) return rows.value;

    return rows.value.filter((r) =>
      [
        r.id,
        r.empleado,
        r.usuario,
        r.perfil,
        r.activo ? 'SI' : 'NO',
      ]
        .filter((v) => v !== null && v !== undefined)
        .some((v) => String(v).toUpperCase().includes(s))
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
        msg: 'Respuesta inválida del servidor (${res.status})',
        raw: text,
      };
    }
  }

  function normalizeRow(item) {
    return {
      id: item.id ?? null,
      id_empleado: item.id_empleado ?? item.idEmpleado ?? '',
      id_perfil: item.id_perfil ?? item.idPerfil ?? '',
      empleado: item.empleado ?? '',
      usuario: item.usuario ?? '',
      perfil: item.perfil ?? '',
      activo: item.activo === true || item.activo === 1,
    };
  }

  async function loadUsuarios() {
    const r = await apiGet('/api/usuarios');

    if (!r.ok) {
      show(r.msg || 'No se pudieron cargar los usuarios.', 'danger');
      return;
    }

    rows.value = Array.isArray(r.data) ? r.data.map(normalizeRow) : [];
  }

  function openCreate() {
    Object.assign(form, emptyForm());
    Object.assign(errors, emptyErrors());
    dialog.value = true;
  }

  function openEdit(row) {
    Object.assign(errors, emptyErrors());

    Object.assign(form, {
      id: row.id,
      id_empleado: row.id_empleado ?? '',
      id_perfil: row.id_perfil ?? '',
      usuario: row.usuario ?? '',
      clave: '',
      activo: !!row.activo,
    });

    dialog.value = true;
  }

  function closeDialog() {
    dialog.value = false;
  }

  function openPassword(row) {
    Object.assign(passwordErrors, emptyPasswordErrors());

    Object.assign(passwordForm, {
      id: row.id,
      usuario: row.usuario ?? '',
      clave: '',
    });

    passwordDialog.value = true;
  }

  function closePasswordDialog() {
    passwordDialog.value = false;
  }

  function validate() {
    Object.assign(errors, emptyErrors());

    if (!String(form.id_empleado).trim()) {
      errors.id_empleado = 'El ID de empleado es obligatorio';
    } else if (isNaN(Number(form.id_empleado))) {
      errors.id_empleado = 'Debe ser numérico';
    }

    if (!String(form.id_perfil).trim()) {
      errors.id_perfil = 'El ID de perfil es obligatorio';
    } else if (isNaN(Number(form.id_perfil))) {
      errors.id_perfil = 'Debe ser numérico';
    }

    if (!String(form.usuario).trim()) {
      errors.usuario = 'El usuario es obligatorio';
    }

    if (!form.id) {
      if (!String(form.clave).trim()) {
        errors.clave = 'La contraseña es obligatoria';
      }
    }

    return !Object.values(errors).some(Boolean);
  }

  function validatePassword() {
    Object.assign(passwordErrors, emptyPasswordErrors());

    if (!String(passwordForm.clave).trim()) {
      passwordErrors.clave = 'La contraseña es obligatoria';
    }

    return !Object.values(passwordErrors).some(Boolean);
  }

  async function save() {
    if (saving.value) return;

    if (!validate()) {
      show('Revisa los campos marcados.', 'warning');
      return;
    }

    saving.value = true;

    try {
      const payload = {
        id_empleado: Number(form.id_empleado),
        id_perfil: Number(form.id_perfil),
        usuario: String(form.usuario).trim().toLowerCase(),
        activo: !!form.activo,
      };

      let r;

      if (!form.id) {
        payload.clave = String(form.clave);

        r = await apiSend('/api/usuarios', 'POST', payload);

        if (r.ok) {
          show('Usuario agregado.', 'success');
          dialog.value = false;
          await loadUsuarios();
        } else {
          show(r.msg || 'No se pudo agregar el usuario.', 'danger');
        }

        return;
      }

      r = await apiSend(`/api/usuarios/${form.id}`, 'PUT', payload);

      if (r.ok) {
        show('Usuario actualizado.', 'success');
        dialog.value = false;
        await loadUsuarios();
      } else {
        show(r.msg || 'No se pudo actualizar el usuario.', 'danger');
      }
    } catch (error) {
      console.error(error);
      show('Ocurrió un error al guardar el usuario.', 'danger');
    } finally {
      saving.value = false;
    }
  }

  async function savePassword() {
    if (savingPassword.value) return;

    if (!validatePassword()) {
      show('Captura la nueva contraseña.', 'warning');
      return;
    }

    savingPassword.value = true;

    try {
      const r = await apiSend(`/api/usuarios/${passwordForm.id}/clave`, 'PUT', {
        clave: String(passwordForm.clave),
      });

      if (r.ok) {
        show('Contraseña actualizada.', 'success');
        passwordDialog.value = false;
      } else {
        show(r.msg || 'No se pudo actualizar la contraseña.', 'danger');
      }
    } catch (error) {
      console.error(error);
      show('Ocurrió un error al actualizar la contraseña.', 'danger');
    } finally {
      savingPassword.value = false;
    }
  }

  async function toggleActivo(row) {
    try {
      const r = await apiSend(`/api/usuarios/${row.id}/activar`, 'PUT', {
        activo: !row.activo,
      });

      if (r.ok) {
        show(row.activo ? 'Usuario desactivado.' : 'Usuario activado.', 'success');
        await loadUsuarios();
      } else {
        show(r.msg || 'No se pudo actualizar el estado.', 'danger');
      }
    } catch (error) {
      console.error(error);
      show('Ocurrió un error al actualizar el estado.', 'danger');
    }
  }

  onMounted(async () => {
    await loadUsuarios();
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

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .col-span-2 {
    grid-column: span 2;
  }

  .check {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
  }

  .actions-cell {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .user-ref {
    font-size: 14px;
    padding: 6px 0;
  }
</style>