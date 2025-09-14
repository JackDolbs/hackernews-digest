# causaLens Digest - AI-Powered HackerNews Digest

An intelligent agent that scans HackerNews, identifies trending tech stories, and creates concise, actionable digests with AI-powered insights. Built with SvelteKit, PocketBase, and OpenAI API.

![causaLens Digest](https://img.shields.io/badge/causaLens-AI%20Digest-blue?style=for-the-badge&logo=y-combinator)

## Features

- 🤖 **AI-Powered Summaries**: Uses OpenAI to generate concise 2-3 sentence summaries with "why it matters" insights
- 📱 **Mobile-First Design**: Beautiful, responsive interface inspired by The Economist's Espresso
- 🔍 **Smart Filtering**: Automatically identifies tech-relevant stories using keywords and domains
- 💾 **Persistent Caching**: PocketBase-powered caching system (45-minute TTL) for improved performance
- 🎭 **Sentiment Analysis**: AI-driven sentiment classification with color-coded badges
- 📊 **Story Categorization**: Organizes stories into AI & ML, Hardware, General Tech, etc.
- 🔄 **Flexible Sorting**: Sort by trending score, upvotes, comments, or latest stories
- ⚡ **Loading States**: Smooth skeleton loaders for better user experience
- 🚀 **Fast Performance**: Concurrent API calls and efficient data processing
- ⏰ **Automated Generation**: CRON job support for scheduled digest creation

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd hackernews-digest
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Required: OpenAI API key (server-side only, secure)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Optional: PocketBase caching (recommended for production)
VITE_POCKETBASE_URL=https://your-pocketbase-instance.com
```

**Required:**
- Get your OpenAI API key from: https://platform.openai.com/api-keys

**Optional (for persistent caching):**
- Set up a PocketBase instance (local or hosted)
- Create a `digests_cache` collection with fields: `key` (text), `digest` (json), `params` (json)
- **Security**: Configure PocketBase API rules for public access:
  ```
  List/View: @request.auth.id = ""  (allow anonymous read)
  Create: @request.auth.id = ""     (allow anonymous create)
  Update: false                     (no updates needed)
  Delete: false                     (cleanup handled server-side)
  ```

**⚠️ Security Note:** Admin credentials are no longer required in `.env` file. The system uses public PocketBase API rules for secure, anonymous caching.

### 3. Run the Application

```bash
# Start the development server
npm run dev

# Open http://localhost:5173
```

### 4. Generate Digest via CLI

```bash
# Generate a one-time digest
npm run digest

# Start automated CRON job (daily at 8 AM)
npm run cron

# Start CRON with custom schedule
npm run cron hourly
```

## Usage

### Web Interface

1. Open the app in your browser
2. Click "Refresh Feed" to generate a new digest
3. Browse AI-generated summaries with:
   - **Sentiment badges**: Color-coded emotional tone (positive/neutral/negative)
   - **Category tags**: Story classification (AI & ML, Hardware, General Tech)
   - **"Why it matters"** insights for each story
4. **Sort stories** by trending score, upvotes, comments, or latest
5. **Cache management**: Use "Clear Cache" to force fresh content
6. Click links to read original stories or HN discussions

### CLI Commands

```bash
# Generate digest and save to JSON
npm run digest

# Start CRON scheduler
npm run cron [schedule]
```

Available CRON schedules:
- `daily` - Every day at 8:00 AM (default)
- `sixHourly` - Every 6 hours
- `hourly` - Every hour
- `testing` - Every 5 minutes
- Custom CRON pattern (e.g., `"0 */2 * * *"`)

### API Endpoints

```bash
# GET digest with parameters
GET /api/digest?limit=12&hours=24

# POST digest with JSON body
POST /api/digest
{
  "storyLimit": 15,
  "hoursBack": 48
}

# Cache management
GET /api/cache          # Get cache statistics
POST /api/cache/clear   # Clear digest cache
```

## Architecture

### Core Services

- **HackerNews API Service** (`src/lib/services/hackernews.js`)
  - Fetches top stories and trending content
  - Handles concurrent API calls for performance

- **Tech Story Filter** (`src/lib/services/filter.js`)
  - Filters stories using tech keywords and domains
  - Categorizes stories into relevant tech topics

- **AI Summarization** (`src/lib/services/ai.js`)
  - Generates concise summaries with OpenAI
  - Provides "why it matters" insights
  - **NEW**: Sentiment analysis with reasoning

- **PocketBase Cache** (`src/lib/services/pb-cache.js`)
  - **NEW**: Persistent caching with 45-minute TTL
  - Automatic cleanup of expired entries
  - **Security**: No admin credentials required, uses public API rules
  - Sanitized logging with no sensitive data exposure

- **Digest Agent** (`src/lib/digest-agent.js`)
  - Orchestrates the entire pipeline
  - CLI and programmatic interfaces
  - Integrated with caching system

### Frontend Components

- **DigestCard** - Individual story summary cards with sentiment badges
- **DigestSort** - **NEW**: Flexible sorting controls (trending, upvotes, comments, latest)
- **SentimentBadge** - **NEW**: Color-coded sentiment indicators
- **Header** - Navigation with cache controls and branding
- **DigestOverview** - Daily summary statistics and overview
- **Loading States** - **NEW**: Skeleton loaders for better UX
- **Mobile-first Layout** - Responsive design with Tailwind CSS

### Automation

- **CRON Job** (`src/lib/cron-job.js`)
  - Scheduled digest generation
  - Configurable timing and error handling

## Configuration

### Story Filtering

The system uses a comprehensive list of tech keywords and domains to identify relevant stories:

- **Programming**: JavaScript, Python, React, AI/ML, etc.
- **Companies**: Apple, Google, Microsoft, startups, etc.
- **Domains**: GitHub, Stack Overflow, tech blogs, etc.
- **Categories**: AI & ML, Web Development, Mobile, Cloud, etc.

### AI Prompts

Summaries are generated with prompts optimized for:
- Conciseness (2-3 sentences)
- Actionable insights
- "Why it matters" context
- Tech industry relevance

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── DigestCard.svelte
│   │   └── LoadingSpinner.svelte
│   ├── services/
│   │   ├── hackernews.js
│   │   ├── filter.js
│   │   └── ai.js
│   ├── digest-agent.js
│   └── cron-job.js
├── routes/
│   ├── api/digest/+server.js
│   ├── +layout.svelte
│   └── +page.svelte
└── app.css
```

## Demo

The system demonstrates:
- **Automation Workflow**: Repeatable, agentic, low friction
- **Code Quality**: Clean, modular architecture
- **Communication**: Clear, actionable digest format
- **LLM Integration**: Effective AI summarization that adds genuine value

## Development

### Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS + shadcn-svelte components
- **Backend**: PocketBase (optional, for persistent caching)
- **AI**: OpenAI GPT-3.5-turbo (summaries + sentiment analysis)
- **Automation**: node-cron
- **APIs**: HackerNews Firebase API

### Performance Optimizations

- **Persistent Caching**: 45-minute TTL reduces API calls and improves load times
- **Concurrent Processing**: Parallel API calls for story fetching and AI processing
- **Smart Filtering**: Pre-filter stories before expensive AI operations
- **Skeleton Loading**: Smooth loading states for better perceived performance
- **Efficient Rendering**: Component-based architecture with minimal re-renders
- **Mobile-optimized UI**: Responsive design with touch-friendly interactions

### Security

This application follows security best practices:

- **🔒 API Key Protection**: OpenAI API key is server-side only (`process.env`), never exposed to client
- **🛡️ Sanitized Logging**: All sensitive URLs and credentials removed from console logs
- **🔐 No Admin Credentials**: PocketBase uses public API rules, no admin authentication required
- **📋 Environment Variables**: Only safe variables exposed to client-side (VITE_ prefix)
- **📚 Security Documentation**: Comprehensive `SECURITY.md` with guidelines and best practices

For detailed security information, see [`SECURITY.md`](./SECURITY.md).

### Recent Updates (v2.0)

- ✅ **PocketBase Integration**: Persistent caching system with 45-minute TTL
- ✅ **Sentiment Analysis**: AI-powered emotional tone detection with color-coded badges
- ✅ **Flexible Sorting**: Multiple story ordering options (trending, upvotes, comments, latest)
- ✅ **Enhanced UI**: Skeleton loaders, improved mobile experience, and causaLens branding
- ✅ **Cache Management**: Manual cache control and performance statistics
- ✅ **Security Hardening**: Removed admin credential requirements, sanitized logging, secure environment variable handling
- ✅ **Performance Optimizations**: Concurrent API processing, efficient caching, and faster load times

## Future Enhancements

This project has several potential areas for expansion:

### 📧 **Email Digest System**
- **Scheduled Email Delivery**: Automated daily/weekly digest emails
- **Subscriber Management**: User preferences and subscription handling
- **Email Templates**: Beautiful HTML email templates with mobile optimization
- **Personalization**: Customized digests based on user interests and reading history

### 🚨 **Breaking News Detection**
- **Trending Algorithm**: Detect stories with rapid engagement growth
- **Breaking News Section**: Featured section for high-impact stories
- **Real-time Notifications**: Push notifications for critical tech developments
- **Urgency Scoring**: AI-powered assessment of story importance and time sensitivity