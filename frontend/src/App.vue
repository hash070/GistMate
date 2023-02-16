<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import {NMessageProvider} from "naive-ui";</script>

<template>
  <n-message-provider>
    <AppHeader/>

    <router-view class="mt-10"></router-view>
  </n-message-provider>

</template>

<style scoped>
</style>
