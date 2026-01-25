<template>
  <div class="content">
    <div class="toolbar">
      <h2 class="title">Sucursales</h2>
      <v-spacer />

      <v-text-field
        v-model="search"
        label="Buscar"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 280px"
      />

      <v-btn class="btn-add" variant="flat" @click="openCreate">
        <v-icon size="18" class="mr-2">mdi-plus</v-icon>
        AGREGAR
      </v-btn>
    </div>

    <v-data-table
      :items="filtered"
      :headers="headers"
      item-key="id"
      density="comfortable"
      class="grid elevation-1"
      :row-props="rowProps"
    >
      <template #item.edit="{ item }">
        <v-btn
          size="small"
          variant="text"
          icon="mdi-pencil"
          @click="openEdit(item)"
        />
      </template>
    </v-data-table>

    <!-- ✅ Dialog (esto era lo que faltaba) -->
    <v-dialog v-model="dialog" max-width="720">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span class="text-h6">
            {{ form.id ? "Editar sucursal" : "Agregar sucursal" }}
          </span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nombre"
                  label="Sucursal *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.extension"
                  label="Extensión"
                  variant="outlined"
                  density="comfortable"
                  maxlength="4"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.domicilio"
                  label="Domicilio"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.correo"
                  label="Correo"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.email]"
                />
              </v-col>

              <!-- Campos extra -->
              <v-col cols="12" md="3">
                <v-text-field v-model="form.telefono1" label="Teléfono 1" variant="outlined" density="comfortable" />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model="form.telefono2" label="Teléfono 2" variant="outlined" density="comfortable" />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model.number="form.altitud" label="Altitud" variant="outlined" density="comfortable" type="number" />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model.number="form.latitud" label="Latitud" variant="outlined" density="comfortable" type="number" />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field v-model.number="form.r_social" label="R. Social (tinyint)" variant="outlined" density="comfortable" type="number" />
              </v-col>

              <v-col cols="12" md="3">
                <v-switch v-model="form.activo" label="Activo" inset />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :timeout="2500">
      {{ snack.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

const headers = [
  { title: "", key: "edit", sortable: false, width: 56 },
  { title: "Sucursal", key: "nombre" },
  { title: "Domicilio", key: "domicilio" },
  { title: "Extensión", key: "extension" },
  { title: "Correo", key: "correo" },
];

const rows = ref([]);
const search = ref("");

const dialog = ref(false);
const formRef = ref(null);

const form = reactive(emptyForm());

function rowProps({ index }) {
  return { class: index % 2 === 0 ? "row-even" : "row-odd" };
}

function emptyForm() {
  return {
    id: null,
    nombre: "",
    domicilio: "",
    telefono1: "",
    telefono2: "",
    extension: "",
    correo: "",
    altitud: null,
    latitud: null,
    r_social: null,
    activo: true,
  };
}

const rules = {
  required: (v) => (!!v && String(v).trim().length > 0) || "Requerido",
  email: (v) => {
    if (!v) return true;
    return /.+@.+\..+/.test(v) || "Correo inválido";
  },
};

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) =>
    [r.nombre, r.domicilio, r.extension, r.correo]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(q))
  );
});

const snack = reactive({ show: false, text: "" });
function notify(text) {
  snack.text = text;
  snack.show = true;
}

async function apiGet(url) {
  const res = await fetch(url);
  return res.json();
}
async function apiSend(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function load() {
  const r = await apiGet("/api/sucursales");
  if (r.ok) rows.value = r.data;
  else notify(r.msg || "No se pudo cargar");
}

onMounted(load);

function openCreate() {
  Object.assign(form, emptyForm());
  dialog.value = true;
}

function openEdit(item) {
  Object.assign(form, {
    id: item.id,
    nombre: item.nombre ?? "",
    domicilio: item.domicilio ?? "",
    telefono1: item.telefono1 ?? "",
    telefono2: item.telefono2 ?? "",
    extension: item.extension ?? "",
    correo: item.correo ?? "",
    altitud: item.altitud ?? null,
    latitud: item.latitud ?? null,
    r_social: item.r_social ?? null,
    activo: item.activo ?? true,
  });
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

async function save() {
  const valid = await formRef.value?.validate?.();
  if (valid && valid.valid === false) return;

  if (!form.nombre.trim()) {
    notify("Sucursal es requerida");
    return;
  }

  if (!form.id) {
    const r = await apiSend("/api/sucursales", "POST", form);
    if (r.ok) {
      notify("Sucursal agregada");
      dialog.value = false;
      await load();
    } else notify(r.msg || "Error insertando");
  } else {
    const r = await apiSend(`/api/sucursales/${form.id}`, "PUT", form);
    if (r.ok) {
      notify("Sucursal actualizada");
      dialog.value = false;
      await load();
    } else notify(r.msg || "Error actualizando");
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

  .title {
    margin: 0;
    font-weight: 700;
  }

  .btn-add {
    background: var(--pol-blue) !important;
    color: var(--white) !important;
    letter-spacing: 0.12em;
    font-weight: 700;
  }

  .grid :deep(thead th) {
    background: var(--pol-blue);
    color: var(--white);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .row-even :deep(td) {
    background: var(--surface);
  }

  .row-odd :deep(td) {
    background: var(--pol-blue-light);
  }
</style>
