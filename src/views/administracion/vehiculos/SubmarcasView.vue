<template>
  <div class="content">
    <BaseToast />

    <div class="toolbar">
      <h2 class="title">Submarcas</h2>
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
            <span v-if="col.key === 'activa'">
              {{ normalizeActiva(row.activa) ? "SI" : "NO" }}
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
      :title="form.id ? 'Editar Submarca' : 'Agregar Submarca'"
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

        <BaseInput
          v-model="form.submarca"
          label="Submarca"
          :required="true"
          :error="errors.submarca"
          placeholder="Ej. YARIS"
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
  import BaseSelect from "@/components/ui/BaseSelect.vue";
  import BaseModal from "@/components/ui/BaseModal.vue";
  import DataTable from "@/components/ui/DataTable.vue";
  import { useToast } from "@/composables/useToast";

  const { show } = useToast();

  const rows = ref([]);
  const marcas = ref([]);
  const search = ref("");
  const dialog = ref(false);
  const saving = ref(false);

  const form = reactive(emptyForm());
  const errors = reactive(emptyErrors());

  function emptyForm() {
    return {
      id: null,
      id_marca: "",
      submarca: "",
      activa: true,
    };
  }

  function emptyErrors() {
    return {
      id_marca: "",
      submarca: "",
    };
  }

  const columns = [
    { key: "marca", label: "Marca", sortable: true },
    { key: "submarca", label: "Submarca", sortable: true },
    { key: "activa", label: "Activa", sortable: true },
  ];

  const marcaOptions = computed(() => {
    return (marcas.value || []).map((m) => ({
      label: m.marca,
      value: String(m.id),
    }));
  });

  const filtered = computed(() => {
    const s = search.value.trim().toUpperCase();
    if (!s) return rows.value;

    return rows.value.filter((r) =>
      [
        r.marca,
        r.submarca,
        normalizeActiva(r.activa) ? "SI" : "NO",
      ]
        .filter((e) => e !== null && e !== undefined)
        .some((e) => String(e).toUpperCase().includes(s))
    );
  });

  function normalizeActiva(value) {
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

  async function loadSubmarcas() {
    const r = await apiGet("/api/submarcas");

    if (r.ok) {
      rows.value = Array.isArray(r.data) ? r.data : [];
    } else {
      show(r.msg || "No se pudieron cargar las submarcas.", "danger");
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

  function openCreate() {
    Object.assign(form, emptyForm());
    Object.assign(errors, emptyErrors());
    dialog.value = true;
  }

  function openEdit(item) {
    Object.assign(errors, emptyErrors());

    Object.assign(form, {
      id: item.id,
      id_marca: String(item.id_marca ?? ""),
      submarca: item.submarca ?? "",
      activa: normalizeActiva(item.activa),
    });

    dialog.value = true;
  }

  function closeDialog() {
    dialog.value = false;
  }

  function validate() {
    Object.assign(errors, emptyErrors());

    const submarca = String(form.submarca || "").trim();

    if (!String(form.id_marca || "").trim()) {
      errors.id_marca = "La marca es requerida";
    }

    if (!submarca) {
      errors.submarca = "La submarca es requerida";
    } else if (submarca.length > 50) {
      errors.submarca = "Máximo 50 caracteres";
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
        submarca: String(form.submarca).trim().toUpperCase(),
        activa: !!form.activa,
      };

      let r;

      if (!payload.id) {
        r = await apiSend("/api/submarcas", "POST", payload);

        if (r.ok) {
          show("Submarca agregada", "success");
          dialog.value = false;
          await loadSubmarcas();
        } else {
          show(r.msg || "Error insertando submarca, marque a Sistemas", "danger");
          console.error("Error POST /api/submarcas:", r);
        }
      } else {
        r = await apiSend(`/api/submarcas/${payload.id}`, "PUT", payload);

        if (r.ok) {
          show("Submarca actualizada", "success");
          dialog.value = false;
          await loadSubmarcas();
        } else {
          show(r.msg || "No se pudo actualizar la submarca", "warning");
          console.error(`Error PUT /api/submarcas/${payload.id}:`, r);
        }
      }
    } catch (error) {
      console.error("Error al guardar submarca:", error);
      show("Ocurrió un error al guardar la submarca", "danger");
    } finally {
      saving.value = false;
    }
  }

  onMounted(async () => {
    await Promise.all([loadSubmarcas(), loadMarcas()]);
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