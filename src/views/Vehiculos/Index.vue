<template>
  <div class="vehiculos-view">
    <!-- Barra superior para los menús -->
    <div class="menus-bar">
      <!-- VEHICULO -->
      <v-menu
        location="bottom"
        transition="slide-y-transition"
        :close-on-content-click="true"
      >
        <template #activator="{ props: menuProps }">
          <v-tooltip text="Opciones de vehículo" location="bottom">
            <template #activator="{ props: tipProps }">
              <!-- Importante: combinar props del menú + tooltip -->
              <v-btn
                variant="text"
                v-bind="{ ...menuProps, ...tipProps }"
              >
                Vehiculo
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <v-list density="compact">
          <v-list-item
            title="Registrar Carga"
            @click="goTo('registrar-carga')"
          />
          <v-list-item
            title="Consultar Vehiculo"
            @click="goTo('consultar-vehiculo')"
          />
        </v-list>
      </v-menu>

      <!-- FLOTILLA -->
      <v-menu
        location="bottom"
        transition="slide-y-transition"
        :close-on-content-click="true"
      >
        <template #activator="{ props: menuProps }">
          <v-tooltip text="Opciones de flotilla" location="bottom">
            <template #activator="{ props: tipProps }">
              <v-btn
                variant="text"
                v-bind="{ ...menuProps, ...tipProps }"
              >
                Flotilla
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <v-list density="compact">
          <v-list-item
            title="Consultar Flotilla"
            @click="goTo('consultar-flotilla')"
          />
        </v-list>
      </v-menu>

      <!-- REPORTES -->
      <v-menu
        location="bottom"
        transition="slide-x-transition"
        :close-on-content-click="true"
      >
        <template #activator="{ props: menuProps }">
          <v-tooltip text="Reportes" location="bottom">
            <template #activator="{ props: tipProps }">
              <v-btn
                variant="text"
                v-bind="{ ...menuProps, ...tipProps }"
              >
                Reportes
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <v-list density="compact">
          <v-list-item
            title="Rendimiento de Vehiculo"
            @click="goTo('rendimiento-vehiculo')"
          />
          <v-list-item
            title="Rendimiento de Flotilla"
            @click="goTo('rendimiento-flotilla')"
          />
        </v-list>
      </v-menu>
    </div>

    <!-- Tu contenido actual -->
    <div class="view-content">
      <h1>Vehículos</h1>
      <p>Contenido de la vista...</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

/**
 * Aquí tienes 2 opciones:
 * 1) Navegar por name (recomendado) -> define esos names en router
 * 2) Navegar por path -> cambia a router.push('/ruta')
 */
function goTo(name) {
  router.push({ name });
}
</script>

<style scoped>
.vehiculos-view {
  width: 100%;
}

.menus-bar {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
}

.view-content {
  padding: 12px;
}
</style>
