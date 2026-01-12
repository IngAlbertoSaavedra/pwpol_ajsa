<template>
  <div class="splashscreen">
    <img class="logo" src="../assets/logo.png" alt="Logo" />
    <h1>Poliacero</h1>
  </div>
</template>

<style scoped>
  .splashscreen {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
  }

  .logo {
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1.05);
    }
  }


  h1 {
    color: var(--brand-blue);
  }
  h1 span {
    color: var(--brand-green);
  }
</style>
