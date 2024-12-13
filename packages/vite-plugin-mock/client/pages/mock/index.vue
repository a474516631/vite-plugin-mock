<script setup lang="ts">
import ModuleInfo from '../../components/ModuleInfo.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <!-- <TestText class="hidden" color="red" bgColor="blue" text="Hello World"></TestText> -->
  <ModuleInfo :url="route.query.url" :method="route.query.method"/>
</template>
