<template>
  <nav id="app-nav-bar" class="bg-githubBlack py-2 fixed w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
      <!-- Left Router Link -->
      <div class="flex">
        <n-dropdown trigger="hover" :options="avatarOptions" @select="handleAvatarSelect">
          <n-avatar
              round
              :size="32"
              :src="store.menu.avatar"
          />
        </n-dropdown>

        <router-link to="/"
                     class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          {{ $t("home") }}
        </router-link>
        <router-link to="/settings"
                     class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          {{ $t("settings.settings") }}
        </router-link>
        <router-link to="/docs"
                     class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          {{ $t("docs.docs") }}
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
        <a href="https://github.com/hash070" target="_blank"
           class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{{$t('author')}}</a>
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
import {NAvatar, NDropdown} from "naive-ui";
import {store} from "../store";
import {useI18n} from "vue-i18n";
import {errorMsg, getDialog, iT, loadGistsDataToMenu, successMsg} from "../utils/util";
import {changeMDELanguage} from "../utils/mdEditor";
import {i18n} from "../main";

const avatarOptions = [
  {
    label: iT('login.logout'),
    key: 'logout'
  }
]

const handleAvatarSelect = (key: string | number) => {
  console.log(key)
  if (key === "logout") {
    getDialog().warning({
      title: iT('login.confirm_logout'),
      content: iT('login.confirm_logout_content'),
      positiveText: iT('login.logout'),
      negativeText: iT('hint.no'),
      onPositiveClick: () => {
        errorMsg(iT('login.failed'))
        localStorage.clear()
        window.location.reload()
      }
    })
  }
}

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
    label: '中文简体',
    key: 'zh-CN'
  }
]

const {t, locale} = useI18n();

const showDropdown = ref(false)

function handleSelect(key: string | number) {
  successMsg(String(key))
  locale.value = String(key)
  changeMDELanguage(String(key))
  //save language to local storage
  localStorage.setItem("language", String(key))
  //save to store
  store.app.language = String(key)
  //reload menu
  loadGistsDataToMenu(true)
}

function handleClick() {
  showDropdown.value = !showDropdown.value
}

onMounted(() => {
  console.log(`the Header component is now mounted.`)
})

</script>

<style lang="scss" scoped>
@import "../style";

a {
  text-decoration: none;
}

#app-nav-bar {
  background-color: $githubBlack;
  padding: 0 0;
  position: fixed;
  top: 0;
  width: 100%;

  .max-w-7xl {
    max-width: 80rem;
    margin-right: auto;
    margin-left: auto;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }

  .flex {
    display: flex;
    align-items: center;

    &.justify-between {
      justify-content: space-between;
    }
  }

  a {
    margin-right: 0.5rem;

    n-avatar {
      border-radius: 50%;
      width: 32px;
      height: 32px;

      img {
        border-radius: 50%;
      }
    }
  }

  .text-gray-300 {
    color: $gray-300;

    &:hover {
      background-color: $gray-700;
      color: $white;
    }
  }

  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .font-medium {
    font-weight: 500;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .text-gray-100 {
    color: $gray-100;

    &:hover {
      color: $white;
    }
  }

  a[href="https://github.com/hash070/GistMate"] {
    &:hover {
      background-color: $gray-700;
      color: $white;
    }
  }

  .select-none {
    user-select: none;
  }

  .n-dropdown {
    display: inline-flex;
    align-items: center;
    position: relative;
    margin: 0 0.5rem;
    cursor: pointer;

    &:hover {
      color: $white;
      background-color: $gray-700;
    }

    .n-dropdown-menu {
      position: absolute;
      z-index: 99;
      top: calc(100% + 0.5rem);
      left: 0;
      min-width: 8rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      background-color: $white;
      border-radius: 0.375rem;
      box-shadow: 0 0.5rem 1rem -0.25rem rgba($black, 0.1), 0 0 0 1px rgba($black, 0.05);

      .n-dropdown-item {
        padding: 0.25rem 1rem;
        line-height: 1.5;
        color: $gray-700;

        &:hover {
          color: $black;
          background-color: $gray-200;
        }
      }
    }
  }
}

</style>