<script setup lang="ts">
import {  computed,  ref, watch, watchEffect } from 'vue';
import { codeToHtml } from 'shiki'
import { standFetch } from '../request';
import { useDark } from '@vueuse/core';
import { useHTMLPrettify, useJSONPrettify, useJSPrettify } from '../composables/usePrettify';
const props = defineProps<{ url: string, method: string }>()
const emptyCode = ref('')
const showDemo = ref(false)
const isDark = useDark()

const mockData = ref({})

const typeData = ref({})
const resTypeHtml = ref('')
const reqTypeHtml = ref('')
const mockRes = ref('')
const mockResShow = ref(false)
const aiLoading = ref(false)
const mockResHtml = ref('')

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

watchEffect(async () => {
  if(mockRes.value){
    const res = mockRes.value
    // const resHtml = new JSONFormatter(JSON.stringify(res));
    const htmlRes = useJSONPrettify(JSON.stringify(res))
    const resHtml = await codeToHtml(htmlRes.value, {
      lang: 'json',
      theme: isDark.value? 'github-dark' : 'github-light',
      // theme: 'github-light',
    })
    mockResHtml.value = resHtml
  }else{
    mockResHtml.value = ''
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



async function getAiMockRes(){
  aiLoading.value = true
  mockResShow.value = true
  const res = await standFetch.get('/__mock_api/ai-mock', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    query:{
      url:props.url,
    }
  })

  mockRes.value = res as any
  aiLoading.value = false

}

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
      <div class="bg-white rounded-md mt-2 dark:bg-#24292e relative ">
        <div  text="gray/80" min-h-30px max-h-30px select-none flex all:my-auto>
          <div px1 ml1 mr-2 op-60 shrink-0>Mock Data</div>
        </div>
        <div class="pt-20px " border="t main" pa-4 v-html="jsonHtml"></div>
        <div class="fixed right-10 bottom-10 " >
          <img class="w-50px cursor-pointer " src="/ai-float-person.png" alt="" @click="mockResShow = true">
          <div  border="main 1" v-show="mockResShow"
          class="
          p-4 absolute right-12 bottom-10 w-80vw min-h-300px overflow-y-auto bg-white rounded-2 shadow-2xl
          dark:bg-black " >
            <div class="flex flex-col">
              <div class="flex gap-2 items-center">
                <div class="text-14px font-bold ">AI Mock</div>

              </div>
              <div class="flex-1 flex items-center ">
                <div v-if="aiLoading"  class="i-ant-design:loading-outlined w-4 h-4 animate-spin mr-4 text-blue"></div>
                <div v-else v-html="mockResHtml"></div>

              </div>
              <div class="flex gap-4">
                <div class="text-12px text-blue  cursor-pointer" @click="getAiMockRes">
                  <span class="i-ant-design:yuque-filled  mr-1 text-blue"></span>
                  <span>生成 Mock 数据</span>
                </div>
                <div v-if="mockResHtml" class="text-12px text-blue  cursor-pointer" @click="getAiMockRes">
                  <span class="i-ant-design:edit-outlined mr-1"></span>
                  <span>写入文件</span>
                </div>
              </div>
            </div>
            <div class="i-ant-design:close-outlined absolute right-4 top-4 cursor-pointer" @click="mockResShow = false"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div h-100vh flex items-center justify-center v-else>
    <div class="i-ant-design:loading-outlined w-1em h-1em animate-spin mr-4"></div>
    <div>加载中...</div>
  </div>
</template>



<style scoped>

</style>
