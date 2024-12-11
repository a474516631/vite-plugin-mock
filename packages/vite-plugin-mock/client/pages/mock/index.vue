<script setup lang="ts">
import ModuleInfo from '../../components/ModuleInfo.vue'
const route = useRoute()
</script>

<template>
  <!-- <TestText class="hidden" color="red" bgColor="blue" text="Hello World"></TestText> -->
   {{ route.query }}
  <ModuleInfo :url="route.query.url" :method="route.query.method"/>
</template>
