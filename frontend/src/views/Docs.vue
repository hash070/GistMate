<template>
  <div class="docs">

    <div class="left-anchor" style="position: fixed;left: 2rem;top: 5rem">
      <n-anchor
          listen-to=".document-scroll-container"
      >
        <n-anchor-link :title="$t('docs.intro.i')" href="#intro">
          <n-anchor-link :title="$t('docs.docs')" href="#basic.vue"/>
        </n-anchor-link>
        <n-anchor-link title="API" href="#API"/>
      </n-anchor>
    </div>

    <div style="position: fixed;left: 10rem;right: 0;top:3rem">
      <n-scrollbar
          trigger="none"
          style="max-height: calc(100vh - 3rem)"
      >
        <div id="intro">
          <n-h1 align-text>
            <n-text type="primary">
              {{ $t('docs.intro.i') }}
            </n-text>
          </n-h1>
          <n-text>
            {{ $t('docs.intro.desc_content') }}
          </n-text>
        </div>
        <div id="get-started">
          <n-h1 align-text>
            <n-text type="primary">
              {{ $t('docs.getting_started.i') }}
            </n-text>
          </n-h1>
          <n-text>
            {{ $t('docs.getting_started.desc_content') }}
          </n-text>
        </div>
      </n-scrollbar>
    </div>


  </div>
</template>

<script setup lang="ts">

import {NAnchor, NAnchorLink, NH1, NScrollbar, NText} from "naive-ui";</script>

<style scoped lang="scss">
.docs {
  padding-top: 3rem;
  max-height: calc(100vh - 3rem)
}
</style>