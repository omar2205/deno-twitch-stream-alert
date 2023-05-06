import { load } from 'https://deno.land/std@0.186.0/dotenv/mod.ts'
await load({ export: true })

import { addWebhook } from './Twitch.ts'

const streamerId = Deno.args[0]
if (!streamerId) throw new Error('No streamerId was provided')

await addWebhook(streamerId)
