import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/getRoleById',
    method: 'POST',
    response: () => {
      return indexJson
    },
  }
}
