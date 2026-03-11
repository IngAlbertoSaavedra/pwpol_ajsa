<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Empresas</h2>
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
        @click="openCreate">
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

      <template #actions />

    </DataTable>

    <BaseModal v-model:open="dialog" :title="form.id ? 'Editar Empresa' : 'Agregar Empresa'">
      <form class="form-grid" @submit.prevent="save">
        <BaseInput
          v-model="form.ncorto"
          label="Nombre corto"
          :required="true"
          :error="errors.ncorto"
          placeholder="mayúsculas"
        />

        <BaseInput
          v-model="form.nombre"
          label="Nombre"
          :required="true"
          :error="errors.nombre"
          placeholder="mayúsculas"
        />

        <BaseInput
          v-model="form.rfc"
          label="RFC"
          :required="true"
          :error="errors.rfc"
          placeholder="RFC"
        />

        <BaseInput
          v-model="form.presentacion"
          label="Presentación"
          :required="true"
          :error="errors.presentacion"
          placeholder="número"
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
  import { computed, onMounted, reactive, ref } from 'vue';

  import BaseToast from '@/components/ui/BaseToast.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import DataTable from '@/components/ui/DataTable.vue';
  import { useToast } from '@/composables/useToast';

  const { show } = useToast();

  const rows = ref([]); 
  const search = ref("");
  const dialog = ref(false);
  const saving = ref(false);

  const form = reactive(emptyForm());
  const errors = reactive(emptyErrors());

  const empresas = ref([]);
  const empresasLoading = ref(false);
  const empresasLoaded = ref(false);

  function emptyForm() {
    return {
      id: null,
      ncorto: "",
      nombre: "",
      rfc: "",
      presentacion: "",
      activo: true,
    };
  }

  function emptyErrors() {
    return {
      ncorto: "",
      nombre: "",
      rfc: "",
      presentacion: "",
    };
  }

  const columns = [
    { key: 'ncorto', label: 'Nombre corto', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'rfc', label: 'RFC', sortable: true },
    { key: 'presentacion', label: 'Presentación', sortable: true },
    { key: 'activo', label: 'Activo', sortable: true },
  ];

  const filtered = computed(() => {
    const s = search.value.toUpperCase();
    if (!s) return rows.value;

    return rows.value.filter((r) =>
      [r.ncorto, r.nombre, r.rfc, r.presentacion]
        .filter(Boolean)
        .some((e) => String(e).toUpperCase().includes(s))
    );
  });

  async function apiGet(url) {
    const res = await fetch(url);
    return res.json();
  }

  async function apiSend(url, method, body) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function loadEmpresas() {
    const r = await apiGet('/api/empresas');
    if (r.ok) rows.value = r.data;
    else show(r.msg || "No se pudieron cargar las empresas.", "danger");
  }

  async function openCreate() {
    Object.assign(form, emptyForm());
    Object.assign(errors, emptyErrors());
    dialog.value = true;
  }

  async function openEdit(item) {
  
    Object.assign(errors, emptyErrors());

    Object.assign(form, {
      id: item.id,
      ncorto: item.ncorto ?? "",
      nombre: item.nombre ?? "",
      rfc: item.rfc ?? "",
      presentacion: item.presentacion ?? "",  
      activo: item.activo ?? true,
    });

    dialog.value = true;
  }

  function closeDialog() {
    dialog.value = false;
  }

  function validate() {
    Object.assign(errors, emptyErrors());

    if (!String(form.ncorto).trim()) errors.ncorto = "Nombre corto es requerido";
    else if (String(form.ncorto).trim().length > 20) errors.ncorto = "Máximo 20 caracteres";
    if (!String(form.nombre).trim()) errors.nombre = "Nombre es requerido";
    else if (String(form.nombre).trim().length > 50) errors.nombre = "Máximo 50 caracteres";

    if (!String(form.rfc).trim()) errors.rfc = "RFC es requerido";
    else if (String(form.rfc).trim().length > 15 ) errors.rfc = "Máximo 15 caracteres";

    if (!String(form.presentacion).trim()) errors.presentacion = "Presentación es requerida";
    else if (isNaN(Number(form.presentacion))) errors.presentacion = "Presentación debe ser un número";

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
        ncorto: form.ncorto.trim().toUpperCase(),
        nombre: form.nombre.trim().toUpperCase(),
        rfc: form.rfc.trim().toUpperCase(),
      };

      if (!payload.id) {
        const r = await apiSend("/api/empresas", "POST", payload);
        if (r.ok) {
          show("Empresa agregada", "success");
          dialog.value = false;
          await loadEmpresas();
        } else show(r.msg || "Error insertando, marque a Sistemas", "danger");
      } else {
        const r = await apiSend(`/api/empresas/${payload.id}`, "PUT", payload);
        if (r.ok) {
          show("Empresa actualizada", "success");
          dialog.value = false;
          await loadEmpresas();
        } else show(r.msg || "No se pudo actualizar, marque a Sistemas", "warning");
      }
    } finally {
      saving.value = false;
    }
  }

  onMounted(async () => {
    await loadEmpresas();
  });

</script>

<style scoped>

  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
</style>
