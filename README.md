# Get alerts in Discord from Twitch

Sends an alert using Twitch webhooks to a Discord channel

# Usage

1. Copy `.env.example` to `.env` and update its content.
    * You can get `CLIENT_SECRET` and `CLIENT_ID` from Twitch dev.
    Create a new application here [Twitch Register Application ](https://dev.twitch.tv/console/apps/create "Twitch Register Application ")
    * To get `ACCESS_TOKEN` you need the Twitch CLI. Check the official guide [Twitch CLI](https://dev.twitch.tv/docs/cli/) or just download it from GitHub https://github.com/twitchdev/twitch-cli/releases
    * After downloading/installing the Twitch CLI, run `./twitch token` and it will offer to configure it self. Enter your `CLIENT_SECRET` and `CLIENT_ID` when prompted.
    * For `WEBHOOK_SECRET` any string between 10 and 100 characters will do.
    * For `DISCORD_CHANNEL_WEBHOOK_URL` we will need to create a Discord channel webhook. Go to the channel you want to send notifications, and click edit and go to Integrations. Click view webhooks in the Webhooks sections and click New Webhook. You can customize your Bot and click Copy Webhook URL.
2. Create a project in Deno deploy and enter all the variables from the `.env` don't worry about `CALLBACK_URL` we will get it after.
3. Copy your deno deploy URL from `Overview` tab (the smallest .deno.dev URL)

