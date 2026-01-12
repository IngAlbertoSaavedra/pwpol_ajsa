<template>
  <nav class="navbar">
    <h1 class="logo">PWPol</h1>

    <ul>
      <li>
        <router-link to="/">Inicio</router-link>
      </li>
      <li>
        <router-link to="/login">Login</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #1e293b;
    color: white;
  }

  ul {
    display: flex;
    list-style: none;
    gap: 1rem;
  }

  a {
    color: white;
    text-decoration: none;
  }

  a.router-link-active {
    font-weight: bold;
  }
</style>
