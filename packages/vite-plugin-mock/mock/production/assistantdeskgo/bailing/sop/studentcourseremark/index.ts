import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdeskgo/bailing/sop/studentcourseremark',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
