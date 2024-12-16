import { getAiModel } from './model'
import { RunnableSequence } from '@langchain/core/runnables'
import { PromptTemplate } from '@langchain/core/prompts'
export async function addSuggestionToCode(comInfo: any) {
  if (!comInfo.props) return

  const parser = StructuredOutputParser.fromZodSchema(z.object({}))

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `
`,
    ),
    chatModel,
    parser,
  ])
  console.log(parser.getFormatInstructions())
  const response = await chain.invoke({
    metaInfo: comInfo,
    format_instructions: parser.getFormatInstructions(),
    props: comInfo.props,
  })
  return response
}

// 定义Prompt模板，用于指导AI生成符合要求的Mock数据
const promptTemplate = PromptTemplate.fromTemplate(`
你是一个帮助生成Mock数据的助手，给定一个请求的描述（包含请求返回类型信息），你需要生成对应的符合该请求要求的Mock数据，并且只能以JSON格式返回，不要包含任何额外的解释内容。
尽量使用中文
请求描述：
{request_description}
`)

// 模拟的请求相关信息，实际中你可以从提取接口文件等方式获取到准确的请求描述信息

export async function getMockData(
  resType: string,
  aiConfig: {
    openAIApiKey: string
    modelName: string
  },
) {
  const chatModel = getAiModel(aiConfig)
  const requestDescription = `返回类型: ${resType}`

  const input = await promptTemplate.format({ request_description: requestDescription })
  const response = await chatModel.call([input])
  try {
    return response.content
  } catch (error) {
    console.error('解析AI返回的JSON数据失败:', error)
    return null
  }
}
