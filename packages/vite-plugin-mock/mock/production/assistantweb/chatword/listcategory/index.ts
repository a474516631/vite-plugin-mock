import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/chatword/listcategory',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
