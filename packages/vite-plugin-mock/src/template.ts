import path from 'node:path'

export function mockTsStrTemplate(params: { reqUrl: string; reqMethod: string; prefix: string }) {
  const url = path.join(params.prefix, params.reqUrl)
  return `
import indexJson from './data/index.json'
export default () => {
  return {
    url: '${url}',
    method: '${params.reqMethod}',
    response: () => {
      return indexJson
    },
  }
}`
}
