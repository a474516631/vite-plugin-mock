import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/interview/list',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
