import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/muse/remind/desk/list',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
