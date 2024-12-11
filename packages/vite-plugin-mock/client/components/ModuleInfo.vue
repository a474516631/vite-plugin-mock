<script setup lang="ts">
import { fetchModule } from '../composables/fetch';
import { toRef, computed, defineAsyncComponent, ref, watch, watchEffect } from 'vue';
import { codeToHtml } from 'shiki'
const props = defineProps<{ url: string, method: string }>()
const emptyCode = ref('')
const showDemo = ref(false)

const moduleInfoData = fetchModule(toRef(props, 'url'))

// const LarkComponents = computed(() => {
//   return defineAsyncComponent(() => import(/* @vite-ignore */`/${props.id}?t=${Date.now()}`))
// })


const componentDemoList = computed(() => {
  return moduleInfoData?.data?.value?.mockData?.map((d: any) => {
    return {
      ...d,
      demo: ref('')
    }
  }) || []
})

watch(moduleInfoData?.data, () => {
  showDemo.value = true
})

watch(props, () => {
  showDemo.value = false
  emptyCode.value = ''
})

// watchEffect(async () => {
//   for (const comMockProps of componentDemoList.value) {
//     comMockProps.demo.value = await getExampleCode(comMockProps) || ''
//   }
//   if(!componentDemoList.value.length){
//     emptyCode.value = await getEmptyPropsDemo()
//   }

// })
function openEditor() {
  fetch(`/__open-in-editor?file=${encodeURIComponent(props.path)}`)
}

async function getExampleCode(mockData: any) {
  const data = mockData.data
  const desc = mockData.desc
  const propsStr = Object.keys(data)
    .map((key) => `   ${key}="${data[key]}"`).join('\n') || ''


    // const html = await codeToHtml(code, {
    //   lang: 'vue-html',
    //   theme: 'github-dark'
    // })
  // return html
}


// async function getEmptyPropsDemo(){
//   const code = `
//   <${componentName.value}/>
//   `
//   return await codeToHtml(code, {
//     lang: 'vue-html',
//     theme: 'github-dark'
//   })
// }
</script>
<template>
  <div v-if=" showDemo" >
    <div class=" w-full h-100vh  pa-4 overflow-auto text-12px" >
      <div class="text-xl underline cursor-pointer text-#333 hover:text-#1890ff" @click="openEditor"># {{ id }}</div>
      <div v-if="componentDemoList.length">
        <div v-for="(comMockProps,index) of componentDemoList" :key="comMockProps.desc" class="bg-#fafafa mt-4 pa-4 shadow ">
          <div >
            <div class="mb-4 text-4">用法 {{ index + 1 }}</div>
            <div class=" text-14px">代码：</div>
            <div class="code mt-1 text-12px" v-html="comMockProps.demo.value"></div>
          </div>
          <div pt-4>
            <div mb-2 text-14px>示例</div>
            <!-- <component :is="LarkComponents" v-bind="comMockProps.data" /> -->
          </div>
        </div>
      </div>
      <div class="w-full h-full" v-if="showDemo && !componentDemoList.length">
        <div mb-2 text-14px mt-10px>示例:</div>
        <!-- <component :is="LarkComponents" /> -->
        {{ console.log('emptyCode',emptyCode) }}
        <div class=" text-14px">代码：</div>
        <div class="code mt-1 text-12px min-h-56px" v-html="emptyCode"></div>
      </div>
    </div>
  </div>
  <div h-100vh flex items-center justify-center v-else>
    <div class="i-ant-design:loading-outlined w-1em h-1em animate-spin mr-4"></div>
    <div >加载中...</div>
  </div>
</template>



<style scoped></style>
