import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/assistantdesk/inclass/getfirstleavereason',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
