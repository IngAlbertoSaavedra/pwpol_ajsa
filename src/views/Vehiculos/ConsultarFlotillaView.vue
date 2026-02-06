<template>
  <BaseToast />

  <DataTable
    :rows="rows"
    :columns="columns"
    rowKey="id"
    :pageSize="8"
  >
    <template #actions="{ row }">
      <BaseButton variant="secondary" @click="openEdit(row)">Editar</BaseButton>
      <BaseButton variant="danger" @click="remove(row)">Eliminar</BaseButton>
    </template>
  </DataTable>

  <BaseModal v-model:open="modalOpen" title="Editar">
    <BaseInput v-model="form.nombre" label="Nombre" :required="true" :error="errors.nombre" />
    <template #footer>
      <BaseButton variant="secondary" @click="modalOpen=false">Cancelar</BaseButton>
      <BaseButton variant="primary" @click="save">Guardar</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseToast from '@/components/ui/BaseToast.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { useToast } from '@/composables/useToast'

const { show } = useToast()

const rows = ref([
  { id: 1, nombre: 'Sucursal 1', activo: true },
  { id: 2, nombre: 'Sucursal 2', activo: false },
])

const columns = [
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'activo', label: 'Activo', sortable: true },
]

const modalOpen = ref(false)
const form = reactive({ id: null, nombre: '' })
const errors = reactive({ nombre: '' })

function openEdit(row) {
  form.id = row.id
  form.nombre = row.nombre
  errors.nombre = ''
  modalOpen.value = true
}

function validate() {
  errors.nombre = form.nombre.trim() ? '' : 'Este campo es obligatorio'
  return !errors.nombre
}

function save() {
  if (!validate()) return
  const idx = rows.value.findIndex(r => r.id === form.id)
  if (idx >= 0) rows.value[idx].nombre = form.nombre
  modalOpen.value = false
  show('Guardado', 'success')
}

function remove(row) {
  rows.value = rows.value.filter(r => r.id !== row.id)
  show('Eliminado', 'warning')
}
</script>
