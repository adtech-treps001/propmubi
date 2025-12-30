# AI CODING AGENT PROMPTS
## Detailed Instructions for Autonomous Implementation

**Purpose:** These prompts can be copy-pasted to AI coding agents (Claude Code, GitHub Copilot, Cursor, Aider, etc.) for autonomous task implementation.

**Usage:**
1. Pick a task from IMPLEMENTATION_TASKS_DAG.md
2. Copy the corresponding prompt below
3. Paste to your AI coding agent
4. Agent will implement with detailed checklist
5. Review, test, and commit

---

## TABLE OF CONTENTS

1. [Infrastructure Prompts](#infrastructure-prompts)
2. [Backend Service Prompts](#backend-service-prompts)
3. [Frontend Prompts](#frontend-prompts)
4. [Mobile Prompts](#mobile-prompts)
5. [Testing Prompts](#testing-prompts)
6. [DevOps Prompts](#devops-prompts)

---

# INFRASTRUCTURE PROMPTS

## [INFRA-001] Local Development Infrastructure Setup

```
TASK: Set up local development infrastructure for Propmubi real estate platform

CONTEXT:
- Tech Stack: Docker Desktop, Kubernetes, Helm, Terraform
- Platform: Windows 10/11 with WSL 2 Ubuntu 22.04
- Microservices architecture with 18+ services
- Event-driven design with Redis Streams

REQUIREMENTS:
1. Install and configure Docker Desktop with Kubernetes enabled
2. Configure WSL 2 with Ubuntu 22.04
3. Install development tools: Helm 3, Terraform 1.6+, kubectl
4. Set up local Docker registry on port 5000
5. Create /etc/hosts entries for local domains:
   - 127.0.0.1 api.propmubi.local
   - 127.0.0.1 app.propmubi.local
   - 127.0.0.1 admin.propmubi.local

6. Run setup script: scripts/setup-wsl.sh (already exists)
7. Verify all tools installed:
   - docker --version (>= 24.0)
   - kubectl version (>= 1.28)
   - helm version (>= 3.13)
   - terraform version (>= 1.6)

ACCEPTANCE CRITERIA:
- [ ] Docker Desktop running with Kubernetes enabled
- [ ] WSL 2 Ubuntu accessible with Python 3.11 and Node 18+
- [ ] All CLI tools installed and in PATH
- [ ] Local registry accepting image pushes
- [ ] Smoke test script passes: scripts/test-infrastructure.sh

DELIVERABLES:
1. Updated documentation in README.md
2. Smoke test script: scripts/test-infrastructure.sh
3. Screenshot of docker ps and kubectl get nodes
4. Git commit with tag: INFRA-001-complete

DO NOT:
- Install production cloud resources yet
- Configure secrets or credentials
- Start any services (that's next task)

START IMPLEMENTATION.
```

---

## [INFRA-002] Local Database Setup

```
TASK: Set up all local databases for Propmubi microservices

CONTEXT:
- Using docker-compose.local.yml (already exists)
- 5 databases: PostgreSQL, MongoDB, Redis, Elasticsearch, Qdrant
- Connection pooling with PgBouncer
- Initialization scripts exist: scripts/init-databases.sql, scripts/init-mongodb.js

REQUIREMENTS:
1. Start all databases via docker-compose:
   docker-compose -f docker-compose.local.yml up -d postgres pgbouncer mongodb redis elasticsearch qdrant

2. Verify all containers running:
   docker ps | grep -E "postgres|mongo|redis|elastic|qdrant"

3. PostgreSQL Setup:
   - Verify pg_isready: docker exec propmubi-postgres pg_isready -U propmubi
   - Check databases created: propmubi_properties, propmubi_users, propmubi_transactions
   - Verify extensions: uuid-ossp, postgis, pg_trgm
   - Test connection: psql -U propmubi -h localhost -d propmubi_properties -c "\l"

4. MongoDB Setup:
   - Verify running: docker exec propmubi-mongodb mongosh --eval "db.version()"
   - Check collections: documents, document_versions, knowledge_graphs, event_logs
   - Verify indexes created (see init-mongodb.js)

5. Redis Setup:
   - Test: docker exec propmubi-redis redis-cli -a propmubi_dev_pass ping
   - Should return: PONG

6. Elasticsearch Setup:
   - Health check: curl http://localhost:9200/_cluster/health
   - Should return: green or yellow status

7. Qdrant Setup:
   - Health check: curl http://localhost:6333/
   - Should return: {"title":"qdrant..."}

8. Create Alembic migration structure for each PostgreSQL database:
   mkdir -p migrations/{properties,users,transactions}
   # Initialize Alembic for each

ACCEPTANCE CRITERIA:
- [ ] All 5 databases running and healthy
- [ ] All connection tests passing
- [ ] Initial schemas/collections created
- [ ] Alembic migration framework initialized
- [ ] Database credentials work from WSL and Windows
- [ ] Test script passes: scripts/test-databases.sh

DELIVERABLES:
1. Test script: scripts/test-databases.sh with all connection tests
2. Alembic config files in migrations/
3. Documentation: docs/DATABASE_SETUP.md with connection strings
4. Git commit with tag: INFRA-002-complete

CONSTRAINTS:
- Use only local docker-compose (no cloud resources)
- No sensitive data in git (use .env file)
- All containers must restart automatically (restart: unless-stopped)

START IMPLEMENTATION.
```

---

## [INFRA-003] Message Queue & Event Bus Setup

```
TASK: Set up Redis Streams as event bus for microservices communication

CONTEXT:
- Event-driven architecture with publish-subscribe pattern
- Redis Streams for high-throughput event processing
- Consumer groups for load balancing
- Dead letter queue for failed events
- 18+ microservices will produce/consume events

REQUIREMENTS:
1. Redis is already running from INFRA-002

2. Create Event Schema Registry:
   - Directory: schemas/events/
   - Files: property_events.py, user_events.py, transaction_events.py, document_events.py
   - Use Pydantic v2 for schemas with strict validation

3. Example Event Schema (schemas/events/property_events.py):
   ```python
   from pydantic import BaseModel, Field
   from datetime import datetime
   from uuid import UUID

   class PropertyCreatedEvent(BaseModel):
       event_id: UUID = Field(default_factory=uuid4)
       event_type: str = "property.created"
       timestamp: datetime = Field(default_factory=datetime.utcnow)
       correlation_id: UUID
       data: dict = Field(..., description="Property data")

       class Config:
           json_schema_extra = {
               "example": {
                   "event_type": "property.created",
                   "data": {"id": "prop-123", "name": "Prestige Apartments"}
               }
           }
   ```

4. Create Base Publisher (common/events/publisher.py):
   - Connect to Redis
   - Publish to stream: XADD stream_name * field value
   - Add event ID, timestamp, correlation ID
   - Validate against schema before publishing
   - Handle errors: retry 3 times, then DLQ
   - Logging with structlog

5. Create Base Consumer (common/events/consumer.py):
   - Create consumer group if not exists: XGROUP CREATE
   - Read from stream: XREADGROUP
   - Process message
   - Acknowledge: XACK
   - On error: retry 3 times, then move to DLQ

6. Initialize Stream Groups:
   ```python
   # For each event stream, create consumer groups
   streams = {
       'property.events': ['crm-service', 'analytics-service'],
       'user.events': ['crm-service', 'communication-service'],
       'transaction.events': ['analytics-service', 'payment-service'],
       'document.events': ['legal-service', 'loan-service']
   }

   for stream, groups in streams.items():
       for group in groups:
           # XGROUP CREATE stream group $ MKSTREAM
   ```

7. Create DLQ Handler:
   - Stream name: dlq:failed_events
   - Store failed event + error message + retry count
   - Alert mechanism (log for now)

8. Create Event Bus Test Suite:
   tests/infrastructure/test_event_bus.py
   - Test publish
   - Test consume
   - Test consumer group
   - Test DLQ
   - Test idempotency

ACCEPTANCE CRITERIA:
- [ ] Event schemas defined for all 4 event types
- [ ] Base publisher class with schema validation
- [ ] Base consumer class with retry logic
- [ ] Stream groups created for all services
- [ ] DLQ configured and tested
- [ ] Tests passing with >= 90% coverage
- [ ] Documentation: docs/EVENT_BUS_GUIDE.md

DELIVERABLES:
1. schemas/events/*.py (4 files)
2. common/events/publisher.py
3. common/events/consumer.py
4. common/events/dlq_handler.py
5. scripts/init-redis-streams.py (initializes streams)
6. tests/infrastructure/test_event_bus.py
7. docs/EVENT_BUS_GUIDE.md with examples
8. Git commit with tag: INFRA-003-complete

EXAMPLE USAGE:
```python
# Publishing
publisher = EventPublisher(redis_url)
event = PropertyCreatedEvent(data={"id": "123", ...})
await publisher.publish("property.events", event)

# Consuming
consumer = EventConsumer(redis_url, "property.events", "crm-service")
async for event in consumer.consume():
    # Process event
    await process_property_created(event)
```

START IMPLEMENTATION.
```

---

# BACKEND SERVICE PROMPTS

## [SVC-001] API Gateway Service

```
TASK: Implement API Gateway microservice with authentication, rate limiting, and service routing

CONTEXT:
- FastAPI-based API Gateway
- JWT authentication middleware
- Redis-based rate limiting
- Routes requests to downstream services
- Prometheus metrics and Jaeger tracing
- First microservice in the critical path

TECH STACK:
- Python 3.11
- FastAPI 0.104+
- Redis (for rate limiting)
- Uvicorn (ASGI server)
- Structlog (structured logging)
- Prometheus client
- OpenTelemetry

REQUIREMENTS:

1. PROJECT SETUP:
   ```bash
   cd services/
   mkdir api-gateway && cd api-gateway
   poetry init
   # Add dependencies (see detailed list in IMPLEMENTATION_PROGRESS_TRACKER.md)
   poetry install
   ```

2. DIRECTORY STRUCTURE:
   ```
   services/api-gateway/
   ├─ src/
   │  ├─ main.py
   │  ├─ config/
   │  │  └─ settings.py (Pydantic BaseSettings)
   │  ├─ middleware/
   │  │  ├─ auth.py (JWT validation)
   │  │  ├─ rate_limit.py (Redis-based)
   │  │  ├─ cors.py
   │  │  └─ logging.py
   │  ├─ routes/
   │  │  ├─ health.py (/health/live, /health/ready, /health/startup)
   │  │  ├─ proxy.py (service routing)
   │  │  └─ metrics.py (/metrics for Prometheus)
   │  ├─ services/
   │  │  ├─ jwt_service.py (token decode/verify)
   │  │  └─ rate_limiter.py
   │  └─ utils/
   │     └─ logger.py (structlog setup)
   ├─ tests/
   │  ├─ unit/
   │  │  ├─ test_auth_middleware.py
   │  │  ├─ test_rate_limit.py
   │  │  └─ test_jwt_service.py
   │  └─ integration/
   │     └─ test_proxy.py
   ├─ Dockerfile (multi-stage build)
   ├─ .dockerignore
   ├─ pyproject.toml
   └─ README.md
   ```

3. IMPLEMENTATION DETAILS:

   A. main.py:
      - Create FastAPI app with lifespan context manager
      - Add middleware in order: CORS → Logging → RateLimit → Auth
      - Include routers: health, proxy, metrics
      - Configure OpenAPI docs

   B. config/settings.py:
      - Use Pydantic BaseSettings
      - Load from .env file
      - Settings: environment, debug, redis_url, jwt_secret, downstream service URLs
      - Validate required fields

   C. middleware/auth.py:
      - Exempt paths: /health, /metrics, /api/v1/auth/*
      - Extract Bearer token from Authorization header
      - Decode JWT using jose library
      - Validate: signature, expiration, issuer
      - Attach user info to request.state.user
      - Return 401 on invalid token

   D. middleware/rate_limit.py:
      - Use Redis INCR for counting
      - Key: rate_limit:{user_id or IP}:{current_minute}
      - Expire key after 60 seconds
      - Return 429 if count > limit
      - Add headers: X-RateLimit-Limit, X-RateLimit-Remaining

   E. routes/proxy.py:
      - Route pattern: /api/v1/{service}/{path:path}
      - Service map: auth → auth-service, users → user-service, properties → property-service
      - Use httpx.AsyncClient to forward request
      - Preserve headers, method, body
      - Return response with same status code and headers
      - Add request ID for tracing

   F. routes/metrics.py:
      - Prometheus metrics: http_requests_total (Counter), http_request_duration_seconds (Histogram)
      - Increment on each request
      - Expose via /metrics endpoint

4. TESTING (Target: 85%+ coverage):
   - Unit tests for all middleware
   - Integration tests for proxy routing
   - Mock downstream services
   - Test error scenarios

5. DOCKER:
   - Multi-stage Dockerfile (builder + runtime)
   - Use python:3.11-slim
   - Non-root user
   - EXPOSE 8000
   - CMD: uvicorn src.main:app --host 0.0.0.0 --port 8000

6. HELM CHART:
   - Create values file: helm-charts/propmubi-microservices/values/api-gateway-values.yaml
   - Set replicas: 2
   - HPA: min 2, max 10, CPU 70%
   - Resources: 500m CPU, 512Mi RAM
   - Ingress: api.propmubi.local

ACCEPTANCE CRITERIA:
- [ ] All endpoints responding correctly
- [ ] JWT auth working (valid token passes, invalid rejected)
- [ ] Rate limiting enforced
- [ ] Requests proxied to downstream services
- [ ] Health checks return 200
- [ ] Metrics exposed at /metrics
- [ ] Unit tests >= 85% coverage
- [ ] Integration tests passing
- [ ] Docker image builds without errors
- [ ] Linting passes (black, isort, pylint, mypy)
- [ ] Security scan passes (bandit, safety)
- [ ] Deployed to dev via ArgoCD
- [ ] Smoke test passes

DELIVERABLES:
1. Complete source code in services/api-gateway/
2. Unit and integration tests
3. Dockerfile and .dockerignore
4. Helm values file
5. README.md with API documentation
6. OpenAPI spec (auto-generated by FastAPI)
7. Git commit with tag: SVC-001-complete

TESTING COMMANDS:
```bash
# Run tests
pytest tests/ --cov=src --cov-report=html --cov-report=term-missing

# Linting
black --check src/
isort --check src/
pylint src/ --fail-under=8.0
mypy src/

# Security
bandit -r src/
safety check

# Build Docker
docker build -t propmubi/api-gateway:latest .
docker run -p 8000:8000 -e JWT_SECRET_KEY=test propmubi/api-gateway:latest

# Test endpoints
curl http://localhost:8000/health/live
curl http://localhost:8000/metrics
```

START IMPLEMENTATION. Follow the detailed checklist in IMPLEMENTATION_PROGRESS_TRACKER.md for [SVC-001].
```

---

## [SVC-002] Authentication Service

```
TASK: Implement Authentication Service with JWT, OAuth, OTP, and Aadhaar integration

CONTEXT:
- Handles user registration, login, logout, token refresh
- Supports multiple auth methods: Email/Password, Google OAuth, Facebook OAuth, Aadhaar OTP
- Publishes events: user.registered, user.logged_in, user.logged_out
- Critical service: 90%+ test coverage required

TECH STACK:
- Python 3.11, FastAPI
- SQLAlchemy (PostgreSQL for users)
- Redis (session management, OTP storage)
- python-jose (JWT)
- bcrypt (password hashing)
- httpx (for OAuth and Aadhaar APIs)

AUTH FLOWS:
1. Email/Password: Register → Verify Email → Login → JWT token
2. OAuth: Redirect → Callback → Create/Update user → JWT token
3. Aadhaar OTP: Request OTP → Verify OTP → Create user → JWT token
4. Token Refresh: Send refresh token → Get new access token

REQUIREMENTS:

1. PROJECT STRUCTURE:
   ```
   services/auth-service/
   ├─ src/
   │  ├─ main.py
   │  ├─ config/settings.py
   │  ├─ models/
   │  │  ├─ user.py (SQLAlchemy User model)
   │  │  ├─ session.py (User sessions)
   │  │  └─ oauth.py (OAuth tokens)
   │  ├─ services/
   │  │  ├─ jwt_service.py (create/verify JWT)
   │  │  ├─ oauth_service.py (Google, Facebook)
   │  │  ├─ otp_service.py (SMS OTP via MSG91)
   │  │  └─ password_service.py (bcrypt hash/verify)
   │  ├─ routes/
   │  │  ├─ auth.py (login, register, logout, refresh)
   │  │  ├─ oauth.py (OAuth callbacks)
   │  │  └─ aadhaar.py (Aadhaar OTP flow)
   │  ├─ events/
   │  │  └─ publishers.py (publish auth events)
   │  ├─ integrations/
   │  │  ├─ aadhaar_ekyc.py
   │  │  └─ digilocker.py
   │  └─ schemas/
   │     ├─ auth.py (Pydantic request/response models)
   │     └─ token.py
   ├─ migrations/ (Alembic)
   ├─ tests/
   └─ Dockerfile
   ```

2. DATABASE SCHEMA (models/user.py):
   ```python
   class User(Base):
       __tablename__ = "users"

       id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
       email = Column(String(255), unique=True, nullable=True)
       phone = Column(String(15), unique=True, nullable=True)
       password_hash = Column(String(255), nullable=True)  # Null for OAuth/Aadhaar users
       full_name = Column(String(255))
       is_email_verified = Column(Boolean, default=False)
       is_phone_verified = Column(Boolean, default=False)
       is_active = Column(Boolean, default=True)
       auth_provider = Column(Enum('email', 'google', 'facebook', 'aadhaar'), default='email')
       aadhaar_id = Column(String(12), unique=True, nullable=True)  # Encrypted
       created_at = Column(DateTime, default=datetime.utcnow)
       updated_at = Column(DateTime, onupdate=datetime.utcnow)

       # Relationships
       sessions = relationship("Session", back_populates="user")
       oauth_tokens = relationship("OAuthToken", back_populates="user")
   ```

3. JWT SERVICE (services/jwt_service.py):
   ```python
   def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
       to_encode = data.copy()
       expire = datetime.utcnow() + expires_delta
       to_encode.update({"exp": expire, "iat": datetime.utcnow()})
       return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

   def create_refresh_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
       # Similar to access token but longer expiry

   def verify_token(token: str) -> dict:
       try:
           payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
           return payload
       except JWTError:
           raise HTTPException(status_code=401, detail="Invalid token")
   ```

4. ROUTES IMPLEMENTATION:

   A. POST /api/v1/auth/register (routes/auth.py):
      - Input: email, password, full_name, phone
      - Hash password with bcrypt
      - Create user in DB
      - Send verification email (via communication-service event)
      - Publish event: user.registered
      - Return: user_id, message

   B. POST /api/v1/auth/login:
      - Input: email/phone, password
      - Verify credentials
      - Check if email/phone verified
      - Create session in Redis
      - Publish event: user.logged_in
      - Return: access_token, refresh_token, user info

   C. POST /api/v1/auth/refresh:
      - Input: refresh_token
      - Verify refresh token
      - Generate new access_token
      - Return: access_token

   D. POST /api/v1/auth/logout:
      - Input: access_token (from header)
      - Delete session from Redis
      - Blacklist token (add to Redis set with TTL)
      - Publish event: user.logged_out
      - Return: success message

   E. GET/POST /api/v1/oauth/google (routes/oauth.py):
      - GET: Redirect to Google OAuth consent screen
      - POST (callback): Exchange code for token, get user info, create/update user, return JWT

   F. POST /api/v1/aadhaar/request-otp (routes/aadhaar.py):
      - Input: aadhaar_number (12 digits)
      - Call Aadhaar eKYC API to request OTP
      - Store OTP in Redis with 5-minute expiry
      - Return: request_id

   G. POST /api/v1/aadhaar/verify-otp:
      - Input: request_id, otp
      - Verify OTP from Redis
      - Call Aadhaar API to verify
      - Create user with aadhaar_id
      - Return: JWT tokens

5. EVENT PUBLISHING (events/publishers.py):
   ```python
   async def publish_user_registered(user_id: UUID, email: str):
       event = UserRegisteredEvent(
           data={"user_id": str(user_id), "email": email}
       )
       await event_publisher.publish("user.events", event)
   ```

6. INTEGRATIONS:
   - Google OAuth: Use google-auth library
   - Aadhaar eKYC: Integrate with govt API or use AuthBridge/IDfy
   - DigiLocker: For document verification (optional)

7. TESTING (Target: 90%+ coverage):
   - Unit tests for all services (jwt, password, otp)
   - Integration tests for all routes
   - Mock external APIs (Google, Aadhaar)
   - Test error cases: invalid credentials, expired tokens, etc.

8. SECURITY:
   - Never log passwords or tokens
   - Hash passwords with bcrypt (cost factor 12)
   - Encrypt Aadhaar numbers at rest (AES-256)
   - Rate limit OTP requests (max 3 per 5 minutes)
   - HTTPS only in production
   - Validate all inputs with Pydantic

9. ALEMBIC MIGRATIONS:
   ```bash
   cd services/auth-service
   alembic init migrations
   alembic revision --autogenerate -m "create users table"
   alembic upgrade head
   ```

ACCEPTANCE CRITERIA:
- [ ] All auth flows working (email, OAuth, Aadhaar)
- [ ] JWT tokens issued and validated correctly
- [ ] Passwords hashed with bcrypt
- [ ] Sessions stored in Redis
- [ ] Events published on registration, login, logout
- [ ] Unit tests >= 90% coverage
- [ ] Integration tests passing
- [ ] Security scan passes (bandit, safety)
- [ ] No secrets in code
- [ ] Database migrations applied
- [ ] Deployed to dev
- [ ] Smoke test passes

DELIVERABLES:
1. Complete auth-service source code
2. Alembic migrations
3. Unit and integration tests
4. Dockerfile
5. Helm values
6. README with API docs
7. Git commit with tag: SVC-002-complete

TESTING:
```bash
# Unit tests
pytest tests/unit/ --cov=src --cov-report=term

# Integration tests
pytest tests/integration/

# Security
bandit -r src/
safety check

# Manual testing
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","full_name":"Test User"}'
```

START IMPLEMENTATION. Reference IMPLEMENTATION_PROGRESS_TRACKER.md for detailed checklist.
```

---

# FRONTEND PROMPTS

## [FE-001] Design System & Atomic Components

```
TASK: Build a comprehensive design system using Atomic Design methodology with Tailwind CSS, Radix UI, and Storybook

CONTEXT:
- Shared component library for web and mobile apps
- Atomic Design: Atoms → Molecules → Organisms → Templates
- Tailwind CSS for styling
- Radix UI for accessible primitives
- Storybook for component documentation
- TypeScript for type safety
- Vitest for testing

TECH STACK:
- React 18 + TypeScript
- Tailwind CSS 3.4+
- Radix UI primitives
- class-variance-authority (cva) for component variants
- Storybook 7.6+
- Vitest + React Testing Library

PROJECT SETUP:
```bash
cd packages/
pnpm create vite@latest design-system --template react-ts
cd design-system
pnpm install
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D tailwindcss postcss autoprefixer storybook
pnpm dlx storybook@latest init
```

REQUIREMENTS:

1. DIRECTORY STRUCTURE:
   ```
   packages/design-system/
   ├─ src/
   │  ├─ atoms/
   │  │  ├─ Button/
   │  │  │  ├─ Button.tsx
   │  │  │  ├─ Button.stories.tsx
   │  │  │  ├─ Button.test.tsx
   │  │  │  └─ index.ts
   │  │  ├─ Input/
   │  │  ├─ Label/
   │  │  ├─ Badge/
   │  │  ├─ Avatar/
   │  │  ├─ Spinner/
   │  │  └─ Checkbox/
   │  ├─ molecules/
   │  │  ├─ SearchBar/
   │  │  ├─ FormField/
   │  │  ├─ Card/
   │  │  ├─ PropertyCard/
   │  │  └─ Modal/
   │  ├─ organisms/
   │  │  ├─ Header/
   │  │  ├─ Footer/
   │  │  ├─ PropertyList/
   │  │  ├─ FilterPanel/
   │  │  └─ ChatWidget/
   │  ├─ templates/
   │  │  ├─ PageLayout/
   │  │  └─ DashboardLayout/
   │  ├─ tokens/
   │  │  ├─ colors.ts
   │  │  ├─ typography.ts
   │  │  └─ spacing.ts
   │  ├─ lib/
   │  │  └─ utils.ts (cn helper)
   │  └─ index.ts (export all)
   └─ .storybook/
   ```

2. DESIGN TOKENS (tokens/colors.ts):
   ```typescript
   export const colors = {
     primary: {
       50: '#f0f9ff',
       100: '#e0f2fe',
       500: '#0ea5e9',  // Main
       600: '#0284c7',
       900: '#0c4a6e',
     },
     secondary: {
       // ... similar structure
     },
     neutral: {
       // ... grays
     },
     success: '#10b981',
     warning: '#f59e0b',
     error: '#ef4444',
   }

   export const typography = {
     fontFamily: {
       sans: ['Inter', 'sans-serif'],
       display: ['Poppins', 'sans-serif'],
     },
     fontSize: {
       xs: '0.75rem',
       sm: '0.875rem',
       base: '1rem',
       lg: '1.125rem',
       xl: '1.25rem',
       '2xl': '1.5rem',
       // ...
     }
   }
   ```

3. TAILWIND CONFIG (tailwind.config.js):
   ```javascript
   import { colors, typography } from './src/tokens'

   export default {
     content: ['./src/**/*.{ts,tsx}'],
     theme: {
       extend: {
         colors,
         fontFamily: typography.fontFamily,
         fontSize: typography.fontSize,
       }
     },
     plugins: [],
   }
   ```

4. IMPLEMENT ATOMS:

   A. Button (atoms/Button/Button.tsx):
      - Variants: default, destructive, outline, ghost, link
      - Sizes: sm, default, lg, icon
      - Loading state with spinner
      - Disabled state
      - Full accessibility (ARIA labels)
      - Example in IMPLEMENTATION_PROGRESS_TRACKER.md

   B. Input:
      - Variants: default, error, success
      - Sizes: sm, default, lg
      - Icons (left/right)
      - Disabled state
      - Error message support

   C. Badge:
      - Variants: default, secondary, success, warning, error
      - Removable (with X button)

   D. Avatar:
      - Sizes: xs, sm, md, lg, xl
      - Image with fallback to initials
      - Status indicator (online/offline dot)

   E. Spinner:
      - Sizes: xs, sm, md, lg
      - Colors: primary, white

   F. Checkbox, Radio, Switch:
      - Use Radix UI primitives
      - Custom styling with Tailwind

5. IMPLEMENT MOLECULES:

   A. SearchBar (molecules/SearchBar/SearchBar.tsx):
      - Combines Input + Search icon + Filter button
      - Props: onSearch, onFilter, placeholder
      - Example in IMPLEMENTATION_PROGRESS_TRACKER.md

   B. FormField:
      - Combines Label + Input + Error message
      - Props: label, error, required

   C. Card:
      - Container with shadow and rounded corners
      - Variants: default, elevated
      - Optional header, footer

   D. PropertyCard:
      - Image + Title + Price + Location + CTA button
      - Hover effects
      - Favorite button (heart icon)
      - Props: property data, onFavorite, onView

   E. Modal/Dialog:
      - Use Radix UI Dialog
      - Props: title, children, onClose
      - Overlay with backdrop blur
      - Accessible (focus trap, Esc to close)

6. IMPLEMENT ORGANISMS:

   A. Header:
      - Logo + Navigation menu + User dropdown + Notifications
      - Responsive (hamburger on mobile)
      - Sticky on scroll

   B. PropertyList:
      - Grid of PropertyCard components
      - Responsive grid (1/2/3 columns)
      - Loading skeleton
      - Empty state

   C. FilterPanel:
      - Multiple filter inputs (price range, location, BHK, etc.)
      - Apply/Reset buttons
      - Collapsible on mobile

   D. ChatWidget:
      - Chat messages + Input field
      - Floating button to open/close
      - Typing indicator
      - Full implementation in [FE-002]

7. IMPLEMENT TEMPLATES:

   A. PageLayout:
      - Header + Sidebar (optional) + Main content + Footer
      - Props: header, sidebar, children, footer

   B. DashboardLayout:
      - Sidebar navigation + Top bar + Main content area
      - Responsive sidebar (drawer on mobile)

8. STORYBOOK SETUP:
   - Configure .storybook/main.ts
   - Add Tailwind to .storybook/preview.tsx
   - Create stories for ALL components
   - Add controls for all props
   - Add docs addon for auto-generated docs

   Example story (atoms/Button/Button.stories.tsx):
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react'
   import { Button } from './Button'

   const meta: Meta<typeof Button> = {
     title: 'Atoms/Button',
     component: Button,
     tags: ['autodocs'],
     argTypes: {
       variant: {
         control: 'select',
         options: ['default', 'destructive', 'outline', 'ghost', 'link'],
       },
       size: {
         control: 'select',
         options: ['sm', 'default', 'lg', 'icon'],
       },
       isLoading: { control: 'boolean' },
     },
   }

   export default meta
   type Story = StoryObj<typeof Button>

   export const Primary: Story = {
     args: {
       children: 'Button',
       variant: 'default',
     },
   }

   export const Loading: Story = {
     args: {
       children: 'Loading',
       isLoading: true,
     },
   }

   export const AllVariants: Story = {
     render: () => (
       <div className="flex gap-2">
         <Button variant="default">Default</Button>
         <Button variant="destructive">Destructive</Button>
         <Button variant="outline">Outline</Button>
         <Button variant="ghost">Ghost</Button>
         <Button variant="link">Link</Button>
       </div>
     ),
   }
   ```

9. TESTING:
   - Install: pnpm add -D @testing-library/react @testing-library/jest-dom vitest
   - Test all components (>80% coverage)
   - Test user interactions (click, type, etc.)
   - Test accessibility (ARIA labels, keyboard navigation)

   Example test (atoms/Button/Button.test.tsx):
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react'
   import { Button } from './Button'

   describe('Button', () => {
     it('renders children', () => {
       render(<Button>Click me</Button>)
       expect(screen.getByText('Click me')).toBeInTheDocument()
     })

     it('calls onClick when clicked', () => {
       const handleClick = vi.fn()
       render(<Button onClick={handleClick}>Click me</Button>)
       fireEvent.click(screen.getByText('Click me'))
       expect(handleClick).toHaveBeenCalledTimes(1)
     })

     it('shows loading state', () => {
       render(<Button isLoading>Loading</Button>)
       expect(screen.getByRole('button')).toBeDisabled()
       expect(screen.getByRole('button')).toHaveClass('disabled')
     })

     it('applies correct variant classes', () => {
       render(<Button variant="destructive">Delete</Button>)
       expect(screen.getByRole('button')).toHaveClass('bg-red-500')
     })
   })
   ```

10. ACCESSIBILITY:
    - All interactive elements keyboard accessible
    - Proper ARIA labels
    - Focus indicators
    - Screen reader support
    - Color contrast ratio >= 4.5:1
    - Test with axe-core

11. DOCUMENTATION:
    - README.md with installation and usage
    - Component prop tables (auto-generated by Storybook)
    - Design principles
    - Contribution guide

ACCEPTANCE CRITERIA:
- [ ] All atoms implemented (Button, Input, Badge, Avatar, Spinner, Checkbox, Radio, Switch)
- [ ] All molecules implemented (SearchBar, FormField, Card, PropertyCard, Modal)
- [ ] All organisms implemented (Header, PropertyList, FilterPanel)
- [ ] All templates implemented (PageLayout, DashboardLayout)
- [ ] Design tokens defined
- [ ] Storybook running with all component stories
- [ ] Tests passing with >= 80% coverage
- [ ] Type checking passes (tsc --noEmit)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Responsive (mobile-first)

DELIVERABLES:
1. Complete design-system package
2. All component source files
3. Storybook stories for all components
4. Unit tests for all components
5. README.md with documentation
6. Git commit with tag: FE-001-complete

TESTING COMMANDS:
```bash
# Run tests
pnpm test --coverage

# Type check
pnpm tsc --noEmit

# Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook

# Accessibility test
pnpm test:a11y
```

START IMPLEMENTATION. Build all components with reusability, accessibility, and performance in mind.
```

---

## [FE-002] Chatbot Component & AI Chat Interface

```
TASK: Build an AI-powered chatbot interface with real-time streaming responses, context awareness, and multi-modal support

CONTEXT:
- Conversational AI for property search, EMI calculation, document upload
- Real-time streaming responses (token by token)
- WebSocket or SSE for bidirectional communication
- Context-aware suggestions
- Voice input (optional)
- Integrates with AI Orchestration Service (AI-001)

TECH STACK:
- React 18 + TypeScript
- Zustand (state management)
- Socket.IO or SSE (real-time)
- react-markdown (message rendering)
- lucide-react (icons)
- @radix-ui/react-dialog (modal)

REQUIREMENTS:

1. CHAT COMPONENTS (organisms/ChatWidget/):

   A. ChatWindow.tsx (Main container):
      ```typescript
      interface ChatWindowProps {
        isOpen: boolean
        onClose: () => void
      }

      export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
        const { messages, sendMessage, isStreaming } = useChatStore()

        return (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col">
              <ChatHeader onClose={onClose} />
              <ChatMessages messages={messages} />
              {isStreaming && <TypingIndicator />}
              <ChatInput onSend={sendMessage} disabled={isStreaming} />
            </DialogContent>
          </Dialog>
        )
      }
      ```

   B. ChatMessage.tsx:
      - User messages: right-aligned, blue bubble
      - Assistant messages: left-aligned, gray bubble
      - Markdown rendering for formatted text
      - Code syntax highlighting
      - Image/document preview
      - Timestamp

   C. ChatInput.tsx:
      - Text input field
      - Send button
      - Microphone button (voice input - optional)
      - File upload button (documents, images)
      - Character limit indicator
      - Keyboard shortcuts (Enter to send, Shift+Enter for newline)

   D. TypingIndicator.tsx:
      - Animated dots
      - "Assistant is typing..." text

   E. SuggestedQueries.tsx:
      - Quick action chips
      - Examples:
        - "Show 3BHK under ₹1 Cr"
        - "Calculate EMI for ₹80L"
        - "Upload documents"
        - "Check property status"

2. STATE MANAGEMENT (stores/useChatStore.ts):
   ```typescript
   import create from 'zustand'
   import { nanoid } from 'nanoid'

   interface Message {
     id: string
     role: 'user' | 'assistant' | 'system'
     content: string
     timestamp: Date
     isStreaming?: boolean
     metadata?: {
       propertyId?: string
       documentId?: string
     }
   }

   interface ChatStore {
     conversations: Map<string, Message[]>
     activeConversationId: string | null
     isOpen: boolean
     isStreaming: boolean

     // Actions
     sendMessage: (content: string, metadata?: any) => Promise<void>
     streamResponse: (chunk: string) => void
     clearConversation: () => void
     toggleChat: () => void
     createConversation: () => string
   }

   export const useChatStore = create<ChatStore>((set, get) => ({
     conversations: new Map(),
     activeConversationId: null,
     isOpen: false,
     isStreaming: false,

     sendMessage: async (content: string, metadata?: any) => {
       const { activeConversationId } = get()

       // Add user message
       const userMessage: Message = {
         id: nanoid(),
         role: 'user',
         content,
         timestamp: new Date(),
         metadata,
       }

       set((state) => {
         const messages = state.conversations.get(activeConversationId!) || []
         return {
           conversations: new Map(state.conversations).set(
             activeConversationId!,
             [...messages, userMessage]
           ),
           isStreaming: true,
         }
       })

       // Create streaming assistant message
       const assistantMessageId = nanoid()
       const assistantMessage: Message = {
         id: assistantMessageId,
         role: 'assistant',
         content: '',
         timestamp: new Date(),
         isStreaming: true,
       }

       set((state) => {
         const messages = state.conversations.get(activeConversationId!) || []
         return {
           conversations: new Map(state.conversations).set(
             activeConversationId!,
             [...messages, assistantMessage]
           ),
         }
       })

       // Stream response from API
       await streamChatResponse(content, assistantMessageId)

       set({ isStreaming: false })
     },

     streamResponse: (messageId: string, chunk: string) => {
       set((state) => {
         const { activeConversationId } = get()
         const messages = state.conversations.get(activeConversationId!) || []
         const updatedMessages = messages.map((msg) =>
           msg.id === messageId
             ? { ...msg, content: msg.content + chunk }
             : msg
         )
         return {
           conversations: new Map(state.conversations).set(
             activeConversationId!,
             updatedMessages
           ),
         }
       })
     },

     toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

     createConversation: () => {
       const id = nanoid()
       set({ activeConversationId: id })
       return id
     },
   }))
   ```

3. WEBSOCKET INTEGRATION (lib/chatSocket.ts):
   ```typescript
   import { io, Socket } from 'socket.io-client'
   import { useChatStore } from '@/stores/useChatStore'

   let socket: Socket | null = null

   export const connectChatSocket = (conversationId: string) => {
     socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
       path: '/ws/chat',
       query: { conversationId },
     })

     socket.on('connect', () => {
       console.log('Connected to chat server')
     })

     socket.on('message:start', (data) => {
       // New message stream starting
     })

     socket.on('message:chunk', (data) => {
       // Streaming token
       useChatStore.getState().streamResponse(data.messageId, data.chunk)
     })

     socket.on('message:end', (data) => {
       // Message complete
       // Mark as not streaming
     })

     socket.on('error', (error) => {
       console.error('Chat error:', error)
     })

     return socket
   }

   export const disconnectChatSocket = () => {
     if (socket) {
       socket.disconnect()
       socket = null
     }
   }

   export const sendChatMessage = (message: string, metadata?: any) => {
     if (socket) {
       socket.emit('message', { content: message, metadata })
     }
   }
   ```

4. ALTERNATIVE: SSE (Server-Sent Events):
   ```typescript
   async function streamChatResponse(message: string, messageId: string) {
     const response = await fetch('/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message }),
     })

     const reader = response.body?.getReader()
     const decoder = new TextDecoder()

     while (true) {
       const { done, value } = await reader!.read()
       if (done) break

       const chunk = decoder.decode(value)
       useChatStore.getState().streamResponse(messageId, chunk)
     }
   }
   ```

5. SUGGESTED QUERIES:
   ```typescript
   const suggestions = [
     {
       label: 'Search Properties',
       icon: Search,
       queries: [
         'Show me 3BHK apartments under ₹1 Crore',
         'Properties near Whitefield, Bangalore',
         'Luxury villas with pool',
       ],
     },
     {
       label: 'Calculate EMI',
       icon: Calculator,
       queries: [
         'Calculate EMI for ₹80 lakhs loan',
         'What is my loan eligibility?',
       ],
     },
     {
       label: 'Documents',
       icon: FileText,
       queries: [
         'Upload property documents',
         'Verify sale deed',
       ],
     },
   ]
   ```

6. VOICE INPUT (Optional):
   ```bash
   pnpm add react-speech-recognition
   ```

   ```typescript
   import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

   const VoiceInput = () => {
     const { transcript, listening, resetTranscript } = useSpeechRecognition()

     const handleVoiceInput = () => {
       if (listening) {
         SpeechRecognition.stopListening()
         onSend(transcript)
         resetTranscript()
       } else {
         SpeechRecognition.startListening()
       }
     }

     return (
       <button onClick={handleVoiceInput}>
         {listening ? <MicOff /> : <Mic />}
       </button>
     )
   }
   ```

7. MULTI-MODAL SUPPORT:
   - Image upload: For property inquiries
   - Document upload: For analysis
   - PDF rendering in chat
   - Video playback inline

8. CONTEXT AWARENESS:
   - Remember user's previous searches
   - Suggest based on current page (e.g., property details page → "Calculate EMI for this property")
   - Personalized suggestions based on user persona (Buyer, Investor, etc.)

9. TESTING:
   - Unit tests for all components
   - Test streaming logic
   - Test WebSocket connection/disconnection
   - Test error handling (network errors, API errors)
   - Test accessibility

ACCEPTANCE CRITERIA:
- [ ] Chat window opens/closes smoothly
- [ ] Messages sent and received
- [ ] Streaming responses working (token by token)
- [ ] Markdown rendering in messages
- [ ] Typing indicator shown during streaming
- [ ] Suggested queries clickable
- [ ] Voice input working (optional)
- [ ] Image/document upload working
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation, screen reader)
- [ ] Tests passing >= 80% coverage

DELIVERABLES:
1. ChatWindow, ChatMessage, ChatInput, TypingIndicator components
2. useChatStore (Zustand)
3. WebSocket/SSE integration
4. Suggested queries
5. Tests
6. Storybook stories
7. Git commit with tag: FE-002-complete

TESTING:
```bash
pnpm test organisms/ChatWidget --coverage
pnpm storybook
```

START IMPLEMENTATION.
```

---

# MOBILE PROMPTS

## [FE-004] React Native Mobile App (Android + iOS)

```
TASK: Build React Native mobile app with Expo, supporting Android and iOS from single codebase

CONTEXT:
- Cross-platform mobile app (Android first, then iOS same code)
- Expo for managed workflow
- Native features: Camera, Location, Push Notifications, Biometric Auth
- Offline-first with AsyncStorage
- Same design system adapted for React Native

TECH STACK:
- Expo SDK 50+
- React Native 0.73+
- TypeScript
- NativeWind (Tailwind for RN)
- React Query (data fetching)
- Zustand (state management)
- Expo Camera, Location, Notifications

PROJECT SETUP:
```bash
cd apps/
npx create-expo-app mobile --template tabs
cd mobile
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install @tanstack/react-query zustand
npx expo install expo-camera expo-location expo-notifications
npx expo install @react-native-async-storage/async-storage
npx expo install nativewind
```

REQUIREMENTS:

1. DIRECTORY STRUCTURE:
   ```
   apps/mobile/
   ├─ app/
   │  ├─ (tabs)/
   │  │  ├─ index.tsx (Home/Search)
   │  │  ├─ saved.tsx (Saved Properties)
   │  │  ├─ profile.tsx (User Profile)
   │  │  └─ _layout.tsx
   │  ├─ (auth)/
   │  │  ├─ login.tsx
   │  │  ├─ register.tsx
   │  │  └─ _layout.tsx
   │  ├─ property/[id].tsx (Property Details)
   │  └─ _layout.tsx (Root layout)
   ├─ components/
   │  ├─ PropertyCard.tsx
   │  ├─ SearchBar.tsx
   │  └─ ...
   ├─ hooks/
   │  ├─ useAuth.ts
   │  ├─ useProperties.ts
   │  └─ useLocation.ts
   ├─ stores/
   │  ├─ authStore.ts
   │  └─ searchStore.ts
   ├─ lib/
   │  ├─ api.ts
   │  └─ storage.ts
   ├─ assets/
   └─ app.json
   ```

2. NAVIGATION (Expo Router):
   - Tab navigation: Home, Saved, Profile
   - Stack navigation for details
   - Auth flow (redirect to login if not authenticated)

3. ADAPT DESIGN SYSTEM FOR REACT NATIVE:
   - Create packages/design-system-native/
   - Port components to RN:
     - Button → Pressable
     - Input → TextInput
     - Card → View with shadow
   - Use NativeWind for Tailwind-like styling

4. CORE SCREENS:

   A. Login Screen (app/(auth)/login.tsx):
      ```typescript
      import { View, TextInput, Pressable, Text } from 'react-native'
      import { useAuth } from '@/hooks/useAuth'

      export default function LoginScreen() {
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const { login, isLoading } = useAuth()

        const handleLogin = async () => {
          await login(email, password)
        }

        return (
          <View className="flex-1 justify-center p-4">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              className="border rounded p-3 mb-3"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="border rounded p-3 mb-3"
            />
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-blue-500 p-3 rounded"
            >
              <Text className="text-white text-center">
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </Pressable>
          </View>
        )
      }
      ```

   B. Property Search (app/(tabs)/index.tsx):
      - SearchBar with filters
      - FlatList of PropertyCard
      - Pull to refresh
      - Infinite scroll

   C. Property Details (app/property/[id].tsx):
      - Image carousel (react-native-reanimated-carousel)
      - Property info
      - Floor plan
      - Location map (react-native-maps)
      - CTA buttons: Call, WhatsApp, Book Site Visit

   D. Saved Properties (app/(tabs)/saved.tsx):
      - List of favorited properties
      - Remove from saved

   E. User Profile (app/(tabs)/profile.tsx):
      - User info
      - Settings
      - Logout

5. NATIVE FEATURES:

   A. Camera (for document scanning):
      ```typescript
      import { Camera, CameraType } from 'expo-camera'

      const DocumentScanner = () => {
        const [hasPermission, setHasPermission] = useState<boolean | null>(null)
        const cameraRef = useRef<Camera>(null)

        useEffect(() => {
          (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
          })()
        }, [])

        const takePicture = async () => {
          if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync()
            // Upload photo
          }
        }

        if (!hasPermission) return <Text>No camera permission</Text>

        return (
          <View className="flex-1">
            <Camera ref={cameraRef} type={CameraType.back} className="flex-1" />
            <Pressable onPress={takePicture}>
              <Text>Take Picture</Text>
            </Pressable>
          </View>
        )
      }
      ```

   B. Location Services:
      ```typescript
      import * as Location from 'expo-location'

      const useLocation = () => {
        const [location, setLocation] = useState<Location.LocationObject | null>(null)

        const getCurrentLocation = async () => {
          let { status } = await Location.requestForegroundPermissionsAsync()
          if (status !== 'granted') {
            Alert.alert('Permission denied')
            return
          }

          let loc = await Location.getCurrentPositionAsync({})
          setLocation(loc)
        }

        return { location, getCurrentLocation }
      }
      ```

   C. Push Notifications:
      ```typescript
      import * as Notifications from 'expo-notifications'

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      })

      const registerForPushNotifications = async () => {
        const { status } = await Notifications.requestPermissionsAsync()
        if (status !== 'granted') return

        const token = await Notifications.getExpoPushTokenAsync()
        // Send token to backend
      }
      ```

   D. Biometric Auth:
      ```typescript
      import * as LocalAuthentication from 'expo-local-authentication'

      const authenticateWithBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()

        if (!hasHardware || !isEnrolled) {
          Alert.alert('Biometric not available')
          return false
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate',
        })

        return result.success
      }
      ```

6. OFFLINE SUPPORT:
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage'

   // Cache API responses
   const cacheProperty = async (propertyId: string, data: any) => {
     await AsyncStorage.setItem(`property_${propertyId}`, JSON.stringify(data))
   }

   const getCachedProperty = async (propertyId: string) => {
     const data = await AsyncStorage.getItem(`property_${propertyId}`)
     return data ? JSON.parse(data) : null
   }

   // Offline queue for actions
   const queueAction = async (action: any) => {
     const queue = await AsyncStorage.getItem('action_queue')
     const actions = queue ? JSON.parse(queue) : []
     actions.push(action)
     await AsyncStorage.setItem('action_queue', JSON.stringify(actions))
   }

   // Sync when online
   const syncActions = async () => {
     const queue = await AsyncStorage.getItem('action_queue')
     if (!queue) return

     const actions = JSON.parse(queue)
     for (const action of actions) {
       // Send to API
     }
     await AsyncStorage.removeItem('action_queue')
   }
   ```

7. DEEP LINKING:
   ```json
   // app.json
   {
     "expo": {
       "scheme": "propmubi",
       "android": {
         "intentFilters": [
           {
             "action": "VIEW",
             "data": [
               {
                 "scheme": "https",
                 "host": "propmubi.com",
                 "pathPrefix": "/property"
               }
             ]
           }
         ]
       }
     }
   }
   ```

8. ANDROID BUILD:
   ```bash
   # Configure EAS
   npm install -g eas-cli
   eas login
   eas build:configure

   # Build APK
   eas build --platform android --profile preview

   # Build AAB (for Google Play)
   eas build --platform android --profile production
   ```

9. iOS BUILD (Same codebase):
   ```bash
   # Build simulator
   eas build --platform ios --profile preview

   # Build for TestFlight
   eas build --platform ios --profile production
   ```

10. TESTING:
    - Install Detox for E2E tests
    - Test on Android emulator and physical device
    - Test on iOS simulator and physical device
    - Test offline mode
    - Test permissions

ACCEPTANCE CRITERIA:
- [ ] All core screens implemented
- [ ] Authentication working
- [ ] Property search and details working
- [ ] Native features working (camera, location, push)
- [ ] Offline support working
- [ ] Deep linking working
- [ ] Android APK builds successfully
- [ ] iOS IPA builds successfully (same code)
- [ ] Performance: 60fps on mid-range devices
- [ ] Published to internal testing (Google Play Internal Testing, TestFlight)

DELIVERABLES:
1. Complete mobile app source code
2. EAS build configuration
3. app.json with all settings
4. README with setup instructions
5. Screenshots for app store
6. Git commit with tag: FE-004-complete

TESTING:
```bash
# Run on Android emulator
npx expo run:android

# Run on iOS simulator
npx expo run:ios

# Build
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

START IMPLEMENTATION. Build once, deploy to both Android and iOS.
```

---

# TESTING PROMPTS

## [TEST-001] Unit Test Suite

```
TASK: Write comprehensive unit tests for all backend services with >= 85% coverage

CONTEXT:
- Python services using pytest
- FastAPI applications
- Target: 85%+ overall coverage, 90%+ for critical paths (auth, payment, tax)
- Mock external dependencies
- Test both happy paths and error cases

TECH STACK:
- pytest 7.4+
- pytest-cov (coverage)
- pytest-asyncio (async tests)
- pytest-mock (mocking)
- httpx (for API testing)
- faker (test data generation)

REQUIREMENTS:

1. TEST STRUCTURE:
   ```
   tests/
   ├─ unit/
   │  ├─ test_api_gateway.py
   │  ├─ test_auth_service.py
   │  ├─ test_user_service.py
   │  ├─ test_property_service.py
   │  └─ ... (all services)
   ├─ integration/
   ├─ fixtures/
   │  ├─ database.py
   │  ├─ redis.py
   │  └─ users.py
   └─ conftest.py
   ```

2. FIXTURES (tests/conftest.py):
   ```python
   import pytest
   from fastapi.testclient import TestClient
   from sqlalchemy import create_engine
   from sqlalchemy.orm import sessionmaker

   @pytest.fixture
   def test_db():
       engine = create_engine("sqlite:///:memory:")
       Base.metadata.create_all(engine)
       TestingSessionLocal = sessionmaker(bind=engine)
       db = TestingSessionLocal()
       yield db
       db.close()

   @pytest.fixture
   def test_client():
       from src.main import app
       return TestClient(app)

   @pytest.fixture
   def mock_redis():
       return MagicMock()

   @pytest.fixture
   def test_user(test_db):
       user = User(email="test@example.com", full_name="Test User")
       test_db.add(user)
       test_db.commit()
       return user

   @pytest.fixture
   def auth_token(test_user):
       return create_access_token({"sub": str(test_user.id)})
   ```

3. TEST EXAMPLES:

   A. Test Auth Service (tests/unit/test_auth_service.py):
      ```python
      import pytest
      from src.services.auth_service import create_user, authenticate_user

      def test_create_user_success(test_db):
          user = create_user(
              test_db,
              email="new@example.com",
              password="SecurePass123!",
              full_name="New User"
          )

          assert user.id is not None
          assert user.email == "new@example.com"
          assert user.password_hash != "SecurePass123!"  # Should be hashed

      def test_create_user_duplicate_email(test_db, test_user):
          with pytest.raises(HTTPException) as exc:
              create_user(
                  test_db,
                  email=test_user.email,
                  password="Pass123!",
                  full_name="Duplicate"
              )

          assert exc.value.status_code == 400
          assert "already exists" in exc.value.detail

      def test_authenticate_user_success(test_db):
          # Create user
          user = create_user(test_db, "auth@example.com", "Pass123!", "Auth User")

          # Authenticate
          authenticated = authenticate_user(test_db, "auth@example.com", "Pass123!")

          assert authenticated is not None
          assert authenticated.id == user.id

      def test_authenticate_user_wrong_password(test_db, test_user):
          result = authenticate_user(test_db, test_user.email, "WrongPassword")
          assert result is None

      def test_authenticate_user_not_found(test_db):
          result = authenticate_user(test_db, "notfound@example.com", "Pass123!")
          assert result is None
      ```

   B. Test JWT Service (tests/unit/test_jwt_service.py):
      ```python
      import pytest
      from jose import jwt, JWTError
      from src.services.jwt_service import create_access_token, verify_token

      def test_create_access_token():
          data = {"sub": "user-123"}
          token = create_access_token(data)

          assert token is not None
          assert isinstance(token, str)

          # Decode and verify
          payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
          assert payload["sub"] == "user-123"
          assert "exp" in payload
          assert "iat" in payload

      def test_verify_token_valid():
          token = create_access_token({"sub": "user-123"})
          payload = verify_token(token)

          assert payload["sub"] == "user-123"

      def test_verify_token_expired():
          # Create token with past expiration
          expired_token = create_access_token({"sub": "user-123"}, expires_delta=timedelta(seconds=-1))

          with pytest.raises(HTTPException) as exc:
              verify_token(expired_token)

          assert exc.value.status_code == 401

      def test_verify_token_invalid_signature():
          token = "invalid.token.signature"

          with pytest.raises(HTTPException) as exc:
              verify_token(token)

          assert exc.value.status_code == 401
      ```

   C. Test API Endpoints (tests/unit/test_auth_routes.py):
      ```python
      import pytest

      def test_register_success(test_client):
          response = test_client.post(
              "/api/v1/auth/register",
              json={
                  "email": "newuser@example.com",
                  "password": "SecurePass123!",
                  "full_name": "New User"
              }
          )

          assert response.status_code == 201
          data = response.json()
          assert "user_id" in data
          assert data["email"] == "newuser@example.com"

      def test_register_invalid_email(test_client):
          response = test_client.post(
              "/api/v1/auth/register",
              json={
                  "email": "invalid-email",
                  "password": "Pass123!",
                  "full_name": "User"
              }
          )

          assert response.status_code == 422  # Validation error

      def test_login_success(test_client, test_user):
          response = test_client.post(
              "/api/v1/auth/login",
              json={
                  "email": test_user.email,
                  "password": "TestPassword123!"
              }
          )

          assert response.status_code == 200
          data = response.json()
          assert "access_token" in data
          assert "refresh_token" in data

      def test_login_wrong_password(test_client, test_user):
          response = test_client.post(
              "/api/v1/auth/login",
              json={
                  "email": test_user.email,
                  "password": "WrongPassword"
              }
          )

          assert response.status_code == 401

      def test_protected_route_with_valid_token(test_client, auth_token):
          response = test_client.get(
              "/api/v1/users/me",
              headers={"Authorization": f"Bearer {auth_token}"}
          )

          assert response.status_code == 200

      def test_protected_route_without_token(test_client):
          response = test_client.get("/api/v1/users/me")

          assert response.status_code == 401
      ```

4. COVERAGE REQUIREMENTS:
   - Overall: >= 85%
   - Critical paths (auth, payment, tax): >= 90%
   - New code: >= 90%

5. RUN TESTS:
   ```bash
   # All tests with coverage
   pytest tests/unit/ --cov=src --cov-report=html --cov-report=term-missing

   # Specific test file
   pytest tests/unit/test_auth_service.py -v

   # With coverage threshold
   pytest tests/unit/ --cov=src --cov-fail-under=85
   ```

6. TEST MATRIX:
   - For each service, test:
     - Happy path (success cases)
     - Error cases (validation errors, not found, etc.)
     - Edge cases (empty input, null values, etc.)
     - Security (SQL injection, XSS, etc.)

ACCEPTANCE CRITERIA:
- [ ] Unit tests for all services
- [ ] Overall coverage >= 85%
- [ ] Critical paths coverage >= 90%
- [ ] All tests passing
- [ ] No skipped tests
- [ ] Coverage report generated

DELIVERABLES:
1. Unit tests for all services
2. Fixtures in conftest.py
3. Coverage report (HTML)
4. Git commit with tag: TEST-001-complete

START IMPLEMENTATION. Write tests for all services, aiming for high coverage and comprehensive test cases.
```

---

## APPENDIX: PROMPT TEMPLATE

Use this template for tasks not covered above:

```
TASK: [Brief task description]

CONTEXT:
- [Why this task is important]
- [What it depends on]
- [What depends on it]

TECH STACK:
- [List all technologies used]

REQUIREMENTS:
1. [Requirement 1]
2. [Requirement 2]
3. ...

IMPLEMENTATION DETAILS:
[Step-by-step instructions]

ACCEPTANCE CRITERIA:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] ...

DELIVERABLES:
1. [Deliverable 1]
2. [Deliverable 2]
3. ...

TESTING:
```bash
# Test commands
```

START IMPLEMENTATION.
```

---

**END OF AI AGENT PROMPTS**

**Usage:** Copy relevant prompt, paste to your AI coding agent, and let it implement autonomously. Always review and test the output before committing.
