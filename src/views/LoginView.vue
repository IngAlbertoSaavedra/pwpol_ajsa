<!-- D:\Repositorios\pwpol_ajsa\src\views\LoginView.vue -->
<template>
  <section class="login-page">
    <div class="login-shell">
      <aside class="login-left" aria-hidden="true">
        <div class="login-brand">
          <img class="brand-logo" src="../assets/images/logo_small.png" alt="Logo PWPol" />
          <div class="brand-text">
            <h1>PWPol</h1>
            <p>Acceso al sistema</p>
          </div>
        </div>

        <ul class="login-bullets">
          <li>Validación contra base de datos</li>
          <li>Acceso restringido por sesión</li>
          <li>Interfaz clara y accesible</li>
        </ul>
      </aside>

      <main class="login-card" role="region" aria-label="Formulario de inicio de sesión">
        <header class="card-header">
          <h2>Iniciar sesión</h2>
          <p>Escribe tus credenciales para continuar</p>
        </header>

        <p v-if="errorMessage" class="alert" role="alert">
          {{ errorMessage }}
        </p>

        <form class="form" @submit.prevent="onSubmit">
          <label class="field">
            <span class="label">Usuario</span>
            <input
              class="input"
              v-model.trim="usuario"
              type="text"
              autocomplete="username"
              placeholder="Ej. a.saavedra"
              :disabled="isLoading"
              required
            />
          </label>

          <label class="field">
            <span class="label">Contraseña</span>

            <div class="password-row">
              <input
                class="input"
                v-model="clave"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                :disabled="isLoading"
                required
              />
              <button
                class="toggle"
                type="button"
                @click="showPassword = !showPassword"
                :disabled="isLoading"
                :aria-pressed="showPassword ? 'true' : 'false'"
                aria-label="Mostrar u ocultar contraseña"
              >
                {{ showPassword ? "🙈" : "👁️" }}
              </button>
            </div>
          </label>

          <button class="btn" type="submit" :disabled="isLoading">
            <span v-if="!isLoading">Entrar</span>
            <span v-else>Validando…</span>
          </button>

          <p class="hint">
            Si no tienes acceso, contacta al administrador.
          </p>
        </form>
      </main>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const usuario = ref("");
const clave = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const route = useRoute();

const onSubmit = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    // ⚠️ Este endpoint lo atiende TU BACKEND (Node/Express).
    // El frontend NO toca SQL Server.
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: usuario.value,
        clave: clave.value,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      errorMessage.value = data?.message || "No se pudo iniciar sesión.";
      return;
    }

    // Guardamos sesión simple (token/objeto). Luego puedes ampliar a JWT.
    localStorage.setItem("pwpol_session", JSON.stringify(data.session));

    const redirectTo = typeof route.query.redirect === "string" ? route.query.redirect : "/";
    await router.replace(redirectTo);
  } catch (e) {
    errorMessage.value = "No se pudo conectar al servidor. Verifica que el backend esté encendido.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #eef3f9 0%, #f7f9fc 60%, #eef3f9 100%);
}

.login-shell {
  width: 100%;
  max-width: 960px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
}

.login-left {
  border-radius: 18px;
  padding: 22px;
  background: #002455;
  color: white;
  box-shadow: 0 16px 44px rgba(0,0,0,0.14);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.brand-logo {
  width: 54px;
  height: 54px;
  object-fit: contain;
  border-radius: 14px;
  background: rgba(255,255,255,0.12);
  padding: 8px;
}

.brand-text h1 {
  margin: 0;
  font-size: 26px;
  letter-spacing: 0.4px;
}

.brand-text p {
  margin: 4px 0 0;
  opacity: 0.85;
  font-size: 13px;
}

.login-bullets {
  margin: 14px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  opacity: 0.95;
}

.login-card {
  border-radius: 18px;
  padding: 18px 18px 16px;
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 16px 44px rgba(0,0,0,0.10);
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.card-header p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.7;
}

.alert {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 38, 38, 0.25);
  color: #991b1b;
  font-size: 13px;
}

.form {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 13px;
  font-weight: 700;
  opacity: 0.85;
}

.input {
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.14);
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  background: white;
}

.input:focus {
  border-color: rgba(0, 36, 85, 0.55);
  box-shadow: 0 0 0 4px rgba(0, 36, 85, 0.12);
}

.password-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toggle {
  height: 42px;
  width: 52px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.14);
  background: white;
  cursor: pointer;
}

.btn {
  height: 44px;
  border-radius: 14px;
  border: none;
  background: #002455;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.hint {
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.7;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }
}
</style>
