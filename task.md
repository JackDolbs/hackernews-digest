# HackerNews AI Digest Agent

## Overview
Build an automated agent that keeps a tech company ahead of the curve. This should be an AI Agent that scans Hacker News, picks out the juiciest tech stories, and turns them into a concise, actionable digest (like The Economist's Espresso digest).

**Data Source:** HN API - https://github.com/HackerNews/API

## Requirements

### Core Functionality
- Spot the most relevant and trending tech stories
- Turn them into short insightful summaries to save time
- Receive these digests automatically via email or report

### Challenge Objectives
Create an agentic solution that:

1. **Data Collection**: Pulls top HN stories and filters for tech topics
2. **Content Processing**: Summarizes each story in 2-3 sentences, highlighting "why it matters"
3. **Distribution**: Generates a daily digest or report for each pulled story (and potentially sends via email)

## Deliverables
- Clean, modular code
- Sample digest report
- Demo (deck or video) showing the product in action and its impact

## Evaluation Criteria
- **Automation Workflow**: Repeatable, agentic, low friction, high impact
- **Code Quality**: Clean, modular Python code
- **Communication**: Clear and easy-to-process digest format
- **LLM Integration**: Effective use of LLMs that add genuine value

## AI Workflow Engineer Mindset
Consider these questions throughout development:
- What insights can we uncover?
- How actionable are these summaries?
- Can timely access to this information drive better decisions?

## Technical Stack (Proposed)
- **Frontend**: Mobile-first SvelteKit application (inspired by The Economist's Espresso)
- **UI Components**: shadcn-svelte
- **Styling**: TailwindCSS
- **AI Integration**: OpenAI API
- **Backend**: PocketBase collection
- **Alternative**: Email summaries (if time permits)

## Timeline
**3 hours total** to build the solution