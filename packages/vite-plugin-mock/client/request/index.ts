import { createStandardFetch, ResCode } from 'common-fetch'

export const standFetch = createStandardFetch({
  afterHook: async (_, res) => {
    if (res?.ok) {
      const data = await res?.json()
      // if (data.errNo === 3 || data.errNo === 1001) {
      //   return Promise.reject(data)
      // }
      // if (data.errNo !== ResCode.OK) {
      //   return Promise.reject(data)
      // }
      return data
    }
  },
})
