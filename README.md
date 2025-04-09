# Morphius AI

An AI-powered search engine with a generative UI that utlizes open-source and closed-source foundation models.

![capture](/public/screenshot-2025-01-31.png)

## 🗂️ Overview

- 🛠 [Features](#-features)
- 🧱 [Stack](#-stack)
- 🚀 [Quickstart](#-quickstart)
- 🌐 [Deploy](#-deploy)
- 🔎 [Search Engine](#-search-engine)
- ✅ [Verified models](#-verified-models)
- ⚡ [AI SDK Implementation](#-ai-sdk-implementation)
- 📦 [Open Source vs Cloud Offering](#-open-source-vs-cloud-offering)
- 👥 [Contributing](#-contributing)

## 🛠 Features

### Core Features

- AI-powered search with GenerativeUI
- Natural language question understanding
- Multiple search providers support (Tavily, SearXNG, Exa)
- Model selection from UI (switch between available AI models)
  - Reasoning models with visible thought process

### Chat & History

- Chat history functionality (Optional)
- Share search results (Optional)
- Redis support (Local/Upstash)

### AI Providers

The following AI providers are supported:

- OpenAI 
- Google Generative AI
- Anthropic
- Ollama
- Openrouter
- Groq
- DeepSeek
- xAI (Grok)
- OpenAI Compatible - Not configured
- Azure OpenAI - Not configured

Models are configured in `public/config/models.json`. Each model requires its corresponding API key to be set in the environment variables. See [Configuration Guide](docs/CONFIGURATION.md) for details.

### Search Capabilities

- URL-specific search
- Video search support (Optional)
- SearXNG integration with:
  - Customizable search depth (basic/advanced)
  - Configurable engines
  - Adjustable results limit
  - Safe search options
  - Custom time range filtering

### Additional Features

- Docker deployment ready
- Github deployment ready
- Browser search engine integration

## 🧱 Technical Stack

### Core Framework

- [Next.js](https://nextjs.org/) - App Router, React Server Components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - Text streaming / Generative UI

### AI & Search Providers

- [OpenAI](https://openai.com/) 

- [Google AI Studio] (https://aistudio.google.com/)

- [Anthropic] (https://console.anthropic.com/)

- [Groq] (https://console.groq.com/)

- [Ollama] (https://ollama.com/)

- [Azure OpenAI] (ttps://azure.microsoft.com)

- [DeepSeek] (https://www.deepseek.com/en)

- [Openrouter] (https://openrouter.ai/) 

- [Tavily AI](https://tavily.com/) - Default search provider

- Alternative Search providers:

  - [SearXNG](https://docs.searxng.org/) - Self-hosted search

  - [Exa](https://exa.ai/) - Neural search

### Data Storage

- [Upstash](https://upstash.com/) - Serverless Redis

- [Redis](https://redis.io/) - Local Redis option

#### Setting up Redis Locally 

To use Redis locally follow these comprehensive setup instructions:

1. **Mac - Install Redis using Homebrew**
   ```bash
   # Install Redis via Homebrew
   brew install redis
   ```

2. **Start Redis Service**
   You have two options to start Redis:

   A. **Start Redis temporarily** (will stop when computer restarts):
   ```bash
   redis-server
   ```

   B. **Start Redis as a background service** (recommended, starts automatically on boot):
   ```bash
   brew services start redis
   ```

3. **Verify Redis Installation**
   ```bash
   # This should return PONG if Redis is running correctly
   redis-cli ping
   ```

4. **Configure Environment Variables**
   Update your `.env.local` file with:
   ```
   ENABLE_SAVE_CHAT_HISTORY=true
   USE_LOCAL_REDIS=true
   LOCAL_REDIS_URL=redis://localhost:6379
   ```

5. **Useful Redis Commands**
   ```bash
   # Stop Redis (if running as a service)
   brew services stop redis

   # Restart Redis (if running as a service)
   brew services restart redis

   # Check Redis service status
   brew services list

   # Access Redis CLI
   redis-cli

   # Monitor Redis in real-time
   redis-cli monitor
   ```

6. **Troubleshooting**
   ```bash
   # Check if Redis port is in use
   lsof -i :6379

   # Check Redis logs
   tail -f /usr/local/var/log/redis.log

   # Uninstall and reinstall if needed
   brew uninstall redis
   brew install redis
   ```

7. **Using Docker**
   If you're using Docker, Redis is already included in the docker-compose configuration.
   Just set the following in your `.env.local`:
   ```
   ENABLE_SAVE_CHAT_HISTORY=true
   USE_LOCAL_REDIS=true
   LOCAL_REDIS_URL=redis://redis:6379
   ```

### UI & Styling

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

## 🚀 Quickstart

### 1. Fork and Clone repo

Fork the repo to your Github account, then run the following command to clone the repo:

```bash
git clone git@github.com:[YOUR_GITHUB_ACCOUNT]/morphius.git
```

### 2. Install dependencies

```bash
cd morphius
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the required environment variables in `.env.local`:

```bash
# Required
###############################################################################
# Required Configuration
# These settings are essential for the basic functionality of the system.
###############################################################################

# OpenAI API key retrieved here: https://platform.openai.com/api-keys
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]

# Search Configuration
TAVILY_API_KEY=[YOUR_TAVILY_API_KEY]  # Get your API key at: https://app.tavily.com/home

# Optional Docker Configuration (only needed in some Docker environments)
# BASE_URL=http://localhost:3000  # Use only if models.json fails to load in Docker

###############################################################################
# Optional Features
# Enable these features by uncommenting and configuring the settings below
###############################################################################

#------------------------------------------------------------------------------
# Chat History Storage
# Enable persistent chat history across sessions
#------------------------------------------------------------------------------
# ENABLE_SAVE_CHAT_HISTORY=true  # enable chat history storage

# Redis Configuration (Required if ENABLE_SAVE_CHAT_HISTORY=true)
# Choose between local Redis or Upstash Redis

# OPTION 1: Local Redis
# First install Redis on your system:
#   - macOS: brew install redis && brew services start redis
#   - Linux: sudo apt install redis-server && sudo systemctl start redis-server
# Then configure:
# USE_LOCAL_REDIS=true  # use local Redis
# LOCAL_REDIS_URL=redis://localhost:6379  # local Redis URL

# For Docker environments, use:
# LOCAL_REDIS_URL=redis://redis:6379  # Docker Redis URL

# OPTION 2: Upstash Redis (Recommended for production)
# UPSTASH_REDIS_REST_URL=[YOUR_UPSTASH_REDIS_REST_URL]  # Upstash Redis REST URL (if USE_LOCAL_REDIS=false)
# UPSTASH_REDIS_REST_TOKEN=[YOUR_UPSTASH_REDIS_REST_TOKEN]  # Upstash Redis REST Token (if USE_LOCAL_REDIS=false)

#------------------------------------------------------------------------------
# Additional AI Providers
# Enable alternative AI models by configuring these providers
#------------------------------------------------------------------------------
# Google Generative AI
# GOOGLE_GENERATIVE_AI_API_KEY=[YOUR_GOOGLE_GENERATIVE_AI_API_KEY]

# Anthropic (Claude)
# ANTHROPIC_API_KEY=[YOUR_ANTHROPIC_API_KEY]

# Groq
# GROQ_API_KEY=[YOUR_GROQ_API_KEY]

# Ollama
# OLLAMA_BASE_URL=http://localhost:11434

# Azure OpenAI
# AZURE_API_KEY=
# AZURE_RESOURCE_NAME=

# DeepSeek
# DEEPSEEK_API_KEY=[YOUR_DEEPSEEK_API_KEY]

# xAI (Grok)
# XAI_API_KEY=[YOUR_XAI_API_KEY]

# OpenAI Compatible Model
# OPENAI_COMPATIBLE_API_KEY=
# OPENAI_COMPATIBLE_API_BASE_URL=

# Openrouter: https://openrouter.ai/
# OPENROUTER_API_KEY=
#------------------------------------------------------------------------------
# Alternative Search Providers
# Configure different search backends (default: Tavily)
#------------------------------------------------------------------------------
# SEARCH_API=searxng  # Available options: tavily, searxng, exa

# SearXNG Configuration (Required if SEARCH_API=searxng)
# SEARXNG_API_URL=http://localhost:8080  # Replace with your local SearXNG API URL or docker http://searxng:8080
# SEARXNG_SECRET=""  # generate a secret key e.g. openssl rand -base64 32
# SEARXNG_PORT=8080
# SEARXNG_BIND_ADDRESS=0.0.0.0
# SEARXNG_IMAGE_PROXY=true
# SEARXNG_LIMITER=false
# SEARXNG_DEFAULT_DEPTH=basic
# SEARXNG_MAX_RESULTS=50
# SEARXNG_ENGINES=google,bing,duckduckgo,wikipedia
# SEARXNG_TIME_RANGE=None
# SEARXNG_SAFESEARCH=0

#------------------------------------------------------------------------------
# Additional Features
# Enable extra functionality as needed
#------------------------------------------------------------------------------
# NEXT_PUBLIC_ENABLE_SHARE=true  # Enable sharing of chat conversations
# SERPER_API_KEY=[YOUR_SERPER_API_KEY]  # Enable video search capability
# JINA_API_KEY=[YOUR_JINA_API_KEY]  # Alternative to Tavily for retrieve tool
```

### 4. Run app locally

### Using pnpm - Node Modules

# Remove node_modules directory

```bash
rm -rf node_modules
```

# Clear npm cache

```bash
npm cache clean --force 
```

# Reinstall node modules (npm)

```bash
pnpm install
```

# Run App

```bash
pnpm dev
```

#### Using Docker

docker-compose build 

```bash
docker compose up -d
```

```bash
docker compose down
```

Visit http://localhost:3000 in your browser.

Next Steps

- Hot reload: Try making a change to a file and see if it automatically updates
- If you need to restart the development environment, run:

```bash
docker compose -f docker-compose.dev.yaml restart
```

When you're done, you can stop the development environment:

```bash
docker compose -f docker-compose.dev.yaml down
```


## 🌐 Deploy

Host your own live version of Morphius on various platforms:

### Vercel Deployment

The easiest way to deploy Morphius is with Vercel:

1. Click the deploy button below:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmiurla%2Fmorphic&env=OPENAI_API_KEY,TAVILY_API_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

2. Configure your environment variables in the Vercel dashboard
3. Your app will be automatically deployed and updated with each push to the main branch

Manual Deployment Steps:
```bash
# Install Vercel CLI
pnpm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel deploy
```

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Node version: 18.x
3. Add your environment variables in the Netlify dashboard
4. Deploy!

Manual Deployment Steps:
```bash
# Install Netlify CLI
pnpm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy
```

### Kinsta Application Hosting

Kinsta supports deployment via Docker. Here's how to deploy:

1. Ensure you have a Dockerfile in your repository (already included)
2. Log in to your Kinsta dashboard
3. Create a new application
4. Connect your GitHub repository
5. Configure the build settings:
   - Build environment: Dockerfile
   - Dockerfile path: `Dockerfile`
   - Context: `.`
6. Add your environment variables in the Kinsta dashboard
7. Deploy!

The included Dockerfile is optimized for production:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN cwd=$(pwd) && \
    npm install -g pnpm && \
    pnpm setup && \
    mkdir -p /root/.local/share/pnpm && \
    mkdir -p /root/.pnpm-store

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Browser Search Engine Integration

After deploying to any platform, users can set up Morphius as their browser search engine:

1. Open browser settings
2. Navigate to search engine settings
3. Add new search engine:
   - Name: Morphius
   - Keyword: morphius
   - URL: `https://[YOUR-DEPLOYED-DOMAIN]/search?q=%s`

Replace [YOUR-DEPLOYED-DOMAIN] with:
- Vercel: `your-app.vercel.app`
- Netlify: `your-app.netlify.app`
- Kinsta: `your-app.kinsta.app`

## 🔎 Search Engine

### Setting up the Search Engine in Your Browser

If you want to use Morphic as a search engine in your browser, follow these steps:

1. Open your browser settings.
2. Navigate to the search engine settings section.
3. Select "Manage search engines and site search".
4. Under "Site search", click on "Add".
5. Fill in the fields as follows:
   - **Search engine**: Morphic
   - **Shortcut**: morphic
   - **URL with %s in place of query**: `https://morphic.sh/search?q=%s`
6. Click "Add" to save the new search engine.
7. Find "Morphic" in the list of site search, click on the three dots next to it, and select "Make default".

This will allow you to use Morphic as your default search engine in the browser.

## ✅ Verified models

### List of models applicable to all

- OpenAI
  - o3-mini
  - gpt-4o
  - gpt-4o-mini
  - gpt-4-turbo
  - gpt-3.5-turbo
- Google
  - Gemini 2.5 Pro (Experimental)
  - Gemini 2.0 Flash Thinking (Experimental)
  - Gemini 2.0 Flash
- Anthropic
  - Claude 3.5 Sonnet
  - Claude 3.5 Hike
- Ollama
  - qwen2.5
  - deepseek-r1
- Groq
  - meta-llama/llama-4-scout-17b-16e-instruct
  - deepseek-r1-distill-llama-70b
- DeepSeek
  - DeepSeek V3
  - DeepSeek R1
- xAI
  - grok-2
  - grok-2-vision

## ⚡ AI SDK Implementation

### Current Version: AI SDK UI

This version of Morphic uses the AI SDK UI implementation, which is recommended for production use. It provides better streaming performance and more reliable client-side UI updates.

### Previous Version: AI SDK RSC (v0.2.34 and earlier)

The React Server Components (RSC) implementation of AI SDK was used in versions up to [v0.2.34](https://github.com/miurla/morphic/releases/tag/v0.2.34) but is now considered experimental and not recommended for production. If you need to reference the RSC implementation, please check the v0.2.34 release tag.

> Note: v0.2.34 was the final version using RSC implementation before migrating to AI SDK UI.

For more information about choosing between AI SDK UI and RSC, see the [official documentation](https://sdk.vercel.ai/docs/getting-started/navigating-the-library#when-to-use-ai-sdk-rsc).

## 📦 Open Source vs Cloud Offering

Morphius is open source software available under the Apache-2.0 license.



