import indexJson from './data/index.json'
export default () => {
  return {
    url: '/api/coursetrans/api/getstudentorderlist',
    method: 'get',
    response: () => {
      return indexJson
    },
  }
}
