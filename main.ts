import { load } from 'https://deno.land/std@0.186.0/dotenv/mod.ts'
await load({ export: true })

import fast from 'https://deno.land/x/fast@6.0.0-alpha.1/mod.ts'
import {
  getHmac,
  getHmacMessage,
  HMAC_PREFIX,
  TWITCH_MESSAGE_SIGNATURE,
  verifyMessage,
} from './utils.ts'
import { handleTwitchRequest } from './Twitch.ts'

const app = fast()
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') || ''

app.post('/', async (ctx) => {
  try {
    const headers = ctx.request.headers
    const body = await ctx.request.text()
    const message = getHmacMessage(headers, body)
    if (message) {
      const hmacMessage = await getHmac(WEBHOOK_SECRET, message)
      if (
        verifyMessage(
          HMAC_PREFIX + hmacMessage,
          headers.get(TWITCH_MESSAGE_SIGNATURE) || '',
        )
      ) return await handleTwitchRequest(body)
    }

    //return JSON.parse(body)['challenge']
    return Response.json({ error: 'Bad signature' }, { status: 400 })
  } catch (err) {
    console.log(err)
    return Response.json({ error: 'An unknown error' }, { status: 500 })
  }
})

await app.serve()
