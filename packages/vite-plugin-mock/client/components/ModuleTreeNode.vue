<script setup lang="ts">
import type { TreeNode } from '../composables/fetch'
import FileIcon from './FileIcon.vue'
withDefaults(defineProps<{
  /** 树的节点 */
  node: TreeNode
  /** 节点图标 */
  icon?: string
}>(), {
  icon: 'i-carbon-folder',
})

const route = useRoute()
</script>

<template>
  <details open>
    <summary
      cursor-default
      select-none
      text-sm
      truncate
      p="y1"
    >
      <div :class="icon" />
      {{ node.name }}
    </summary>

    <ModuleTreeNode v-for="e of Object.entries(node.children)" :key="e[0]" ml4 :node="e[1]" />
    <div
      v-for="i of node.items"
      :key="i.full"
      ml4
      ws-nowrap
    >
      <RouterLink
        block
        text-sm
        p="x2 y1"
        ml1
        rounded
        :to="`/mock?url=${encodeURIComponent(i.url)}&method=${i.method}`"
        :class="{ 'bg-active': i.full === route.params.id }"
      >
        <FileIcon :id="i.url" />
        <span ml-1>
          {{ i.url.split('/').pop() }}
        </span>
      </Routerlink>
    </div>
  </details>
</template>
