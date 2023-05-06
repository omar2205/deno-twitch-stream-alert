const CALLBACK_URL = Deno.env.get('CALLBACK_URL') || ''
const CLIENT_SECRET = Deno.env.get('CLIENT_SECRET') || ''
const CLIENT_ID = Deno.env.get('CLIENT_ID') || ''
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') || ''

export async function getAccessToken() {
  const body = new URLSearchParams()
  body.append('client_id', CLIENT_ID)
  body.append('client_secret', CLIENT_SECRET)
  body.append('grant_type', 'client_credentials')

  const response = await fetch(
    'https://id.twitch.tv/oauth2/token',
    {
      method: 'POST',
      body,
    },
  )

  const data = await response.json()
  return data.access_token
}

export async function addWebhook(streamerId: string) {
  const payload = {
    'type': 'stream.onlnine',
    'version': '1',
    'condition': {
      'broadcaster_user_id': streamerId,
    },
    'transport': {
      'method': 'webhook',
      'callback': CALLBACK_URL,
      'secret': WEBHOOK_SECRET,
    },
  }

  const token = await getAccessToken()
  const headers = {
    'Client-ID': CLIENT_ID,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await fetch(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    },
  )

  // Check the response status
  if (response.ok) {
    console.log('Subscription successful')
  } else {
    console.log('Subscription failed:', await response.text())
  }
}

export function handleTwitchRequest(body: string) {
  const data = JSON.parse(body)

  if (data.challenge) {
    console.log('Challenge received')
    return data.challenge
  }

  if (data.event) {
    console.log('Notifications received')
    if (data.event.type === 'stream.online') {
      console.log(`Streamer ${data.event.broadcaster_user_name} is ONLINE`)
      sendDiscordNotification()
    } else if (data.event.type === 'stream.offline') {
      console.log(`Streamer ${data.event.broadcaster_user_name} is OFFLINE`)
    }
  }
}

async function sendDiscordNotification() {
  const DISCORD_CHANNEL_WEBHOOK_URL = Deno.env.get(
    'DISCORD_CHANNEL_WEBHOOK_URL',
  )

  if (!DISCORD_CHANNEL_WEBHOOK_URL) throw new Error('No Discord webhook')

  await fetch(DISCORD_CHANNEL_WEBHOOK_URL, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: `{"content": ":rotating_light: hey @everyone\nLIVE NOW"}`
  })
}
