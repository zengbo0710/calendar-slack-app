# Calendar-Slack Integration Application

## Project Overview

A simple Node.js and TypeScript application that fetches leave events for today and the next 2 days from Google Calendar and sends them to a Slack channel on a configurable schedule. Designed for simplicity and easy maintenance.

## Features

- Fetch leave events from Google Calendar (today + next 2 days)
- Send formatted message to Slack channel on configurable schedule
- Simple configuration via environment variables
- Basic error handling and logging

## Technology Stack

- **Runtime**: Node.js (v22.18+)
- **Language**: TypeScript
- **Dependencies** (minimal):
  - `googleapis` - Google Calendar API
  - `@slack/web-api` - Slack API
  - `dotenv` - Environment variables
  - `node-cron` - Task scheduling

## Project Structure

```
calendar-slack-app/
├── src/
│   ├── index.ts                  # Main application file with scheduler
│   ├── calendar.ts               # Google Calendar functions
│   ├── slack.ts                  # Slack functions
│   └── types.ts                  # Type definitions
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Configuration

### Environment Variables (.env)

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

## Core Functions

### Calendar Functions (calendar.ts)

```typescript
interface LeaveEvent {
  summary: string;
  start: string;
  end: string;
}

// Get events from Google Calendar
export async function getLeaveEvents(): Promise<LeaveEvent[]>

// Filter events containing leave keywords
export function filterLeaveEvents(events: any[]): LeaveEvent[]
```

### Slack Functions (slack.ts)

```typescript
// Send message to Slack channel
export async function sendToSlack(message: string): Promise<void>

// Format leave events into readable message
export function formatMessage(events: LeaveEvent[]): string
```

## Message Format

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

## Error Handling

- Basic try-catch blocks around API calls
- Simple console logging for errors
- Graceful failure (continue if one API fails)

## Security

- Store API keys in `.env` file
- Add `.env` to `.gitignore`
- Use minimal API permissions

## Setup

### Prerequisites

- Node.js v22.18+
- Google Calendar API access
- Slack bot token

### Installation

1. Clone and install:
   ```bash
   npm install
   ```

2. Create `.env` file with your API keys

3. Run the application:
   ```bash
   npm start
   ```

### Package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

## Usage

The application runs as a scheduled job using node-cron. Configure the schedule via environment variables:

```bash
# Run the scheduler (keeps running and executes at configured times)
npm start

# The scheduler reads SCHEDULE_TIME and SCHEDULE_DAYS from .env:
# SCHEDULE_TIME=08:30 (default)
# SCHEDULE_DAYS=1-5 (Monday-Friday, default)

# Examples of different schedule configurations:
# 9:00 AM Monday-Friday: SCHEDULE_TIME=09:00 SCHEDULE_DAYS=1-5
# 8:30 AM every day: SCHEDULE_TIME=08:30 SCHEDULE_DAYS=0-6
# 7:45 AM Monday-Thursday: SCHEDULE_TIME=07:45 SCHEDULE_DAYS=1-4
```

## Troubleshooting

- **Calendar not found**: Check `GOOGLE_CALENDAR_ID`
- **Slack message fails**: Verify bot token and channel ID
- **No events found**: Check calendar has events with "leave" keywords

## Maintenance

- Keep dependencies updated
- Monitor Google API quotas
- Refresh tokens when they expire

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
