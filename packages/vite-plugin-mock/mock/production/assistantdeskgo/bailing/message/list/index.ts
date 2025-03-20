import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/message/list',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
