import indexJson from './data/index.json'

export default () => {
  return {
    url: '/api/assistantweb/api/assistantdeskgo/lessonprestates',
    method: 'post',
    response: () => {
      return indexJson
    },
  }
}
