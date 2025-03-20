import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/message/read',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
