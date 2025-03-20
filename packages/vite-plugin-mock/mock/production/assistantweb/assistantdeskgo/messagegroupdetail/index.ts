import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/assistantdeskgo/messagegroupdetail',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
