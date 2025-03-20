import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/assistant/getgroupsensitivewords',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
