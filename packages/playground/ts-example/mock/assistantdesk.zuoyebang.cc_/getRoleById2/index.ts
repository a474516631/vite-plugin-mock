import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/getRoleById2',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
