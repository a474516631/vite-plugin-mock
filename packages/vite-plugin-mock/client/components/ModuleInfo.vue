<script setup lang="ts">
import {  computed,  ref, watch, watchEffect } from 'vue';
import { codeToHtml } from 'shiki'
import { standFetch } from '../request';
import { useDark } from '@vueuse/core';
const props = defineProps<{ url: string, method: string }>()
const emptyCode = ref('')
const showDemo = ref(false)
const isDark = useDark()

const mockData = ref({})

const typeData = ref({})
const resTypeHtml = ref('')
const reqTypeHtml = ref('')

watchEffect(async () => {
  const res = await standFetch.fetch(props.url, {
    method: props.method,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(res)
  mockData.value = res
})


const jsonHtml = ref('')


watch(mockData, () => {
  showDemo.value = true
})

watch(props, () => {
  showDemo.value = false
  emptyCode.value = ''
})

watchEffect(async () => {
  if(typeData.value[props.url]?.resType){
    const res = await codeToHtml(typeData.value[props.url]?.resType, {
      lang: 'typescript',
      theme: isDark.value? 'github-dark' : 'github-light',
      // theme: 'github-light',
    })
    resTypeHtml.value = res
  }else{
    resTypeHtml.value = ''
  }


 if(typeData.value[props.url]?.reqType){
    const res = await codeToHtml(typeData.value[props.url]?.reqType, {
      lang: 'typescript',
      theme: isDark.value? 'github-dark' : 'github-light',
      // theme: 'github-light',
    })
    reqTypeHtml.value = res
  }else{
    reqTypeHtml.value = ''
  }

})


function openEditor() {
  fetch(`/__open-in-editor?file=${encodeURIComponent(props.url)}`)
}

watchEffect(async () => {

  console.log(mockData.value, isDark)
  const html = await codeToHtml(JSON.stringify(mockData.value, null, 2), {
    lang: 'json',
    theme: isDark.value ? 'github-dark' : 'github-light',
    // theme: 'github-light',
  })
  jsonHtml.value = html
})

onMounted(async ()=>{
  const res = await standFetch.fetch('/__mock_api/type-api', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(res)
  typeData.value = res
})

</script>
<template>
  <div v-if="showDemo" bg-active>
    <div class=" w-full h-100vh  pa-4 overflow-auto text-12px">
      <div class="text-xl underline cursor-pointer  hover:text-#1890ff" @click="openEditor"># {{ url }}</div>
      <div border="t main" class="bg-main rounded-md flex min-h-30vh gap-2 pt-4">
        <div class="flex-1 bg-white rounded-md dark:bg-#24292e" >
          <div  text="gray/80" min-h-30px max-h-30px select-none flex all:my-auto>
            <div px1 ml1 mr-2 op-60 shrink-0> Req Type</div>
          </div>
          <div border="t main ">
            <div class="pt-20px " pa-4 v-html="reqTypeHtml"></div>
          </div>
        </div>
        <div class="flex-1 bg-white rounded-md dark:bg-#24292e" >
          <div  text="gray/80" min-h-30px max-h-30px select-none flex all:my-auto>
            <div px1 ml1 mr-2 op-60 shrink-0> Res Type</div>
          </div>
          <div border="t main ">
            <div class="pt-20px " pa-4 v-html="resTypeHtml"></div>
          </div>

        </div>
      </div>
      <div class="bg-white rounded-md mt-2 dark:bg-#24292e relative">
        <div  text="gray/80" min-h-30px max-h-30px select-none flex all:my-auto>
          <div px1 ml1 mr-2 op-60 shrink-0>Mock Data</div>
        </div>
        <div class="pt-20px " border="t main" pa-4 v-html="jsonHtml"></div>
        <div class="fixed right-10 bottom-10 cursor-pointer">
          <img class="w-50px " src="/ai-float-person.png" alt="">
        </div>
      </div>
    </div>
  </div>
  <div h-100vh flex items-center justify-center v-else>
    <div class="i-ant-design:loading-outlined w-1em h-1em animate-spin mr-4"></div>
    <div>加载中...</div>
  </div>
</template>



<style scoped></style>
