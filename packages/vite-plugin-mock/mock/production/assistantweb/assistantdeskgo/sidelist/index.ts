import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/assistantdeskgo/sidelist',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
