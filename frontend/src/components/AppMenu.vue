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
        <p>Content</p>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {NIcon, NLayout, NLayoutSider, NMenu, NSpace, NSpin} from 'naive-ui'
import {store} from '../store'
import {IconRefresh} from '@tabler/icons-vue';

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

const handleMenuClick = (key: any) => {
  console.log(`Clicked menu item with key "${key}"`);
};

</script>
<style lang="scss" scoped>
@import "../style";

#side-menu, #content {
  height: calc(100vh - 3rem);
}
</style>