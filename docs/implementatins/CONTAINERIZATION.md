# Containerization Guide - Propmubi App

**Document Version:** 1.0  
**Last Updated:** November 28, 2025  
**Status:** Complete Implementation

---

## Overview

This document provides complete guidance on containerizing, deploying, and managing the Propmubi application using Docker, Docker Compose, and Kubernetes.

## Table of Contents

1. [Docker Quick Start](#docker-quick-start)
2. [Local Development Setup](#local-development-setup)
3. [Docker Compose Orchestration](#docker-compose-orchestration)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Common Library Integration](#common-library-integration)
6. [Project Structure](#project-structure)
7. [Troubleshooting](#troubleshooting)

---

## Docker Quick Start

### Start All Services

```bash
cd /mnt/c/projects/propmubi-app
docker-compose up -d
```

This starts:
- PostgreSQL (PostGIS) on port 5432
- MongoDB on port 27017
- Redis on port 6379
- Kafka on port 9092
- Backend API on port 3001
- Web Frontend on port 3000
- Adminer DB UI on port 8080
- Prometheus on port 9090
- Grafana on port 3005

### Health Check All Services

```bash
# Backend API
curl http://localhost:3001/api/health

# Web Frontend
curl -I http://localhost:3000

# Database
docker-compose exec postgres psql -U postgres -d propmubi -c "SELECT 1"

# View all service status
docker-compose ps
```

### Stop All Services

```bash
# Stop containers (keep volumes)
docker-compose down

# Stop and remove everything (including data)
docker-compose down -v
```

---

## Local Development Setup

### Option 1: Full Docker (Recommended for Isolation)

```bash
docker-compose up -d
npm run web:dev  # Frontend in watch mode
```

### Option 2: Hybrid (Docker Databases + Local Services)

```bash
# Start only databases
docker-compose up -d postgres mongodb redis

# Local services
cd backend && npm run dev  # Terminal 1
./scripts/start-web.sh     # Terminal 2
```

### Option 3: Fully Local (Requires All Dependencies)

Ensure installed locally:
- PostgreSQL 16+ with PostGIS
- MongoDB 7.0+
- Redis 7.0+
- Node.js 18+

```bash
# Start services
cd backend && npm run dev      # Terminal 1
./scripts/start-web.sh         # Terminal 2

# For web dev:
npm run web:dev                # Terminal 3 (if webpack/vite needed)
```

---

## Docker Compose Orchestration

### Services Included

#### Data Tier

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| PostgreSQL | postgis/postgis:16-3.3 | 5432 | Relational data + spatial |
| MongoDB | mongo:7 | 27017 | Document storage |
| Redis | redis:7 | 6379 | Caching & sessions |

#### Message Queue

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| Kafka | confluentinc/cp-kafka:7.5.0 | 9092 | Event streaming |
| Zookeeper | confluentinc/cp-zookeeper:7.5.0 | 2181 | Kafka coordination |

#### Application Tier

| Service | Dockerfile | Port | Purpose |
|---------|-----------|------|---------|
| Backend | infra/docker/Dockerfile.backend | 3001 | REST API |
| Web | infra/docker/Dockerfile.web | 3000 | Frontend |

#### Monitoring

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| Prometheus | prom/prometheus | 9090 | Metrics collection |
| Grafana | grafana/grafana | 3005 | Visualization |
| Adminer | adminer | 8080 | DB browser |

### Custom Environment Variables

Edit `.env` file:

```bash
# Core
NODE_ENV=development
PORT=3001

# Database
DB_NAME=propmubi
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/propmubi

# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=admin
MONGO_DB=propmubi

# Security
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=http://localhost:3000

# Monitoring
GRAFANA_PASSWORD=admin
```

Load in docker-compose:
```bash
export $(cat .env | xargs)
docker-compose up -d
```

### Volume Mounting for Development

Edit `docker-compose.yml` backend service:

```yaml
backend:
  volumes:
    - ./backend/src:/app/src  # Enable hot-reload
    - ./common:/app/common     # Shared libraries
```

---

## Kubernetes Deployment

### Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Setup cluster (example: Minikube)
brew install minikube  # or choco install minikube
minikube start --cpus=4 --memory=8192
```

### Deploy to Kubernetes

```bash
# Create namespace & secrets
kubectl apply -f infra/kubernetes/deployment.yaml

# Or step-by-step:
kubectl create namespace propmubi
kubectl create secret generic db-secret \
  -n propmubi \
  --from-literal=username=postgres \
  --from-literal=password=your-secure-pw

# Deploy
kubectl apply -f infra/kubernetes/deployment.yaml

# Check deployment
kubectl -n propmubi get pods
kubectl -n propmubi describe pod <pod-name>

# View logs
kubectl -n propmubi logs deployment/backend -f
kubectl -n propmubi logs deployment/web -f

# Port-forward for local access
kubectl -n propmubi port-forward svc/backend 3001:3001 &
kubectl -n propmubi port-forward svc/web 3000:3000 &
```

### Scale Services

```bash
# Scale backend to 5 replicas
kubectl -n propmubi scale deployment backend --replicas=5

# Scale web to 3 replicas
kubectl -n propmubi scale deployment web --replicas=3

# Check status
kubectl -n propmubi get deployment
```

### Update Deployments

```bash
# Update image version
kubectl -n propmubi set image deployment/backend \
  backend=propmubi/backend:v1.2.0

# Rollback if needed
kubectl -n propmubi rollout undo deployment/backend
```

---

## Common Library Integration

### Using Common Types

```typescript
// In any service
import { Property, User, Rental } from '../common/types';

const property: Property = {
  id: 'prop-123',
  title: 'Modern Apartment',
  type: 'APARTMENT',
  location: {
    address: '123 Main St',
    city: 'Bangalore',
    state: 'Karnataka',
    coordinates: { lat: 13.0, lng: 77.5 }
  },
  // ... rest of properties
};
```

### Using Common Utils

```typescript
import {
  formatCurrency,
  calculateDistance,
  isValidPhoneIndia,
  formatRelativeTime
} from '../common/utils';

// Format money
console.log(formatCurrency(1500000)); // ₹15,00,000

// Calculate distance
const distance = calculateDistance(13.0, 77.5, 13.1, 77.6);

// Validate phone
if (isValidPhoneIndia('+91 98765 43210')) {
  // Valid
}

// Relative time
console.log(formatRelativeTime(new Date('2025-11-25'))); // "3d ago"
```

### Using Common Constants

```typescript
import {
  API_ROUTES,
  PROPERTY_TYPES,
  ERROR_CODES,
  CACHE_TTL
} from '../common/constants';

// API endpoint
const url = `${API_BASE}${API_ROUTES.PROPERTIES}`;

// Property type check
if (propertyData.type === PROPERTY_TYPES[0]) {
  // It's an APARTMENT
}

// Error handling
if (error.code === ERROR_CODES.PROPERTY_NOT_FOUND) {
  // Handle not found
}

// Caching
redis.setex(key, CACHE_TTL.PROPERTY, value);
```

---

## Project Structure

```
propmubi-app/
│
├── 📦 apps/                          # Applications
│   ├── web/                         # React frontend
│   │   ├── public/                 # Static assets
│   │   ├── src/                    # Source code
│   │   └── Dockerfile             # Built in docker-compose
│   └── mobile/                      # React Native (scaffold)
│
├── 🔧 services/                      # Microservices
│   ├── property-service/            # Property CRUD & search
│   ├── verification-service/        # Trust verification
│   ├── builder-os-service/         # Builder dashboard
│   └── notification-service/       # Alerts & emails
│
├── 📊 data/                          # Data layer
│   ├── postgres/
│   │   └── init.sql               # DDL: tables, indices, functions
│   └── mongo/
│       └── init.js                # Collections & indices
│
├── 🧩 common/                        # Shared libraries
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── utils/
│   │   └── index.ts               # Helper functions
│   └── constants/
│       └── index.ts               # Shared constants
│
├── 🐳 infra/                         # Infrastructure
│   ├── docker/
│   │   ├── Dockerfile.backend     # Multi-stage backend build
│   │   ├── Dockerfile.web         # Web build & serve
│   │   └── prometheus.yml         # Metrics config
│   └── kubernetes/
│       └── deployment.yaml        # K8s manifests
│
├── 🎨 assets/                        # Static files
│   ├── images/
│   └── icons/
│
├── 📝 docs/                          # Documentation
│   ├── CONTAINERIZATION.md         # This file
│   ├── MASTER_BLUEPRINT_IMPLEMENTATION.md
│   └── ...other docs
│
├── scripts/                          # Helper scripts
│   ├── start-dev.sh               # Start backend + web
│   ├── start-web.sh               # Start web only
│   └── test-backend.sh            # Test all endpoints
│
├── backend/                          # Legacy Express backend
│   ├── src/
│   │   ├── server.js             # Main server
│   │   └── ...services
│   └── package.json
│
├── docker-compose.yml              # Local dev orchestration
├── package.json                    # Root workspace
├── README.md                       # Project README
└── .env.example                   # Environment template
```

---

## Troubleshooting

### Port Conflicts

```bash
# Check if port is in use
lsof -i :3001
lsof -i :5432

# Find process using port and kill
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
docker-compose exec postgres psql -U postgres -d propmubi -c "SELECT 1"

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check logs
docker-compose logs postgres | tail -50
docker-compose logs mongodb | tail -50
```

### Build Failures

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache

# Check build logs
docker build -f infra/docker/Dockerfile.backend -t propmubi/backend:latest . 2>&1 | tail -100
```

### Service Not Responding

```bash
# Check service health
docker-compose ps

# View detailed logs
docker-compose logs <service-name> --tail=100

# Restart service
docker-compose restart <service-name>

# Restart and rebuild
docker-compose up --build -d <service-name>
```

### Memory Issues

```bash
# Check Docker resource usage
docker stats

# Increase Docker memory limit (Mac/Windows)
# Docker Desktop > Settings > Resources > Memory

# Increase via docker-compose resource limits
# See docker-compose.yml: resources.limits
```

### Kubernetes Issues

```bash
# Check pod status
kubectl -n propmubi describe pod <pod-name>

# View pod logs
kubectl -n propmubi logs <pod-name>

# Check service endpoints
kubectl -n propmubi get endpoints

# Debug networking
kubectl -n propmubi exec -it <pod-name> -- /bin/sh
```

---

## Performance Optimization

### Docker Image Size

Current sizes (estimated):
- Backend: ~400MB (after multi-stage)
- Web: ~300MB (after build optimization)

Reduce further:
- Use Alpine base images (done in Dockerfiles)
- Remove dev dependencies in production
- Use `.dockerignore` file

### Database Performance

- PostGIS spatial indices on `geom` columns
- B-tree indices on frequently queried fields
- Connection pooling via PgBouncer (add to docker-compose if needed)

### Caching Strategy

```typescript
// 1 hour property cache
redis.setex(`property:${id}`, 3600, JSON.stringify(data));

// 30 second API response cache
redis.setex(`api:${path}`, 30, JSON.stringify(response));

// 24 hour verification cache
redis.setex(`verify:${id}`, 86400, JSON.stringify(result));
```

---

## Security Best Practices

### Secrets Management

✅ **Good:**
```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

❌ **Avoid:**
```yaml
env:
  - name: DB_PASSWORD
    value: "plaintext-password"  # Never in docker-compose!
```

### Network Policies

In Kubernetes:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: web
    ports:
    - protocol: TCP
      port: 3001
```

---

## Next Steps

1. ✅ Start services: `docker-compose up -d`
2. ✅ Verify health: `curl http://localhost:3001/api/health`
3. ✅ Test endpoints: `bash ./scripts/test-backend.sh`
4. ✅ Access dashboards:
   - Web: http://localhost:3000
   - DB UI: http://localhost:8080
   - Metrics: http://localhost:9090
   - Grafana: http://localhost:3005
5. ✅ Deploy to Kubernetes when ready

---

**For questions or issues, refer to:** 
- Docker docs: https://docs.docker.com/
- Kubernetes docs: https://kubernetes.io/docs/
- PostgreSQL PostGIS: https://postgis.net/
- Project MASTER_BLUEPRINT_IMPLEMENTATION.md

