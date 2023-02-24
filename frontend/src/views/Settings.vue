<template>
  <div class="settings">
    <n-form ref="formRef" :model="model" style="margin: 2rem">
      <n-form-item :label="$t('settings.img_repo')">
        <n-input v-model:value="model.imgRepo"/>
      </n-form-item>
      <n-form-item :label="$t('settings.auto_save')">
        <n-switch v-model:value="model.autoSave"/>
      </n-form-item>
      <n-form-item :label="$t('settings.silent_mode')">
        <n-switch v-model:value="model.silentMode"/>
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button
                :disabled="model.imgRepo === null||model.imgRepo === ''"
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
  </div>


</template>

<script setup lang="ts">
import {FormInst, NButton, NCol, NForm, NFormItem, NInput, NRow, NSwitch} from "naive-ui";
import {onMounted, ref} from "vue";
import {store} from "../store";

onMounted(() => {
  console.log('Settings mounted')
  //load from local storage
  model.value.imgRepo = localStorage.getItem('imgRepo')
  model.value.autoSave = localStorage.getItem('autoSave') === 'true'
  model.value.silentMode = localStorage.getItem('silentMode') === 'true'
})


const formRef = ref<FormInst | null>(null)

interface ModelType {
  imgRepo: string | null
  autoSave: boolean
  silentMode: boolean
}

const model = ref<ModelType>({
  imgRepo: null,
  autoSave: true,
  silentMode: false
})

const handleSaveButtonClick = () => {
  console.log(model.value)
  //save to local storage
  localStorage.setItem('imgRepo', model.value.imgRepo as string)
  localStorage.setItem('autoSave', model.value.autoSave.toString())
  localStorage.setItem('silentMode', model.value.silentMode.toString())
  //update store
  store.editor.imgRepo = model.value.imgRepo as string
  store.editor.autoSave = model.value.autoSave
  store.app.silentMode = model.value.silentMode
}

</script>

<style scoped lang="scss">
.settings {
  padding-top: 3rem;
}
</style>