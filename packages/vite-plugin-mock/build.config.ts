import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // 主入口
    'src/index',
    // 客户端入口
    {
      input: 'src/client',
      name: 'client',
      outDir: 'dist',
    },
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  externals: [
    'vite',
    'mockjs',
    'path-to-regexp',
    'express',
    'axios',
    'cors',
    'http-proxy-middleware',
    'chokidar',
  ],
})
