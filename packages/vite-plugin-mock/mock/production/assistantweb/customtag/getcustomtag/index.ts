import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/customtag/getcustomtag',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
