# HackerNews AI Digest Agent

An AI-powered agent that scans HackerNews, picks out trending tech stories, and creates concise, actionable digests. Built with SvelteKit, Tailwind CSS, and OpenAI API.

![HackerNews AI Digest](https://img.shields.io/badge/HackerNews-AI%20Digest-orange?style=for-the-badge&logo=y-combinator)

## Features

- 🤖 **AI-Powered Summaries**: Uses OpenAI to generate concise 2-3 sentence summaries
- 📱 **Mobile-First Design**: Beautiful, responsive interface inspired by The Economist's Espresso
- 🔍 **Smart Filtering**: Automatically identifies tech-relevant stories using keywords and domains
- ⏰ **Automated Generation**: CRON job support for scheduled digest creation
- 📊 **Story Categorization**: Organizes stories into AI & ML, Web Dev, Mobile, etc.
- 🚀 **Fast Performance**: Concurrent API calls and efficient data processing

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
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

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
2. Click "Refresh" to generate a new digest
3. Browse AI-generated summaries with "why it matters" insights
4. Click links to read original stories or HN discussions

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

- **Digest Agent** (`src/lib/digest-agent.js`)
  - Orchestrates the entire pipeline
  - CLI and programmatic interfaces

### Frontend Components

- **DigestCard** - Individual story summary cards
- **LoadingSpinner** - Loading state component
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

- **Frontend**: SvelteKit + Tailwind CSS
- **AI**: OpenAI GPT-3.5-turbo
- **Automation**: node-cron
- **APIs**: HackerNews Firebase API

### Performance Optimizations

- Concurrent API calls for story fetching
- Smart filtering before AI processing
- Efficient component rendering
- Mobile-optimized UI

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for the tech community