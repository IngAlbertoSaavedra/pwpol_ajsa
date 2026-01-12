<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Correo" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button>Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import authService from "../services/auth.service";

const email = ref("");
const password = ref("");

const login = async () => {
  await authService.login(email.value, password.value);
};
</script>

<style scoped>
.login {
  max-width: 300px;
  margin: 4rem auto;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
}
</style>
