<template>
  <div class="settings">
    <n-scrollbar
        trigger="none"
        style="max-height: calc(100vh - 3rem)"
    >
      <n-form ref="formRef" :model="model" style="margin: 2rem">
        <n-button @click="setUpImageUploadRepo" type="primary" style="margin: 1rem 0">
          {{ $t('settings.setup_img_upload_repo') }}
        </n-button>
        <n-form-item :label="$t('settings.img_repo')">
          <n-input v-model:value="model.imgRepo"/>
        </n-form-item>
        <n-form-item :label="$t('settings.auto_save')">
          <n-switch v-model:value="model.autoSave"/>
        </n-form-item>
        <n-form-item :label="$t('settings.silent_mode')">
          <n-switch v-model:value="model.silentMode"/>
        </n-form-item>
        <n-form-item :label="$t('settings.default_expand_all')">
          <n-switch v-model:value="model.defaultExpandAll"/>
        </n-form-item>
        <n-form-item :label="$t('settings.proxy_url')">
          <n-input v-model:value="model.proxyUrl"/>
        </n-form-item>
        <n-form-item :label="$t('settings.proxy')">
          <n-switch v-model:value="model.proxy"/>
        </n-form-item>
        <n-form-item :label="$t('settings.use_lsky')">
          <n-switch v-model:value="model.useLskyImage"/>
        </n-form-item>
        <n-form-item :label="$t('settings.lsky_api')">
          <n-input v-model:value="model.lskyAPI"/>
        </n-form-item>
        <n-form-item :label="$t('settings.lsky_token')">
          <n-input v-model:value="model.lskyToken" type="password" show-password-on="click"/>
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button
                  round
                  type="primary"
                  @click="handleSaveButtonClick"
              >
                {{ $t('settings.save') }}
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </n-scrollbar>
  </div>


</template>

<script setup lang="ts">
import {FormInst, NButton, NCol, NForm, NFormItem, NInput, NRow, NScrollbar, NSwitch} from "naive-ui";
import {onMounted, ref} from "vue";
import {store} from "../store";
import axios from "axios";
import {getDialog, infoMsg, iT, successMsg} from "../utils/util";

onMounted(() => {
  console.log('Settings mounted')
  //load from local storage
  model.value.imgRepo = localStorage.getItem('imgRepo')
  model.value.autoSave = localStorage.getItem('autoSave') === 'true'
  model.value.silentMode = localStorage.getItem('silentMode') === 'true'
  model.value.defaultExpandAll = localStorage.getItem('defaultExpandAll') === 'true'
  model.value.proxyUrl = localStorage.getItem('proxyUrl') as string
  model.value.proxy = localStorage.getItem('proxy') === 'true'
  model.value.useLskyImage = localStorage.getItem('useLskyImage') === 'true'
  model.value.lskyAPI = localStorage.getItem('lskyAPI') as string
  model.value.lskyToken = localStorage.getItem('lskyToken') as string
})


const formRef = ref<FormInst | null>(null)

interface ModelType {
  imgRepo: string | null
  autoSave: boolean
  silentMode: boolean
  defaultExpandAll: boolean
  proxyUrl: string
  proxy: boolean
  useLskyImage: boolean
  lskyAPI: string
  lskyToken: string
}

const model = ref<ModelType>({
  imgRepo: null,
  autoSave: true,
  silentMode: false,
  defaultExpandAll: true,
  proxyUrl: '',
  proxy: false,
  useLskyImage: false,
  lskyAPI: '',
  lskyToken: ''
})

const handleSaveButtonClick = () => {
  console.log(model.value)
  //save to local storage
  localStorage.setItem('imgRepo', model.value.imgRepo as string)
  localStorage.setItem('autoSave', model.value.autoSave.toString())
  localStorage.setItem('silentMode', model.value.silentMode.toString())
  localStorage.setItem('defaultExpandAll', model.value.defaultExpandAll.toString())
  localStorage.setItem('proxyUrl', model.value.proxyUrl.toString())
  localStorage.setItem('proxy', model.value.proxy.toString())
  localStorage.setItem('useLskyImage', model.value.useLskyImage.toString())
  localStorage.setItem('lskyAPI', model.value.lskyAPI.toString())
  localStorage.setItem('lskyToken', model.value.lskyToken.toString())
  //update store
  store.editor.imgRepo = model.value.imgRepo as string
  store.editor.autoSave = model.value.autoSave
  store.app.silentMode = model.value.silentMode
  store.menu.defaultExpandAll = model.value.defaultExpandAll
  store.app.useLskyImage = model.value.useLskyImage

  if (model.value.proxy) {
    axios.defaults.baseURL = model.value.proxyUrl
  } else {
    axios.defaults.baseURL = "https://api.github.com"
  }
}


//set up img upload repo
const setUpImageUploadRepo = () => {
  getDialog().warning({
    title: iT('hint.setup_img_upload_repo'),
    content: iT('hint.setup_img_upload_repo_confirm'),
    positiveText: iT('hint.yes'),
    negativeText: iT('hint.no'),
    onPositiveClick: () => {
      let body = {
        "description": "img",
        "public": false,
        "files": {
          "meta.md": {
            "content": "# Hello [GistMate](https://github.com/hash070/GistMate) \n\nDo not delete this gist if you don't know what are you doing"
          }
        }
      }
      console.log('body:', body)
      axios.post("/gists", body)
          .then((res) => {
            console.log("img repo", res);
            successMsg(iT('hint.setup_img_upload_repo_success'))
            model.value.imgRepo = res.data.id;
            localStorage.setItem('imgRepo', res.data.id)
          })
          .catch((err) => {
            console.log(err);
            infoMsg(iT('hint.request_failed'))
          })
          .finally(() => {
          })
    }
  })

}

</script>

<style scoped lang="scss">
.settings {
  padding-top: 3rem;
}
</style>