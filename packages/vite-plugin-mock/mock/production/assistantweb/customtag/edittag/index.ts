import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/customtag/edittag',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
