<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import {onMounted, ref} from 'vue'
import type {GlobalTheme} from 'naive-ui'
import {NButton, NConfigProvider, NInput, NModal} from 'naive-ui'
import {errorMsg, infoMsg, iT, successMsg} from "./utils/util";
import axios from "axios";
//dark mode or light mode
const theme = ref<GlobalTheme | null>(null)

const isModalShow = ref(false)
const isLoading = ref(false)
const gistKey = ref('')

async function onKeySubmit() {
  localStorage.setItem('gistKey', gistKey.value)
  isLoading.value = true
  console.log('confirm')
  axios.get('/gists')
      .then((res) => {
        successMsg(iT('login.success'))
        isModalShow.value = false
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        errorMsg(iT('login.failed'))
        localStorage.removeItem('gistKey')
      }).finally(() => {
    isLoading.value = false
  })
  /*  try {
      const res = await axios.get('/gists/public')
      successMsg(iT('login.success'))
      isModalShow.value = false
      console.log(res)
    } catch (err) {
      console.log(err)
      errorMsg(iT('login.failed'))
    } finally {
      isLoading.value = false
    }*/
}

onMounted(() => {
  const gistKey = localStorage.getItem('gistKey')
  if (gistKey) {
    console.log('gist key detected, trying to login')
    axios.get('/gists/public')
        .then((res) => {
          successMsg(iT('login.success'))
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
          errorMsg(iT('login.failed'))
          localStorage.removeItem('gistKey')
        })
  } else {
    console.log('gistKey is null, please input your gist key')
    infoMsg(iT('hint.input_key'))
    // infoMsg(iT('hint.input_key'))
    isModalShow.value = true
  }
})


</script>

<template>
  <n-config-provider preflight-style-disabled :theme="theme">
    <AppHeader/>
    <router-view class="mt-14"></router-view>
    <n-modal
        v-model:show="isModalShow"
        :closable="false"
        :bordered="false"
        :mask-closable="false"
        :loading="isLoading"
        class="w-96"
        preset="card"
        :title="$t('hint.input_key')"
        :positive-text="$t('login.submit')"
    >
      <n-input
          v-model:value="gistKey"
          :placeholder="$t('hint.api_key')"
          class="mb-4"
      />
      <n-button
          :loading="isLoading"
          :disabled="gistKey === ''"
          @click="onKeySubmit"
      >
        {{ $t('login.submit') }}
      </n-button>
    </n-modal>
  </n-config-provider>

</template>

<style scoped>
</style>
