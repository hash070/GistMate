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
        <n-menu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="store.menuOptions"
        />
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
import {NLayout, NLayoutSider, NMenu, NSpace} from 'naive-ui'
import {BookOutline as BookIcon,LibraryOutline as LibraryIcon} from '@vicons/ionicons5'
import {renderIcon} from "../utils/util";
import {store} from '../store'

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

</script>
<style lang="scss" scoped>
@import "../style";

#side-menu, #content {
  height: calc(100vh - 3rem);
}
</style>