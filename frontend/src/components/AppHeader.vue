<template>
  <nav class="bg-githubBlack py-2 fixed top-0 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
      <!-- Left Router Link -->
      <div class="flex">
        <router-link to="/"
                     class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          Home
        </router-link>
        <router-link to="/404"
                     class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          404
        </router-link>
      </div>
      <!-- Middle text -->
      <div class="flex">
        <div class="text-gray-100 hover:text-white px-3 py-2 rounded-md text-xl font-medium">
          GistMate
        </div>
      </div>

      <!-- Right buttons -->
      <div class="flex">
        <a href="https://github.com/hash070/GistMate" target="_blank"
           class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">GitHub</a>
        <div
            class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          <n-dropdown trigger="hover" :options="options" @select="handleSelect">
            Language
          </n-dropdown>
        </div>

      </div>
    </div>
  </nav>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {NDropdown, useMessage} from "naive-ui";

const message = useMessage()

const options = [
  {
    label: 'English',
    key: "en"
  },
  {
    label: '日本語',
    key: 'jp'
  },
  {
    label: '简体中文',
    key: 'zh-cn'
  }
]

const showDropdown = ref(false)

function handleSelect(key: string | number) {
  message.info(String(key))
}

function handleClick() {
  showDropdown.value = !showDropdown.value
}

</script>

<style scoped>

</style>