<template>
  <div class="splashscreen">
    <img class="logo" src="@/assets/images/logo.jpg" alt="Logo" />
  </div>
</template>

<style scoped>
  .splashscreen {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
  }

  .logo {
    animation: pulse 1.2s ease-in-out infinite alternate;
    border-radius: 18px;
    box-shadow: 0 14px 26px var(--shadow);
    background: var(--surface);
  }

  @keyframes pulse {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1.05);
    }
  }
</style>