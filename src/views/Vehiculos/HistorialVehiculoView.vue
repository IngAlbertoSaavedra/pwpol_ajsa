<template>
  <section class="historial-vehiculo">
    <div class="page-header">
      <h1>Reporte Historial Vehículo</h1>
      <p>Consulta el historial del vehículo por clave o placa y exporta el reporte en PDF.</p>
    </div>

    <div class="search-card">
      <div class="search-options">
        <label class="radio-option">
          <input v-model="tipoBusqueda" type="radio" value="clave" />
          <span>Clave Vehículo</span>
        </label>

        <label class="radio-option">
          <input v-model="tipoBusqueda" type="radio" value="placa" />
          <span>Placa</span>
        </label>
      </div>

      <div class="search-row">
        <div class="search-field">
          <label>{{ labelBusqueda }}</label>
          <input
            v-model.trim="criterio"
            type="text"
            :placeholder="placeholderBusqueda"
            maxlength="15"
            @keyup.enter="buscar"
          />
        </div>

        <div class="search-actions">
          <button class="btn btn-primary" :disabled="loadingBusqueda" @click="buscar">
            {{ loadingBusqueda ? "Buscando..." : "Buscar" }}
          </button>

          <button class="btn btn-secondary" :disabled="loadingBusqueda || loadingPdf" @click="limpiarTodo">
            Limpiar
          </button>

          <button
            class="btn btn-primary"
            :disabled="!puedeExportar || loadingPdf"
            @click="exportarPdf"
          >
            {{ loadingPdf ? "Exportando..." : "Exportar Reporte" }}
          </button>
        </div>
      </div>

      <div
        v-if="mensajeBusqueda"
        class="alert"
        :class="unidadEncontrada ? 'alert-success' : 'alert-warning'"
      >
        {{ mensajeBusqueda }}
      </div>
    </div>

    <div class="content-card">
      <div class="section-title">
        <h2>Datos del Vehículo</h2>
      </div>

      <div class="vehicle-grid">
        <div class="field">
          <span class="field-label">Clave</span>
          <span class="field-value">{{ vehiculo?.clave || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Placa</span>
          <span class="field-value">{{ vehiculo?.placa || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Sucursal</span>
          <span class="field-value">{{ vehiculo?.sucursal || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Marca</span>
          <span class="field-value">{{ vehiculo?.marca || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Sub Marca</span>
          <span class="field-value">{{ vehiculo?.submarca || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Modelo</span>
          <span class="field-value">{{ vehiculo?.anio || vehiculo?.modelo || "-" }}</span>
        </div>

        <div class="field">
          <span class="field-label">Combustible</span>
          <span class="field-value">{{ vehiculo?.combustible || "-" }}</span>
        </div>

        <div class="field field-wide">
          <span class="field-label">Chofer</span>
          <span class="field-value">{{ vehiculo?.chofer || "-" }}</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="section-title">
        <h2>Filtros del Reporte</h2>
      </div>

      <div class="filter-grid">
        <div class="form-field">
          <label>Fecha inicial</label>
          <input v-model="fechaInicio" type="date" :disabled="!vehiculo" />
        </div>

        <div class="form-field">
          <label>Fecha final</label>
          <input v-model="fechaFin" type="date" :disabled="!vehiculo" />
        </div>

        <div class="form-field">
          <label>Movimiento</label>
          <select v-model="filtroMovimiento" :disabled="!vehiculo">
            <option value="">Todos</option>
            <option v-for="item in movimientosUnicos" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label>Usuario</label>
          <select v-model="filtroUsuario" :disabled="!vehiculo">
            <option value="">Todos</option>
            <option v-for="item in usuariosUnicos" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label>Chofer</label>
          <select v-model="filtroChofer" :disabled="!vehiculo">
            <option value="">Todos</option>
            <option v-for="item in choferesUnicos" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>

        <div class="filter-actions">
          <button class="btn btn-secondary" :disabled="!vehiculo" @click="limpiarFiltros">
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div v-if="mensajeFiltro" class="alert alert-warning">
        {{ mensajeFiltro }}
      </div>
    </div>

    <div class="content-card">
      <div class="section-title section-title-inline">
        <h2>Historial del Vehículo</h2>
        <span class="records-badge">
          Registros mostrados: {{ historialFiltrado.length }}
        </span>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Movimiento</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Odómetro</th>
              <th>Chofer</th>
              <th>Comentario</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!historialFiltrado.length">
              <td colspan="7" class="empty-cell">Sin registros en el rango seleccionado</td>
            </tr>

            <tr v-for="item in historialFiltrado" :key="item.id">
              <td>{{ item.movimiento || "-" }}</td>
              <td>{{ formatDate(item.fecha) }}</td>
              <td>{{ item.hora || "-" }}</td>
              <td>{{ formatNumber(item.odometro) }}</td>
              <td>{{ item.chofer || "-" }}</td>
              <td>{{ item.comentario || "-" }}</td>
              <td>{{ item.usuario || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import authService from "@/services/auth.service.js";
import logoEmpresa from "@/assets/images/logo_small.png";

const tipoBusqueda = ref("clave");
const criterio = ref("");
const loadingBusqueda = ref(false);
const loadingPdf = ref(false);

const mensajeBusqueda = ref("");
const unidadEncontrada = ref(false);

const vehiculo = ref(null);
const historial = ref([]);

const fechaInicio = ref("");
const fechaFin = ref("");
const filtroMovimiento = ref("");
const filtroUsuario = ref("");
const filtroChofer = ref("");

const labelBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Clave de Vehículo" : "Placa"
);

const placeholderBusqueda = computed(() =>
  tipoBusqueda.value === "clave" ? "Número económico" : "Placa de la unidad"
);

const usuarioLogeado = computed(() => {
  const session = authService.getSession?.() || null;

  return (
    authService.userRef?.value ||
    session?.userusuario ||
    session?.user?.usuario ||
    "USUARIO"
  );
});

const puedeExportar = computed(() => !!vehiculo.value?.id);

const movimientosUnicos = computed(() => {
  return [...new Set(
    historial.value
      .map((item) => String(item.movimiento || "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "es"));
});

const usuariosUnicos = computed(() => {
  return [...new Set(
    historial.value
      .map((item) => String(item.usuario || "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "es"));
});

const choferesUnicos = computed(() => {
  return [...new Set(
    historial.value
      .map((item) => String(item.chofer || "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "es"));
});

const mensajeFiltro = computed(() => {
  if (!fechaInicio.value || !fechaFin.value) return "";

  const inicio = parseDateOnly(fechaInicio.value);
  const fin = parseDateOnly(fechaFin.value);

  if (!inicio || !fin) return "";
  if (inicio > fin) return "La fecha inicial no puede ser mayor que la fecha final.";

  return "";
});

const historialFiltrado = computed(() => {
  if (!Array.isArray(historial.value)) return [];
  if (mensajeFiltro.value) return [];

  const inicio = fechaInicio.value ? parseDateOnly(fechaInicio.value) : null;
  const fin = fechaFin.value ? parseDateOnly(fechaFin.value) : null;

  return historial.value.filter((item) => {
    const fechaItem = parseDateOnly(item.fecha);
    const movimientoItem = String(item.movimiento || "").trim();
    const usuarioItem = String(item.usuario || "").trim();
    const choferItem = String(item.chofer || "").trim();

    if (!fechaItem) return false;
    if (inicio && fechaItem < inicio) return false;
    if (fin && fechaItem > fin) return false;
    if (filtroMovimiento.value && movimientoItem !== filtroMovimiento.value) return false;
    if (filtroUsuario.value && usuarioItem !== filtroUsuario.value) return false;
    if (filtroChofer.value && choferItem !== filtroChofer.value) return false;

    return true;
  });
});

function parseDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const text = String(value).trim();

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function normalizarTexto(valor) {
  return String(valor ?? "").trim().toUpperCase();
}

function limpiarFiltros() {
  fechaInicio.value = "";
  fechaFin.value = "";
  filtroMovimiento.value = "";
  filtroUsuario.value = "";
  filtroChofer.value = "";
}

function limpiarTodo() {
  tipoBusqueda.value = "clave";
  criterio.value = "";
  mensajeBusqueda.value = "";
  unidadEncontrada.value = false;
  vehiculo.value = null;
  historial.value = [];
  limpiarFiltros();
}

async function buscar() {
  const valor = normalizarTexto(criterio.value);

  mensajeBusqueda.value = "";
  unidadEncontrada.value = false;
  vehiculo.value = null;
  historial.value = [];
  limpiarFiltros();

  if (!valor) {
    mensajeBusqueda.value =
      tipoBusqueda.value === "clave"
        ? "Debes capturar la clave del vehículo"
        : "Debes capturar la placa";
    return;
  }

  loadingBusqueda.value = true;

  try {
    const params = new URLSearchParams();
    params.set(tipoBusqueda.value, valor);

    const response = await fetch(`/api/vehiculos/historial?${params.toString()}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensajeBusqueda.value = data.msg || "Unidad no encontrada";
      return;
    }

    vehiculo.value = data.data?.vehiculo ?? null;
    historial.value = Array.isArray(data.data?.historial) ? data.data.historial : [];
    unidadEncontrada.value = true;
    mensajeBusqueda.value = "Unidad encontrada";
  } catch (error) {
    console.error(error);
    mensajeBusqueda.value = "Error consultando la unidad";
  } finally {
    loadingBusqueda.value = false;
  }
}

function getFechaHoraActual() {
  const ahora = new Date();

  return {
    fecha: ahora.toLocaleDateString("es-MX"),
    hora: ahora.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

function getDescripcionFiltro() {
  const partes = [];

  if (fechaInicio.value && fechaFin.value) {
    partes.push(`Fechas: del ${formatDate(fechaInicio.value)} al ${formatDate(fechaFin.value)}`);
  } else if (fechaInicio.value) {
    partes.push(`Fechas: desde ${formatDate(fechaInicio.value)}`);
  } else if (fechaFin.value) {
    partes.push(`Fechas: hasta ${formatDate(fechaFin.value)}`);
  } else {
    partes.push("Fechas: sin filtro");
  }

  partes.push(`Movimiento: ${filtroMovimiento.value || "Todos"}`);
  partes.push(`Usuario: ${filtroUsuario.value || "Todos"}`);
  partes.push(`Chofer: ${filtroChofer.value || "Todos"}`);

  return partes.join(" | ");
}

async function cargarImagenComoBase64(src) {
  const response = await fetch(src);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function exportarPdf() {
  if (!vehiculo.value?.id) return;
  if (mensajeFiltro.value) {
    mensajeBusqueda.value = mensajeFiltro.value;
    return;
  }

  loadingPdf.value = true;

  try {
    const doc = new jsPDF("l", "mm", "a4");
    const { fecha, hora } = getFechaHoraActual();
    const nombreArchivo = `REPORTE_HISTORIAL_${vehiculo.value.clave || "VEHICULO"}_${fecha.replaceAll("/", "-")}.pdf`;

    let logoBase64 = null;
    try {
      logoBase64 = await cargarImagenComoBase64(logoEmpresa);
    } catch (error) {
      console.error("No se pudo cargar el logo para el PDF:", error);
    }

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 14, 8, 28, 22);
    }

    doc.setFontSize(16);
    doc.text("Reporte Historial Vehicular", 48, 16);

    doc.setFontSize(10);
    doc.text(`Fecha de descarga: ${fecha}`, 48, 24);
    doc.text(`Hora de descarga: ${hora}`, 48, 29);
    doc.text(`Usuario: ${usuarioLogeado.value}`, 48, 34);

    doc.text(`Filtro aplicado: ${getDescripcionFiltro()}`, 14, 42);

    doc.setFontSize(11);
    doc.text("Datos de la unidad", 14, 50);

    const datosUnidad = [
      ["Clave", vehiculo.value?.clave || "-"],
      ["Placa", vehiculo.value?.placa || "-"],
      ["Sucursal", vehiculo.value?.sucursal || "-"],
      ["Marca", vehiculo.value?.marca || "-"],
      ["Sub Marca", vehiculo.value?.submarca || "-"],
      ["Modelo", String(vehiculo.value?.anio || vehiculo.value?.modelo || "-")],
      ["Combustible", vehiculo.value?.combustible || "-"],
      ["Chofer", vehiculo.value?.chofer || "-"],
    ];

    autoTable(doc, {
      startY: 53,
      head: [["Campo", "Valor"]],
      body: datosUnidad,
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [220, 235, 245],
        textColor: [20, 30, 50],
      },
      theme: "grid",
    });

    const bodyTabla = historialFiltrado.value.map((item) => [
      item.movimiento || "-",
      formatDate(item.fecha),
      item.hora || "-",
      formatNumber(item.odometro),
      item.chofer || "-",
      item.comentario || "-",
      item.usuario || "-",
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [[
        "Movimiento",
        "Fecha",
        "Hora",
        "Odómetro",
        "Chofer",
        "Comentario",
        "Usuario",
      ]],
      body: bodyTabla.length ? bodyTabla : [["-", "-", "-", "-", "-", "-", "-"]],
      styles: {
        fontSize: 8,
        cellWidth: "wrap",
      },
      columnStyles: {
        4: { cellWidth: 45 },
        5: { cellWidth: 70 },
        6: { cellWidth: 35 },
      },
      headStyles: {
        fillColor: [220, 235, 245],
        textColor: [20, 30, 50],
      },
      theme: "grid",
    });

    doc.save(nombreArchivo);
  } catch (error) {
    console.error(error);
    mensajeBusqueda.value = "No se pudo exportar el reporte";
  } finally {
    loadingPdf.value = false;
  }
}

function formatDate(value) {
  if (!value) return "-";

  const parsed = parseDateOnly(value);
  if (!parsed) return "-";

  return parsed.toLocaleDateString("es-MX");
}

function formatNumber(value) {
  const number = Number(value || 0);
  return number.toLocaleString("es-MX");
}
</script>

<style scoped>
.historial-vehiculo {
  display: grid;
  gap: 16px;
}

.page-header h1 {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: var(--muted);
}

.search-card,
.content-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.search-options {
  display: flex;
  gap: 18px;
  margin-bottom: 14px;
}

.radio-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
}

.search-field {
  width: 30%;
  min-width: 280px;
  max-width: 420px;
  flex: 0 0 auto;
}

.search-field label,
.form-field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.search-field input,
.form-field input,
.form-field select {
  width: 100%;
  height: 46px;
  border: 1px solid var(--input-border);
  border-radius: 12px;
  padding: 0 14px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  background: var(--surface);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-field input::placeholder {
  color: var(--input-placeholder);
}

.search-field input:focus,
.form-field input:focus,
.form-field select:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px var(--input-focus-shadow);
}

.search-actions,
.filter-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: end;
}

.btn {
  height: 40px;
  border: 0;
  border-radius: 10px;
  padding: 0 16px;
  font-weight: 700;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
}

.alert {
  margin-top: 12px;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
}

.alert-success {
  background: var(--alert-success-bg);
  color: var(--alert-success-text);
  border: 1px solid var(--alert-success-border);
}

.alert-warning {
  background: var(--alert-warning-bg);
  color: var(--alert-warning-text);
  border: 1px solid var(--alert-warning-border);
}

.section-title {
  margin-bottom: 12px;
}

.section-title-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-title h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.records-badge {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  background: var(--surface);
}

.vehicle-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 52px;
}

.field-wide {
  grid-column: span 2;
}

.field-label {
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 700;
}

.field-value {
  font-size: 1rem;
  color: var(--text);
  font-weight: 600;
  word-break: break-word;
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border: 1px solid var(--border);
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background: var(--table-header-bg);
  font-size: 0.9rem;
}

.empty-cell {
  text-align: center;
  color: var(--muted);
  font-weight: 600;
}

@media (max-width: 768px) {
  .search-actions,
  .filter-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
  }

  .search-field {
    width: 100%;
    max-width: none;
  }

  .field-wide {
    grid-column: span 1;
  }

  .section-title-inline {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>