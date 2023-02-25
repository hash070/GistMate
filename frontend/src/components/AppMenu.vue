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
        <n-spin :show="store.loading.menu" style="height: calc(100vh - 3rem)">
          <template #icon style="display: flex;align-items: center">
            <n-icon>
              <IconLoader/>
            </n-icon>
          </template>
          <n-menu
              v-model:value="store.menu.activeKey"
              @update:expanded-keys="handleMenuExpand"
              @update:value="handleMenuClick"
              :default-expand-all="store.menu.defaultExpandAll"
              :watch-props="['defaultExpandedKeys']"
              :collapsed="collapsed"
              :collapsed-width="64"
              :indent="12"
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
        <n-spin :show="store.loading.editor" style="height: calc(100vh - 6rem);">
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
                    @update:value="handleViewModeChange"
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
                <n-tooltip placement="bottom" trigger="hover">
                  <template #trigger>
                    <n-switch
                        :rail-style="publicOrPrivateSwitchStyle"
                        v-model:value="isCurrentGistPublic"
                        disabled
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
                  </template>
                  {{ $t('hint.visibility_is_unchangeable') }}
                </n-tooltip>
              </div>
              <div style="min-width: 8rem">
                <n-switch
                    :rail-style="viewOrEditSwitchStyle"
                    v-model:value="store.editor.autoSave"
                >
                  <template #checked-icon>
                    <n-icon>
                      <IconLock/>
                    </n-icon>
                  </template>
                  <template #unchecked-icon>
                    <n-icon>
                      <IconLockOpen/>
                    </n-icon>
                  </template>
                  <template #checked>
                    {{ $t('gist.auto_save_on') }}
                  </template>
                  <template #unchecked>
                    {{ $t('gist.auto_save_off') }}
                  </template>
                </n-switch>
              </div>
              <n-button
                  icon-placement="left"
                  strong secondary
                  type="error"
                  @click="handleDeleteGistFile"
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

          <n-scrollbar
              v-if="!isInEditMode"
              trigger="none"
              style="height: calc(100vh - 6rem)"
          >
            <v-md-preview
                :text="store.editor.textVal"
            />
          </n-scrollbar>
          <v-md-editor
              v-else
              v-model="store.editor.textVal"
              :disabled-menus="[]"
              @upload-image="handleUploadImage"
              height="calc(100vh - 6rem)"
              :include-level="[1 ,2, 3]"
              @save="handleSave"
              @change="handleEditorChange"
          />
        </n-spin>
      </n-layout>
      <n-modal
          v-model:show="store.app.isNewGistModalShow"
          :closable="true"
          :bordered="false"
          :mask-closable="true"
          :loading="isModalActionLoading"
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
          <n-tooltip placement="bottom" trigger="hover">
            <template #trigger>
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
            </template>
            {{ $t('hint.visibility_is_unchangeable') }}
          </n-tooltip>

          <n-button
              :loading="isModalActionLoading"
              :disabled="newGistCollectionName === ''|| newGistName === ''"
              @click="onNewGistSubmit"
          >
            {{ $t('login.submit') }}
          </n-button>
        </div>
      </n-modal>

      <n-modal
          v-model:show="store.app.isNewGistFileModalShow"
          :closable="true"
          :bordered="false"
          :mask-closable="true"
          :loading="isModalActionLoading"
          style="max-width: 400px"
          preset="card"
          :title="$t('hint.input_new_gist_collection')"
          :positive-text="$t('login.submit')"
      >
        <n-input
            v-model:value="store.menu.createNewGistFileName"
            :placeholder="$t('hint.input_new_gist_collection')"
        />
        <div id="submit-box" style="display: flex;justify-content: end">
          <n-button
              :loading="isModalActionLoading"
              :disabled="store.menu.currentGistCollectionKey === ''"
              @click="handleNewGistFile"
              type="primary"
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
  NSwitch,
  NTooltip
} from 'naive-ui'
import {store} from '../store'
import {IconLoader, IconLock, IconLockOpen, IconTrashX, IconX} from '@tabler/icons-vue';
import axios from "axios";
import {
  deleteGist,
  errorMsg,
  errorNotification,
  finishLoadingBar,
  getDialog,
  getNoInterceptorAxios,
  infoMsg,
  iT,
  loadGistsDataToMenu,
  randomString,
  startLoadingBar,
  successMsg,
  updateGistData
} from "../utils/util";

//save gist file
const handleSave = async (text: string, html?: string) => {
  console.log('Save action:', text)

  //if the file name is changed, update the file name before update the content
  if (store.editor.filename !== gistFileNameBeforeEdit) {
    axios.patch('/gists/' + currentGistId.value, {
      files: {
        [gistFileNameBeforeEdit]: {
          filename: store.editor.filename
        }
      }
    }).then(async (res) => {
      console.log(res)
      gistFileNameBeforeEdit = store.editor.filename
      successMsg(iT('hint.file_name_update_success'))
      //update the content
      await updateGistData(currentGistId.value, text)
      //update the menu
      loadGistsDataToMenu();
      //restore the selected menu key
      store.menu.activeKey = res.data.files[store.editor.filename].raw_url
    }).catch((err) => {
      console.log(err)
      errorMsg(iT('hint.file_name_update_failed'))
      return
    })
  } else {
    //if the file name is not changed, just update the content
    await updateGistData(currentGistId.value, text)
  }
  //reload latest menu data silently, because gist raw url will change after update
  loadGistsDataToMenu(true)
  console.log("====LoadGistsDataToMenu action performed====")
  //update save flag
  store.editor.isLatestSaved = true
  gistFileContentBeforeEdit = text
  //update last save time
  lastTypingDate.value = new Date()
  console.log('lastTypingDate', lastTypingDate.value)
}

//handle delete gist file
const handleDeleteGistFile = () => {
  console.log('Delete action')
  getDialog().warning({
    title: iT('hint.delete_gist_file_dialog_title'),
    content: iT('hint.delete_gist_file_dialog_content'),
    positiveText: iT('hint.yes'),
    negativeText: iT('hint.no'),
    onPositiveClick: () => {
      infoMsg(iT('hint.delete_gist_file_action_started'))
      axios.patch('/gists/' + currentGistId.value, {
        files: {
          [store.editor.filename]: null
        }
      }).then((res) => {
        console.log(res)
        successMsg(iT('hint.delete_gist_file_action_success'))
        handleEditorClose()
        //refresh gist menu
        loadGistsDataToMenu()
      }).catch((err) => {
        console.log(err)
        errorMsg(iT('hint.delete_gist_file_action_failed'))
      })
    },
    onNegativeClick: () => {
      infoMsg(iT('hint.delete_gist_file_action_cancelled'))
    }
  })
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

//create a intervalID variable in order to clear the interval onUnmounted
let autoSaveInterval: number = 0

onMounted(() => {
  console.log('menu mounted')
  //clean up
  store.editor.textVal = ''
  store.editor.filename = ''
  isInEditMode.value = false
  store.editor.openingFile = false
  if (localStorage.getItem('gistKey')) loadGistsDataToMenu();
  else return

  //setup auto save interval
  //Interval to check if the last typing date is 3 seconds later than now
  autoSaveInterval = setInterval(() => {
    console.log('Interval: isLatestSaved', store.editor.isLatestSaved)
    if (isInEditMode.value && store.editor.autoSave && !store.editor.isLatestSaved) {
      //log three conditions
      console.log('isInEditMode:', isInEditMode.value)
      console.log('store.editor.autoSave:', store.editor.autoSave)
      console.log('isLatestSaved:', store.editor.isLatestSaved)
      //check if the date is 3 seconds later than last typing date
      const now = new Date()
      const diff = now.getTime() - lastTypingDate.value.getTime()
      if (diff > 3000) {
        console.log('==========Auto save===========')
        console.log('diff:', diff)
        console.log('last typing date:', lastTypingDate.value)
        console.log('now:', now)
        console.log('==============================')
        //update save flag to prevent multiple save actions
        store.editor.isLatestSaved = true
        lastTypingDate.value = new Date()
        //save method
        handleSave(store.editor.textVal, '')
      }
    }
  }, 1000)
})

onUnmounted(() => {
  console.log('menu unmounted')
  clearInterval(autoSaveInterval)
  //TODO: ask user if they want to save the changes
  //remove store.editor.textVal
  store.editor.textVal = ''
})


// const activeKey = ref<string | null>(null);
const collapsed = ref(false);
//loading status of modal
const isModalActionLoading = ref(false);
const newGistCollectionName = ref('')
const newGistName = ref('')
const isNewGistPublic = ref(false)
const isCurrentGistPublic = ref(false)
const currentGistId = ref('')
const isInEditMode = ref(false)
//last update date
const lastTypingDate = ref(new Date())
//isFirstEdit flag
const isFirstEdit = ref(true)

//save the filename before edit, for renaming
let gistFileNameBeforeEdit = ''
//save the gist file content before edit, for comparing, to avoid unnecessary update
let gistFileContentBeforeEdit = ''

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
  isModalActionLoading.value = true
  let body = {
    "description": newGistCollectionName.value,
    "public": isNewGistPublic.value,
    "files": {
      [newGistName.value]: {
        "content": "# Hello [GistMate](https://github.com/hash070/GistMate)"
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
        isModalActionLoading.value = false
      })
}

const handleMenuExpand = (keys: string[]) => {
  console.log('expandedKey:', keys)
};

const handleViewModeChange = (checked: boolean) => {
  console.log('view mode change:', checked)
  //true => Edit mode, false => View mode
  if (checked) {
    console.log('enter edit mode')
    gistFileContentBeforeEdit = store.editor.textVal
    //auto collapse the menu
    collapsed.value = true
  } else {
    console.log('enter view mode')
    //auto expand the menu
    collapsed.value = false
    //check if the content has changed
    if (gistFileContentBeforeEdit !== store.editor.textVal) {
      console.log('content changed')
      handleSave(store.editor.textVal)
    }
  }
  isFirstEdit.value = true
  store.editor.isLatestSaved = true
  console.log('ViewModeChange: isLatestSaved:', store.editor.isLatestSaved)
}

const handleMenuClick = (key: string, item: MenuOption) => {
  console.log('click, Key:', key, 'Item:', item)

  //set current gist collection key
  store.menu.currentGistCollectionKey = item.parentKey as string

  if (key === "create") {
    console.log('create new gist')
    store.app.isNewGistModalShow = true
  } else if (key === "newGist") {
    store.menu.createNewGistFileName = ''
    store.app.isNewGistFileModalShow = true
  } else if (key === "delete") {
    console.log('delete gist:', item.parentKey)
    getDialog().warning({
      title: iT('hint.delete_gist_collection'),
      content: iT('hint.delete_gist_collection_confirm'),
      positiveText: iT('hint.yes'),
      negativeText: iT('hint.no'),
      onPositiveClick: () => {
        infoMsg(iT('hint.delete_gist_collection_started'))
        //delete method
        deleteGist(item.parentKey as string)
        //close editor
        handleEditorClose()
      },
      onNegativeClick: () => {
        infoMsg(iT('hint.delete_gist_collection_action_cancelled'))
      }
    })
  } else {
    //TODO: ask user if they want to save the changes
    cleanUpEditor()
    //create a new axios instance to bypass global interceptors
    //because extra headers would cause CORS error
    store.loading.editor = true;
    store.editor.openingFile = true;
    startLoadingBar()

    //get proxy settings
    if (localStorage.getItem('proxy') === 'true') {
      key = "/api/proxy/userContent?url=" + key
    }

    getNoInterceptorAxios().request({
      method: 'get',
      url: key,
      params: {
        //Extra req headers to GitHub api would cause CORS error
        //So I add a timestamp to avoid browser cache
        'time-stamp': new Date().getTime()
      }
    }).then((response) => {
      console.log('handleMenuClick action, data fetch:', response)
      store.editor.textVal = response.data.toString()
      store.editor.filename = item.label as string
      gistFileNameBeforeEdit = item.label as string
      isCurrentGistPublic.value = item.isPublic as boolean
      currentGistId.value = item.parentKey as string
      console.log('isCurrentGistPublic:', isCurrentGistPublic.value)
    }).catch(function (error) {
      console.log(error);
      errorMsg(iT('hint.network_error'))
    }).finally(() => {
      finishLoadingBar()
      store.loading.editor = false
    })
  }
};

const handleEditorChange = (text: string, html: string) => {
  //If auto-saving is on and it's in edit mode but it's not the first time editing, update the last typing date.
  if (store.editor.autoSave && isInEditMode.value && !isFirstEdit.value) {
    //update last typing date
    lastTypingDate.value = new Date()
    store.editor.isLatestSaved = false
  } else {
    //if it's the first time editing, skip and set isFirstEdit to false
    isFirstEdit.value = false
  }
}

//create new gist file handler
const handleNewGistFile = () => {
  isModalActionLoading.value = true
  axios.patch('/gists/' + store.menu.currentGistCollectionKey, {
    files: {
      [store.menu.createNewGistFileName]: {
        content: "# Hello [GistMate](https://github.com/hash070/GistMate)"
      }
    }
  }).then((res) => {
    console.log("new gist save success:", res)
    successMsg(iT('gist.create_new_gist_file_success'))
    //refresh gist menu
    loadGistsDataToMenu()
    //set selected key to the new file
    store.menu.activeKey = res.data.files[store.menu.createNewGistFileName].raw_url
    //update currentGistId
    currentGistId.value = store.menu.currentGistCollectionKey
    cleanUpEditor()
    store.editor.textVal = "# Hello [GistMate](https://github.com/hash070/GistMate)"
    store.editor.filename = store.menu.createNewGistFileName
    gistFileNameBeforeEdit = store.menu.createNewGistFileName
  }).catch((err) => {
    console.log(err)
    errorMsg(iT('gist.create_new_gist_file_failed'))
  }).finally(() => {
    store.app.isNewGistFileModalShow = false
    isModalActionLoading.value = false
  })
}

//Editor close handler
const handleEditorClose = () => {
  //editor related
  store.editor.textVal = ''
  store.editor.filename = ''
  //auto-save related
  store.editor.isLatestSaved = true
  isInEditMode.value = false
  store.editor.openingFile = false
  store.menu.activeKey = null
  isFirstEdit.value = true
}

//image upload handler
/*
const handleUploadImage = (event: any, insertImage: any, files: any) => {
  console.log('handleUploadImage:', 'event:', event, 'InsertImage: ', insertImage, "files:", files)
  let imgFileName = new Date().toISOString()
  console.log('imgFileName:', imgFileName)

  console.log('UploadImage Gist Key:', store.menu.currentGistCollectionKey)
  console.log("Uploading image file:", files[0])

  // Create a new FormData object
  const formData = new FormData();

  // Append the file to the FormData object
  formData.append(imgFileName, files[0]);

  console.log("image upload formData:", formData)

  //upload an image to current gist collection
  //TODO:Not working, return 422 err, can't upload file

  axios.patch('/gists/' + store.menu.currentGistCollectionKey, {
    files: {
      [imgFileName]: {
        content: formData
      }
    }
  }).then((res) => {
    console.log("new gist save success:", res)
    const uploadedImgObj = res.data.files[imgFileName]
    //the raw url is named `raw_url` in the obj
    const uploadedImgRawUrl = uploadedImgObj.raw_url
    //insert the image to the editor
    store.editor.textVal += `![${imgFileName}](${uploadedImgRawUrl})`
    successMsg(iT('gist.image_upload_success'))
    successMsg(iT('gist.image_upload_success'))
  }).catch((err) => {
    console.log(err)
    errorMsg(iT('gist.image_upload_failed'))
  }).finally(() => {
    store.app.isNewGistFileModalShow = false
    isModalActionLoading.value = false
  })
}
*/

//Worked, but seems not a good way, needs a server to process the image
const handleUploadImage = (event: any, insertImage: any, files: any) => {
  console.log('handleUploadImage:', 'event:', event, 'InsertImage: ', insertImage, "files:", files)
  const imgFileName = randomString(16)
  console.log('imgFileName:', imgFileName)

  if (store.editor.imgRepo === '') errorNotification(iT('hint.no_gist_repo'), iT('hint.no_gist_repo_hint'))

  console.log('UploadImage Gist Key:', store.editor.imgRepo)
  console.log("Uploading image file:", files[0])

  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = function (event) {
    //@ts-ignore
    const base64Img = event.target.result as string;

    const imageParts = base64Img.split(';base64,');
    const imageType = imageParts[0].split(':')[1];
    const base64Data = imageParts[1];

    console.log('base64Data:', base64Data);
    axios.patch('/gists/' + store.editor.imgRepo, {
      files: {
        [imgFileName]: {
          content: base64Data
        }
      }
    }).then((res) => {
      console.log("new gist save success:", res)
      //get the raw url of the uploaded image
      const uploadedImgObj = res.data.files[imgFileName]
      //the raw url is named `raw_url` in the obj
      const uploadedImgRawUrl = uploadedImgObj.raw_url

      let regex = "\\/\\/([^\\/]+)\\/([^*]+)"
      let match = uploadedImgRawUrl.match(regex)
      const uploadedImgRawUrlLocal = "/api/img?url=" + match[2]
      //insert the image to the editor
      // store.editor.textVal += `\n![${imgFileName}](${uploadedImgRawUrlLocal})`
      insertImage({
        url:
            `${uploadedImgRawUrlLocal}`,
        desc: `${imgFileName}`,
        // width: 'auto',
        // height: 'auto',
      });
      successMsg(iT('gist.image_upload_success'))
    }).catch((err) => {
      console.log(err)
      errorMsg(iT('gist.image_upload_failed'))
      errorNotification(iT('hint.no_gist_repo'), iT('hint.no_gist_repo_hint'))
    }).finally(() => {
      store.app.isNewGistFileModalShow = false
      isModalActionLoading.value = false
    })
  };
}


//Editor clean handler
const cleanUpEditor = () => {
  //editor related
  store.editor.textVal = ''
  store.editor.filename = ''
  //auto-save related
  store.editor.isLatestSaved = true
  isInEditMode.value = false
  store.editor.openingFile = true
  isFirstEdit.value = true
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