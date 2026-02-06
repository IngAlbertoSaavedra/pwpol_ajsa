<template>
  <div class="table-wrap">
    <div class="table-tools" v-if="searchable">
      <input
        class="input"
        type="text"
        :value="search"
        placeholder="Buscar..."
        @input="onSearch"
      />
      <div class="spacer"></div>
      <slot name="tools" />
    </div>

    <table class="table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="th"
            :class="{ sortable: col.sortable }"
            @click="col.sortable && toggleSort(col.key)"
          >
            <span>{{ col.label }}</span>
            <span v-if="col.sortable" class="sort-ind">
              <span v-if="sortKey === col.key">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
            </span>
          </th>

          <th v-if="$slots.actions" class="th">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(row, i) in pagedRows" :key="getRowKey(row, i)">
          <slot
            v-if="$slots.row"
            name="row"
            :row="row"
            :index="rowIndexOffset + i"
            :pageIndex="i"
            :columns="columns"
          />
          <tr v-else>
            <td v-for="col in columns" :key="col.key" class="td">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>

            <td v-if="$slots.actions" class="td">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </template>

        <tr v-if="pagedRows.length === 0">
          <td class="td empty" :colspan="columns.length + ($slots.actions ? 1 : 0)">
            Sin resultados
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <span class="muted">{{ pageInfo }}</span>

      <div class="pager__buttons">
        <button class="btn btn--ghost" :disabled="page === 1" @click="page--">
          Anterior
        </button>
        <button class="btn btn--ghost" :disabled="page === totalPages" @click="page++">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'

  const props = defineProps({
    rows: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] }, // [{ key, label, sortable }]
    rowKey: { type: String, default: 'id' },
    pageSize: { type: Number, default: 10 },
    searchable: { type: Boolean, default: true },
    searchKeys: { type: Array, default: () => [] }, // si vacío, busca en todas las columnas
  })

  const search = ref('')
  const page = ref(1)
  const sortKey = ref('')
  const sortDir = ref('asc') // asc | desc

  watch(
    () => props.rows,
    () => {
      page.value = 1
    }
  )

  function onSearch(e) {
    search.value = e.target.value
    page.value = 1
  }

  function toggleSort(key) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  const filteredRows = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return props.rows

    const keys = props.searchKeys.length
      ? props.searchKeys
      : props.columns.map(c => c.key)

    return props.rows.filter(r =>
      keys.some(k => String(r[k] ?? '').toLowerCase().includes(q))
    )
  })

  const sortedRows = computed(() => {
    if (!sortKey.value) return filteredRows.value

    const key = sortKey.value
    const dir = sortDir.value

    return [...filteredRows.value].sort((a, b) => {
      const av = a[key]
      const bv = b[key]

      const an = Number(av)
      const bn = Number(bv)
      const bothNumeric = !Number.isNaN(an) && !Number.isNaN(bn)

      let cmp = 0
      if (bothNumeric) cmp = an - bn
      else cmp = String(av ?? '').localeCompare(String(bv ?? ''), 'es', { sensitivity: 'base' })

      return dir === 'asc' ? cmp : -cmp
    })
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / props.pageSize)))

  watch(page, (v) => {
    if (v < 1) page.value = 1
    if (v > totalPages.value) page.value = totalPages.value
  })

  const pagedRows = computed(() => {
    const start = (page.value - 1) * props.pageSize
    return sortedRows.value.slice(start, start + props.pageSize)
  })

  const rowIndexOffset = computed(() => (page.value - 1) * props.pageSize)

  const pageInfo = computed(() => {
    const total = sortedRows.value.length
    if (total === 0) return '0 registros'
    const start = (page.value - 1) * props.pageSize + 1
    const end = Math.min(page.value * props.pageSize, total)
    return `${start}-${end} de ${total}`
  })

  function getRowKey(row, i) {
    const k = row?.[props.rowKey]
    return k != null ? k : `${rowIndexOffset.value + i}`
  }
</script>
