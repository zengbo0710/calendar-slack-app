# Calendar-Slack Integration Application

A simple Node.js and TypeScript application that fetches leave events for today and the next 2 days from Google Calendar and sends them to a Slack channel on a configurable schedule.

## Features

- Fetch leave events from Google Calendar (today + next 2 days)
- Send formatted message to Slack channel on configurable schedule
- Simple configuration via environment variables
- Basic error handling and logging

## Prerequisites

- Node.js v22.18+
- Google Calendar API access
- Slack bot token

## Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` file with your API credentials:
   ```env
   # Google Calendar API
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_refresh_token
   GOOGLE_CALENDAR_ID=your_calendar_id

   # Slack API
   SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
   SLACK_CHANNEL_ID=your_channel_id

   # Scheduler Configuration
   SCHEDULE_TIME=08:30
   SCHEDULE_DAYS=1-5
   ```

## API Setup

### Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Get refresh token for your calendar
5. Required scope: `https://www.googleapis.com/auth/calendar.readonly`

### Slack API

1. Go to [Slack API](https://api.slack.com/apps)
2. Create new app
3. Add bot token scope: `chat:write`
4. Install app to workspace
5. Copy bot token

## Usage

Build and run the application:

```bash
# Build the TypeScript code
npm run build

# Run the scheduler (keeps running and executes at configured times)
npm start

# For development
npm run dev
```

The application runs as a scheduled job using node-cron. Configure the schedule via environment variables:

- `SCHEDULE_TIME=08:30` (default: 8:30 AM)
- `SCHEDULE_DAYS=1-5` (default: Monday-Friday)

### Schedule Examples

- 9:00 AM Monday-Friday: `SCHEDULE_TIME=09:00 SCHEDULE_DAYS=1-5`
- 8:30 AM every day: `SCHEDULE_TIME=08:30 SCHEDULE_DAYS=0-6`
- 7:45 AM Monday-Thursday: `SCHEDULE_TIME=07:45 SCHEDULE_DAYS=1-4`

## Message Format

The application sends messages in this format:

```
Upcoming Leave Schedule (Today + Next 2 Days)

Today - Monday, Jan 15, 2024
• John Doe - Annual Leave
• Jane Smith - Medical Leave

Tuesday, Jan 16, 2024
• Mike Johnson - Personal Leave

Wednesday, Jan 17, 2024
• No scheduled leaves
```

## Troubleshooting

- **Calendar not found**: Check `GOOGLE_CALENDAR_ID`
- **Slack message fails**: Verify bot token and channel ID
- **No events found**: Check calendar has events with "leave" keywords
- **Authentication errors**: Verify Google API credentials and refresh token

## Maintenance

- Keep dependencies updated
- Monitor Google API quotas
- Refresh tokens when they expire

## License

MIT
