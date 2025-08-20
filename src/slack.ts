import { WebClient } from '@slack/web-api';
import { LeaveEvent } from './types';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function sendToSlack(message: string): Promise<void> {
  try {
    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID!,
      text: message,
    });
    console.log('Message sent to Slack successfully');
  } catch (error) {
    console.error('Error sending message to Slack:', error);
  }
}

export function formatMessage(events: LeaveEvent[]): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const dates = [
    { date: today, label: 'Today' },
    { date: tomorrow, label: 'Tomorrow' },
    { date: dayAfter, label: 'Day After' }
  ];

  let message = 'Upcoming Leave Schedule (Today + Next 2 Days)\n\n';

  dates.forEach(({ date, label }) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => {
      const eventDate = event.start.split('T')[0];
      return eventDate === dateStr;
    });

    const dayName = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    if (label === 'Today') {
      message += `${label} - ${dayName}\n`;
    } else {
      message += `${dayName}\n`;
    }

    if (dayEvents.length === 0) {
      message += '• No scheduled leaves\n';
    } else {
      dayEvents.forEach(event => {
        const leaveType = extractLeaveType(event.summary);
        message += `• ${event.attendee} - ${leaveType}\n`;
      });
    }
    message += '\n';
  });

  return message.trim();
}

function extractLeaveType(summary: string): string {
  const lowerSummary = summary.toLowerCase();
  
  if (lowerSummary.includes('annual') || lowerSummary.includes('vacation')) {
    return 'Annual Leave';
  } else if (lowerSummary.includes('medical') || lowerSummary.includes('sick')) {
    return 'Medical Leave';
  } else if (lowerSummary.includes('personal')) {
    return 'Personal Leave';
  } else if (lowerSummary.includes('emergency')) {
    return 'Emergency Leave';
  } else if (lowerSummary.includes('maternity') || lowerSummary.includes('paternity')) {
    return 'Parental Leave';
  } else {
    return 'Leave';
  }
}
