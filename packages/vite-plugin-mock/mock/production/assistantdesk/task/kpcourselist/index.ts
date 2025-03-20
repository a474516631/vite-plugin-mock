import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdesk/api/task/kpcourselist',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
