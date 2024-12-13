import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/student/studentdetail',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
