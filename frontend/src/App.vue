<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import {onMounted, ref} from 'vue'
import type {GlobalTheme} from 'naive-ui'
import {NButton, NConfigProvider, NDivider, NInput, NModal} from 'naive-ui'
import {handleAxiosError, iT, setMenuOptionsFromAxiosResponse, successMsg} from "./utils/util";
import axios from "axios";
import {store} from "./store";
import {useI18n} from "vue-i18n";
import {changeMDELanguage} from "./utils/mdEditor";

const {t, locale} = useI18n();

//dark mode or light mode
const theme = ref<GlobalTheme | null>(null)

const isLoading = ref(false)
const gistKey = ref('')

function onKeySubmit() {
  localStorage.setItem('gistKey', gistKey.value)
  isLoading.value = true
  //activate menu loading spin
  store.loading.menu = true
  console.log('confirm')
  //get gist data, add time_stamp to avoid cache
  axios.get('/gists' + '?time_stamp=' + new Date().getTime())
      .then((res) => {
        successMsg(iT('login.success'))
        store.app.isKeyInputModalShow = false
        console.log(res)
        // process data (array) and push into store.menuOptions
        setMenuOptionsFromAxiosResponse(res)
      })
      .catch((err) => {
        handleAxiosError(err)
      }).finally(() => {
    isLoading.value = false
    //deactivate menu loading spin
    store.loading.menu = false
  })
}

onMounted(() => {
  console.log('app mounted')
  //set language from local storage, if not exist, use default language (en-US)
  const language = localStorage.getItem('language')
  if (language) {
    locale.value = String(language)
    changeMDELanguage(String(language))
  } else {
    localStorage.setItem('language', 'en-US')
  }

  //load localStorage data to store
  store.editor.imgRepo = localStorage.getItem('imgRepo') || ''
  store.editor.autoSave = localStorage.getItem('autoSave') === 'true'
  store.app.silentMode = localStorage.getItem('silentMode') === 'true'
  store.menu.defaultExpandAll = localStorage.getItem('defaultExpandAll') === 'true'
})


</script>

<template>
  <n-config-provider preflight-style-disabled :theme="theme">
    <AppHeader/>
    <router-view class="router-view"></router-view>
    <n-modal
        v-model:show="store.app.isKeyInputModalShow"
        :closable="false"
        :bordered="false"
        :mask-closable="false"
        :loading="isLoading"
        style="max-width: 400px"
        preset="card"
        :title="$t('hint.input_key')"
        :positive-text="$t('login.submit')"
    >
      <a style="display: flex;justify-content: center;outline: none" href="	https://github.com/login/oauth/authorize?client_id=21ade8c504c134ae481e&redirect_uri=https://gm.a.com/api/oauth/callback&scope=gist%20user:email">
        <img src="/img/github-logo.ico" alt="github" height="48">
      </a>
      <h3 style="text-align: center">{{$t('hint.oauth')}}</h3>
      <n-divider >
        {{ $t('hint.or')}}
      </n-divider>
      <n-input
          v-model:value="gistKey"
          :placeholder="$t('hint.api_key')"
          class="mb-4"
      />
      <div style="display: flex;justify-content: end">
        <n-button
            :loading="isLoading"
            :disabled="gistKey === ''"
            @click="onKeySubmit"
        >
          {{ $t('login.submit') }}
        </n-button>
      </div>
    </n-modal>
  </n-config-provider>

</template>

<style lang="scss" scoped>
@import "style";

.router-view {
  padding-top: 3rem;
  height: calc(100vh - 3rem);
}

.w-96 {
  width: 24rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

</style>
