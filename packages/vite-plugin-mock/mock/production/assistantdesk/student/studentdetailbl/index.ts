import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdesk/api/student/studentdetailbl',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
