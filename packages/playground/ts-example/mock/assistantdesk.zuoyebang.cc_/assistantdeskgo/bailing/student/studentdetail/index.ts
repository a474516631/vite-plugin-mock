import indexJson from './data/index.json'
export default (req, res) => {
  return {
    url: '/api/assistantdeskgo/bailing/student/studentdetail',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}