# Propmubi App - Documentation Index

**Last Updated:** November 28, 2025  
**Project Status:** ✅ Containerization Complete

---

## 📚 Documentation Guide

### 🚀 Getting Started (Read First)

1. **[README.md](./README.md)** - Main project overview
   - Project features overview
   - Quick start guide
   - Installation instructions
   - Docker & containerization section
   - Project structure

2. **[CONTAINERIZATION_QUICK_REF.md](./CONTAINERIZATION_QUICK_REF.md)** - Quick reference card
   - One-page summary of what was created
   - Quick start commands
   - Service URLs & ports
   - Common library usage examples

### 🏗️ Architecture & Implementation

3. **[MASTER_BLUEPRINT_IMPLEMENTATION.md](./MASTER_BLUEPRINT_IMPLEMENTATION.md)** - Strategic implementation plan
   - Architecture migration (Express → NestJS)
   - 90/10 Hybrid architecture (React/Native + Unity)
   - Builder OS (new B2B product)
   - Data ingestion pipeline (Python Playwright + Kafka)
   - Apex Home+ subscription features
   - Integration with AI guidelines
   - Implementation timeline (9 months)
   - Success metrics & risk mitigation

4. **[DESIGN.md](./DESIGN.md)** - System design patterns
   - Component architecture
   - State management patterns
   - API design principles

### 🐳 Containerization & DevOps

5. **[CONTAINERIZATION.md](./CONTAINERIZATION.md)** - Comprehensive Docker/K8s guide (300+ lines)
   - Docker Quick Start
   - Local development setup (3 options)
   - Docker Compose service orchestration
   - Kubernetes deployment guide
   - Common library integration examples
   - Troubleshooting & solutions
   - Performance optimization tips
   - Security best practices

6. **[docker-compose.yml](./docker-compose.yml)** - Local development orchestration
   - PostgreSQL + PostGIS
   - MongoDB
   - Redis
   - Kafka + Zookeeper
   - Backend API
   - Web frontend
   - Adminer (DB UI)
   - Prometheus & Grafana

7. **[infra/docker/Dockerfile.backend](./infra/docker/Dockerfile.backend)** - Multi-stage backend build
   - Alpine base image
   - Security hardening (non-root user)
   - Health checks

8. **[infra/docker/Dockerfile.web](./infra/docker/Dockerfile.web)** - Frontend build
   - Build stage
   - Serve with static server
   - Health checks

9. **[infra/kubernetes/deployment.yaml](./infra/kubernetes/deployment.yaml)** - K8s manifests
   - Namespace creation
   - PostgreSQL StatefulSet
   - Backend deployment (3 replicas)
   - Web deployment (2 replicas)
   - LoadBalancer services
   - Secrets management
   - Resource limits & health probes

### 💾 Data Layer

10. **[data/postgres/init.sql](./data/postgres/init.sql)** - PostgreSQL initialization
    - 10+ tables (users, properties, rentals, auctions, communities, etc.)
    - PostGIS extension setup
    - Spatial indices (GIST)
    - B-tree indices
    - Triggers for auto-updating timestamps
    - UUID generation

11. **[data/mongo/init.js](./data/mongo/init.js)** - MongoDB initialization
    - Collections: sessions, notifications, audit_logs, cache
    - TTL indices for session expiration

### 🧩 Common Libraries (Shared Across Services)

12. **[common/types/index.ts](./common/types/index.ts)** - TypeScript interfaces
    - Property, PropertyLocation, PropertyVerification, TrustBadge
    - User, Builder
    - Rental, Auction, Community
    - Poll, Vote
    - ApiResponse, PaginatedResponse
    - AppError

13. **[common/utils/index.ts](./common/utils/index.ts)** - 40+ utility functions
    - Validation: email, phone, pincode, coordinates
    - Formatting: currency, date, area, relative time
    - Calculations: EMI, distance, price per sqft
    - String: slugify, capitalize, truncate
    - Array: unique, groupBy, sortBy
    - Object: pick, omit, deepMerge
    - Random: generateId, randomInt

14. **[common/constants/index.ts](./common/constants/index.ts)** - Shared constants
    - API_ROUTES (16 endpoints)
    - HTTP_STATUS codes
    - Property & user enums
    - Verification status constants
    - Pagination defaults
    - Cache TTLs (5min, 30min, 1hr, 24hrs)
    - Error codes
    - Regex patterns

### 📦 Project Structure

15. **[DESIGN.md](./DESIGN.md)** - System design
16. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Business overview
17. **[PRD.md](./PRD.md)** - Product requirements document
18. **[USER_GUIDE.md](./USER_GUIDE.md)** - End-user documentation
19. **[INTEGRATION_QUICKSTART.md](./INTEGRATION_QUICKSTART.md)** - API integration guide
20. **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Service integrations

### 🛠️ Helper Scripts

21. **[scripts/start-dev.sh](./scripts/start-dev.sh)** - Start backend + web
22. **[scripts/start-web.sh](./scripts/start-web.sh)** - Start web frontend only
23. **[scripts/test-backend.sh](./scripts/test-backend.sh)** - Test all API endpoints

---

## 📋 Directory Structure

```
propmubi-app/
├── 📄 Documentation
│   ├── README.md
│   ├── CONTAINERIZATION.md
│   ├── CONTAINERIZATION_QUICK_REF.md
│   ├── MASTER_BLUEPRINT_IMPLEMENTATION.md
│   ├── DESIGN.md
│   ├── PROJECT_OVERVIEW.md
│   ├── PRD.md
│   ├── USER_GUIDE.md
│   ├── INTEGRATION_QUICKSTART.md
│   ├── INTEGRATION_SUMMARY.md
│   ├── SERVICE_INTEGRATIONS.md
│   ├── SERVICES_SHOWCASE.md
│   └── FILES_CREATED.md
│
├── 📦 Applications
│   ├── apps/web/                    # React frontend
│   ├── apps/mobile/                 # React Native
│   └── backend/                     # Express API (legacy)
│
├── 🔧 Microservices
│   ├── services/property-service/
│   ├── services/verification-service/
│   ├── services/builder-os-service/
│   └── services/notification-service/
│
├── 💾 Data Layer
│   ├── data/postgres/init.sql       # PostgreSQL DDL
│   └── data/mongo/init.js           # MongoDB init
│
├── 🧩 Shared Libraries
│   ├── common/types/index.ts        # Interfaces
│   ├── common/utils/index.ts        # Functions
│   └── common/constants/index.ts    # Constants
│
├── 🐳 Infrastructure
│   ├── infra/docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.web
│   │   └── prometheus.yml
│   └── infra/kubernetes/
│       └── deployment.yaml
│
├── 🎨 Assets
│   ├── assets/images/
│   └── assets/icons/
│
├── 🛠️ Scripts
│   ├── scripts/start-dev.sh
│   ├── scripts/start-web.sh
│   └── scripts/test-backend.sh
│
├── 🐳 Orchestration
│   └── docker-compose.yml
│
└── 📋 Configuration
    ├── package.json
    ├── .env.example
    └── setup.sh
```

---

## 🚀 Quick Start Paths

### Path 1: Docker Compose (Recommended for Beginners)
```bash
docker-compose up -d                    # Start all services
curl http://localhost:3001/api/health   # Verify backend
curl -I http://localhost:3000           # Verify web
```
→ See: [CONTAINERIZATION_QUICK_REF.md](./CONTAINERIZATION_QUICK_REF.md)

### Path 2: Local Development
```bash
cd backend && npm run dev               # Terminal 1
./scripts/start-web.sh                  # Terminal 2
```
→ See: [CONTAINERIZATION.md](./CONTAINERIZATION.md) - Local Development Setup

### Path 3: Kubernetes Deployment
```bash
kubectl apply -f infra/kubernetes/deployment.yaml
kubectl -n propmubi port-forward svc/backend 3001:3001
```
→ See: [CONTAINERIZATION.md](./CONTAINERIZATION.md) - Kubernetes Deployment

---

## 📚 Reading Recommendations by Role

### 👨‍💻 Backend Developer
1. [MASTER_BLUEPRINT_IMPLEMENTATION.md](./MASTER_BLUEPRINT_IMPLEMENTATION.md) - Architecture
2. [common/types/index.ts](./common/types/index.ts) - Data models
3. [data/postgres/init.sql](./data/postgres/init.sql) - Database schema
4. [CONTAINERIZATION.md](./CONTAINERIZATION.md) - Deployment
5. [INTEGRATION_QUICKSTART.md](./INTEGRATION_QUICKSTART.md) - API integrations

### 🎨 Frontend Developer
1. [README.md](./README.md) - Project overview
2. [common/types/index.ts](./common/types/index.ts) - Data structures
3. [common/utils/index.ts](./common/utils/index.ts) - Utility functions
4. [CONTAINERIZATION_QUICK_REF.md](./CONTAINERIZATION_QUICK_REF.md) - Running locally
5. [DESIGN.md](./DESIGN.md) - UI patterns

### 🚀 DevOps Engineer
1. [CONTAINERIZATION.md](./CONTAINERIZATION.md) - Complete guide
2. [docker-compose.yml](./docker-compose.yml) - Local orchestration
3. [infra/kubernetes/deployment.yaml](./infra/kubernetes/deployment.yaml) - K8s setup
4. [data/postgres/init.sql](./data/postgres/init.sql) - Database setup
5. [MASTER_BLUEPRINT_IMPLEMENTATION.md](./MASTER_BLUEPRINT_IMPLEMENTATION.md) - Architecture

### 🧑‍💼 Product Manager
1. [README.md](./README.md) - Feature overview
2. [MASTER_BLUEPRINT_IMPLEMENTATION.md](./MASTER_BLUEPRINT_IMPLEMENTATION.md) - Roadmap
3. [PRD.md](./PRD.md) - Product requirements
4. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Business model

### 📱 Integration Partner
1. [INTEGRATION_QUICKSTART.md](./INTEGRATION_QUICKSTART.md) - Quick start
2. [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - Service list
3. [SERVICE_INTEGRATIONS.md](./SERVICE_INTEGRATIONS.md) - Detailed integrations
4. [common/types/index.ts](./common/types/index.ts) - API data models
5. [CONTAINERIZATION_QUICK_REF.md](./CONTAINERIZATION_QUICK_REF.md) - Running services

---

## 🎯 Key Implementation Decisions

✅ **Architecture:**
- 90/10 Hybrid: React Native (90%) + Native modules (10%)
- Microservices ready with common library pattern

✅ **Data:**
- PostgreSQL PostGIS for spatial queries
- MongoDB for session/cache data
- Redis for real-time caching

✅ **Deployment:**
- Docker Compose for local development
- Kubernetes manifests for production
- Multi-stage builds for security

✅ **Code Sharing:**
- Common library pattern (types, utils, constants)
- Workspace setup via npm workspaces
- Shared error handling & validation

---

## 📞 Support & Resources

### Internal Documentation
- [MASTER_BLUEPRINT_IMPLEMENTATION.md](./MASTER_BLUEPRINT_IMPLEMENTATION.md) - Implementation roadmap
- [CONTAINERIZATION.md](./CONTAINERIZATION.md) - Deployment troubleshooting

### External Resources
- Docker: https://docs.docker.com/
- Kubernetes: https://kubernetes.io/docs/
- PostgreSQL PostGIS: https://postgis.net/
- Node.js: https://nodejs.org/docs/

### Getting Help
1. Check [CONTAINERIZATION.md](./CONTAINERIZATION.md) troubleshooting section
2. Review service logs: `docker-compose logs <service>`
3. Run health checks: `curl http://localhost:3001/api/health`

---

**Last Generated:** November 28, 2025  
**Project Status:** ✅ Ready for Development & Deployment

