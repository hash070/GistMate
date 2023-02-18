<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import {onMounted, ref} from 'vue'
import type {GlobalTheme} from 'naive-ui'
import {NButton, NConfigProvider, NInput, NModal} from 'naive-ui'
import {BookOutline as BookIcon, LibraryOutline as LibraryIcon} from '@vicons/ionicons5'
import {errorMsg, infoMsg, iT, renderIcon, successMsg} from "./utils/util";
import axios from "axios";
import {store} from "./store";


//dark mode or light mode
const theme = ref<GlobalTheme | null>(null)

const isModalShow = ref(false)
const isLoading = ref(false)
const gistKey = ref('')

function onKeySubmit() {
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
}

onMounted(() => {
  const gistKey = localStorage.getItem('gistKey')
  if (gistKey) {
    console.log('gist key detected, trying to login')
    axios.get('/gists')
        .then((res) => {
          successMsg(iT('login.success'))
          console.log(res)
          // process data and store in store.gistsData
          store.gistsData = res.data
          // process data (array) and push into store.menuOptions
/*          res.data.map((gist: any) => {
            store.menuOptions = [
              ...store.menuOptions,
              {
                label: gist.description,
                key: gist.id,
                icon: renderIcon(LibraryIcon),
                //file is a object, not an array
                //need to use Object.keys to get the keys
                children: Object.keys(gist.files).map((child: any) => {
                  return {
                    label: gist.files[child].filename,
                    key: gist.files[child].filename,
                    icon: renderIcon(BookIcon),
                    // to: '/gist/'+gist.id+'/'+child.filename
                  }
                })
              }
            ]
          })*/
          //I should set store.menuOptions after the loop
          let tempMenuOptions: any = []
          res.data.map((gist: any) => {
            tempMenuOptions = [
              ...tempMenuOptions,
              {
                label: gist.description,
                key: gist.id,
                icon: renderIcon(LibraryIcon),
                //file is a object, not an array
                //need to use Object.keys to get the keys
                children: Object.keys(gist.files).map((child: any) => {
                  return {
                    label: gist.files[child].filename,
                    key: gist.files[child].filename,
                    icon: renderIcon(BookIcon),
                    // to: '/gist/'+gist.id+'/'+child.filename
                  }
                })
              }
            ]
          })
          store.menuOptions = tempMenuOptions
/*
          console.log('store.menuOptions', store.menuOptions)
          //test performance
          for (let i = 0; i < 10000; i++) {
            tempMenuOptions= [
              ...tempMenuOptions,
              {
                label: "test",
                key: "test",
                icon: renderIcon(LibraryIcon),
                children: [{
                  label: "testChild",
                  key: "test",
                  icon: renderIcon(BookIcon),
                  // to: '/gist/'+gist.id+'/'+child.filename
                }]
              }
            ]
          }
          store.menuOptions = tempMenuOptions*/
        })
        .catch((err) => {
          console.log(err)
          errorMsg(iT('login.failed'))
          localStorage.removeItem('gistKey')
        })
    /*
    //Just a test, it works fine
        store.menuOptions = [
          {
            label: iT('menu.home'),
            key: 'home',
            children: [
              {
                label: iT('menu.home'),
                key: 'home',
                to: '/home'
              },
              {
                label: iT('menu.about'),
                key: 'about',
                to: '/about'
              }
            ]
          },
          {
            label: iT('menu.user'),
            key: 'user',
            children: [
              {
                label: iT('menu.user'),
                key: 'user',
                to: '/user'
              },
              {
                label: iT('menu.user'),
                key: 'user',
                to: '/user'
              }
            ]
          },
          {
            label: iT('menu.wine'),
            key: 'wine',
            children: [
              {
                label: iT('menu.wine'),
                key: 'wine',
                to: '/wine'
              },
              {
                label: iT('menu.wine'),
                key: 'wine',
                icon: renderIcon(PersonIcon),
                to: '/wine'
              }
            ]
          }
        ]*/
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
    <router-view class="router-view"></router-view>
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
