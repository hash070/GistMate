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

          <n-scrollbar
              x-scrollable
              v-if="store.editor.openingFile"
          >
            <div class="gist-edit-tool-bar" style="display: flex;overflow-x: auto;align-items: center;height: 3rem">
              <div style="min-width: 5rem">
                <n-switch
                    :rail-style="viewOrEditSwitchStyle"
                    v-model:value="isInEditMode"
                    style="padding-left: 1rem"
                >
                  <template #checked>
                    {{ $t('gist.edit') }}
                  </template>
                  <template #unchecked>
                    {{ $t('gist.view') }}
                  </template>
                </n-switch>
              </div>

              <div>
                <n-input
                    v-model:value="store.editor.filename"
                    style="min-width: 8rem"
                    :disabled="!isInEditMode"
                    :placeholder="$t('gist.file_name')"
                />
              </div>

              <div style="min-width: 5rem">
                <n-switch
                    :rail-style="publicOrPrivateSwitchStyle"
                    v-model:value="isCurrentGistPublic"
                >
                  <template #checked-icon>
                    <n-icon>
                      <IconLockOpen/>
                    </n-icon>
                  </template>
                  <template #unchecked-icon>
                    <n-icon>
                      <IconLock/>
                    </n-icon>
                  </template>
                  <template #checked>
                    {{ $t('gist.public') }}
                  </template>
                  <template #unchecked>
                    {{ $t('gist.private') }}
                  </template>
                </n-switch>
              </div>

              <n-button
                  icon-placement="left"
                  secondary strong
              >
                <template #icon>
                  <n-icon>
                    <IconFilePlus/>
                  </n-icon>
                </template>
                {{ $t('gist.create_new_gist_file') }}
              </n-button>
              <n-button
                  icon-placement="left"
                  strong secondary
                  type="error"
              >
                <template #icon>
                  <n-icon>
                    <IconTrashX/>
                  </n-icon>
                </template>
                {{ $t('gist.delete_gist_file') }}
              </n-button>
              <n-button
                  quaternary circle
                  @click="handleEditorClose"
              >
                <template #icon>
                  <n-icon>
                    <IconX/>
                  </n-icon>
                </template>
              </n-button>
            </div>
          </n-scrollbar>

          <v-md-preview
              v-if="!isInEditMode"
              :text="store.editor.textVal"
              height="calc(100vh - 6rem)"
          />
          <v-md-editor
              v-else
              v-model="store.editor.textVal"
              height="calc(100vh - 6rem)"
              :include-level="[1 ,2, 3]"
              @save="handleSave"
          />
        </n-spin>
      </n-layout>
      <n-modal
          v-model:show="store.app.isNewGistModalShow"
          :closable="true"
          :bordered="false"
          :mask-closable="true"
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
            :placeholder="$t('hint.input_new_gist_file_name')"
            style="margin-top: 20px"
        />
        <div id="submit-box">
          <n-switch
              :rail-style="publicOrPrivateSwitchStyle"
              v-model:value="isNewGistPublic"
          >
            <template #checked-icon>
              <n-icon>
                <IconLockOpen/>
              </n-icon>
            </template>
            <template #unchecked-icon>
              <n-icon>
                <IconLock/>
              </n-icon>
            </template>
            <template #checked>
              {{ $t('gist.public') }}
            </template>
            <template #unchecked>
              {{ $t('gist.private') }}
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
  NScrollbar,
  NSpace,
  NSpin,
  NSwitch
} from 'naive-ui'
import {store} from '../store'
import {IconFilePlus, IconLoader, IconLock, IconLockOpen, IconTrashX, IconX} from '@tabler/icons-vue';
import axios from "axios";
import {
  errorMsg,
  finishLoadingBar,
  getNoInterceptorAxios,
  infoMsg,
  iT,
  loadGistsDataToMenu,
  startLoadingBar,
  successMsg,
  updateGistData
} from "../utils/util";

const handleSave = (text: string, html: string) => {
  console.log('Save action:', text)

  //if the file name is changed, update the file name before update the content
  if (store.editor.filename !== gistFileNameBeforeEdit) {
    axios.patch('/gists/' + currentGistId.value, {
      files: {
        [gistFileNameBeforeEdit]: {
          filename: store.editor.filename
        }
      }
    }).then((res) => {
      console.log(res)
      gistFileNameBeforeEdit = store.editor.filename
      successMsg(iT('hint.file_name_update_success'))
      //update the menu
      loadGistsDataToMenu();
      //restore the selected menu key
      activeKey.value = res.data.files[store.editor.filename].raw_url
      //update the content
      updateGistData(currentGistId.value, text)
    }).catch((err) => {
      console.log(err)
      errorMsg(iT('hint.file_name_update_failed'))
      return
    })
  } else {
    //if the file name is not changed, just update the content
    updateGistData(currentGistId.value, text)
  }
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
const isNewGistPublic = ref(false)
const isCurrentGistPublic = ref(false)
const currentGistId = ref('')
const isInEditMode = ref(false)

//save the filename before edit, for renaming
let gistFileNameBeforeEdit = ''

const publicOrPrivateSwitchStyle = ({focused, checked}: { focused: boolean, checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#FCB040'
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  } else {
    style.background = '#18A058'
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  return style
}

const viewOrEditSwitchStyle = ({focused, checked}: { focused: boolean, checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#18A058'
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
    "public": isNewGistPublic.value,
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
        isNewGistPublic.value = false
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
  console.log('click, Key:', key, 'Item:', item)
  if (key === "create") {
    //TODO: create new gist
    console.log('create new gist')
    store.app.isNewGistModalShow = true
  } else {
    //TODO: ask user if they want to save the changes

    //create a new axios instance to bypass global interceptors
    //because extra headers would cause CORS error
    store.loading.editor = true;
    store.editor.openingFile = true;
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
      store.editor.filename = item.label as string
      gistFileNameBeforeEdit = item.label as string
      isCurrentGistPublic.value = item.isPublic as boolean
      currentGistId.value = item.parentKey as string
      console.log('isCurrentGistPublic:', isCurrentGistPublic.value)
    }).catch(function (error) {
      console.log(error);
    }).finally(() => {
      finishLoadingBar()
      store.loading.editor = false
    })
  }
};

const handleEditorClose = () => {
  //clean up
  store.editor.textVal = ''
  store.editor.filename = ''
  store.editor.openingFile = false
  isInEditMode.value = false
  activeKey.value = null
}

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

.gist-edit-tool-bar > * {
  margin-right: 1rem;
}
</style>