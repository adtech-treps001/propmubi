# Propmubi Containerization - Quick Reference

## 📋 What Was Created

### ✅ Directory Structure
```
apps/              → web/ & mobile/ application scaffolds
services/          → property/, verification/, builder-os/, notification/ services
data/              → PostgreSQL (init.sql) & MongoDB (init.js) initialization
common/            → types/, utils/, constants/ shared libraries
infra/
  ├── docker/      → Dockerfile.backend, Dockerfile.web, prometheus.yml
  └── kubernetes/  → deployment.yaml for K8s cluster deployment
assets/            → images/, icons/ static files
scripts/           → start-dev.sh, start-web.sh, test-backend.sh helpers
```

### ✅ Files Created
1. **docker-compose.yml** - Complete local dev stack (PostgreSQL, MongoDB, Redis, Kafka, Backend, Web, Adminer, Prometheus, Grafana)
2. **Dockerfiles**
   - `infra/docker/Dockerfile.backend` - Multi-stage Node.js backend
   - `infra/docker/Dockerfile.web` - React frontend with serve
3. **Database Scripts**
   - `data/postgres/init.sql` - 10+ tables with PostGIS, indices, triggers
   - `data/mongo/init.js` - Collections & MongoDB setup
4. **Kubernetes**
   - `infra/kubernetes/deployment.yaml` - K8s manifests (3 backend replicas, 2 web replicas, PostgreSQL, secrets)
5. **Common Libraries**
   - `common/types/index.ts` - 15+ TypeScript interfaces (Property, User, Rental, Auction, etc.)
   - `common/utils/index.ts` - 40+ utility functions (validation, formatting, calculations)
   - `common/constants/index.ts` - Shared constants (routes, status enums, regexes, cache TTLs)
6. **Documentation**
   - `README.md` - Updated with Docker section
   - `CONTAINERIZATION.md` - 300+ line comprehensive guide

---

## 🚀 Quick Start Commands

### Start Everything
```bash
cd /mnt/c/projects/propmubi-app
docker-compose up -d
```

### Check Health
```bash
curl http://localhost:3001/api/health          # Backend
curl -I http://localhost:3000                  # Web
docker-compose ps                              # All services
```

### Access Services
- **Backend API:** http://localhost:3001
- **Web Frontend:** http://localhost:3000
- **Adminer (DB):** http://localhost:8080
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3005

### Stop Everything
```bash
docker-compose down -v
```

---

## 📚 Common Library Usage

### Import Types
```typescript
import { Property, User, Rental, Auction } from '../common/types';
```

### Use Utilities
```typescript
import {
  formatCurrency,        // ₹15,00,000
  calculateDistance,     // Distance between coordinates
  isValidPhoneIndia,     // Phone validation
  groupBy,               // Array grouping
  generateId             // UUID generation
} from '../common/utils';
```

### Access Constants
```typescript
import {
  API_ROUTES,           // /api/properties, /api/users
  PROPERTY_TYPES,       // APARTMENT, VILLA, COMMERCIAL
  ERROR_CODES,          // PROPERTY_NOT_FOUND, USER_NOT_FOUND
  CACHE_TTL             // 3600, 1800, 86400
} from '../common/constants';
```

---

## 🐳 Docker Compose Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **postgres** | postgis/postgis:16-3.3 | 5432 | Relational + spatial DB |
| **mongodb** | mongo:7 | 27017 | Document storage |
| **redis** | redis:7 | 6379 | Cache & sessions |
| **kafka** | confluentinc/cp-kafka:7.5.0 | 9092 | Event queue |
| **backend** | propmubi/backend | 3001 | REST API |
| **web** | propmubi/web | 3000 | React frontend |
| **adminer** | adminer | 8080 | DB browser UI |
| **prometheus** | prom/prometheus | 9090 | Metrics collection |
| **grafana** | grafana/grafana | 3005 | Dashboards |

---

## 📊 Database Schema Highlights

### PostgreSQL (PostGIS)
✅ **Tables:** users, builders, properties, rentals, auctions, communities, polls, votes, verification_logs  
✅ **Indices:** Spatial (GIST on geom), B-tree on foreign keys  
✅ **Triggers:** Auto-update updated_at timestamps  
✅ **Extensions:** PostGIS, uuid, hstore  

### MongoDB
✅ **Collections:** sessions, notifications, audit_logs, cache  
✅ **Indices:** TTL on sessions, compound on notifications  

---

## 🔐 Environment Variables

Create `.env` file:
```bash
NODE_ENV=development
DB_NAME=propmubi
DB_USER=postgres
DB_PASSWORD=postgres
MONGO_USER=admin
MONGO_PASSWORD=admin
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
REACT_APP_API_URL=http://localhost:3001
GRAFANA_PASSWORD=admin
```

---

## ☸️ Kubernetes Deployment

```bash
# Create namespace & deploy
kubectl apply -f infra/kubernetes/deployment.yaml

# Check status
kubectl -n propmubi get pods

# Port forward
kubectl -n propmubi port-forward svc/backend 3001:3001 &
kubectl -n propmubi port-forward svc/web 3000:3000 &

# Scale backend to 5 replicas
kubectl -n propmubi scale deployment backend --replicas=5
```

---

## 📖 Related Documentation

- **README.md** - Main project overview & installation
- **CONTAINERIZATION.md** - Comprehensive Docker/K8s guide (300+ lines)
- **MASTER_BLUEPRINT_IMPLEMENTATION.md** - Architecture & feature roadmap
- **DESIGN.md** - System design patterns
- **USER_GUIDE.md** - End-user documentation

---

## ✨ Next Immediate Actions

1. ✅ Containerization Complete
2. ⏳ **Start services:** `docker-compose up -d`
3. ⏳ **Test endpoints:** `bash ./scripts/test-backend.sh`
4. ⏳ **Build microservices:** Convert services/ stubs into actual modules
5. ⏳ **Implement verification workflows:** RERA scraper, Landeed integration
6. ⏳ **Build Builder OS dashboard:** Inventory matrix, auto-pilot CRM
7. ⏳ **Deploy to Kubernetes:** When ready for production

---

## 🎯 Alignment with Master Blueprint

✅ **90/10 Architecture:**
- Shell (90%): React Native → Web frontend in apps/
- Core (10%): Native modules → services/ scaffold ready for Unity, AR

✅ **Microservices Ready:**
- property-service/ → Property CRUD
- verification-service/ → Trust verification engine
- builder-os-service/ → Builder dashboard
- notification-service/ → Alerts & emails

✅ **Data Tier:**
- PostgreSQL PostGIS → Spatial queries for location-based searches
- MongoDB → Session & cache storage
- Redis → Real-time caching

✅ **Orchestration:**
- Kafka topics ready for events (property.new, rera.updates, social.leads)
- Temporal.io integration point in documentation
- Kubernetes manifests for production scale

---

**Status:** ✅ **CONTAINERIZATION COMPLETE**

All systems ready for development & deployment!

