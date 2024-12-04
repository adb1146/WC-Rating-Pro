# WC Rating Pro

## Overview

WC Rating Pro is an advanced workers' compensation insurance rating platform that combines traditional underwriting expertise with AI-powered insights. The platform streamlines the insurance application process and provides accurate premium calculations with intelligent assistance.

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables in `.env` with your actual values:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Features

- AI-powered risk assessment
- Real-time premium calculation
- Interactive location management
- Safety program tracking
- Loss history analysis
- Comprehensive class code database
- Territory-based rating
- Multi-state support

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- OpenAI API
- Google Maps API