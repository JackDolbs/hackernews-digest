/**
 * CRON Job for Automated Digest Generation
 * Runs the digest agent on a schedule
 */

import cron from 'node-cron';
import { runDigestCLI } from './digest-agent.js';

/**
 * CRON schedule configurations
 */
const SCHEDULES = {
	// Every day at 8:00 AM
	daily: '0 8 * * *',
	
	// Every 6 hours
	sixHourly: '0 */6 * * *',
	
	// Every hour (for demo purposes)
	hourly: '0 * * * *',
	
	// Every 5 minutes (for testing)
	testing: '*/5 * * * *'
};

/**
 * Start the CRON job
 * @param {string} schedule - CRON schedule pattern or preset name
 */
export function startDigestCron(schedule = 'daily') {
	const cronPattern = SCHEDULES[schedule] || schedule;
	
	console.log(`🕐 Starting HackerNews Digest CRON job...`);
	console.log(`   Schedule: ${cronPattern} (${schedule})`);
	console.log(`   Next run: ${getNextRunTime(cronPattern)}`);
	
	// Validate CRON pattern
	if (!cron.validate(cronPattern)) {
		throw new Error(`Invalid CRON pattern: ${cronPattern}`);
	}
	
	// Start the scheduled task
	const task = cron.schedule(cronPattern, async () => {
		console.log('\n⏰ CRON job triggered - generating digest...');
		console.log(`   Time: ${new Date().toISOString()}`);
		
		try {
			await runDigestCLI();
			console.log('✅ CRON digest generation completed successfully');
		} catch (error) {
			console.error('❌ CRON digest generation failed:', error.message);
		}
		
		console.log(`   Next run: ${getNextRunTime(cronPattern)}\n`);
	}, {
		scheduled: true,
		timezone: "America/New_York" // Adjust timezone as needed
	});
	
	// Handle graceful shutdown
	process.on('SIGINT', () => {
		console.log('\n🛑 Shutting down CRON job...');
		task.stop();
		process.exit(0);
	});
	
	process.on('SIGTERM', () => {
		console.log('\n🛑 Shutting down CRON job...');
		task.stop();
		process.exit(0);
	});
	
	return task;
}

/**
 * Get the next run time for a CRON pattern
 * @param {string} cronPattern - CRON pattern
 * @returns {string} Next run time
 */
function getNextRunTime(cronPattern) {
	try {
		// This is a simplified calculation - in production you'd use a proper CRON parser
		const now = new Date();
		const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
		return nextHour.toLocaleString();
	} catch (error) {
		return 'Unable to calculate';
	}
}

/**
 * CLI function to start CRON job
 */
export function runCronCLI() {
	const args = process.argv.slice(2);
	const schedule = args[0] || 'daily';
	
	console.log('🚀 HackerNews AI Digest - CRON Scheduler');
	console.log('==========================================\n');
	
	try {
		startDigestCron(schedule);
		
		console.log('✅ CRON job started successfully!');
		console.log('\nAvailable schedules:');
		Object.entries(SCHEDULES).forEach(([name, pattern]) => {
			console.log(`   ${name}: ${pattern}`);
		});
		console.log('\nPress Ctrl+C to stop the CRON job.\n');
		
	} catch (error) {
		console.error('❌ Failed to start CRON job:', error.message);
		process.exit(1);
	}
}

// If running directly from command line
if (import.meta.url === `file://${process.argv[1]}`) {
	runCronCLI();
}
