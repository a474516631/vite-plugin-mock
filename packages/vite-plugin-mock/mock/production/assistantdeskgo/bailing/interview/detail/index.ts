import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/interview/detail',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
