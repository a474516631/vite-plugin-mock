import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/testRestful2/1',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
