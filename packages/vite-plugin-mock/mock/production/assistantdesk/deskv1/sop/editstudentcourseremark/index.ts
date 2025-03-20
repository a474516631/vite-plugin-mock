import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantdesk/deskv1/sop/editstudentcourseremark',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
