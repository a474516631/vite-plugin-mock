<template>
  <div class="text" :style="{ color: props.color, backgroundColor: props.bgColor}">
    {{ props.text }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ color: string,bgColor: string, text: string }>()
</script>

<style scoped>

</style>