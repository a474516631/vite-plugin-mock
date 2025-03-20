import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdesk/api/user/userinfo',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
