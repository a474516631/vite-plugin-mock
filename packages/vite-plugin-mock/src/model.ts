import 'openai/shims/node'
import { ChatOpenAI } from '@langchain/openai'
export function getAiModel(params: { openAIApiKey: string; modelName: string }) {
  const { openAIApiKey, modelName } = params
  const chatModel = new ChatOpenAI({
    openAIApiKey: openAIApiKey,
    modelName: modelName,
    maxTokens: 4096,
    temperature: 0.7,
    configuration: {
      baseURL: 'https://llm.baifentan.com/openproxy/rp/v1/',
      fetch(url: any, options: any = {}) {
        // 添加统一的标头
        const headers = Object.assign({}, options.headers, {
          // "Authorization": `"Bearer ${auth.apiKey}@${auth.openproxyBusiness}"`,
        })

        // 调用原始的fetch方法，并传递修改后的选项
        return fetch(url, Object.assign({}, options, { headers }))
      },
    },
  })
  return chatModel
}
