<template>
  <div class="w-full flex">
    {{info}}
  </div>
</template>

<script setup lang="ts">
import { info, infoFetch, moduleTree } from '../composables/fetch';

infoFetch.execute()

</script>

<style scoped>

</style>