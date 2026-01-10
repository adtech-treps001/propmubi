# 🛠️ Development Guide

**Complete setup and development workflow for PropMubi Real Estate Platform**

---

## 📋 Prerequisites

### Required Tools
```bash
Node.js     20.x or higher
Python      3.11 or higher
Poetry      1.7.x or higher
pnpm        8.x or higher
Docker      24.x or higher
Git         2.x or higher
```

### Optional Tools
```bash
kubectl     (for Kubernetes deployment)
k9s         (Kubernetes CLI UI)
pgcli       (PostgreSQL CLI)
redis-cli   (Redis CLI)
aws-cli     (AWS deployment)
terraform   (Infrastructure as Code)
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd propmubi

# Install frontend dependencies
cd web
npm install

# Start web development server
npm run dev
```

### 2. Verify Installation

```bash
# Check web app
# Open http://localhost:3000 in browser

# Expected: Homepage loads with glassmorphism design
```

### 3. Access Applications

| Service | URL | Status |
|---------|-----|--------|
| Web App | http://localhost:3000 | ✅ Available |
| Mobile App | Expo Go (see Mobile Setup) | 🚧 Coming Soon |
| Backend API | http://localhost:8000 | 🚧 Coming Soon |
| Admin Dashboard | http://localhost:3001 | 🚧 Coming Soon |

---

## 📦 Monorepo Structure

```
propmubi/
├── web/                           # Next.js/React web application
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   ├── components/            # Reusable components
│   │   ├── styles/                # CSS modules
│   │   └── utils/                 # Utility functions
│   ├── public/                    # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                       # FastAPI microservices (coming soon)
│   ├── services/
│   │   ├── api-gateway/           # Kong/Traefik gateway
│   │   ├── auth-service/          # Authentication & JWT
│   │   ├── property-service/      # Property management
│   │   ├── user-service/          # User management
│   │   ├── document-service/      # Document processing
│   │   ├── payment-service/       # Payment integration
│   │   ├── loan-service/          # Loan processing
│   │   ├── crm-service/           # CRM & lead management
│   │   ├── notification-service/  # Email/SMS/Push
│   │   └── ai-orchestrator/       # LLM orchestration
│   └── shared/
│       ├── domain/                # Domain models
│       └── common/                # Shared utilities
│
├── database/                      # Database migrations & seeds
│   ├── migrations/                # SQL migration scripts
│   └── seeds/                     # Initial data
│
├── k8s/                          # Kubernetes manifests
│   ├── base/                     # Base configurations
│   └── overlays/                 # Environment overlays
│
├── terraform/                    # Infrastructure as Code
│   ├── providers/
│   │   ├── aws/                  # AWS configs
│   │   └── gcp/                  # GCP configs
│   └── environments/
│       ├── dev/
│       ├── staging/
│       └── prod/
│
├── docs/                         # Documentation
│   ├── 00-START-HERE/
│   ├── 01-PRODUCT/
│   ├── 02-ARCHITECTURE/
│   ├── 04-IMPLEMENTATION/
│   └── 09-STANDARDS/
│
└── mcp-server/                   # Model Context Protocol server
```

---

## 🔧 Development Workflow

### Frontend Development (Web)

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server (hot reload)
npm run dev
# Opens http://localhost:3000

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run E2E tests (Playwright)
npm run test:e2e
```

### Backend Development (Coming Soon)

```bash
# Navigate to backend directory
cd backend

# Install dependencies with Poetry
poetry install

# Activate virtual environment
poetry shell

# Start development server (hot reload)
uvicorn main:app --reload --port 8000

# Run tests
pytest tests/ --cov=src --cov-report=html

# Run linter
black . && isort . && pylint src/

# Type checking
mypy src/
```

### Running Individual Services

```bash
# Property Service
cd backend/services/property-service
poetry run uvicorn main:app --reload --port 8001

# Auth Service
cd backend/services/auth-service
poetry run uvicorn main:app --reload --port 8002

# User Service
cd backend/services/user-service
poetry run uvicorn main:app --reload --port 8003
```

---

## 🗃️ Database Management

### PostgreSQL Setup (Coming Soon)

```bash
# Start PostgreSQL via Docker
docker run -d \
  --name propmubi-postgres \
  -e POSTGRES_USER=propmubi \
  -e POSTGRES_PASSWORD=propmubi123 \
  -e POSTGRES_DB=propmubi \
  -p 5432:5432 \
  postgis/postgis:15-3.3

# Connect to database
psql -h localhost -U propmubi -d propmubi

# Run migrations
cd database/migrations
psql -h localhost -U propmubi -d propmubi -f 001_initial_schema.sql

# Seed database
psql -h localhost -U propmubi -d propmubi -f seeds/sample_properties.sql
```

### Redis Setup (Coming Soon)

```bash
# Start Redis via Docker
docker run -d \
  --name propmubi-redis \
  -p 6379:6379 \
  redis:7-alpine

# Connect to Redis
redis-cli

# Test connection
PING
# Expected: PONG
```

### MongoDB Setup (Coming Soon)

```bash
# Start MongoDB via Docker
docker run -d \
  --name propmubi-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=propmubi \
  -e MONGO_INITDB_ROOT_PASSWORD=propmubi123 \
  -p 27017:27017 \
  mongo:6

# Connect to MongoDB
mongosh mongodb://propmubi:propmubi123@localhost:27017/
```

---

## 🔑 Environment Configuration

### Web App (.env)

Create `web/.env`:

```bash
# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV=development
VITE_API_URL=http://localhost:8000

# ============================================
# MAPBOX (for satellite maps)
# ============================================
VITE_MAPBOX_TOKEN=your-mapbox-token-here

# ============================================
# GOOGLE MAPS (alternative)
# ============================================
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Backend (.env) - Coming Soon

Create `backend/.env`:

```bash
# ============================================
# ENVIRONMENT
# ============================================
ENV=development
DEBUG=true
LOG_LEVEL=debug

# ============================================
# DATABASES
# ============================================
# PostgreSQL
DATABASE_URL=postgresql://propmubi:propmubi123@localhost:5432/propmubi
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# MongoDB
MONGODB_URL=mongodb://propmubi:propmubi123@localhost:27017/propmubi

# Redis
REDIS_URL=redis://localhost:6379/0

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Qdrant (Vector DB)
QDRANT_URL=http://localhost:6333

# ============================================
# EVENT BUS (Redis Streams)
# ============================================
REDIS_STREAM_HOST=localhost
REDIS_STREAM_PORT=6379

# ============================================
# AI/LLM PROVIDERS
# ============================================
LLM_ROUTER=litellm

# OpenAI
OPENAI_API_KEY=your-openai-key-here
OPENAI_MODEL=gpt-4-turbo

# Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-key-here
ANTHROPIC_MODEL=claude-sonnet-4.5

# Ollama (self-hosted)
OLLAMA_BASE_URL=http://localhost:11434

# ============================================
# EXTERNAL APIS
# ============================================
# Property APIs
LANDEED_API_KEY=your-landeed-key
TEAL_API_KEY=your-teal-key
SETU_API_KEY=your-setu-key

# Financial APIs
CIBIL_API_KEY=your-cibil-key
KARZA_API_KEY=your-karza-key

# Communication
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key

# Payment Gateways
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_API_KEY=your-stripe-key

# ============================================
# SECURITY
# ============================================
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_ACCESS_TOKEN_EXPIRE=15  # minutes
JWT_REFRESH_TOKEN_EXPIRE=7  # days
ENCRYPTION_KEY=your-encryption-key-32-chars

# ============================================
# STORAGE
# ============================================
# S3 (AWS or MinIO)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=propmubi-documents
S3_REGION=us-east-1

# ============================================
# SATELLITE IMAGERY
# ============================================
SATELLITE_API_URL=https://api.satellite-provider.com
SATELLITE_API_KEY=your-satellite-key

# ============================================
# MONITORING
# ============================================
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_PORT=9090
```

---

## 🐳 Docker Services

### Docker Compose (All Services)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL with PostGIS
  postgres:
    image: postgis/postgis:15-3.3
    container_name: propmubi-postgres
    environment:
      POSTGRES_USER: propmubi
      POSTGRES_PASSWORD: propmubi123
      POSTGRES_DB: propmubi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U propmubi"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: propmubi-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB
  mongodb:
    image: mongo:6
    container_name: propmubi-mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: propmubi
      MONGO_INITDB_ROOT_PASSWORD: propmubi123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  # Elasticsearch
  elasticsearch:
    image: elasticsearch:8.11.0
    container_name: propmubi-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  # Qdrant (Vector DB)
  qdrant:
    image: qdrant/qdrant:latest
    container_name: propmubi-qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

  # MinIO (S3-compatible storage)
  minio:
    image: minio/minio:latest
    container_name: propmubi-minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  # Prometheus (Metrics)
  prometheus:
    image: prom/prometheus:latest
    container_name: propmubi-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  # Grafana (Dashboards)
  grafana:
    image: grafana/grafana:latest
    container_name: propmubi-grafana
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  mongodb_data:
  elasticsearch_data:
  qdrant_data:
  minio_data:
  prometheus_data:
  grafana_data:
```

### Start All Services

```bash
# Start all infrastructure services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 🧪 Testing Strategy

### Frontend Tests (Web)

#### Unit Tests (Vitest)
```bash
cd web

# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Example unit test:
```typescript
// src/components/PropertyCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyCard from './PropertyCard';

describe('PropertyCard', () => {
  it('should render property name', () => {
    const property = {
      id: '1',
      name: 'Luxury Villa',
      price: 50000000,
      bhk: '3BHK'
    };

    render(<PropertyCard property={property} />);
    expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
  });

  it('should format price correctly', () => {
    const property = {
      id: '1',
      name: 'Test Property',
      price: 10000000,
      bhk: '2BHK'
    };

    render(<PropertyCard property={property} />);
    expect(screen.getByText('₹1.00 Cr')).toBeInTheDocument();
  });
});
```

#### E2E Tests (Playwright)
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Generate test report
npm run test:e2e:report
```

Example E2E test:
```typescript
// tests/e2e/property-search.spec.ts
import { test, expect } from '@playwright/test';

test('should search properties by location', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Enter search location
  await page.fill('[data-testid="search-input"]', 'Bangalore');
  await page.click('[data-testid="search-button"]');

  // Wait for results
  await page.waitForSelector('[data-testid="property-card"]');

  // Verify results loaded
  const propertyCards = await page.$$('[data-testid="property-card"]');
  expect(propertyCards.length).toBeGreaterThan(0);
});
```

### Backend Tests (Coming Soon)

#### Unit Tests (pytest)
```bash
cd backend

# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_property_service.py

# Run with verbose output
pytest tests/ -v
```

Example unit test:
```python
# tests/services/property/test_property_service.py
import pytest
from src.services.property.service import PropertyService
from src.domain.entities.property import Property

@pytest.fixture
def property_service():
    return PropertyService()

def test_create_property(property_service):
    property_data = {
        "name": "Luxury Villa",
        "price": 50000000,
        "bhk": "3BHK",
        "area_sqft": 2000
    }

    property = property_service.create_property(property_data)

    assert property.id is not None
    assert property.name == "Luxury Villa"
    assert property.price.amount == 50000000

def test_search_properties_by_location(property_service):
    results = property_service.search_by_location(
        lat=12.9716,
        lng=77.5946,
        radius_km=5
    )

    assert len(results) > 0
    assert all(isinstance(p, Property) for p in results)
```

#### Integration Tests
```python
# tests/integration/test_property_flow.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_property_creation_flow():
    async with AsyncClient(base_url="http://localhost:8001") as client:
        # Create property
        response = await client.post("/api/v1/properties", json={
            "name": "Test Villa",
            "price": 10000000,
            "bhk": "2BHK"
        })
        assert response.status_code == 201
        property_id = response.json()["id"]

        # Get property
        response = await client.get(f"/api/v1/properties/{property_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "Test Villa"
```

### Coverage Requirements

```bash
Minimum Coverage Thresholds:
  Frontend (Web):
    Lines:      80%
    Functions:  80%
    Branches:   75%

  Backend (Services):
    Lines:      85%
    Functions:  85%
    Branches:   80%

  Critical Paths (Payment, Auth):
    Lines:      95%
    Functions:  95%
    Branches:   90%
```

---

## 📝 Code Standards

### TypeScript (Frontend)

```typescript
// Use explicit types
function calculateEMI(
  principal: number,
  ratePercent: number,
  tenureMonths: number
): number {
  const rate = ratePercent / 1200;
  const emi = (principal * rate * Math.pow(1 + rate, tenureMonths)) /
              (Math.pow(1 + rate, tenureMonths) - 1);
  return Math.round(emi);
}

// Use interfaces for objects
interface Property {
  id: string;
  name: string;
  price: number;
  bhk: string;
  location: Location;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

// Use enums for constants
enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  UNDER_CONSTRUCTION = 'under_construction'
}

// Use async/await over promises
async function fetchProperty(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.statusText}`);
  }
  return response.json();
}
```

### Python (Backend) - Coming Soon

```python
# Use type hints
from typing import Optional, List
from dataclasses import dataclass

@dataclass
class Property:
    id: str
    name: str
    price: float
    bhk: str
    area_sqft: float

async def get_property(property_id: str) -> Optional[Property]:
    """Fetch property by ID from database."""
    result = await db.properties.find_one({"id": property_id})
    if not result:
        return None
    return Property(**result)

# Use Pydantic for validation
from pydantic import BaseModel, Field, validator

class PropertyCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    bhk: str = Field(..., regex=r'^\d{1,2}BHK$')
    area_sqft: float = Field(..., gt=0)

    @validator('price')
    def price_must_be_reasonable(cls, v):
        if v > 1_000_000_000:  # 100 crore
            raise ValueError('Price seems unreasonably high')
        return v
```

### Error Handling

```typescript
// Frontend error handling
try {
  const property = await fetchProperty(id);
  setProperty(property);
} catch (error) {
  if (error instanceof NetworkError) {
    showToast('Network error. Please check your connection.');
  } else if (error instanceof NotFoundError) {
    showToast('Property not found.');
  } else {
    console.error('Unexpected error:', error);
    showToast('Something went wrong. Please try again.');
  }
}
```

```python
# Backend error handling
from fastapi import HTTPException
from src.exceptions import PropertyNotFoundError, ValidationError

@app.get("/api/v1/properties/{property_id}")
async def get_property(property_id: str):
    try:
        property = await property_service.get_by_id(property_id)
        if not property:
            raise PropertyNotFoundError(property_id)
        return property
    except PropertyNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
```

---

## 🔍 Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Web App",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/web/src"
    },
    {
      "name": "Debug Backend (FastAPI)",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "main:app",
        "--reload",
        "--port", "8000"
      ],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/backend"
      }
    },
    {
      "name": "Debug Tests (Frontend)",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/web/node_modules/.bin/vitest",
      "args": ["--run"],
      "cwd": "${workspaceFolder}/web",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill process
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

### Docker Issues

```bash
# Reset Docker completely
docker-compose down -v
docker system prune -a -f
docker-compose up -d
```

### Node Modules Issues

```bash
# Clear and reinstall
cd web
rm -rf node_modules package-lock.json
npm install
```

### Python Dependencies Issues

```bash
# Clear and reinstall
cd backend
poetry env remove python
poetry install
```

---

## 📚 Additional Resources

- [System Architecture](../02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md)
- [Product Requirements](../01-PRODUCT/PRD.md)
- [Technology Decisions](../implementatins/TECHNOLOGY_DECISIONS.md)
- [Quick Start Guide](../implementatins/QUICK_START_GUIDE.md)
- [Agentic Development Guide](../09-STANDARDS/AGENTIC_DEVELOPMENT_GUIDE.md)

---

**Last Updated**: January 8, 2026
**Status**: ✅ Complete
**Maintainer**: AGENT-TL
