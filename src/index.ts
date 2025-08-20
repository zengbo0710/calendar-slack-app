import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import { getLeaveEvents } from './calendar';
import { sendToSlack, formatMessage } from './slack';

// Load environment variables
dotenv.config();

async function sendLeaveSchedule(): Promise<void> {
  try {
    console.log('Fetching leave events...');
    const events = await getLeaveEvents();
    
    console.log(`Found ${events.length} leave events`);
    
    const message = formatMessage(events);
    await sendToSlack(message);
    
    console.log('Leave schedule sent successfully');
  } catch (error) {
    console.error('Error in sendLeaveSchedule:', error);
  }
}

function createCronExpression(time: string, days: string): string {
  // Parse time (e.g., "08:30" -> hour: 8, minute: 30)
  const [hour, minute] = time.split(':').map(Number);
  
  // Create cron expression: minute hour * * days
  return `${minute} ${hour} * * ${days}`;
}

function startScheduler(): void {
  const scheduleTime = process.env.SCHEDULE_TIME || '08:30';
  const scheduleDays = process.env.SCHEDULE_DAYS || '1-5';
  
  const cronExpression = createCronExpression(scheduleTime, scheduleDays);
  
  console.log(`Starting scheduler with expression: ${cronExpression}`);
  console.log(`Schedule: ${scheduleTime} on days ${scheduleDays} (0=Sunday, 1=Monday, etc.)`);
  
  cron.schedule(cronExpression, async () => {
    console.log(`\n--- Scheduled task running at ${new Date().toISOString()} ---`);
    await sendLeaveSchedule();
  }, {
    timezone: 'Asia/Singapore'
  });
  
  console.log('Scheduler started. Application is running...');
}

// Main execution
async function main(): Promise<void> {
  console.log('Calendar-Slack Integration App Starting...');
  
  // Validate required environment variables
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_CALENDAR_ID',
    'SLACK_BOT_TOKEN',
    'SLACK_CHANNEL_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    console.error('Please check your .env file');
    process.exit(1);
  }
  
  // Start the scheduler
  startScheduler();
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the application
main().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
