# Water Project

A regional environmental intelligence platform for water infrastructure, quality, contamination, and research-backed exploration in the **Baja California and Southern California border region**.

## Features

- **Interactive Map** — Explore water infrastructure, contamination sites, and quality monitoring stations across the border region.
- **Research Chatbot** — Ask questions and receive answers backed by scientific papers with citations, powered by Llama 3.1 via Groq and a RAG pipeline.
- **City Dashboards** — Detailed water quality profiles for cities including Tijuana, Mexicali, Ensenada, San Diego, Los Angeles, and more.
- **Biochemistry Lab** — Interactive simulations for activated sludge, disinfection chemistry (chlorination, UV), and quantitative microbial risk assessment (QMRA).
- **Microplastics Tracking** — Monitor microplastic contamination sources and affected areas throughout the region.
- **Verification Center** — Report incorrect information to help improve data accuracy across the platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL + pgvector) |
| LLM | Llama 3.1 8B via Groq API |
| Embeddings | Custom embedding service |
| Charts | Recharts |
| Maps | D3-geo + custom GeoJSON |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone https://github.com/Vakyro/water-project.git
cd water-project
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
EMBEDDING_SERVICE_URL=your_embedding_service_url
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/chat/           # Chatbot API route (RAG pipeline)
│   ├── app/                # Main application (map, dashboards, biochem lab)
│   └── (landing)/          # Public landing pages
├── components/             # Reusable UI components
│   ├── app-shell/          # Layout (sidebar, topbar, global search)
│   ├── chat/               # Chat widget
│   ├── map/                # Map canvas and panels
│   └── ui/                 # shadcn/ui base components
├── src/
│   ├── core/               # Config, types, constants, error handling
│   ├── data/               # Static data (cities, facilities, microplastics)
│   └── infrastructure/     # Supabase, LLM, embedding clients + RAG service
└── public/
    ├── maps_geojson/       # Region and city GeoJSON data
    ├── maps_details/       # Per-city water quality CSV/JSON data
    └── maps_svgs/          # City map SVGs
```

## Cities Covered

| Mexico | USA |
|---|---|
| Tijuana | San Diego |
| Mexicali | Los Angeles |
| Ensenada | Bakersfield |
| Tecate | Brawley |
| San Luis Río Colorado | |

## Disclaimer

This platform is designed for **educational and research purposes only**. It is not an official government source and should not be used for regulatory compliance or official decision-making. For official water quality information, consult [CONAGUA](https://www.gob.mx/conagua) (Mexico) or the [EPA](https://www.epa.gov/) and [California Water Boards](https://www.waterboards.ca.gov/) (USA).
