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
          <td class="td">{{ row.empleado }}</td>
          <td class="td">{{ row.usuario }}</td>
          <td class="td">{{ row.perfil }}</td>
          <td class="td">{{ row.activo ? "SI" : "NO" }}</td>

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
              {{ row.activo ? "DESACTIVAR" : "ACTIVAR" }}
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
        <div class="col-span-2 nomina-row">
          <BaseInput
            v-model="form.nomina"
            label="Número de nómina"
            placeholder="Número de nómina"
            :required="true"
            :error="errors.nomina"
            @blur="buscarEmpleadoPorNomina"
          />

          <BaseButton
            type="button"
            variant="secondary"
            class="btn-search"
            :loading="buscandoEmpleado"
            @click="buscarEmpleadoPorNomina"
          >
            BUSCAR
          </BaseButton>
        </div>

        <BaseInput
          :modelValue="form.empleado"
          label="Empleado"
          placeholder="Empleado"
          :disabled="true"
          :error="errors.id_empleado"
        />

        <div class="field">
          <label class="field-label">
            Perfil
            <span class="required">* requerido</span>
          </label>

          <select
            v-model="form.id_perfil"
            class="field-select"
            :class="{ 'field-error': errors.id_perfil }"
          >
            <option value="">Seleccione un perfil</option>
            <option
              v-for="perfil in perfiles"
              :key="perfil.id"
              :value="String(perfil.id)"
            >
              {{ perfil.nombre }}
            </option>
          </select>

          <div v-if="errors.id_perfil" class="field-error-text">
            {{ errors.id_perfil }}
          </div>
        </div>

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
import { computed, onMounted, reactive, ref } from "vue";

import BaseToast from "@/components/ui/BaseToast.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import DataTable from "@/components/ui/DataTable.vue";
import { useToast } from "@/composables/useToast";

const { show } = useToast();

const rows = ref([]);
const perfiles = ref([]);
const search = ref("");
const dialog = ref(false);
const passwordDialog = ref(false);
const saving = ref(false);
const savingPassword = ref(false);
const buscandoEmpleado = ref(false);

const columns = [
  { key: "empleado", label: "Empleado", sortable: true },
  { key: "usuario", label: "Usuario", sortable: true },
  { key: "perfil", label: "Perfil", sortable: true },
  { key: "activo", label: "Activo", sortable: true },
];

function emptyForm() {
  return {
    id: null,
    nomina: "",
    id_empleado: "",
    empleado: "",
    id_perfil: "",
    usuario: "",
    clave: "",
    activo: true,
  };
}

function emptyErrors() {
  return {
    nomina: "",
    id_empleado: "",
    id_perfil: "",
    usuario: "",
    clave: "",
  };
}

function emptyPasswordForm() {
  return {
    id: null,
    usuario: "",
    clave: "",
  };
}

function emptyPasswordErrors() {
  return {
    clave: "",
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
    [r.empleado, r.nomina, r.usuario, r.perfil, r.activo ? "SI" : "NO"]
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

function normalizeRow(item) {
  return {
    id: item.id ?? null,
    nomina: item.nomina ?? "",
    id_empleado: item.id_empleado ?? item.idEmpleado ?? "",
    id_perfil: item.id_perfil ?? item.idPerfil ?? "",
    empleado: item.empleado ?? "",
    usuario: item.usuario ?? "",
    perfil: item.perfil ?? "",
    activo: item.activo === true || item.activo === 1,
  };
}

function normalizePerfil(item) {
  return {
    id: item.id ?? "",
    nombre: item.nombre ?? "",
  };
}

function soloLetras(valor) {
  return /^[a-zA-Z]+$/.test(String(valor).trim());
}

async function loadUsuarios() {
  const r = await apiGet("/api/usuarios");

  if (!r.ok) {
    show(r.msg || "No se pudieron cargar los usuarios.", "danger");
    return;
  }

  rows.value = Array.isArray(r.data) ? r.data.map(normalizeRow) : [];
}

async function loadPerfiles() {
  const r = await apiGet("/api/perfiles/combo");

  if (!r.ok) {
    show(r.msg || "No se pudieron cargar los perfiles.", "danger");
    perfiles.value = [];
    return;
  }

  perfiles.value = Array.isArray(r.data) ? r.data.map(normalizePerfil) : [];
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
    nomina: row.nomina ?? "",
    id_empleado: row.id_empleado ?? "",
    empleado: row.empleado ?? "",
    id_perfil: row.id_perfil ? String(row.id_perfil) : "",
    usuario: row.usuario ?? "",
    clave: "",
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
    usuario: row.usuario ?? "",
    clave: "",
  });

  passwordDialog.value = true;
}

function closePasswordDialog() {
  passwordDialog.value = false;
}

async function buscarEmpleadoPorNomina() {
  errors.nomina = "";
  errors.id_empleado = "";

  const nomina = String(form.nomina).trim();

  if (!nomina) {
    form.id_empleado = "";
    form.empleado = "";
    errors.nomina = "La nómina es obligatoria";
    return;
  }

  if (!/^\d+$/.test(nomina)) {
    form.id_empleado = "";
    form.empleado = "";
    errors.nomina = "La nómina debe ser numérica";
    return;
  }

  buscandoEmpleado.value = true;

  try {
    const r = await apiGet(`/api/usuarios/empleado/${nomina}`);

    if (!r.ok) {
      form.id_empleado = "";
      form.empleado = "";
      errors.id_empleado = r.msg || "No se encontró el empleado";
      show(r.msg || "No se encontró el empleado.", "warning");
      return;
    }

    form.id_empleado = r.data.id;
    form.empleado = r.data.empleado || "";
    errors.id_empleado = "";
  } catch (error) {
    console.error(error);
    form.id_empleado = "";
    form.empleado = "";
    errors.id_empleado = "Error consultando empleado";
    show("Ocurrió un error al consultar el empleado.", "danger");
  } finally {
    buscandoEmpleado.value = false;
  }
}

function validate() {
  Object.assign(errors, emptyErrors());

  if (!String(form.nomina).trim()) {
    errors.nomina = "La nómina es obligatoria";
  } else if (!/^\d+$/.test(String(form.nomina).trim())) {
    errors.nomina = "La nómina debe ser numérica";
  }

  if (!String(form.id_empleado).trim()) {
    errors.id_empleado = "Debes buscar un empleado válido";
  }

  if (!String(form.id_perfil).trim()) {
    errors.id_perfil = "El perfil es obligatorio";
  }

  if (!String(form.usuario).trim()) {
    errors.usuario = "El usuario es obligatorio";
  } else if (!soloLetras(form.usuario)) {
    errors.usuario = "Solo se permiten letras, sin espacios ni caracteres especiales";
  }

  if (!form.id) {
    if (!String(form.clave).trim()) {
      errors.clave = "La contraseña es obligatoria";
    } else if (String(form.clave).length < 6) {
      errors.clave = "La contraseña debe tener mínimo 6 caracteres";
    }
  }

  return !Object.values(errors).some(Boolean);
}

function validatePassword() {
  Object.assign(passwordErrors, emptyPasswordErrors());

  if (!String(passwordForm.clave).trim()) {
    passwordErrors.clave = "La contraseña es obligatoria";
  } else if (String(passwordForm.clave).length < 6) {
    passwordErrors.clave = "La contraseña debe tener mínimo 6 caracteres";
  }

  return !Object.values(passwordErrors).some(Boolean);
}

async function save() {
  if (saving.value) return;

  if (!validate()) {
    show("Revisa los campos marcados.", "warning");
    return;
  }

  saving.value = true;

  try {
    const payload = {
      id_empleado: Number(form.id_empleado),
      id_perfil: Number(form.id_perfil),
      usuario: String(form.usuario).trim(),
      activo: !!form.activo,
    };

    let r;

    if (!form.id) {
      payload.clave = String(form.clave);

      r = await apiSend("/api/usuarios", "POST", payload);

      if (r.ok) {
        show("Usuario agregado.", "success");
        dialog.value = false;
        await loadUsuarios();
      } else {
        show(r.msg || "No se pudo agregar el usuario.", "danger");
      }

      return;
    }

    r = await apiSend(`/api/usuarios/${form.id}`, "PUT", payload);

    if (r.ok) {
      show("Usuario actualizado.", "success");
      dialog.value = false;
      await loadUsuarios();
    } else {
      show(r.msg || "No se pudo actualizar el usuario.", "danger");
    }
  } catch (error) {
    console.error(error);
    show("Ocurrió un error al guardar el usuario.", "danger");
  } finally {
    saving.value = false;
  }
}

async function savePassword() {
  if (savingPassword.value) return;

  if (!validatePassword()) {
    show("Revisa la nueva contraseña.", "warning");
    return;
  }

  savingPassword.value = true;

  try {
    const r = await apiSend(`/api/usuarios/${passwordForm.id}/clave`, "PUT", {
      clave: String(passwordForm.clave),
    });

    if (r.ok) {
      show("Contraseña actualizada.", "success");
      passwordDialog.value = false;
    } else {
      show(r.msg || "No se pudo actualizar la contraseña.", "danger");
    }
  } catch (error) {
    console.error(error);
    show("Ocurrió un error al actualizar la contraseña.", "danger");
  } finally {
    savingPassword.value = false;
  }
}

async function toggleActivo(row) {
  try {
    const r = await apiSend(`/api/usuarios/${row.id}/activar`, "PUT", {
      activo: !row.activo,
    });

    if (r.ok) {
      show(row.activo ? "Usuario desactivado." : "Usuario activado.", "success");
      await loadUsuarios();
    } else {
      show(r.msg || "No se pudo actualizar el estado.", "danger");
    }
  } catch (error) {
    console.error(error);
    show("Ocurrió un error al actualizar el estado.", "danger");
  }
}

onMounted(async () => {
  await Promise.all([loadUsuarios(), loadPerfiles()]);
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

.nomina-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: end;
}

.btn-search {
  min-width: 110px;
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

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 14px;
  color: #1f2937;
}

.required {
  color: #ef4444;
  font-size: 13px;
  margin-left: 6px;
}

.field-select {
  width: 100%;
  min-height: 42px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 12px;
  background: #fff;
  font-size: 14px;
  outline: none;
}

.field-select:focus {
  border-color: #38bdf8;
}

.field-error {
  border-color: #ef4444;
}

.field-error-text {
  color: #ef4444;
  font-size: 13px;
}
</style>