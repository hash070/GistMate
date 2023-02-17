<template>
  <nav class="bg-githubBlack py-2 fixed top-0 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
      <!-- Left Router Link -->
      <div class="flex">
        <a href="#" class="mr-2">
          <n-avatar
              round
              :size="32"
              src="/img/github-logo.ico"
          />
        </a>

        <router-link to="/"
                     class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          {{ $t("home") }}
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
            class="text-gray-300 select-none hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          <n-dropdown trigger="hover" :options="languageOptions" @select="handleSelect">
            {{ $t("language") }}
          </n-dropdown>
        </div>

      </div>
    </div>
  </nav>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {NAvatar, NDropdown, useMessage} from "naive-ui";
import {useI18n} from "vue-i18n";

const message = useMessage()

const languageOptions = [
  {
    label: 'English',
    key: "en-US"
  },
  {
    label: '日本語',
    key: 'ja-JP'
  },
  {
    label: '简体中文',
    key: 'zh-CN'
  }
]

const {t, locale} = useI18n();

const showDropdown = ref(false)

function handleSelect(key: string | number) {
  message.info(String(key))
  locale.value = String(key)
}

function handleClick() {
  showDropdown.value = !showDropdown.value
}

onMounted(() => {
  console.log(`the Header component is now mounted.`)
})

</script>

<style scoped>

</style>