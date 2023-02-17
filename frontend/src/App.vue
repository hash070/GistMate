<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import {NMessageProvider} from "naive-ui";
</script>


<template>
  <n-message-provider placement="bottom-right">
    <AppHeader/>
    <router-view class="mt-14"></router-view>
  </n-message-provider>

</template>

<style scoped>
</style>
