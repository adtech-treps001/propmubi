# 📈 TIER 2: SHORT-TERM IMPROVEMENTS (Weeks 5-8)

**Starting Score**: 6.5/10
**Target Score**: 7.8/10
**Gain**: +1.3 points
**Effort**: 160 hours (4 weeks × 40h)
**Goal**: Series A Investment Ready

---

## 🎯 TIER 2 OBJECTIVES

After TIER 1 fixes production blockers, TIER 2 focuses on:
1. **Performance**: Caching layer for scalability
2. **API Maturity**: Versioning and contract testing
3. **Frontend Quality**: State management and error boundaries
4. **Monitoring**: Health checks and basic metrics

---

## 📋 TIER 2 TASKS

### 🟡 Task 6: Redis Caching Layer
**Priority**: P1
**Impact**: +0.8 scalability, +0.2 architecture
**Effort**: 24 hours
**Status**: ❌ Not Started

#### Current Problem
```python
# apps/api/routers/projects.py - No caching
@router.get("/feed")
async def get_project_feed():
    # Reads from file system every request
    with open("data/trending_data.json") as f:
        data = json.load(f)  # ❌ Disk I/O on every request
    return data
```

**Performance Issue**:
- File I/O latency: ~10-50ms per request
- Database queries without caching: ~100-500ms
- At 1000 req/s: Database overwhelmed

#### Implementation

**6.1 Redis Client Setup**
```python
# apps/api/cache/redis_client.py
import redis.asyncio as redis
import os
import json
from typing import Optional

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def get_cache(key: str) -> Optional[dict]:
    """Get value from cache"""
    value = await redis_client.get(key)
    return json.loads(value) if value else None

async def set_cache(key: str, value: dict, ttl: int = 300):
    """Set value in cache with TTL (default 5 minutes)"""
    await redis_client.set(key, json.dumps(value), ex=ttl)

async def delete_cache(key: str):
    """Invalidate cache key"""
    await redis_client.delete(key)

async def delete_pattern(pattern: str):
    """Invalidate cache by pattern (e.g., 'projects:*')"""
    keys = await redis_client.keys(pattern)
    if keys:
        await redis_client.delete(*keys)
```

**6.2 Cache Decorator**
```python
# apps/api/cache/decorators.py
from functools import wraps
from apps.api.cache.redis_client import get_cache, set_cache

def cached(key_prefix: str, ttl: int = 300):
    """
    Cache decorator for async functions
    Usage: @cached("projects:feed", ttl=600)
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function args
            cache_key = f"{key_prefix}:{':'.join(map(str, args))}"

            # Try cache first
            cached_result = await get_cache(cache_key)
            if cached_result:
                return cached_result

            # Cache miss - execute function
            result = await func(*args, **kwargs)

            # Store in cache
            await set_cache(cache_key, result, ttl)

            return result
        return wrapper
    return decorator
```

**6.3 Apply Caching to Routes**
```python
# apps/api/routers/projects.py
from apps.api.cache.decorators import cached
from apps.api.cache.redis_client import delete_pattern

@router.get("/feed")
@cached("projects:feed", ttl=600)  # Cache for 10 minutes
async def get_project_feed():
    # Only executed on cache miss
    projects = await get_trending_projects_from_db()
    return projects

@router.post("/projects")
async def create_project(project: ProjectCreate):
    new_project = await create_project_in_db(project)

    # Invalidate related caches
    await delete_pattern("projects:*")

    return new_project
```

**6.4 Cache Warming Strategy**
```python
# apps/api/tasks/cache_warmer.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apps.api.routers.projects import get_project_feed

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job('interval', minutes=5)
async def warm_project_feed_cache():
    """Warm cache before TTL expires"""
    await get_project_feed()

scheduler.start()
```

**6.5 Cache Monitoring**
```python
# apps/api/routers/health.py
from apps.api.cache.redis_client import redis_client

@router.get("/health/cache")
async def cache_health():
    try:
        await redis_client.ping()
        info = await redis_client.info()
        return {
            "status": "healthy",
            "memory_used_mb": info["used_memory"] / 1024 / 1024,
            "connected_clients": info["connected_clients"],
            "uptime_days": info["uptime_in_days"]
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
```

#### Cache Strategy by Endpoint

| Endpoint | TTL | Invalidation Trigger |
|----------|-----|----------------------|
| `GET /projects/feed` | 10 min | New project created |
| `GET /projects/map` | 30 min | Project location updated |
| `GET /builder/{id}` | 60 min | Builder profile updated |
| `GET /trust/score/{user_id}` | 5 min | Financial profile updated |
| `GET /reputation/{builder_id}` | 1 hour | RERA data sync |

#### Acceptance Criteria
- [ ] Redis client configured with async support
- [ ] Cache decorator implemented
- [ ] Top 5 read-heavy endpoints cached
- [ ] Cache invalidation on write operations
- [ ] Cache hit rate metric tracked (target: >70%)
- [ ] Cache warming for critical endpoints
- [ ] Health check endpoint for Redis

#### Files to Create/Modify
- Create: `apps/api/cache/redis_client.py`
- Create: `apps/api/cache/decorators.py`
- Create: `apps/api/tasks/cache_warmer.py`
- Modify: `apps/api/routers/projects.py`
- Modify: `apps/api/routers/builder.py`
- Modify: `apps/api/routers/agent.py`

---

### 🟡 Task 7: API Versioning
**Priority**: P1
**Impact**: +0.6 API design, +0.2 architecture
**Effort**: 16 hours
**Status**: ❌ Not Started

#### Current Problem
```python
# apps/api/main.py
app.include_router(auth_router, prefix="/auth")
app.include_router(projects_router, prefix="/projects")
# ❌ No version prefix - breaking changes break clients
```

#### Implementation

**7.1 Version-Prefixed Routes**
```python
# apps/api/main.py
from fastapi import APIRouter

# Create versioned API router
api_v1 = APIRouter(prefix="/api/v1")

# Include all routers under v1
api_v1.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_v1.include_router(projects_router, prefix="/projects", tags=["Projects"])
api_v1.include_router(agent_router, prefix="/agent", tags=["Agent"])
api_v1.include_router(crm_router, prefix="/crm", tags=["CRM"])
api_v1.include_router(builder_router, prefix="/builder", tags=["Builder"])

app.include_router(api_v1)
```

**URLs Change**:
```
Before: http://localhost:8000/projects/feed
After:  http://localhost:8000/api/v1/projects/feed
```

**7.2 Deprecation Headers**
```python
# apps/api/middleware/deprecation.py
from fastapi import Request
from datetime import datetime

DEPRECATED_ENDPOINTS = {
    "/api/v1/projects/old-feed": {
        "sunset_date": "2026-06-01",
        "alternative": "/api/v1/projects/feed"
    }
}

async def deprecation_middleware(request: Request, call_next):
    response = await call_next(request)

    if request.url.path in DEPRECATED_ENDPOINTS:
        info = DEPRECATED_ENDPOINTS[request.url.path]
        response.headers["Deprecation"] = "true"
        response.headers["Sunset"] = info["sunset_date"]
        response.headers["Link"] = f'<{info["alternative"]}>; rel="alternate"'

    return response

app.middleware("http")(deprecation_middleware)
```

**7.3 OpenAPI Documentation (Swagger)**
```python
# apps/api/main.py
app = FastAPI(
    title="PropMubi Trust OS API",
    version="1.0.0",
    description="Real Estate Transaction Operating System",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json"
)
```

**7.4 Contract Testing (Pact)**
```python
# tests/contract/test_projects_contract.py
import pytest
from pactman import Consumer, Provider

@pytest.fixture
def pact():
    return Consumer("Web Frontend").has_pact_with(Provider("API Backend"))

def test_get_project_feed_contract(pact):
    expected = {
        "id": "proj-123",
        "name": "Mangala Heights",
        "developer": "Premium Builders",
        "trust_score": 92
    }

    (pact
     .given("projects exist")
     .upon_receiving("a request for project feed")
     .with_request("GET", "/api/v1/projects/feed")
     .will_respond_with(200, body=[expected]))

    with pact:
        response = requests.get("http://localhost:8000/api/v1/projects/feed")
        assert response.status_code == 200
        assert response.json()[0]["trust_score"] >= 0
```

#### Acceptance Criteria
- [ ] All routes under `/api/v1/` prefix
- [ ] OpenAPI documentation at `/api/v1/docs`
- [ ] Version in response headers (`X-API-Version: 1.0.0`)
- [ ] Deprecation middleware for old endpoints
- [ ] Frontend updated to use new URLs
- [ ] Contract tests for critical endpoints
- [ ] Postman collection exported

#### Files to Modify
- `apps/api/main.py` (versioning setup)
- `apps/web/app/consumer/page.tsx` (update fetch URLs)
- `apps/web/app/agent/page.tsx` (update fetch URLs)
- Create: `apps/api/middleware/deprecation.py`
- Create: `tests/contract/test_projects_contract.py`

---

### 🟡 Task 8: Frontend State Management
**Priority**: P1
**Impact**: +0.5 code quality, +0.3 scalability
**Effort**: 32 hours
**Status**: ❌ Not Started

#### Current Problem
```tsx
// apps/web/app/consumer/page.tsx
const [projects, setProjects] = useState([]);

useEffect(() => {
  fetch('http://localhost:8000/api/v1/projects/feed')
    .then(res => res.json())
    .then(setProjects)  // ❌ No caching, refetch every mount
    .catch(e => console.error(e))  // ❌ Poor error handling
}, [])
```

**Issues**:
- No request caching (duplicate API calls)
- No loading/error states
- No optimistic updates
- No offline support
- Manual state management

#### Implementation

**8.1 Install React Query**
```bash
cd apps/web
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

**8.2 Query Client Setup**
```tsx
// apps/web/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**8.3 API Client Layer**
```typescript
// apps/web/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public correlationId?: string
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(
      response.status,
      error.error?.code || 'UNKNOWN_ERROR',
      error.error?.message || 'An error occurred',
      error.error?.correlation_id
    );
  }

  return response.json();
}
```

**8.4 Custom Hooks**
```typescript
// apps/web/lib/api/hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../client';

export interface Project {
  id: string;
  name: string;
  developer: string;
  location: string;
  price_range: string;
  trust_score: number;
  image: string;
  coordinates?: [number, number];
}

export function useProjectFeed() {
  return useQuery({
    queryKey: ['projects', 'feed'],
    queryFn: () => apiRequest<Project[]>('/projects/feed'),
  });
}

export function useProjectById(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => apiRequest<Project>(`/projects/${projectId}`),
    enabled: !!projectId,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lead: { propertyId: string; userId: string }) =>
      apiRequest('/crm/leads', {
        method: 'POST',
        body: JSON.stringify(lead),
      }),
    onSuccess: () => {
      // Invalidate and refetch leads
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
```

**8.5 Updated Component**
```tsx
// apps/web/app/consumer/page.tsx
'use client';

import { useProjectFeed, useCreateLead } from '@/lib/api/hooks/useProjects';
import { useState } from 'react';

export default function ConsumerFeed() {
  const { data: projects, isLoading, error } = useProjectFeed();
  const createLead = useCreateLead();

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading projects: {error.message}
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  const handleInterest = async (projectId: string) => {
    try {
      await createLead.mutateAsync({
        propertyId: projectId,
        userId: 'current-user-id',
      });
      alert('Interest registered!');
    } catch (error) {
      alert(`Failed: ${error.message}`);
    }
  };

  return (
    <div className="project-grid">
      {projects?.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onInterest={() => handleInterest(project.id)}
        />
      ))}
    </div>
  );
}
```

**8.6 Global State (Zustand)**
```typescript
// apps/web/lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { id: string; name: string; role: string } | null;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### Acceptance Criteria
- [ ] React Query installed and configured
- [ ] All API calls use custom hooks
- [ ] Loading and error states handled
- [ ] Optimistic updates for mutations
- [ ] Global auth state with Zustand
- [ ] Request deduplication working
- [ ] DevTools enabled in development

#### Files to Create/Modify
- Create: `apps/web/lib/api/client.ts`
- Create: `apps/web/lib/api/hooks/useProjects.ts`
- Create: `apps/web/lib/api/hooks/useAgents.ts`
- Create: `apps/web/lib/store/authStore.ts`
- Create: `apps/web/app/providers.tsx`
- Modify: `apps/web/app/layout.tsx` (wrap with Providers)
- Modify: `apps/web/app/consumer/page.tsx`
- Modify: `apps/web/app/agent/page.tsx`

---

### 🟡 Task 9: API Health Checks
**Priority**: P2
**Impact**: +0.4 observability, +0.2 scalability
**Effort**: 12 hours
**Status**: ❌ Not Started

#### Implementation

**9.1 Health Check Endpoint**
```python
# apps/api/routers/health.py
from fastapi import APIRouter, status
from sqlalchemy import text
from apps.api.database import AsyncSessionLocal
from apps.api.cache.redis_client import redis_client
import time

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/", status_code=status.HTTP_200_OK)
async def health_check():
    """Basic liveness probe"""
    return {"status": "ok", "timestamp": time.time()}

@router.get("/ready")
async def readiness_check():
    """Readiness probe - checks dependencies"""
    checks = {}

    # Database check
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"

    # Redis check
    try:
        await redis_client.ping()
        checks["cache"] = "healthy"
    except Exception as e:
        checks["cache"] = f"unhealthy: {str(e)}"

    # Overall status
    all_healthy = all(v == "healthy" for v in checks.values())
    status_code = 200 if all_healthy else 503

    return {
        "status": "ready" if all_healthy else "not_ready",
        "checks": checks,
        "timestamp": time.time()
    }, status_code

@router.get("/metrics")
async def metrics():
    """Basic metrics for monitoring"""
    # TODO: Integrate Prometheus client
    return {
        "requests_total": 0,  # Track with middleware
        "active_connections": 0,
        "cache_hit_rate": 0.0,
    }
```

**9.2 Kubernetes Probes**
```yaml
# k8s/base/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: propmubi-api
spec:
  template:
    spec:
      containers:
      - name: api
        image: propmubi/api:latest
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
```

#### Acceptance Criteria
- [ ] `/health` endpoint for liveness
- [ ] `/health/ready` endpoint for readiness
- [ ] Database connectivity check
- [ ] Redis connectivity check
- [ ] Kubernetes probes configured
- [ ] Graceful shutdown on SIGTERM

---

### 🟢 Task 10: Unit Test Coverage
**Priority**: P2
**Impact**: +0.8 testing
**Effort**: 40 hours
**Status**: ❌ Not Started

#### Current State
- 3 unit tests (trust/reputation engines only)
- No router tests
- No repository tests
- Coverage: ~5%

#### Target
- 120+ unit tests
- Coverage: 85%+

#### Implementation

**10.1 Test Structure**
```
apps/api/tests/
├── unit/
│   ├── routers/
│   │   ├── test_auth.py
│   │   ├── test_projects.py
│   │   ├── test_agent.py
│   │   ├── test_crm.py
│   │   └── test_builder.py
│   ├── repositories/
│   │   ├── test_agent_repository.py
│   │   ├── test_project_repository.py
│   │   └── test_lead_repository.py
│   ├── services/
│   │   ├── test_trust_engine.py
│   │   └── test_reputation_engine.py
│   └── middleware/
│       ├── test_auth_middleware.py
│       └── test_error_handler.py
├── integration/
│   ├── test_database.py
│   └── test_cache.py
└── conftest.py  # Fixtures
```

**10.2 Example Router Test**
```python
# tests/unit/routers/test_projects.py
import pytest
from httpx import AsyncClient
from apps.api.main import app

@pytest.mark.asyncio
async def test_get_project_feed(client: AsyncClient, mock_projects):
    response = await client.get("/api/v1/projects/feed")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "name" in data[0]
    assert "trust_score" in data[0]

@pytest.mark.asyncio
async def test_get_project_by_id_not_found(client: AsyncClient):
    response = await client.get("/api/v1/projects/nonexistent-id")

    assert response.status_code == 404
    error = response.json()
    assert error["error"]["code"] == "RESOURCE_NOT_FOUND"
```

**10.3 Fixtures**
```python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from apps.api.main import app
from apps.api.database import get_db

TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/propmubi_test"

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def db_session():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine) as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
def mock_projects():
    return [
        {
            "id": "proj-1",
            "name": "Test Project",
            "developer": "Test Builder",
            "trust_score": 92
        }
    ]
```

#### Acceptance Criteria
- [ ] 120+ unit tests covering routers, services, repositories
- [ ] 85%+ code coverage
- [ ] All tests run in < 30 seconds
- [ ] Test database setup/teardown
- [ ] Mock external dependencies (Twilio, Ollama)
- [ ] CI runs tests on every PR

---

## 📊 TIER 2 COMPLETION METRICS

### Score Impact
| Dimension | Before (T1) | After (T2) | Gain |
|-----------|-------------|------------|------|
| Architecture | 6.5 | 7.5 | +1.0 |
| Code Quality | 7.3 | 8.0 | +0.7 |
| Testing | 5.0 | 7.5 | +2.5 |
| Scalability | 4.0 | 6.5 | +2.5 |
| API Design | 6.0 | 8.0 | +2.0 |
| Observability | 4.0 | 5.5 | +1.5 |
| **Overall** | **6.5** | **7.8** | **+1.3** |

---

**Document Status**: ✅ Complete
**Last Updated**: 2026-01-10
**Next**: `02-TIER-3-ENTERPRISE.md` (Weeks 9-24)
