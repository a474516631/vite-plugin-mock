import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdesk/api/sop/getcalltypelist',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
