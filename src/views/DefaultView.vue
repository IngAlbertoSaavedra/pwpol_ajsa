<template>
  <section class="default-page">
    <div class="hero">
      <h1 class="hero-title">
        Hola <strong>{{ nombre }}</strong>, bienvenido a
        <strong>PWPOL</strong> POLIACERO
      </h1>

      <p class="hero-subtitle">Directorio Poliacero</p>
    </div>

    <BaseToast />

    <div class="directory-card">
      <div class="directory-toolbar">

        <div class="toolbar-right">
          <div class="search-box">
            <span class="search-icon">⌕</span>
            <input
              v-model.trim="search"
              type="text"
              placeholder="Búsqueda"
              class="search-input"
            />
          </div>
        </div>
      </div>

      <div class="table-wrap">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Sucursal / Nombre</th>
              <th>Teléfono</th>
              <th>Ext</th>
              <th>Correo</th>
              <th>Domicilio</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="state-cell">Cargando directorio...</td>
            </tr>

            <tr v-else-if="!filteredRows.length">
              <td colspan="6" class="state-cell">No se encontraron sucursales</td>
            </tr>

            <tr v-for="row in filteredRows" :key="row.id">
              <td>{{ row.r_social || "-" }}</td>
              <td>{{ row.nombre || "-" }}</td>
              <td>{{ formatTelefono(row.telefono1, row.telefono2) }}</td>
              <td>{{ row.extension || "-" }}</td>
              <td>
                <a
                  v-if="row.correo"
                  class="mail-link"
                  :href="`mailto:${row.correo}`"
                >
                  {{ row.correo }}
                </a>
                <span v-else>-</span>
              </td>
              <td>{{ row.domicilio || "-" }}</td>
              
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { computed, onMounted, ref } from "vue";
  import BaseToast from "@/components/ui/BaseToast.vue";
  import { useToast } from "@/composables/useToast";
  import authService from "@/services/auth.service.js";

  const { show } = useToast();

  const loading = ref(false);
  const search = ref("");
  const rows = ref([]);

  const session = authService.getSession?.() || {};
  const user = session.user || {};


  const nombre = computed(() => authService.nombreRef.value);

  const filteredRows = computed(() => {
    const q = search.value.trim().toUpperCase();

    if (!q) return rows.value;

    return rows.value.filter((item) =>
      [
        item.nombre,
        item.telefono1,
        item.telefono2,
        item.extension,
        item.correo,
        item.domicilio,
        item.r_social,
      ]
        .filter(Boolean)
        .some((value) => String(value).toUpperCase().includes(q))
    );
  });

  function formatTelefono(telefono1, telefono2) {
    if (telefono1 && telefono2) return `${telefono1} / ${telefono2}`;
    return telefono1 || telefono2 || "-";
  }

  async function loadSucursales() {
    loading.value = true;

    try {
      const res = await fetch("/api/sucursales");
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.msg || "No se pudo cargar el directorio");
      }

      rows.value = Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error(error);
      show(error?.message || "Error cargando sucursales", "danger");
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadSucursales();
  });
</script>

<style scoped>
  .default-page {
    padding: 28px 40px;
    background: #dfe2e6;
    min-height: 100%;
  }

  .hero {
    margin-bottom: 18px;
  }

  .hero-title {
    margin: 0;
    font-size: 28px;
    font-weight: 400;
    color: #111;
    line-height: 1.2;
  }

  .hero-title strong {
    font-weight: 800;
  }

  .hero-subtitle {
    margin: 22px 0 0;
    font-size: 18px;
    color: #1a1a1a;
  }

  .directory-card {
    background: #ececec;
    border: 1px solid #d2d2d2;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .directory-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 10px 0;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toolbar-btn {
    width: 64px;
    height: 36px;
    border: 1px solid #c9c9c9;
    border-radius: 6px;
    background: #f2f2f2;
    color: #222;
    font-size: 24px;
    line-height: 1;
    cursor: default;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .toolbar-right {
    margin-left: auto;
    width: 100%;
    max-width: 390px;
  }

  .search-box {
    display: flex;
    align-items: center;
    background: #f1f1f1;
    border: 1px solid #cfcfcf;
    border-radius: 6px;
    padding: 0 12px;
    height: 48px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .search-icon {
    font-size: 18px;
    color: #555;
    margin-right: 10px;
  }

  .search-input {
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: #222;
  }

  .table-wrap {
    overflow: auto;
    margin-top: 10px;
  }

  .directory-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 980px;
    background: #efefef;
  }

  .directory-table thead th {
    background: #e6e6e6;
    color: #111;
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    padding: 10px 12px;
    border: 1px solid #c9c9c9;
    white-space: nowrap;
  }

  .directory-table tbody td {
    padding: 8px 12px;
    border: 1px solid #cfcfcf;
    font-size: 14px;
    color: #1a1a1a;
    background: #efefef;
    vertical-align: middle;
  }

  .directory-table tbody tr:hover td {
    background: #e7edf6;
  }

  .state-cell {
    text-align: center;
    padding: 22px !important;
    color: #555;
  }

  .mail-link {
    color: #0f3d78;
    text-decoration: none;
  }

  .mail-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 900px) {
    .default-page {
      padding: 20px 16px;
    }

    .hero-title {
      font-size: 22px;
    }

    .directory-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .toolbar-right {
      max-width: none;
    }
  }
</style>