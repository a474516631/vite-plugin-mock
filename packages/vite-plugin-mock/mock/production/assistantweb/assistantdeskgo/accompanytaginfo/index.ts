import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/assistantdeskgo/accompanytaginfo',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
