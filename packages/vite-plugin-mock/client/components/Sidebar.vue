<script setup lang="ts">
import { moduleTree } from '../composables/fetch'
import ModuleTreeNode from './ModuleTreeNode.vue'
</script>

<template>
  <div h-full border="r main">
    <div of-hidden>
      <NarBar />
    </div>
    <div class="scrolls scrolls-sidebar">

      <ModuleTreeNode
        v-if="Object.keys(moduleTree.root.children).length"
        :node="moduleTree.root"
        p="l3 t4"
        icon="i-carbon-vmdk-disk"
      />
    </div>
  </div>
</template>
