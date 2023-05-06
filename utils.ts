import nodeCrypto from 'node:crypto'
import { bufferToHex } from 'https://deno.land/x/hextools@v1.0.0/mod.ts'
import { timingSafeEqual } from 'https://deno.land/std@0.186.0/crypto/timing_safe_equal.ts'
const encoder = new TextEncoder()
export const decoder = new TextDecoder('utf-8')

export const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase()
export const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'
  .toLowerCase()
export const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'
  .toLowerCase()
export const HMAC_PREFIX = 'sha256='

async function createKey(secret: string) {
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  )
}

export async function getHmac(secret: string, message: string) {
  const key = await createKey(secret)
  return bufferToHex(
    await crypto.subtle.sign('HMAC', key, encoder.encode(message)),
  )
}

export function verifyMessage(hmac: string, signature: string) {
  return timingSafeEqual(encoder.encode(hmac), encoder.encode(signature))
}

export function getHmacMessage(headers: Headers, body: unknown) {
  const id = headers.get(TWITCH_MESSAGE_ID) || ''
  const ts = headers.get(TWITCH_MESSAGE_TIMESTAMP) || ''

  if (id && ts) return id + ts + body
}
