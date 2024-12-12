import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/createUser',
    method: 'GET',
    response: () => {
      return indexJson
    },
  }
}
