<script setup lang="ts">
import { moduleTree } from '../composables/fetch'
import ModuleTreeNode from './ModuleTreeNode.vue'
</script>

<template>
  <div h-full border="r main">
    <div of-hidden>
      <NarBar />
    </div>
    <div class="scrolls scrolls-sidebar ">

      <ModuleTreeNode
        v-if="Object.keys(moduleTree.root.children).length"
        :node="moduleTree.root"
        p="l3 t4"
        icon="i-carbon-vmdk-disk"
      />
    </div>
  </div>
</template>
<style>
:root{
  --cm-ttc-c-thumb: #eee;
  --cm-ttc-c-track: white;
}
.scrolls::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scrolls {
  overflow: auto !important;
  scrollbar-width: thin;
  scrollbar-color: var(--cm-ttc-c-thumb) var(--cm-ttc-c-track);
}
.scrolls::-webkit-scrollbar-track {
  background: var(--cm-ttc-c-track);
}
.scrolls::-webkit-scrollbar-thumb {
  background-color: var(--cm-ttc-c-thumb);
  border: 2px solid var(--cm-ttc-c-thumb);
}
.scrolls::-webkit-scrollbar-thumb,
.scrolls-rounded::-webkit-scrollbar-track {
  border-radius: 3px;
}
.scrolls::-webkit-scrollbar-corner {
  background-color: var(--cm-ttc-c-track);
}
.scrolls-sidebar {
  height: calc(100vh - 25px - 1.5rem - 15px) !important;
}
</style>
