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
              <IconRefresh/>
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
        <v-md-editor
            v-model="store.editor.textVal"
            height="calc(100vh - 3rem)"
            :include-level="[1 ,2, 3]"
            @save="handleSave"
        ></v-md-editor>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {MenuOption, NIcon, NLayout, NLayoutSider, NMenu, NSpace, NSpin} from 'naive-ui'
import {store} from '../store'
import {IconRefresh} from '@tabler/icons-vue';
import axios from "axios";

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
})


const activeKey = ref<string | null>(null);
const collapsed = ref(false);

const handleMenuExpand = (keys: string[]) => {
  console.log('expandedKey:', keys)
};

const handleMenuClick = (key: string, item: MenuOption) => {
  console.log('click:', key, item)
  //create a new axios instance to bypass global interceptors
  //because extra headers would cause CORS error
  axios.create().request({
    method: 'get',
    url: key,
  }).then(function (response) {
    store.editor.textVal = response.data
  }).catch(function (error) {
    console.log(error);
  });
};

</script>
<style lang="scss" scoped>
@import "../style";

#side-menu, #content {
  height: calc(100vh - 3rem);
}
</style>