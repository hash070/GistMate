<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
          id="side-menu"
          :native-scrollbar="false"
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
      >
        <n-spin :show="store.loading.menu">
          <template #icon style="display: flex;align-items: center">
            <n-icon>
              <IconLoader/>
            </n-icon>
          </template>
          <n-menu
              v-model:value="activeKey"
              @update:expanded-keys="handleMenuExpand"
              @update:value="handleMenuClick"
              :collapsed="collapsed"
              :collapsed-width="64"
              style="min-height: calc(100vh - 3rem);"
              :collapsed-icon-size="22"
              :options="store.menuOptions"
          />
        </n-spin>
      </n-layout-sider>
      <n-layout
          id="content"
          :native-scrollbar="false"
      >
        <n-spin :show="store.loading.editor">
          <template #icon style="display: flex;align-items: center">
            <n-icon>
              <IconLoader/>
            </n-icon>
          </template>
          <v-md-editor
              v-model="store.editor.textVal"
              height="calc(100vh - 3rem)"
              :include-level="[1 ,2, 3]"
              @save="handleSave"
          ></v-md-editor>
        </n-spin>
      </n-layout>
      <n-modal
          v-model:show="store.app.isNewGistModalShow"
          :closable="false"
          :bordered="false"
          :mask-closable="false"
          :loading="isLoading"
          style="max-width: 400px"
          preset="card"
          :title="$t('hint.input_new_gist_collection')"
          :positive-text="$t('login.submit')"
      >
        <n-input
            v-model:value="newGistCollectionName"
            :placeholder="$t('hint.input_new_gist_collection')"
        />
        <n-input
            v-model:value="newGistName"
            :placeholder="$t('hint.input_new_gist_name')"
            style="margin-top: 20px"
        />
        <div id="submit-box">
          <n-switch
              :rail-style="railStyle"
              v-model:value="isPublic"
          >
            <template #checked>
              {{ $t('hint.public') }}
            </template>
            <template #unchecked>
              {{ $t('hint.private') }}
            </template>
          </n-switch>
          <n-button
              :loading="isLoading"
              :disabled="newGistCollectionName === ''|| newGistName === ''"
              @click="onNewGistSubmit"
          >
            {{ $t('login.submit') }}
          </n-button>
        </div>
      </n-modal>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
import {CSSProperties, onMounted, onUnmounted, ref} from 'vue'
import {
  MenuOption,
  NButton,
  NIcon,
  NInput,
  NLayout,
  NLayoutSider,
  NMenu,
  NModal,
  NSpace,
  NSpin,
  NSwitch
} from 'naive-ui'
import {store} from '../store'
import {IconLoader} from '@tabler/icons-vue';
import axios from "axios";
import {
  finishLoadingBar,
  getNoInterceptorAxios,
  infoMsg,
  iT,
  loadGistsDataToMenu,
  startLoadingBar
} from "../utils/util";

const handleSave = (text: string, html: string) => {
  console.log('Save action:', text)
}

/*
// Render icons on setup function, worked, but it seems to be not necessary
// Because the icons can be stored in store and rendered in template
  store.menuOptions = store.menuOptions.map((option: any) => {
  const icon = renderIcon(BookIcon);
  return {
    ...option,
    icon,
    children: option.children ? option.children.map((child: any) => {
      const childIcon = renderIcon(BookIcon);
      return {
        ...child,
        icon: childIcon
      };
    }) : []
  };
});*/

onMounted(() => {
  console.log('menu mounted')
  const gistKey = localStorage.getItem('gistKey')
  if (gistKey) {
    console.log('gist key detected, trying to login')
    loadGistsDataToMenu();
  } else {
    console.log('gistKey is null, please input your gist key')
    infoMsg(iT('hint.input_key'))
    // infoMsg(iT('hint.input_key'))
    store.app.isKeyInputModalShow = true
  }
})

onUnmounted(() => {
  console.log('menu unmounted')
  //TODO: ask user if they want to save the changes
  //remove store.editor.textVal
  // store.editor.textVal = ''
})


const activeKey = ref<string | null>(null);
const collapsed = ref(false);
const isLoading = ref(false);
const newGistCollectionName = ref('')
const newGistName = ref('')
const isPublic = ref(false)
const railStyle = ({focused, checked}: { focused: boolean, checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#d03050'
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  } else {
    style.background = '#2080f0'
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  return style
}

const onNewGistSubmit = () => {
  isLoading.value = true
  let body = {
    "description": newGistCollectionName.value,
    "public": isPublic.value,
    "files": {
      [newGistName.value]: {
        "content": "# Hello World"
      }
    }
  }
  console.log('body:', body)
  axios.post("https://api.github.com/gists", body)
      .then((res) => {
        store.app.isNewGistModalShow = false
        loadGistsDataToMenu()
        //clean up
        newGistCollectionName.value = ''
        newGistName.value = ''
        isPublic.value = false
      })
      .catch((err) => {
        console.log(err);
        infoMsg(iT('hint.request_failed'))
      })
      .finally(() => {
        isLoading.value = false
      })
}


const handleMenuExpand = (keys: string[]) => {
  console.log('expandedKey:', keys)
};

const handleMenuClick = (key: string, item: MenuOption) => {
  console.log('click:', key, item)
  if (key === "create") {
    //TODO: create new gist
    console.log('create new gist')
    store.app.isNewGistModalShow = true
  } else {
    //TODO: ask user if they want to save the changes

    //create a new axios instance to bypass global interceptors
    //because extra headers would cause CORS error
    store.loading.editor = true;
    startLoadingBar()
    getNoInterceptorAxios().request({
      method: 'get',
      url: key,
      params: {
        //Extra req headers to GitHub api would cause CORS error
        //So I add a timestamp to avoid browser cache
        'time-stamp': new Date().getTime()
      }
    }).then(function (response) {
      store.editor.textVal = response.data
    }).catch(function (error) {
      console.log(error);
    }).finally(() => {
      finishLoadingBar()
      store.loading.editor = false
    })
  }
};

</script>
<style lang="scss" scoped>
@import "../style";

#side-menu, #content {
  height: calc(100vh - 3rem);
}

#submit-box {
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>