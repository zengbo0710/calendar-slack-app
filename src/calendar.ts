import { google } from 'googleapis';
import { LeaveEvent } from './types';

const LEAVE_KEYWORDS = ['leave', 'vacation', 'off', 'holiday', 'pto', 'absent'];

export async function getLeaveEvents(): Promise<LeaveEvent[]> {
  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Get events for today + next 2 days
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 2);
    endDate.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    return filterLeaveEvents(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

export function filterLeaveEvents(events: any[]): LeaveEvent[] {
  return events
    .filter(event => {
      const summary = event.summary?.toLowerCase() || '';
      return LEAVE_KEYWORDS.some(keyword => summary.includes(keyword));
    })
    .map(event => ({
      summary: event.summary || 'Leave',
      start: event.start?.date || event.start?.dateTime || '',
      end: event.end?.date || event.end?.dateTime || '',
      attendee: event.attendees?.[0]?.displayName || extractNameFromSummary(event.summary || ''),
    }));
}

function extractNameFromSummary(summary: string): string {
  // Try to extract name from summary like "John Doe - Annual Leave"
  const parts = summary.split(' - ');
  if (parts.length > 1) {
    return parts[0].trim();
  }
  return 'Someone';
}
