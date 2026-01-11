# ✅ IMPLEMENTATION CHECKLIST: Complete Roadmap to 9+ Score

**Purpose**: Master checklist tracking all 15 tasks across 3 tiers
**Current Score**: 5.1/10
**Target Score**: 9.2/10
**Total Effort**: 960 hours (24 weeks)

---

## 📊 PROGRESS TRACKER

### Overall Progress
- [ ] TIER 1: Immediate Fixes (0/5 tasks) - Weeks 1-4
- [ ] TIER 2: Short-Term Improvements (0/5 tasks) - Weeks 5-8
- [ ] TIER 3: Enterprise Scale (0/5 tasks) - Weeks 9-24

**Current Status**: 0/15 tasks completed (0%)

---

## 🔴 TIER 1: IMMEDIATE (Weeks 1-4) - Target Score: 6.5/10

### ☐ Task 1: Database Persistence Layer
**Priority**: P0 | **Effort**: 40h | **Score Impact**: +1.3

#### Sub-tasks
- [ ] 1.1 Create database session management (`apps/api/database.py`)
- [ ] 1.2 Implement repository pattern for Agent
- [ ] 1.3 Implement repository pattern for Lead
- [ ] 1.4 Implement repository pattern for Project
- [ ] 1.5 Implement repository pattern for Builder
- [ ] 1.6 Update `apps/api/routers/agent.py` to use repository
- [ ] 1.7 Update `apps/api/routers/crm.py` to use repository
- [ ] 1.8 Update `apps/api/routers/builder.py` to use repository
- [ ] 1.9 Update `apps/api/routers/projects.py` to use repository
- [ ] 1.10 Install Alembic: `poetry add alembic`
- [ ] 1.11 Initialize Alembic: `alembic init migrations`
- [ ] 1.12 Create migration: `alembic revision --autogenerate -m "Initial schema"`
- [ ] 1.13 Apply migration: `alembic upgrade head`
- [ ] 1.14 Configure connection pooling (max 20 connections)
- [ ] 1.15 Update all unit tests to use test database
- [ ] 1.16 Verify all existing Playwright tests still pass

#### Acceptance Criteria
- [ ] All routers query database instead of in-memory data
- [ ] Data persists across service restarts
- [ ] Alembic migrations successfully applied
- [ ] Connection pool metrics tracked
- [ ] All tests passing (Playwright + unit)

#### Files Modified
- `apps/api/database.py`
- `apps/api/routers/agent.py` (189 lines)
- `apps/api/routers/crm.py` (167 lines)
- `apps/api/routers/builder.py` (201 lines)
- `apps/api/routers/projects.py` (123 lines)
- Create: `apps/api/repositories/agent_repository.py`
- Create: `apps/api/repositories/lead_repository.py`
- Create: `apps/api/repositories/project_repository.py`
- Create: `apps/api/repositories/builder_repository.py`
- Create: `apps/api/migrations/*.py`

---

### ☐ Task 2: Security Hardening
**Priority**: P0 | **Effort**: 32h | **Score Impact**: +2.5

#### Sub-tasks
- [ ] 2.1 Install dependencies: `poetry add python-decouple twilio`
- [ ] 2.2 Create `.env.example` template
- [ ] 2.3 Create `apps/api/config.py` with Settings class
- [ ] 2.4 Replace hardcoded OTP with Twilio integration
- [ ] 2.5 Implement OTP storage in Redis (5-minute TTL)
- [ ] 2.6 Restrict CORS to specific origins (update `main.py`)
- [ ] 2.7 Create JWT validation middleware (`apps/api/middleware/auth.py`)
- [ ] 2.8 Apply JWT middleware to protected routes
- [ ] 2.9 Implement refresh token rotation
- [ ] 2.10 Add rate limiting to `/auth/login` (10 attempts/15min)
- [ ] 2.11 Update `docker-compose.yml` to use environment variables
- [ ] 2.12 Create `docker-compose.override.yml` for local secrets
- [ ] 2.13 Add `.env` to `.gitignore`
- [ ] 2.14 Update frontend to use new CORS-restricted API

#### Acceptance Criteria
- [ ] No hardcoded credentials in codebase
- [ ] CORS restricted to `http://localhost:3005,http://localhost:3006`
- [ ] JWT validation working on all protected endpoints
- [ ] OTP sent via SMS (Twilio)
- [ ] Rate limiting prevents brute-force attacks
- [ ] All secrets in environment variables

#### Files Modified
- `apps/api/main.py` (CORS configuration)
- `apps/api/routers/auth.py` (OTP, JWT)
- Create: `apps/api/middleware/auth.py`
- Create: `apps/api/config.py`
- Create: `.env.example`
- Update: `docker-compose.yml`
- Update: `apps/web/.env.local`

---

### ☐ Task 3: Centralized Error Handling
**Priority**: P1 | **Effort**: 16h | **Score Impact**: +0.7

#### Sub-tasks
- [ ] 3.1 Create custom exception classes (`apps/api/exceptions.py`)
- [ ] 3.2 Create global exception handler middleware
- [ ] 3.3 Register exception handler in `main.py`
- [ ] 3.4 Update `apps/api/routers/agent.py` to use custom exceptions
- [ ] 3.5 Update `apps/api/routers/crm.py` to use custom exceptions
- [ ] 3.6 Update `apps/api/routers/builder.py` to use custom exceptions
- [ ] 3.7 Update `apps/api/routers/projects.py` to use custom exceptions
- [ ] 3.8 Add correlation ID to all error responses
- [ ] 3.9 Log errors with full context (path, method, user_id)
- [ ] 3.10 Update frontend to parse structured error responses

#### Acceptance Criteria
- [ ] All errors return structured JSON with correlation ID
- [ ] Consistent error codes across all endpoints
- [ ] Frontend displays user-friendly error messages
- [ ] Errors logged with full request context

#### Files Created/Modified
- Create: `apps/api/exceptions.py`
- Create: `apps/api/middleware/error_handler.py`
- Modify: `apps/api/main.py`
- Modify: All router files

---

### ☐ Task 4: Linting & Formatting
**Priority**: P1 | **Effort**: 8h | **Score Impact**: +0.3

#### Sub-tasks
- [ ] 4.1 Install Python tools: `poetry add --group dev black ruff pre-commit`
- [ ] 4.2 Configure Black in `pyproject.toml`
- [ ] 4.3 Configure Ruff in `pyproject.toml`
- [ ] 4.4 Run Black on all Python files: `black apps/api/`
- [ ] 4.5 Fix Ruff issues: `ruff check apps/api/ --fix`
- [ ] 4.6 Install JS tools: `pnpm add -D prettier eslint @typescript-eslint/parser`
- [ ] 4.7 Create `.prettierrc` configuration
- [ ] 4.8 Create `.eslintrc.js` configuration
- [ ] 4.9 Run Prettier on all JS/TS files: `prettier --write "apps/web/**/*.{js,ts,tsx}"`
- [ ] 4.10 Fix ESLint issues: `eslint --fix "apps/web/**/*.{js,ts,tsx}"`
- [ ] 4.11 Create `.pre-commit-config.yaml`
- [ ] 4.12 Install pre-commit hooks: `pre-commit install`
- [ ] 4.13 Test pre-commit hooks with a commit

#### Acceptance Criteria
- [ ] All Python files formatted with Black
- [ ] All Python files pass Ruff checks
- [ ] All JS/TS files formatted with Prettier
- [ ] All JS/TS files pass ESLint checks
- [ ] Pre-commit hooks block commits with linting errors

#### Files Created
- `pyproject.toml` (updated)
- `.prettierrc`
- `.eslintrc.js`
- `.pre-commit-config.yaml`

---

### ☐ Task 5: Request/Response Logging
**Priority**: P2 | **Effort**: 12h | **Score Impact**: +0.5

#### Sub-tasks
- [ ] 5.1 Create JSON log formatter (`apps/api/logging_config.py`)
- [ ] 5.2 Create request logging middleware
- [ ] 5.3 Register middleware in `main.py`
- [ ] 5.4 Add correlation ID to all requests
- [ ] 5.5 Add correlation ID to response headers (`X-Correlation-ID`)
- [ ] 5.6 Log request start with method, path, client IP
- [ ] 5.7 Log request completion with status code, duration
- [ ] 5.8 Configure log levels (DEBUG in dev, INFO in prod)
- [ ] 5.9 Update exception handler to include correlation ID in errors

#### Acceptance Criteria
- [ ] All requests logged in JSON format
- [ ] Correlation IDs in logs and response headers
- [ ] Request duration tracked
- [ ] Logs include user ID (when authenticated)

#### Files Created/Modified
- Create: `apps/api/logging_config.py`
- Create: `apps/api/middleware/request_logger.py`
- Modify: `apps/api/main.py`

---

## 🟡 TIER 2: SHORT-TERM (Weeks 5-8) - Target Score: 7.8/10

### ☐ Task 6: Redis Caching Layer
**Priority**: P1 | **Effort**: 24h | **Score Impact**: +1.0

#### Sub-tasks
- [ ] 6.1 Create Redis client (`apps/api/cache/redis_client.py`)
- [ ] 6.2 Create cache decorator (`apps/api/cache/decorators.py`)
- [ ] 6.3 Apply caching to `GET /projects/feed` (TTL: 10 min)
- [ ] 6.4 Apply caching to `GET /projects/map` (TTL: 30 min)
- [ ] 6.5 Apply caching to `GET /builder/{id}` (TTL: 60 min)
- [ ] 6.6 Apply caching to `GET /trust/score/{user_id}` (TTL: 5 min)
- [ ] 6.7 Apply caching to `GET /reputation/{builder_id}` (TTL: 1 hour)
- [ ] 6.8 Implement cache invalidation on write operations
- [ ] 6.9 Create cache warming task (`apps/api/tasks/cache_warmer.py`)
- [ ] 6.10 Add cache health check endpoint (`/health/cache`)
- [ ] 6.11 Track cache hit rate metric

#### Acceptance Criteria
- [ ] Top 5 read endpoints cached
- [ ] Cache hit rate >70%
- [ ] Cache invalidation working correctly
- [ ] Cache warming prevents cold starts

#### Files Created
- `apps/api/cache/redis_client.py`
- `apps/api/cache/decorators.py`
- `apps/api/tasks/cache_warmer.py`

---

### ☐ Task 7: API Versioning
**Priority**: P1 | **Effort**: 16h | **Score Impact**: +0.8

#### Sub-tasks
- [ ] 7.1 Create versioned API router in `main.py` (`/api/v1`)
- [ ] 7.2 Move all routers under `/api/v1` prefix
- [ ] 7.3 Update OpenAPI docs URL to `/api/v1/docs`
- [ ] 7.4 Add `X-API-Version` header to all responses
- [ ] 7.5 Create deprecation middleware
- [ ] 7.6 Update frontend to use `/api/v1/*` endpoints
- [ ] 7.7 Create Pact contract tests for critical endpoints
- [ ] 7.8 Export Postman collection for API v1

#### Acceptance Criteria
- [ ] All endpoints under `/api/v1/` prefix
- [ ] OpenAPI docs at `/api/v1/docs`
- [ ] Frontend uses new versioned URLs
- [ ] Contract tests passing

#### Files Modified
- `apps/api/main.py`
- `apps/web/app/consumer/page.tsx`
- `apps/web/app/agent/page.tsx`
- Create: `apps/api/middleware/deprecation.py`
- Create: `tests/contract/test_projects_contract.py`

---

### ☐ Task 8: Frontend State Management
**Priority**: P1 | **Effort**: 32h | **Score Impact**: +0.8

#### Sub-tasks
- [ ] 8.1 Install React Query: `pnpm add @tanstack/react-query`
- [ ] 8.2 Install Zustand: `pnpm add zustand`
- [ ] 8.3 Create QueryClient provider (`apps/web/app/providers.tsx`)
- [ ] 8.4 Create API client layer (`apps/web/lib/api/client.ts`)
- [ ] 8.5 Create custom hook: `useProjectFeed()`
- [ ] 8.6 Create custom hook: `useProjectById()`
- [ ] 8.7 Create custom hook: `useCreateLead()`
- [ ] 8.8 Create custom hook: `useAgentLeads()`
- [ ] 8.9 Create auth store with Zustand (`apps/web/lib/store/authStore.ts`)
- [ ] 8.10 Update `apps/web/app/consumer/page.tsx` to use React Query
- [ ] 8.11 Update `apps/web/app/agent/page.tsx` to use React Query
- [ ] 8.12 Wrap app with Providers in `layout.tsx`
- [ ] 8.13 Add error boundaries for components
- [ ] 8.14 Enable React Query DevTools

#### Acceptance Criteria
- [ ] All API calls use React Query hooks
- [ ] Loading and error states handled
- [ ] Request deduplication working
- [ ] Optimistic updates for mutations
- [ ] Auth state persisted across page reloads

#### Files Created
- `apps/web/lib/api/client.ts`
- `apps/web/lib/api/hooks/useProjects.ts`
- `apps/web/lib/api/hooks/useAgents.ts`
- `apps/web/lib/store/authStore.ts`
- `apps/web/app/providers.tsx`

---

### ☐ Task 9: API Health Checks
**Priority**: P2 | **Effort**: 12h | **Score Impact**: +0.6

#### Sub-tasks
- [ ] 9.1 Create health router (`apps/api/routers/health.py`)
- [ ] 9.2 Implement `/health` endpoint (liveness probe)
- [ ] 9.3 Implement `/health/ready` endpoint (readiness probe)
- [ ] 9.4 Add database connectivity check
- [ ] 9.5 Add Redis connectivity check
- [ ] 9.6 Create `/health/metrics` endpoint (basic metrics)
- [ ] 9.7 Add Kubernetes liveness probe configuration
- [ ] 9.8 Add Kubernetes readiness probe configuration

#### Acceptance Criteria
- [ ] `/health` returns 200 when service is alive
- [ ] `/health/ready` checks all dependencies
- [ ] Returns 503 when dependencies unavailable
- [ ] Kubernetes probes configured

#### Files Created
- `apps/api/routers/health.py`
- `k8s/base/api-deployment.yaml` (probes)

---

### ☐ Task 10: Unit Test Coverage
**Priority**: P2 | **Effort**: 40h | **Score Impact**: +2.5

#### Sub-tasks
- [ ] 10.1 Create test structure (`apps/api/tests/unit/routers/`)
- [ ] 10.2 Create pytest fixtures (`tests/conftest.py`)
- [ ] 10.3 Write tests for `routers/auth.py` (15 tests)
- [ ] 10.4 Write tests for `routers/projects.py` (20 tests)
- [ ] 10.5 Write tests for `routers/agent.py` (18 tests)
- [ ] 10.6 Write tests for `routers/crm.py` (22 tests)
- [ ] 10.7 Write tests for `routers/builder.py` (20 tests)
- [ ] 10.8 Write tests for `repositories/` (25 tests)
- [ ] 10.9 Write tests for `middleware/` (10 tests)
- [ ] 10.10 Run coverage report: `pytest --cov=apps/api --cov-report=html`
- [ ] 10.11 Achieve 85%+ coverage

#### Acceptance Criteria
- [ ] 120+ unit tests
- [ ] 85%+ code coverage
- [ ] All tests run in <30 seconds
- [ ] Test database setup/teardown working
- [ ] CI runs tests on every PR

#### Files Created
- `apps/api/tests/unit/routers/test_auth.py`
- `apps/api/tests/unit/routers/test_projects.py`
- `apps/api/tests/unit/routers/test_agent.py`
- `apps/api/tests/unit/routers/test_crm.py`
- `apps/api/tests/unit/routers/test_builder.py`
- `apps/api/tests/unit/repositories/test_agent_repository.py`
- `apps/api/tests/unit/repositories/test_project_repository.py`
- `apps/api/tests/unit/repositories/test_lead_repository.py`
- `apps/api/tests/conftest.py`

---

## 🚀 TIER 3: ENTERPRISE (Weeks 9-24) - Target Score: 9.2/10

### ☐ Task 11: Microservices Decomposition
**Priority**: P0 | **Effort**: 200h | **Score Impact**: +2.5

#### Sub-tasks (Auth Service Example - Repeat for 9 services)
- [ ] 11.1 Create `apps/auth-service/` directory structure
- [ ] 11.2 Move auth routers to auth-service
- [ ] 11.3 Create dedicated User model and repository
- [ ] 11.4 Create Dockerfile for auth-service
- [ ] 11.5 Configure port 3001 for auth-service
- [ ] 11.6 Add health checks
- [ ] 11.7 Deploy auth-service alongside monolith
- [ ] 11.8 Update frontend to call auth-service directly
- [ ] 11.9 Test auth-service independently

**Repeat for**:
- [ ] 11.10-19: property-service (port 3002)
- [ ] 11.20-29: trust-service (port 3006)
- [ ] 11.30-39: agent-service (port 3015)
- [ ] 11.40-49: crm-service (port 3016)
- [ ] 11.50-59: builder-service (port 3017)
- [ ] 11.60-69: legal-service (port 3007)
- [ ] 11.70-79: reputation-service (port 3012)
- [ ] 11.80-89: marketing-service (port 3014)

**API Gateway**:
- [ ] 11.90 Install Kong or Traefik
- [ ] 11.91 Configure routing rules
- [ ] 11.92 Add rate limiting plugin
- [ ] 11.93 Add CORS plugin
- [ ] 11.94 Add JWT authentication plugin
- [ ] 11.95 Test end-to-end routing

**Service Communication**:
- [ ] 11.96 Implement REST client for inter-service calls
- [ ] 11.97 OR: Implement gRPC for high-throughput calls
- [ ] 11.98 Add service-to-service authentication
- [ ] 11.99 Add circuit breakers (resilience4j)
- [ ] 11.100 Retire monolith (`apps/api/`)

#### Acceptance Criteria
- [ ] 9 independent microservices running
- [ ] API Gateway routes all external traffic
- [ ] Services can communicate internally
- [ ] Each service independently deployable
- [ ] Monolith fully retired

---

### ☐ Task 12: Event-Driven Architecture
**Priority**: P0 | **Effort**: 80h | **Score Impact**: +1.5

#### Sub-tasks
- [ ] 12.1 Create event bus module (`shared/events/event_bus.py`)
- [ ] 12.2 Define domain events (`shared/events/domain_events.py`)
- [ ] 12.3 Implement `publish_event()` function
- [ ] 12.4 Implement `subscribe_to_events()` function
- [ ] 12.5 Create `LeadAssignedEvent`
- [ ] 12.6 Create `TrustScoreUpdatedEvent`
- [ ] 12.7 Create `ProjectCreatedEvent`
- [ ] 12.8 Create `DocumentVerifiedEvent`
- [ ] 12.9 Create `PaymentReceivedEvent`
- [ ] 12.10 Update CRM service to publish `LeadAssignedEvent`
- [ ] 12.11 Update Agent service to consume `LeadAssignedEvent`
- [ ] 12.12 Update Trust service to publish `TrustScoreUpdatedEvent`
- [ ] 12.13 Update Property service to consume `TrustScoreUpdatedEvent`
- [ ] 12.14 Create event consumer workers for each service
- [ ] 12.15 Add dead-letter queue for failed events
- [ ] 12.16 Create event monitoring dashboard

#### Acceptance Criteria
- [ ] 10+ domain events defined
- [ ] All services publish events for state changes
- [ ] All services consume relevant events
- [ ] Event replay working for debugging
- [ ] Dead-letter queue handling failures

---

### ☐ Task 13: Production Infrastructure
**Priority**: P1 | **Effort**: 120h | **Score Impact**: +1.5

#### Sub-tasks
- [ ] 13.1 Create EKS cluster with Terraform
- [ ] 13.2 Configure 3-10 node auto-scaling group
- [ ] 13.3 Deploy all 9 microservices to Kubernetes
- [ ] 13.4 Configure Horizontal Pod Autoscaling for each service
- [ ] 13.5 Upgrade RDS to `db.r6g.xlarge`
- [ ] 13.6 Create RDS read replica
- [ ] 13.7 Configure automated backups (30-day retention)
- [ ] 13.8 Deploy ElastiCache Redis cluster (3 nodes, multi-AZ)
- [ ] 13.9 Configure Ingress controller with TLS
- [ ] 13.10 Setup Cert-Manager for automatic SSL certificates
- [ ] 13.11 Configure resource requests and limits for all pods
- [ ] 13.12 Create staging environment (separate K8s namespace)
- [ ] 13.13 Create production environment

#### Acceptance Criteria
- [ ] EKS cluster running with 5 nodes
- [ ] All services deployed and healthy
- [ ] Auto-scaling working (tested with load)
- [ ] RDS upgraded with read replica
- [ ] ElastiCache Redis cluster operational
- [ ] HTTPS working on api.propmubi.com
- [ ] Staging and production environments separated

---

### ☐ Task 14: Complete Observability
**Priority**: P1 | **Effort**: 80h | **Score Impact**: +2.0

#### Sub-tasks
- [ ] 14.1 Install Prometheus client in all services
- [ ] 14.2 Add metrics middleware
- [ ] 14.3 Define metrics: `http_requests_total`, `http_request_duration_seconds`
- [ ] 14.4 Define business metrics: `leads_created_total`, `trust_scores`
- [ ] 14.5 Deploy Prometheus to Kubernetes
- [ ] 14.6 Configure Prometheus to scrape all services
- [ ] 14.7 Deploy Grafana to Kubernetes
- [ ] 14.8 Create dashboard: API Overview
- [ ] 14.9 Create dashboard: Database Performance
- [ ] 14.10 Create dashboard: Cache Performance
- [ ] 14.11 Create dashboard: Business Metrics
- [ ] 14.12 Install OpenTelemetry in all services
- [ ] 14.13 Configure Jaeger exporter
- [ ] 14.14 Deploy Jaeger to Kubernetes
- [ ] 14.15 Test distributed tracing across services
- [ ] 14.16 Deploy Alertmanager
- [ ] 14.17 Configure 10+ critical alerts
- [ ] 14.18 Integrate with PagerDuty/Slack

#### Acceptance Criteria
- [ ] Prometheus scraping all services
- [ ] 4+ Grafana dashboards
- [ ] Distributed tracing working across services
- [ ] 10+ alerts configured
- [ ] PagerDuty integration working

---

### ☐ Task 15: CI/CD Pipeline
**Priority**: P1 | **Effort**: 60h | **Score Impact**: +1.5

#### Sub-tasks
- [ ] 15.1 Create GitHub Actions workflow for each service
- [ ] 15.2 Configure automated testing on PR
- [ ] 15.3 Configure linting on PR
- [ ] 15.4 Configure coverage reports
- [ ] 15.5 Configure Docker build and push to ECR
- [ ] 15.6 Configure deployment to staging on merge to main
- [ ] 15.7 Configure manual approval for production
- [ ] 15.8 Implement blue-green deployment
- [ ] 15.9 Add smoke tests after deployment
- [ ] 15.10 Configure automated rollback on failure

#### Acceptance Criteria
- [ ] CI runs tests on every PR
- [ ] CD deploys to staging automatically
- [ ] Production deployment requires manual approval
- [ ] Blue-green deployments working
- [ ] Rollback tested and working

---

## 📈 FINAL SCORE PROJECTION

| Dimension | Current | After T1 | After T2 | After T3 |
|-----------|---------|----------|----------|----------|
| Architecture | 6.0 | 6.5 | 7.5 | 9.5 |
| Code Quality | 7.0 | 7.3 | 8.0 | 8.5 |
| Testing | 5.0 | 5.0 | 7.5 | 9.0 |
| Security | 4.0 | 6.5 | 6.5 | 8.5 |
| Scalability | 4.0 | 4.0 | 6.5 | 9.5 |
| DevOps | 3.0 | 3.0 | 3.0 | 9.0 |
| Observability | 2.0 | 4.0 | 5.5 | 9.5 |
| Documentation | 9.0 | 9.0 | 9.0 | 9.0 |
| Database | 5.0 | 7.0 | 7.0 | 8.5 |
| API Design | 6.0 | 6.3 | 8.0 | 9.0 |
| **Overall** | **5.1** | **6.5** | **7.8** | **9.2** |

---

**Document Status**: ✅ Complete
**Last Updated**: 2026-01-10
**Next**: Begin TIER 1 implementation
