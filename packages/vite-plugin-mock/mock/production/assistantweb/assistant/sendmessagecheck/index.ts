import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/assistant/sendmessagecheck',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
