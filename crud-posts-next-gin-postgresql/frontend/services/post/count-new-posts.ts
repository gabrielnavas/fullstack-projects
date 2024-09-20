// 'use client'

// type Result = {
//   message: string
//   error: boolean
//   count: number
// }

// const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/posts/count-news`

// export const countNewPosts = (token: string) => async (timestampAfter: Date): Promise<Result> => {
//   const timeStampStr = timestampAfter.toISOString()
//   const urlWithTimestamp = `${url}/${timeStampStr}`
//   const response = await fetch(urlWithTimestamp, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Accept': 'application/json'
//     }
//   })

//   const body = await response.json()

//   return {
//     error: !response.ok,
//     message: body.message ? body.message : '',
//     count: body.data,
//   }
// }
