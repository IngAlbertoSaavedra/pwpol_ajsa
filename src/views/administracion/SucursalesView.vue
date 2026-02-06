<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Sucursales</h2>

      <div class="spacer"></div>

      <BaseInput
        v-model="search"
        label=""
        placeholder="Buscar..."
        style="max-width: 280px;"
      />

      <BaseButton class="btn-add" variant="primary" @click="openCreate">
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
            {{ row[col.key] }}
          </td>
          <td class="td">
            <BaseButton variant="secondary" @click="openEdit(row)">Editar</BaseButton>
          </td>
        </tr>
      </template>

      <!-- sin esto no sale la etiqueta ACIONES-->
      <template #actions />

    </DataTable>

    <BaseModal v-model:open="dialog" :title="form.id ? 'Editar sucursal' : 'Agregar sucursal'">
      <form class="form-grid" @submit.prevent="save">
        <BaseInput
          v-model="form.nombre"
          label="Sucursal"
          :required="true"
          :error="errors.nombre"
          placeholder="mayúsculas"
        />

        <BaseInput
          v-model="form.extension"
          label="Extensión"
          :required="true"
          :error="errors.extension"
          placeholder="Máx 4"
        />

        <BaseInput
          v-model="form.domicilio"
          label="Domicilio"
          :required="true"
          :error="errors.domicilio"
          class="col-span-2"
          placeholder="calle y numero, colonia, ciudad"
        />

        <BaseInput
          v-model="form.correo"
          label="Correo"
          type="email"
          :required="true"
          :error="errors.correo"
          placeholder="ejemplo@poliacero.com"
        />

        <BaseInput
          v-model="form.telefono1"
          label="Teléfono 1"
          placeholder="sin espacios, sin guiones"
        />

        <BaseInput
          v-model="form.telefono2"
          label="Teléfono 2"
          placeholder="sin espacios, sin guiones"
        />

        <BaseInput
          v-model="form.altitud"
          label="Altitud"
          type="number"
        />

        <BaseInput
          v-model="form.latitud"
          label="Latitud"
          type="number"
        />

        <BaseSelect
          v-model="form.r_social"
          label="Empresa"
          :required="true"
          :error="errors.r_social"
          :options="empresasOptions"
          placeholder="Selecciona empresa"
          class="col-span-2"
        />

        <label class="check col-span-2">
          <input type="checkbox" v-model="form.activo" />
          <span>Activo</span>
        </label>
      </form>

      <template #footer>
        <BaseButton variant="ghost" @click="closeDialog">Cancelar</BaseButton>
        <BaseButton class="btn-add" variant="primary" :loading="saving" @click="save">
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
  const search = ref("");
  const dialog = ref(false);
  const saving = ref(false);

  const empresas = ref([]);
  const empresasLoading = ref(false);
  const empresasLoaded = ref(false);

  const form = reactive(emptyForm());
  const errors = reactive(emptyErrors());

  function emptyForm() {
    return {
      id: null,
      r_social: "", 
      nombre: "",
      domicilio: "",
      telefono1: "",
      telefono2: "",
      extension: "",
      correo: "",
      altitud: "",
      latitud: "",
      activo: true,
    };
  }

  function emptyErrors() {
    return {
      r_social: "",
      nombre: "",
      domicilio: "",
      extension: "",
      correo: "",
    };
  }

  const columns = [
    { key: "r_social", label: "Empresa", sortable: true },
    { key: "nombre", label: "Sucursal", sortable: true },
    { key: "domicilio", label: "Domicilio", sortable: true },
    { key: "extension", label: "Extensión", sortable: true },
    { key: "correo", label: "Correo", sortable: true },
  ];
  
  const filtered = computed(() => {
    const q = search.value.trim().toUpperCase();
    if (!q) return rows.value;

    return rows.value.filter((r) =>
      [r.r_social, r.nombre, r.domicilio, r.extension, r.correo]
        .filter(Boolean)
        .some((x) => String(x).toUpperCase().includes(q))
    );
  });

  
  const empresasOptions = computed(() =>
    empresas.value.map((e) => ({
      value: String(e.id),
      label: e.ncorto,
    }))
  );

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

  // Cargar sucursales
  async function loadSucursales() {
    const r = await apiGet("/api/sucursales");
    if (r.ok) rows.value = r.data;
    else show(r.msg || "No se pudo cargar", "danger");
  }

  async function ensureEmpresasLoaded() {
    if (empresasLoaded.value || empresasLoading.value) return;

    empresasLoading.value = true;
    try {
      const r = await apiGet("/api/empresas");
      if (r.ok) {
        empresas.value = r.data;
        empresasLoaded.value = true;
      } else {
        show(r.msg || "No se pudieron cargar empresas", "danger");
      }
    } finally {
      empresasLoading.value = false;
    }
  }

  onMounted(async () => {
    await loadSucursales();
  });

  async function openCreate() {
    Object.assign(form, emptyForm());
    Object.assign(errors, emptyErrors());
    await ensureEmpresasLoaded();
    dialog.value = true;
  }

  // Abrir modal para editar o crear
  async function openEdit(item) {
    await ensureEmpresasLoaded();
    Object.assign(errors, emptyErrors());

    Object.assign(form, {
      id: item.id,
      r_social: item.r_social_id != null ? String(item.r_social_id) : "",
      nombre: item.nombre ?? "",
      domicilio: item.domicilio ?? "",
      telefono1: item.telefono1 ?? "",
      telefono2: item.telefono2 ?? "",
      extension: item.extension ?? "",
      correo: item.correo ?? "",
      altitud: item.altitud ?? "",
      latitud: item.latitud ?? "",
      activo: item.activo ?? true,
    });

    dialog.value = true;
  }

  function closeDialog() {
    dialog.value = false;
  }

  // Validar requeridos
  function validate() {
    Object.assign(errors, emptyErrors());

    if (!String(form.nombre).trim()) errors.nombre = "Sucursal es requerida";
    if (!String(form.extension).trim()) errors.extension = "Extensión es requerida";
    else if (String(form.extension).trim().length > 4) errors.extension = "Máximo 4 caracteres";

    if (!String(form.domicilio).trim()) errors.domicilio = "Domicilio es requerido";

    if (!String(form.correo).trim()) errors.correo = "Correo es requerido";
    else if (!/.+@.+\..+/.test(String(form.correo))) errors.correo = "Correo inválido";

    if (!String(form.r_social).trim()) errors.r_social = "Empresa es requerida";

    return !Object.values(errors).some(Boolean);
  }

  // Guardar
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
        r_social: Number(form.r_social), 
        nombre: form.nombre.trim().toUpperCase(),
        altitud: form.altitud === "" ? null : Number(form.altitud),
        latitud: form.latitud === "" ? null : Number(form.latitud),
      };

      if (!payload.id) {
        const r = await apiSend("/api/sucursales", "POST", payload);
        if (r.ok) {
          show("Sucursal agregada", "success");
          dialog.value = false;
          await loadSucursales();
        } else show(r.msg || "Error insertando, marque a Sistemas", "danger");
      } else {
        const r = await apiSend(`/api/sucursales/${payload.id}`, "PUT", payload);
        if (r.ok) {
          show("Sucursal actualizada", "success");
          dialog.value = false;
          await loadSucursales();
        } else show(r.msg || "No se pudo actualizar, marque a Sistemas", "warning");
      }
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

  /* estilo de zebra */
  .row-even > td { background: var(--surface); }
  .row-odd  > td { background: var(--row-alt); }
  

</style>
