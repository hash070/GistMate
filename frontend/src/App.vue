<script setup lang="ts">

</script>

<template>

  <nav class="navi-bar">
    <router-link to="/">Home</router-link> |
    <router-link to="/404">NotFound</router-link>
  </nav>

  <router-view></router-view>
</template>

<style scoped>

.navi-bar {
  position: fixed;
  top: 0;
  padding: 0 30px;
  height: 50px;
  width: 100vw;
}

</style>
