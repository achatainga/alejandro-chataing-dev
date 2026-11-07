# alejandro-chataing.dev — Full-Stack Edge AI Platform & SaaS

> *"Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres..."* — Colosenses 3:23

Official personal platform, AI skills download center, and SaaS showroom for **Alejandro Chataing Avila** (Senior Full-Stack Engineer, AI-Augmented Tech Lead & Principal Systems Architect).

---

## ⚡ Architecture Overview

This project is built from scratch as a 100% serverless, edge-native platform hosted on **Cloudflare Workers** with zero cold starts and 0 monthly maintenance cost.

- **Edge Backend**: [Hono](https://hono.dev/) router running on Cloudflare Workers with Node.js compatibility.
- **Frontend SPA**: React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion (served via Workers Static Assets).
- **Edge Database**: Cloudflare D1 SQL database (`alejandro-chataing-dev-db`, ID: `2d1ca165-68ed-4d3c-878f-8f1ec7fa7705`).
- **Edge AI Brain**: Server-side Google Gemini 2.5 Flash streaming via Server-Sent Events (SSE) with intent detection and tool calling.
- **Autonomous Lead Alerting**: Real-time webhook dispatch to Alejandro's personal WhatsApp (`+58 424-166.88.76`) via Evolution API whenever a prospective client inquires.
- **Personal Telemetry**: In-house privacy-safe tracking of visitor dwell times, section views, CLI copy events, and downloads.
- **Headless Blog CMS**: Technical deep dives stored in Cloudflare D1 with markdown rendering.
- **300-Line File Invariant**: Strict SRE clean architecture where **every single file is under 300 lines**.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Secrets (`.dev.vars`)
Create `.dev.vars` with your Gemini API key and WhatsApp endpoints:
```env
GEMINI_API_KEY=AIzaSy...
EVOLUTION_API_URL=https://evolution-api-latest-jkic.onrender.com
EVOLUTION_INSTANCE=alejandro
NOTIFICATION_PHONE=+584241668876
ADMIN_SECRET=REDACTED_ADMIN_SECRET
ADMIN_EMAIL=chataing.alejandro@gmail.com
ENVIRONMENT=development
```

### 3. Build & Run
```bash
# Build the React 19 frontend
npm run build

# Start the full-stack Worker locally with D1 and Static Assets
npx wrangler dev
```

---

## 📦 API Routes

| Endpoint | Method | Description |
|:---|:---|:---|
| `/api/chat` | POST | Streaming Gemini AI assistant with automated lead qualification |
| `/api/leads` | POST | Records qualified client inquiries and dispatches WhatsApp alert |
| `/api/skills` | GET | Catalog of `mcp-code-context` (Enterprise Polyglot) and 12 Agent Skills |
| `/api/skills/:id/download` | POST | Tracks CLI install copies and raw markdown downloads |
| `/api/blog` | GET | Returns published technical engineering articles |
| `/api/blog/:slug` | GET | Returns article markdown and increments view counter |
| `/api/analytics` | POST | Privacy-safe telemetry logging for dwell time and interactions |
| `/api/admin/metrics` | GET | Protected metrics summary (Leads, Installs, Chat Sessions) |
| `/api/admin/leads` | GET | Protected list of recent client inquiries with lead scoring |
| `/api/health` | GET | Edge runtime health status |

---

## 🛠️ Deployment to Cloudflare (`alejandro-chataing.dev`)

```bash
# 1. Build the Vite static assets
npm run build

# 2. Deploy the Worker to Cloudflare edge
npx wrangler deploy

# 3. Apply remote D1 schema migration
npx wrangler d1 execute alejandro-chataing-dev-db --remote --file=./migrations/0001_initial_schema.sql
```

To bind `alejandro-chataing.dev` as a custom domain:
1. In Cloudflare Dashboard, go to **Workers & Pages** -> `alejandro-chataing-dev`.
2. Under **Settings** -> **Domains & Routes**, click **Add Custom Domain**.
3. Enter `alejandro-chataing.dev` and confirm. Cloudflare will automatically provision edge SSL certificates.

---

## 📜 License
Proprietary & Open-Source Mix.
- Portfolio, Backend & UI: © Alejandro Chataing Avila.
- `mcp-code-context`: MIT License.
