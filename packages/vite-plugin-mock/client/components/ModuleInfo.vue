<script setup lang="ts">
import { fetchModule } from '../composables/fetch';
import { toRef, computed, defineAsyncComponent, ref, watch, watchEffect } from 'vue';
import { codeToHtml } from 'shiki'
const props = defineProps<{ url: string, method: string }>()
const emptyCode = ref('')
const showDemo = ref(false)

const mockData = fetchModule(toRef(props, 'url'),toRef(props, 'method'))

const jsonHtml = ref('')


watch(mockData?.data, () => {
  showDemo.value = true
})

watch(props, () => {
  showDemo.value = false
  emptyCode.value = ''
})


function openEditor() {
  fetch(`/__open-in-editor?file=${encodeURIComponent(props.url)}`)
}

watchEffect(async () => {
  const html = await codeToHtml(JSON.stringify(mockData.data.value, null, 2), {
      lang: 'json',
      theme: 'github-dark'
    })
  jsonHtml.value = html
})



</script>
<template>
  <div v-if=" showDemo" >
    <div class=" w-full h-100vh  pa-4 overflow-auto text-12px" >
      <div class="text-xl underline cursor-pointer text-#333 hover:text-#1890ff" @click="openEditor"># {{ url }}</div>
      <div class="pt-20px" v-html="jsonHtml"></div>
    </div>
  </div>
  <div h-100vh flex items-center justify-center v-else>
    <div class="i-ant-design:loading-outlined w-1em h-1em animate-spin mr-4"></div>
    <div >加载中...</div>
  </div>
</template>



<style scoped></style>
