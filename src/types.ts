export interface LeaveEvent {
  summary: string;
  start: string;
  end: string;
  attendee?: string;
}

export interface Config {
  google: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    calendarId: string;
  };
  slack: {
    botToken: string;
    channelId: string;
  };
  schedule: {
    time: string;
    days: string;
  };
}
