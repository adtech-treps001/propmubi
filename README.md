# Propmubi - Parallel Agent Development

This repository contains the ongoing parallel development of the Propmubi platform.

## 🚀 Architecture Overview

- **Frontend**: React + Vite + TypeScript (in `/web`)
- **Infrastructure**: Terraform (GCP) + Kubernetes (in `/terraform`)
- **Backend (Coming Soon)**: NestJS microservices + Python AI services
- **Database (Coming Soon)**: PostgreSQL + Redis

## 💻 Frontend Web App

The frontend is built with React, Vite, and vanilla CSS (Glassmorphism design system).

### Prerequisities
- Node.js v18+
- npm

### getting Started
1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

### Implemented Pages
| Page | Route | Status |
|------|-------|--------|
| **Homepage** | `/` | ✅ Complete |
| **Search Results** | `/search` | ✅ Complete (List + AI Mode) |
| **Property Detail** | `/property/:id` | ✅ Complete (Lead Flow) |
| **Agent Dashboard** | `/agent` | ✅ Complete |
| **Builder Dashboard** | `/builder` | ✅ Complete |
| **Website Builder** | `/builder/website` | ✅ Complete |

## 🏗️ Infrastructure

Terraform configurations are available in `/terraform`.

### Modules Implemented
- **Network**: VPC, Subnets, Firewall
- **Compute**: GKE Autopilot
- **Database**: Cloud SQL (Postgres), Redis
- **Storage**: GCS key buckets
- **Pub/Sub**: Event topics
- **IAM**: Service accounts

## 🤝 Next Steps
- Implement Backend Microservices (Claude Code)
- Verify Database Schema (KIRO)
- Integrate AI endpoints (Cursor)
