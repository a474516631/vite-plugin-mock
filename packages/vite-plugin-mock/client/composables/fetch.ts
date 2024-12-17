import type { Ref } from 'vue'
import { computed, unref } from 'vue'
import { onConfigChanged, onModuleUpdated } from './hmr'
import { useFetch } from '@vueuse/core'
const API_ROOT = '/__mock_api'

export const infoFetch = useFetch(API_ROOT).json<any>()

export const info = infoFetch.data

onConfigChanged(() => {
  infoFetch.execute()
})

export function fetchModule(url: string | Ref<string>, method: string | Ref<string>) {
  console.log(url, method)
  const result = useFetch(
    computed(() => `${unref(url)}`),
    {
      refetch: true,
      fetchOptions: {
        headers: {
          Accept: 'application/json',
        },
      },
    },
  )
    [computed(() => `${unref(method)}`).value.toLocaleLowerCase()]()
    .json<any>()

  // onConfigChanged(() => result.execute())
  // onModuleUpdated((update) => {
  //   console.log('update', update)
  //   if (update.path === unref(url) || update.path === unref(url).slice(8)) {
  //     setTimeout(() => {
  //       result.execute()
  //     }, 50)
  //   }
  // })

  return result
}

export interface ModuleDest {
  full: string
  url: string
  path: string
  method?: string
}

export interface TreeNode {
  name?: string
  children: Record<string, TreeNode>
  items: ModuleDest[]
}

export const moduleTree = computed(() => {
  if (!info.value) {
    return {
      // workspace: { children: {}, items: [] },
      root: { children: {}, items: [] },
    }
  }

  // const inWorkspace: ModuleDest[] = []
  const inRoot: ModuleDest[] = []
  // const inNodeModules: ModuleDest[] = []
  info.value
    .filter((i) => i.url)
    .map((item) => ({ path: item.url, full: item.url, ...item }))
    .forEach((i) => {
      inRoot.push(i)
    })
  // inRoot.forEach(i => i.path = i.path.slice(info.value!.root.length + 1))

  return {
    root: toTree(inRoot, 'Disk Root'),
    size: info.value.size,
  }
})

function toTree(modules: ModuleDest[], name: string) {
  const node: TreeNode = { name, children: {}, items: [] }

  function add(mod: ModuleDest, parts: string[], current = node) {
    if (!mod) return

    if (parts.length <= 1) {
      current.items.push(mod)
      return
    }

    const first = parts.shift()!
    if (!current.children[first]) current.children[first] = { name: first, children: {}, items: [] }
    add(mod, parts, current.children[first])
  }

  modules.forEach((m) => {
    const parts = m.path.split(/\//g).filter(Boolean)
    add(m, parts)
  })

  function flat(node: TreeNode) {
    if (!node) return
    const children = Object.values(node.children)
    if (children.length === 1 && !node.items.length) {
      const child = children[0]
      node.name = node.name ? `${node.name}/${child.name}` : child.name
      node.items = child.items
      node.children = child.children
      flat(node)
    } else {
      children.forEach(flat)
    }
  }

  Object.values(node.children).forEach(flat)

  return node
}
