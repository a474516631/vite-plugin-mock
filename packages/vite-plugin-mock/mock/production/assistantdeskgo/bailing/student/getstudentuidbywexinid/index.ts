import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/student/getstudentuidbywexinid',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
