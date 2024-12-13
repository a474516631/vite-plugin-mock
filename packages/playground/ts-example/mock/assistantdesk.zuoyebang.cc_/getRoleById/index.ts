import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/getRoleById',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
