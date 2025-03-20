import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/assistantweb/api/assistantdeskgo/updatepreclass',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
