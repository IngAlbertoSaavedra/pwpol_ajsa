<template>
  <div class="content">
    <Base-toast />

    <div class="toolbar">
      <h2 class="title">Empresas</h2>
      <div class="spacer"></div>

      <BaseInput 
        v-model="search" 
        label=""
        placeholder="Buscar..." />
    </div>
    
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue';

  import BaseToast from '@/components/ui/BaseToast.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import BaseSelect from '@/components/ui/BaseSelect.vue';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import DataTable from '@/components/ui/DataTable.vue';
  import { useToast } from '@/composables/useToast';

  const { show } = useToast();

  const rows = ref([]); 
  const search = ref("");
  const dialog = ref(false);
  const saving = ref(false);

  const form = reactive(emptyForm());
  const error = reactive(emptyError());

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

  function emptyError() {
    return {
      ncorto: null,
      nombre: null,
      rfc: null,
      presentacion: null,
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

  onMounted(async () => {
    await loadEmpresas();
  });

</script>

<style scoped>

</style>
