# PARALLEL AGENT ORCHESTRATION STRATEGY
## Multi-Agent Development with TDD, BDD, DDD & Clean Architecture

**Version:** 1.0
**Last Updated:** December 29, 2025
**Purpose:** Enable multiple AI coding agents (Cursor, Cline, Claude Code, Copilot, Kiro, etc.) to work in parallel on independent tasks with strict repository structure and Git integration

---

## TABLE OF CONTENTS

1. [Repository Structure Enforcement](#repository-structure-enforcement)
2. [Agent Assignment Matrix](#agent-assignment-matrix)
3. [Delta Context for Each Agent](#delta-context-for-each-agent)
4. [Git Workflow for Agents](#git-workflow-for-agents)
5. [TDD/BDD/DDD Guidelines](#tddbddddd-guidelines)
6. [Clean Architecture Layers](#clean-architecture-layers)
7. [Agent-Specific Prompts](#agent-specific-prompts)

---

## REPOSITORY STRUCTURE ENFORCEMENT

### CRITICAL RULE:
**Each agent MUST create files ONLY in their assigned directory. Violating this rule will cause merge conflicts and deployment failures.**

### Complete Repository Structure

```
propmubi/
├─ .github/
│  └─ workflows/                    [AGENT: DevOps-1]
│     ├─ ci-backend.yml
│     ├─ ci-frontend.yml
│     ├─ deploy-dev.yml
│     ├─ deploy-staging.yml
│     └─ deploy-prod.yml
│
├─ services/                        [AGENTS: Backend-1 to Backend-12]
│  ├─ api-gateway/                  [AGENT: Backend-1]
│  │  ├─ src/
│  │  │  ├─ domain/                 (DDD: Domain layer)
│  │  │  │  ├─ entities/
│  │  │  │  ├─ value_objects/
│  │  │  │  └─ aggregates/
│  │  │  ├─ application/            (DDD: Application layer)
│  │  │  │  ├─ use_cases/
│  │  │  │  └─ services/
│  │  │  ├─ infrastructure/         (DDD: Infrastructure layer)
│  │  │  │  ├─ repositories/
│  │  │  │  ├─ external_services/
│  │  │  │  └─ events/
│  │  │  ├─ interfaces/             (DDD: Interface/Presentation layer)
│  │  │  │  ├─ api/
│  │  │  │  │  ├─ routes/
│  │  │  │  │  ├─ middleware/
│  │  │  │  │  └─ schemas/
│  │  │  │  └─ cli/
│  │  │  ├─ config/
│  │  │  └─ main.py
│  │  ├─ tests/
│  │  │  ├─ unit/                   (TDD: Unit tests)
│  │  │  ├─ integration/            (TDD: Integration tests)
│  │  │  └─ features/               (BDD: Cucumber/Behave features)
│  │  │     ├─ authentication.feature
│  │  │     └─ steps/
│  │  ├─ migrations/                (Alembic migrations)
│  │  ├─ Dockerfile
│  │  ├─ pyproject.toml
│  │  └─ README.md
│  │
│  ├─ auth-service/                 [AGENT: Backend-2]
│  │  └─ (same structure as api-gateway)
│  │
│  ├─ user-service/                 [AGENT: Backend-3]
│  ├─ property-service/             [AGENT: Backend-4]
│  ├─ document-service/             [AGENT: Backend-5]
│  ├─ crm-service/                  [AGENT: Backend-6]
│  ├─ loan-service/                 [AGENT: Backend-7]
│  ├─ legal-service/                [AGENT: Backend-8]
│  ├─ tax-service/                  [AGENT: Backend-9]
│  ├─ inspection-service/           [AGENT: Backend-10]
│  ├─ property-mgmt-service/        [AGENT: Backend-11]
│  └─ investor-service/             [AGENT: Backend-12]
│
├─ services/ai-orchestration/       [AGENT: AI-1]
│  ├─ src/
│  │  ├─ domain/
│  │  │  ├─ agents/
│  │  │  └─ workflows/
│  │  ├─ application/
│  │  │  └─ llm_services/
│  │  ├─ infrastructure/
│  │  │  ├─ llm_providers/
│  │  │  ├─ vector_stores/
│  │  │  └─ mcp_server/
│  │  └─ interfaces/
│  │     └─ api/
│  └─ tests/
│
├─ services/integration/            [AGENTS: Integration-1 to Integration-4]
│  ├─ payment-service/              [AGENT: Integration-1]
│  ├─ communication-service/        [AGENT: Integration-2]
│  ├─ search-service/               [AGENT: Integration-3]
│  └─ analytics-service/            [AGENT: Integration-4]
│
├─ apps/web/                        [AGENT: Frontend-Web]
│  ├─ src/
│  │  ├─ app/                       (Next.js App Router)
│  │  │  ├─ (auth)/
│  │  │  ├─ (buyer)/
│  │  │  ├─ (investor)/
│  │  │  ├─ (builder)/
│  │  │  ├─ (agent)/
│  │  │  └─ api/
│  │  ├─ components/                (Presentation components)
│  │  ├─ lib/                       (Business logic)
│  │  │  ├─ domain/                 (Domain models)
│  │  │  ├─ application/            (Use cases)
│  │  │  ├─ infrastructure/         (API clients)
│  │  │  └─ utils/
│  │  ├─ hooks/                     (Custom hooks)
│  │  └─ stores/                    (State management)
│  ├─ tests/
│  │  ├─ unit/
│  │  ├─ integration/
│  │  └─ e2e/                       (Playwright)
│  ├─ public/
│  └─ package.json
│
├─ apps/mobile/                     [AGENT: Frontend-Mobile]
│  ├─ app/                          (Expo Router)
│  │  ├─ (tabs)/
│  │  ├─ (auth)/
│  │  └─ property/
│  ├─ components/
│  ├─ lib/
│  ├─ hooks/
│  ├─ stores/
│  ├─ tests/
│  └─ app.json
│
├─ packages/design-system/          [AGENT: Frontend-DesignSystem]
│  ├─ src/
│  │  ├─ atoms/
│  │  ├─ molecules/
│  │  ├─ organisms/
│  │  ├─ templates/
│  │  └─ tokens/
│  ├─ .storybook/
│  └─ tests/
│
├─ packages/design-system-native/   [AGENT: Frontend-DesignSystem]
│  ├─ src/
│  │  └─ (same atomic structure)
│  └─ tests/
│
├─ packages/domain/                 [AGENT: Shared-Domain]
│  ├─ src/
│  │  ├─ entities/
│  │  ├─ value_objects/
│  │  ├─ aggregates/
│  │  └─ interfaces/
│  └─ tests/
│
├─ common/                          [AGENT: Shared-Common]
│  ├─ events/
│  │  ├─ publisher.py
│  │  ├─ consumer.py
│  │  └─ schemas/
│  ├─ storage/
│  │  └─ s3_client.py
│  └─ utils/
│
├─ schemas/                         [AGENT: Shared-Schemas]
│  ├─ events/
│  ├─ Property/
│  └─ services/
│
├─ terraform/                       [AGENT: DevOps-2]
│  ├─ modules/
│  │  ├─ network/
│  │  ├─ compute/
│  │  ├─ database/
│  │  └─ storage/
│  └─ environments/
│     ├─ dev/
│     ├─ staging/
│     └─ prod/
│
├─ helm-charts/                     [AGENT: DevOps-3]
│  ├─ propmubi-base/
│  ├─ propmubi-microservices/
│  │  └─ values/
│  │     ├─ api-gateway-values.yaml
│  │     ├─ auth-service-values.yaml
│  │     └─ ...
│  └─ propmubi-infra/
│
├─ argocd/                          [AGENT: DevOps-4]
│  ├─ projects/
│  └─ applications/
│     ├─ dev/
│     ├─ staging/
│     └─ prod/
│
├─ tests/                           [AGENT: QA-1]
│  ├─ unit/
│  ├─ integration/
│  ├─ e2e/
│  ├─ performance/
│  └─ security/
│
├─ docs/                            [AGENT: Documentation]
│  ├─ architecture/
│  ├─ api/
│  └─ guides/
│
├─ scripts/                         [AGENT: Shared-Scripts]
│  ├─ setup-wsl.sh
│  ├─ init-databases.sql
│  └─ init-mongodb.js
│
├─ docker-compose.local.yml
├─ .gitignore
├─ README.md
└─ package.json (monorepo root)
```

---

## AGENT ASSIGNMENT MATRIX

### Backend Team (Microservices)

| Agent ID | Assigned Service | Directory | Tasks | Parallel Safe |
|----------|------------------|-----------|-------|---------------|
| **Backend-1** | API Gateway | `services/api-gateway/` | [SVC-001] | ✓ (Independent) |
| **Backend-2** | Auth Service | `services/auth-service/` | [SVC-002] | ⚠ (After Backend-1) |
| **Backend-3** | User Service | `services/user-service/` | [SVC-003] | ⚠ (After Backend-2) |
| **Backend-4** | Property Service | `services/property-service/` | [SVC-010] | ⚠ (After Backend-3) |
| **Backend-5** | Document Service | `services/document-service/` | [SVC-011] | ✓ (Parallel with CRM) |
| **Backend-6** | CRM Service | `services/crm-service/` | [SVC-012] | ✓ (Parallel with Doc) |
| **Backend-7** | Loan Service | `services/loan-service/` | [SVC-013] | ⚠ (After CRM) |
| **Backend-8** | Legal Service | `services/legal-service/` | [SVC-014] | ✓ (Parallel with Loan) |
| **Backend-9** | Tax Service | `services/tax-service/` | [SVC-015] | ✓ (Parallel with Legal) |
| **Backend-10** | Inspection Service | `services/inspection-service/` | [SVC-016] | ✓ (Parallel with Tax) |
| **Backend-11** | Property Mgmt Service | `services/property-mgmt-service/` | [SVC-017] | ⚠ (After Inspection) |
| **Backend-12** | Investor Service | `services/investor-service/` | [SVC-018] | ⚠ (After Property Mgmt) |

### AI/ML Team

| Agent ID | Assigned Service | Directory | Tasks | Parallel Safe |
|----------|------------------|-----------|-------|---------------|
| **AI-1** | AI Orchestration | `services/ai-orchestration/` | [AI-001] | ⚠ (After Backend-12) |
| **AI-2** | ML Model Service | `services/ml-model-service/` | [AI-002] | ⚠ (After AI-1) |
| **AI-3** | CV Service | `services/cv-service/` | [AI-003] | ⚠ (After AI-2) |

### Integration Team

| Agent ID | Assigned Service | Directory | Tasks | Parallel Safe |
|----------|------------------|-----------|-------|---------------|
| **Integration-1** | Payment Service | `services/payment-service/` | [INT-001] | ✓ (Independent) |
| **Integration-2** | Communication Service | `services/communication-service/` | [INT-002] | ✓ (Parallel with Payment) |
| **Integration-3** | Search Service | `services/search-service/` | [INT-003] | ✓ (Parallel with Comm) |
| **Integration-4** | Analytics Service | `services/analytics-service/` | [INT-004] | ✓ (Parallel with Search) |

### Frontend Team

| Agent ID | Assigned App | Directory | Tasks | Parallel Safe |
|----------|--------------|-----------|-------|---------------|
| **Frontend-DesignSystem** | Design System | `packages/design-system/`<br>`packages/design-system-native/` | [FE-001] | ✓ (Independent - HIGHEST PRIORITY) |
| **Frontend-Chatbot** | Chatbot Component | `packages/design-system/src/organisms/ChatWidget/` | [FE-002] | ⚠ (After DesignSystem) |
| **Frontend-Web** | Next.js Web App | `apps/web/` | [FE-003] | ⚠ (After DesignSystem) |
| **Frontend-Mobile** | React Native App | `apps/mobile/` | [FE-004] | ✓ (Parallel with Web, after DesignSystem) |
| **Frontend-Admin** | Admin Dashboard | `apps/admin/` | [FE-005] | ✓ (Parallel with Web/Mobile) |

### Shared/Infrastructure Team

| Agent ID | Assigned Area | Directory | Tasks | Parallel Safe |
|----------|---------------|-----------|-------|---------------|
| **Shared-Domain** | Domain Models | `packages/domain/` | Shared entities | ✓ (Independent - START FIRST) |
| **Shared-Common** | Common Libraries | `common/` | Event bus, storage | ✓ (Independent - START FIRST) |
| **Shared-Schemas** | Schema Registry | `schemas/` | Event schemas | ✓ (Independent - START FIRST) |
| **DevOps-1** | GitHub Actions | `.github/workflows/` | [INFRA-012] | ✓ (Independent) |
| **DevOps-2** | Terraform | `terraform/` | [INFRA-010] | ✓ (Independent) |
| **DevOps-3** | Helm Charts | `helm-charts/` | [INFRA-011] | ✓ (Independent) |
| **DevOps-4** | ArgoCD | `argocd/` | [INFRA-013] | ⚠ (After DevOps-1,2,3) |
| **QA-1** | Testing | `tests/` | [TEST-001 to TEST-005] | ⚠ (After services complete) |
| **Documentation** | Docs | `docs/` | All docs | ✓ (Continuous) |

---

## DELTA CONTEXT FOR EACH AGENT

### What is Delta Context?
**Delta Context** is the MINIMAL information each agent needs to work independently WITHOUT reading the entire codebase or depending on other agents' work.

### Template for Delta Context

```
AGENT: [Agent ID]
ASSIGNED: [Directory/Service]
TASK: [Task ID and Name]

DEPENDENCIES (READ-ONLY):
- [List of existing files/APIs this agent needs to know about but NOT modify]

YOUR EXCLUSIVE WRITE AREA:
- [Exact directory where this agent creates files]

INTERFACES TO IMPLEMENT:
- [APIs, schemas, or contracts this agent must follow]

INTERFACES TO PUBLISH:
- [APIs, schemas, or events this agent will expose for others]

STRICT CONSTRAINTS:
- DO NOT create files outside YOUR EXCLUSIVE WRITE AREA
- DO NOT modify files in dependencies
- FOLLOW repository structure exactly
- FOLLOW clean architecture layers (domain, application, infrastructure, interfaces)
- WRITE tests FIRST (TDD)
- WRITE BDD features for user-facing functionality
- USE DDD patterns for domain logic

GIT WORKFLOW:
1. Create branch: feature/[TASK-ID]-[service-name]
2. Create files in YOUR directory ONLY
3. Write tests FIRST
4. Implement code
5. Run tests (must pass)
6. Commit with message: "feat([TASK-ID]): [description]"
7. Push and create PR
8. Tag when merged: [TASK-ID]-complete

CONTEXT:
[Minimal context specific to this task]

START IMPLEMENTATION.
```

---

## DELTA CONTEXT EXAMPLES

### AGENT: Backend-1 (API Gateway)

```
AGENT: Backend-1
ASSIGNED: services/api-gateway/
TASK: [SVC-001] API Gateway Service

DEPENDENCIES (READ-ONLY):
- common/events/publisher.py (for publishing events - DO NOT MODIFY)
- schemas/events/user_events.py (for event schemas - DO NOT MODIFY)
- .env file (for configuration)

YOUR EXCLUSIVE WRITE AREA:
services/api-gateway/
├─ src/
│  ├─ domain/                       (Create domain entities here)
│  ├─ application/                  (Create use cases here)
│  │  └─ use_cases/
│  │     ├─ authenticate_request.py
│  │     └─ route_to_service.py
│  ├─ infrastructure/               (Create infrastructure here)
│  │  ├─ repositories/
│  │  │  └─ redis_session_repository.py
│  │  └─ external_services/
│  │     └─ downstream_service_client.py
│  └─ interfaces/                   (Create API routes here)
│     └─ api/
│        ├─ routes/
│        │  ├─ health.py
│        │  ├─ proxy.py
│        │  └─ metrics.py
│        ├─ middleware/
│        │  ├─ auth.py
│        │  └─ rate_limit.py
│        └─ schemas/
│           └─ gateway_schemas.py
├─ tests/
│  ├─ unit/
│  │  ├─ test_authenticate_request.py
│  │  └─ test_rate_limiter.py
│  ├─ integration/
│  │  └─ test_proxy_routing.py
│  └─ features/                     (BDD)
│     ├─ authentication.feature
│     └─ steps/
├─ Dockerfile
└─ pyproject.toml

INTERFACES TO IMPLEMENT:
None (API Gateway is the entry point)

INTERFACES TO PUBLISH:
1. HTTP API:
   - GET /health/live
   - GET /health/ready
   - GET /metrics
   - ALL /api/v1/{service}/{path} (proxy to downstream services)

2. Prometheus Metrics:
   - http_requests_total (Counter)
   - http_request_duration_seconds (Histogram)

SERVICE MAP (for proxy routing):
{
  "auth": "http://auth-service:8001",
  "users": "http://user-service:8002",
  "properties": "http://property-service:8003",
  "documents": "http://document-service:8004",
  "crm": "http://crm-service:8005"
}

STRICT CONSTRAINTS:
- DO NOT create files outside services/api-gateway/
- DO NOT modify common/ or schemas/
- MUST use DDD layers: domain, application, infrastructure, interfaces
- MUST write tests FIRST (TDD)
- MUST achieve >= 85% code coverage
- MUST follow clean architecture: dependencies point INWARD (interfaces → application → domain)

CLEAN ARCHITECTURE RULES:
1. Domain layer (innermost):
   - Pure business logic
   - No dependencies on external libraries
   - Example: domain/entities/authenticated_request.py

2. Application layer:
   - Use cases (orchestrate domain entities)
   - Depends ONLY on domain layer
   - Example: application/use_cases/authenticate_request.py

3. Infrastructure layer:
   - Implements interfaces defined in domain/application
   - External dependencies (Redis, HTTP clients)
   - Example: infrastructure/repositories/redis_session_repository.py

4. Interfaces layer (outermost):
   - API routes, middleware
   - Calls application use cases
   - Example: interfaces/api/routes/proxy.py calls application/use_cases/route_to_service.py

TDD WORKFLOW:
1. Write test FIRST:
   ```python
   # tests/unit/test_authenticate_request.py
   def test_authenticate_request_with_valid_token():
       # Arrange
       token = "valid-jwt-token"

       # Act
       result = authenticate_request(token)

       # Assert
       assert result.is_authenticated == True
   ```

2. Run test (should FAIL):
   ```bash
   pytest tests/unit/test_authenticate_request.py
   # Expected: FAIL (function doesn't exist yet)
   ```

3. Implement MINIMAL code to pass:
   ```python
   # src/application/use_cases/authenticate_request.py
   def authenticate_request(token: str) -> AuthenticationResult:
       # Minimal implementation
       ...
   ```

4. Run test again (should PASS):
   ```bash
   pytest tests/unit/test_authenticate_request.py
   # Expected: PASS
   ```

5. Refactor if needed, keeping tests green.

BDD EXAMPLE:
```gherkin
# tests/features/authentication.feature
Feature: API Gateway Authentication
  As an API consumer
  I want to authenticate my requests
  So that I can access protected resources

  Scenario: Valid JWT token
    Given I have a valid JWT token
    When I make a request to a protected endpoint
    Then the request should be forwarded to the downstream service

  Scenario: Invalid JWT token
    Given I have an invalid JWT token
    When I make a request to a protected endpoint
    Then I should receive a 401 Unauthorized response
```

```python
# tests/features/steps/authentication_steps.py
from behave import given, when, then

@given('I have a valid JWT token')
def step_impl(context):
    context.token = create_valid_token()

@when('I make a request to a protected endpoint')
def step_impl(context):
    context.response = client.get(
        '/api/v1/users/me',
        headers={'Authorization': f'Bearer {context.token}'}
    )

@then('the request should be forwarded to the downstream service')
def step_impl(context):
    assert context.response.status_code == 200
```

GIT WORKFLOW:
```bash
# 1. Create branch
git checkout -b feature/SVC-001-api-gateway

# 2. Create directory structure
mkdir -p services/api-gateway/{src/{domain,application,infrastructure,interfaces},tests/{unit,integration,features}}

# 3. Write tests FIRST (TDD)
# Create test files...

# 4. Implement code
# Create source files...

# 5. Run tests
cd services/api-gateway
pytest tests/ --cov=src --cov-report=term
# Must achieve >= 85% coverage

# 6. Commit
git add services/api-gateway/
git commit -m "feat(SVC-001): implement API gateway with auth and routing

- Add DDD layers: domain, application, infrastructure, interfaces
- Implement JWT authentication middleware
- Implement Redis-based rate limiting
- Implement service routing with httpx
- Add health and metrics endpoints
- Tests: 87% coverage (unit + integration)
- BDD features for authentication flows"

# 7. Push
git push origin feature/SVC-001-api-gateway

# 8. Create PR
gh pr create --title "feat(SVC-001): API Gateway Service" \
  --body "Implements API Gateway with authentication, rate limiting, and service routing.

## Changes
- DDD clean architecture
- TDD with 87% coverage
- BDD features for auth flows

## Testing
- Unit tests: 45 passed
- Integration tests: 12 passed
- BDD features: 3 scenarios passed

## Checklist
- [x] Tests written first (TDD)
- [x] Clean architecture followed
- [x] >= 85% coverage
- [x] All tests passing
- [x] Linting passed
- [x] Security scan passed
- [x] Documentation updated"

# 9. After merge, tag
git tag SVC-001-complete
git push origin SVC-001-complete
```

CONTEXT:
The API Gateway is the single entry point for all client requests. It:
1. Authenticates requests using JWT tokens
2. Rate limits requests using Redis
3. Routes requests to appropriate downstream microservices
4. Exposes Prometheus metrics

You are implementing this service with clean architecture and TDD. Start by creating the directory structure, then write tests first, then implement.

START IMPLEMENTATION.
```

---

### AGENT: Backend-2 (Auth Service)

```
AGENT: Backend-2
ASSIGNED: services/auth-service/
TASK: [SVC-002] Authentication Service

DEPENDENCIES (READ-ONLY):
- common/events/publisher.py (for publishing user.registered, user.logged_in events)
- schemas/events/user_events.py (event schemas - DO NOT MODIFY)
- API Gateway will route /api/v1/auth/* to this service

YOUR EXCLUSIVE WRITE AREA:
services/auth-service/
(Same DDD structure as api-gateway)

INTERFACES TO IMPLEMENT:
None (this service is called by API Gateway)

INTERFACES TO PUBLISH:
1. HTTP API (will be exposed via API Gateway):
   POST /register
   POST /login
   POST /logout
   POST /refresh
   POST /oauth/google
   POST /aadhaar/request-otp
   POST /aadhaar/verify-otp

2. Events to publish:
   - user.registered (when user registers)
   - user.logged_in (when user logs in)
   - user.logged_out (when user logs out)

3. Database Schema (PostgreSQL):
   Table: users
   Columns: id, email, phone, password_hash, full_name, is_email_verified, is_phone_verified, is_active, auth_provider, aadhaar_id, created_at, updated_at

STRICT CONSTRAINTS:
- DO NOT create files outside services/auth-service/
- MUST use bcrypt for password hashing (cost factor 12)
- MUST encrypt Aadhaar numbers at rest (AES-256)
- MUST publish events after registration, login, logout
- MUST achieve >= 90% code coverage (critical service)

CLEAN ARCHITECTURE:
1. Domain:
   - entities/user.py (User aggregate root)
   - value_objects/email.py, password.py, phone.py
   - repositories/user_repository.py (interface)

2. Application:
   - use_cases/register_user.py
   - use_cases/authenticate_user.py
   - use_cases/refresh_token.py
   - services/jwt_service.py
   - services/password_service.py

3. Infrastructure:
   - repositories/sqlalchemy_user_repository.py (implementation)
   - external_services/aadhaar_client.py
   - events/user_event_publisher.py

4. Interfaces:
   - api/routes/auth.py
   - api/routes/oauth.py
   - api/schemas/auth_schemas.py

TDD EXAMPLE:
```python
# tests/unit/test_register_user.py
def test_register_user_with_valid_data():
    # Arrange
    use_case = RegisterUser(user_repo, password_service, event_publisher)

    # Act
    result = use_case.execute(
        email="test@example.com",
        password="SecurePass123!",
        full_name="Test User"
    )

    # Assert
    assert result.user_id is not None
    assert result.email == "test@example.com"
    # Verify event published
    event_publisher.publish.assert_called_once_with("user.registered", ...)
```

BDD EXAMPLE:
```gherkin
# tests/features/user_registration.feature
Feature: User Registration
  As a new user
  I want to register an account
  So that I can access the platform

  Scenario: Successful registration with email
    Given I provide a valid email and password
    When I submit the registration form
    Then I should receive a user ID
    And a verification email should be sent
    And a "user.registered" event should be published

  Scenario: Registration with duplicate email
    Given an account already exists with "existing@example.com"
    When I try to register with "existing@example.com"
    Then I should receive a 400 Bad Request error
    And the error message should say "Email already registered"
```

GIT WORKFLOW: (Same as Backend-1)

CONTEXT:
The Auth Service handles all authentication and authorization. It supports multiple auth methods (email/password, OAuth, Aadhaar OTP). This is a CRITICAL service requiring high security and test coverage.

Wait for Backend-1 (API Gateway) to be deployed, then start implementation.

START IMPLEMENTATION.
```

---

### AGENT: Frontend-DesignSystem

```
AGENT: Frontend-DesignSystem
ASSIGNED: packages/design-system/ AND packages/design-system-native/
TASK: [FE-001] Design System & Atomic Components

DEPENDENCIES (READ-ONLY):
None (this is the foundation for all frontend work)

YOUR EXCLUSIVE WRITE AREA:
packages/design-system/
├─ src/
│  ├─ atoms/
│  │  ├─ Button/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Button.stories.tsx
│  │  │  ├─ Button.test.tsx
│  │  │  └─ index.ts
│  │  ├─ Input/
│  │  ├─ Badge/
│  │  └─ ... (all atomic components)
│  ├─ molecules/
│  ├─ organisms/
│  ├─ templates/
│  ├─ tokens/
│  │  ├─ colors.ts
│  │  ├─ typography.ts
│  │  └─ spacing.ts
│  └─ lib/
│     └─ utils.ts
├─ .storybook/
├─ tests/
└─ package.json

packages/design-system-native/
└─ (Same structure, but for React Native components)

INTERFACES TO IMPLEMENT:
None (this is the foundation)

INTERFACES TO PUBLISH:
1. Atomic Components (export from src/index.ts):
   - Button, Input, Label, Badge, Avatar, Spinner, Checkbox, Radio, Switch

2. Molecule Components:
   - SearchBar, FormField, Card, PropertyCard, Modal, Dropdown, Toast, Pagination

3. Organism Components:
   - Header, Footer, PropertyList, FilterPanel, ChatWidget, UserProfile

4. Template Components:
   - PageLayout, DashboardLayout, AuthLayout

5. Design Tokens:
   - colors, typography, spacing, shadows, breakpoints

STRICT CONSTRAINTS:
- DO NOT create files outside packages/design-system/ or packages/design-system-native/
- MUST follow atomic design methodology
- MUST use Tailwind CSS for styling
- MUST use Radix UI for accessible primitives
- MUST write Storybook stories for ALL components
- MUST achieve >= 80% test coverage
- MUST be WCAG 2.1 AA compliant (accessible)
- MUST be responsive (mobile-first)

ATOMIC DESIGN LAYERS:
1. Atoms: Basic building blocks (Button, Input, etc.)
   - No dependencies on other components
   - Highly reusable
   - Example: Button with variants (default, destructive, outline, ghost, link)

2. Molecules: Combinations of atoms (SearchBar = Input + Button + Icon)
   - Depend on atoms
   - Represent simple UI patterns
   - Example: FormField = Label + Input + Error message

3. Organisms: Complex components (Header = Logo + Nav + User Dropdown)
   - Depend on molecules and atoms
   - Represent sections of UI
   - Example: PropertyList = Grid of PropertyCard components

4. Templates: Page layouts (PageLayout = Header + Sidebar + Main + Footer)
   - Define page structure
   - No business logic
   - Example: DashboardLayout with sidebar navigation

TDD EXAMPLE:
```typescript
// tests/atoms/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/atoms/Button'

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
  })

  it('applies correct variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-500')
  })
})
```

STORYBOOK EXAMPLE:
```typescript
// src/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'default',
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

GIT WORKFLOW:
```bash
git checkout -b feature/FE-001-design-system

# Create directory structure
mkdir -p packages/design-system/src/{atoms,molecules,organisms,templates,tokens,lib}

# Write tests FIRST
# tests/atoms/Button.test.tsx

# Implement component
# src/atoms/Button/Button.tsx

# Create Storybook story
# src/atoms/Button/Button.stories.tsx

# Run tests
cd packages/design-system
pnpm test --coverage

# Run Storybook
pnpm storybook

# Commit
git add packages/design-system/
git commit -m "feat(FE-001): implement Button atom with variants

- Add Button component with 5 variants
- Add loading state with spinner
- Tests: 95% coverage
- Storybook story with all variants
- Accessible (ARIA labels, keyboard navigation)"

git push origin feature/FE-001-design-system
```

PRIORITY: HIGHEST (all frontend agents depend on this)

CONTEXT:
You are building the foundation design system for both web and mobile apps. Start with atoms (Button, Input, etc.), then molecules, then organisms, then templates. Use Tailwind CSS for web, NativeWind for mobile. All components must be accessible, responsive, and well-tested.

START IMPLEMENTATION NOW. Other frontend agents are waiting for you.
```

---

### AGENT: Shared-Common

```
AGENT: Shared-Common
ASSIGNED: common/
TASK: Shared Common Libraries (Event Bus, Storage Client)

DEPENDENCIES (READ-ONLY):
- schemas/events/*.py (event schemas - DO NOT MODIFY)

YOUR EXCLUSIVE WRITE AREA:
common/
├─ events/
│  ├─ __init__.py
│  ├─ publisher.py
│  ├─ consumer.py
│  ├─ dlq_handler.py
│  └─ README.md
├─ storage/
│  ├─ __init__.py
│  ├─ s3_client.py
│  └─ README.md
└─ utils/
   ├─ __init__.py
   └─ logger.py

INTERFACES TO IMPLEMENT:
None (this provides shared utilities)

INTERFACES TO PUBLISH:
1. EventPublisher class:
   ```python
   class EventPublisher:
       def __init__(self, redis_url: str)
       async def publish(self, stream_name: str, event: BaseEvent) -> str
       async def close(self)
   ```

2. EventConsumer class:
   ```python
   class EventConsumer:
       def __init__(self, redis_url: str, stream_name: str, group_name: str)
       async def consume(self) -> AsyncIterator[Event]
       async def ack(self, message_id: str)
       async def close()
   ```

3. S3Client class:
   ```python
   class S3Client:
       def __init__(self, endpoint: str, access_key: str, secret_key: str)
       async def upload_file(self, bucket: str, key: str, file: bytes) -> str
       async def download_file(self, bucket: str, key: str) -> bytes
       async def generate_presigned_url(self, bucket: str, key: str, expires: int) -> str
       async def delete_file(self, bucket: str, key: str) -> bool
       async def list_files(self, bucket: str, prefix: str) -> List[str]
   ```

STRICT CONSTRAINTS:
- DO NOT create files outside common/
- MUST write tests for all classes
- MUST achieve >= 90% code coverage
- MUST provide clear documentation

TDD EXAMPLE:
```python
# tests/test_event_publisher.py
import pytest
from common.events.publisher import EventPublisher
from schemas.events.property_events import PropertyCreatedEvent

@pytest.mark.asyncio
async def test_publish_event(redis_client):
    # Arrange
    publisher = EventPublisher(redis_url="redis://localhost:6379")
    event = PropertyCreatedEvent(data={"id": "prop-123"})

    # Act
    message_id = await publisher.publish("property.events", event)

    # Assert
    assert message_id is not None
    # Verify event in Redis
    events = await redis_client.xread({"property.events": "0"})
    assert len(events) == 1
```

GIT WORKFLOW:
```bash
git checkout -b feature/SHARED-common-libraries

# Write tests FIRST
# tests/test_event_publisher.py

# Implement
# common/events/publisher.py

# Commit
git commit -m "feat(SHARED): implement EventPublisher with DLQ support"

git push origin feature/SHARED-common-libraries
```

PRIORITY: HIGHEST (all backend agents depend on this)

CONTEXT:
You are building shared libraries that ALL microservices will use. Focus on Event Publisher/Consumer (Redis Streams) and S3 Storage Client. These must be rock-solid with excellent test coverage.

START IMPLEMENTATION NOW. Backend agents are waiting.
```

---

## GIT WORKFLOW FOR AGENTS

### Branch Naming Convention
```
feature/<TASK-ID>-<short-description>

Examples:
- feature/SVC-001-api-gateway
- feature/FE-001-design-system
- feature/INFRA-010-terraform-modules
```

### Commit Message Convention
```
<type>(<scope>): <subject>

<optional body>

<optional footer>

Types: feat, fix, docs, style, refactor, test, chore
Scope: TASK-ID (e.g., SVC-001, FE-001)

Examples:
feat(SVC-001): implement API gateway with rate limiting
fix(SVC-002): handle expired JWT tokens correctly
test(FE-001): add unit tests for Button component
docs(INFRA-010): add Terraform module documentation
```

### Pull Request Template
```markdown
## [TASK-ID] Task Name

### Changes
- [ ] Change 1
- [ ] Change 2

### Architecture
- Clean Architecture: ✓/✗
- TDD: ✓/✗ (X% coverage)
- BDD: ✓/✗ (X scenarios)
- DDD: ✓/✗

### Testing
- Unit tests: X passed
- Integration tests: X passed
- E2E tests: X passed (if applicable)
- Coverage: X%

### Checklist
- [ ] Tests written FIRST (TDD)
- [ ] Clean architecture layers followed
- [ ] >= 85% test coverage (or 90% for critical services)
- [ ] All tests passing
- [ ] Linting passed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] No files created outside assigned directory

### Screenshots (if UI changes)
[Add screenshots]
```

### Merge Strategy
- **Squash and merge** for feature branches
- Require 2 approvals for critical services (auth, payment, tax)
- Require 1 approval for other services
- All CI checks must pass

---

## TDD/BDD/DDD GUIDELINES

### Test-Driven Development (TDD)

#### Red-Green-Refactor Cycle
```
1. RED: Write a failing test
   - Write test for a feature that doesn't exist yet
   - Run test (it should FAIL)

2. GREEN: Write minimal code to pass
   - Implement just enough code to make test pass
   - Run test (it should PASS)

3. REFACTOR: Improve code quality
   - Refactor code while keeping tests green
   - Run tests (should still PASS)

4. REPEAT for next feature
```

#### Example TDD Workflow
```python
# Step 1: RED - Write failing test
def test_calculate_emi():
    loan_amount = 8000000  # ₹80 lakhs
    interest_rate = 8.5  # 8.5% per annum
    tenure_months = 240  # 20 years

    emi = calculate_emi(loan_amount, interest_rate, tenure_months)

    assert emi == 69229  # Expected EMI
    # Test will FAIL because calculate_emi() doesn't exist

# Step 2: GREEN - Implement minimal code
def calculate_emi(principal, rate, tenure):
    monthly_rate = rate / 12 / 100
    emi = principal * monthly_rate * (1 + monthly_rate)**tenure / ((1 + monthly_rate)**tenure - 1)
    return round(emi)
    # Test will PASS

# Step 3: REFACTOR - Improve code
def calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> int:
    """
    Calculate Equated Monthly Installment (EMI) for a loan.

    Args:
        principal: Loan amount in rupees
        annual_rate: Annual interest rate (e.g., 8.5 for 8.5%)
        tenure_months: Loan tenure in months

    Returns:
        Monthly EMI amount in rupees (rounded)
    """
    if principal <= 0 or annual_rate <= 0 or tenure_months <= 0:
        raise ValueError("All inputs must be positive")

    monthly_rate = annual_rate / 12 / 100
    emi = principal * monthly_rate * (1 + monthly_rate)**tenure_months / ((1 + monthly_rate)**tenure_months - 1)
    return round(emi)
    # Test still PASSES with improved code
```

### Behavior-Driven Development (BDD)

#### Gherkin Syntax
```gherkin
Feature: <Feature Name>
  As a <role>
  I want <feature>
  So that <benefit>

  Scenario: <Scenario Name>
    Given <precondition>
    And <another precondition>
    When <action>
    Then <expected outcome>
    And <another expected outcome>

  Scenario Outline: <Scenario with examples>
    Given <precondition with <placeholder>>
    When <action with <placeholder>>
    Then <outcome with <placeholder>>

    Examples:
      | placeholder1 | placeholder2 |
      | value1       | value2       |
```

#### Example BDD Feature
```gherkin
# tests/features/property_search.feature
Feature: Property Search
  As a buyer
  I want to search for properties
  So that I can find my dream home

  Scenario: Search by price range
    Given I am on the property search page
    When I set the minimum price to "₹50 lakhs"
    And I set the maximum price to "₹1 crore"
    And I click the "Search" button
    Then I should see properties priced between ₹50 lakhs and ₹1 crore
    And I should not see properties outside this price range

  Scenario Outline: Search by BHK configuration
    Given I am on the property search page
    When I select "<bhk>" configuration
    And I click the "Search" button
    Then I should see only "<bhk>" properties

    Examples:
      | bhk  |
      | 2BHK |
      | 3BHK |
      | 4BHK |
```

#### Step Definitions (Python with Behave)
```python
# tests/features/steps/property_search_steps.py
from behave import given, when, then

@given('I am on the property search page')
def step_impl(context):
    context.browser.get('/search')

@when('I set the minimum price to "{price}"')
def step_impl(context, price):
    context.browser.find_element_by_id('min-price').send_keys(price)

@when('I set the maximum price to "{price}"')
def step_impl(context, price):
    context.browser.find_element_by_id('max-price').send_keys(price)

@when('I click the "{button}" button')
def step_impl(context, button):
    context.browser.find_element_by_xpath(f"//button[text()='{button}']").click()

@then('I should see properties priced between {min_price} and {max_price}')
def step_impl(context, min_price, max_price):
    properties = context.browser.find_elements_by_class_name('property-card')
    for prop in properties:
        price = int(prop.find_element_by_class_name('price').text.replace('₹', '').replace(',', ''))
        assert min_price <= price <= max_price
```

### Domain-Driven Design (DDD)

#### DDD Layers
```
1. Domain Layer (Core Business Logic)
   - Entities: Objects with identity (User, Property, Loan)
   - Value Objects: Immutable objects without identity (Email, Money, Address)
   - Aggregates: Cluster of entities and value objects (PropertyListing aggregate)
   - Domain Services: Business logic that doesn't belong to a single entity
   - Repositories (Interface): Define how to retrieve aggregates

2. Application Layer (Use Cases)
   - Use Cases: Orchestrate domain objects to fulfill business requirements
   - Application Services: Coordinate use cases
   - DTOs: Data Transfer Objects for crossing boundaries

3. Infrastructure Layer (Technical Concerns)
   - Repositories (Implementation): Implement repository interfaces
   - External Services: API clients, email senders, etc.
   - Event Publishers/Consumers
   - Database adapters

4. Interface Layer (User-Facing)
   - API Controllers/Routes
   - Request/Response schemas
   - Middleware
   - CLI commands
```

#### Example DDD Implementation
```python
# Domain Layer
# src/domain/entities/property.py
from dataclasses import dataclass
from typing import List
from uuid import UUID
from .value_objects import Money, Address, Area

@dataclass
class Property:
    """Property Aggregate Root"""
    id: UUID
    name: str
    address: Address
    price: Money
    area: Area
    bhk_config: str  # "2BHK", "3BHK", etc.
    amenities: List[str]
    status: str  # "available", "sold", "under_construction"

    def is_available(self) -> bool:
        return self.status == "available"

    def update_price(self, new_price: Money):
        if new_price.amount <= 0:
            raise ValueError("Price must be positive")
        self.price = new_price

# src/domain/value_objects/money.py
@dataclass(frozen=True)
class Money:
    """Value Object for monetary amounts"""
    amount: float
    currency: str = "INR"

    def __post_init__(self):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")

    def __add__(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)

# src/domain/repositories/property_repository.py (Interface)
from abc import ABC, abstractmethod

class PropertyRepository(ABC):
    @abstractmethod
    async def find_by_id(self, property_id: UUID) -> Optional[Property]:
        pass

    @abstractmethod
    async def save(self, property: Property) -> Property:
        pass

    @abstractmethod
    async def find_by_price_range(self, min_price: Money, max_price: Money) -> List[Property]:
        pass

# Application Layer
# src/application/use_cases/search_properties.py
from dataclasses import dataclass

@dataclass
class SearchPropertiesInput:
    min_price: float
    max_price: float
    bhk_config: Optional[str]
    location: Optional[str]

@dataclass
class SearchPropertiesOutput:
    properties: List[Property]
    total_count: int

class SearchPropertiesUseCase:
    def __init__(self, property_repo: PropertyRepository):
        self.property_repo = property_repo

    async def execute(self, input: SearchPropertiesInput) -> SearchPropertiesOutput:
        # Convert input to domain value objects
        min_price = Money(input.min_price)
        max_price = Money(input.max_price)

        # Use repository to find properties
        properties = await self.property_repo.find_by_price_range(min_price, max_price)

        # Filter by BHK if specified
        if input.bhk_config:
            properties = [p for p in properties if p.bhk_config == input.bhk_config]

        return SearchPropertiesOutput(
            properties=properties,
            total_count=len(properties)
        )

# Infrastructure Layer
# src/infrastructure/repositories/sqlalchemy_property_repository.py
class SQLAlchemyPropertyRepository(PropertyRepository):
    def __init__(self, session: Session):
        self.session = session

    async def find_by_id(self, property_id: UUID) -> Optional[Property]:
        # Map ORM model to domain entity
        orm_property = self.session.query(PropertyModel).filter_by(id=property_id).first()
        if not orm_property:
            return None
        return self._to_domain(orm_property)

    async def save(self, property: Property) -> Property:
        # Map domain entity to ORM model
        orm_property = self._to_orm(property)
        self.session.add(orm_property)
        self.session.commit()
        return property

    def _to_domain(self, orm_property: PropertyModel) -> Property:
        return Property(
            id=orm_property.id,
            name=orm_property.name,
            address=Address(orm_property.address_line, orm_property.city),
            price=Money(orm_property.price_amount),
            # ... map all fields
        )

# Interface Layer
# src/interfaces/api/routes/properties.py
from fastapi import APIRouter, Depends

router = APIRouter()

@router.post("/search")
async def search_properties(
    request: SearchPropertiesRequest,
    use_case: SearchPropertiesUseCase = Depends(get_search_use_case)
):
    # Convert API request to use case input
    input = SearchPropertiesInput(
        min_price=request.min_price,
        max_price=request.max_price,
        bhk_config=request.bhk_config,
        location=request.location
    )

    # Execute use case
    output = await use_case.execute(input)

    # Convert use case output to API response
    return SearchPropertiesResponse(
        properties=[PropertyDTO.from_entity(p) for p in output.properties],
        total_count=output.total_count
    )
```

---

## AGENT-SPECIFIC PROMPTS

### Starting Agent: Shared-Domain

```
AGENT: Shared-Domain
PRIORITY: START FIRST (all other agents depend on this)

TASK: Define shared domain models and interfaces

YOUR EXCLUSIVE WRITE AREA:
packages/domain/
├─ src/
│  ├─ entities/
│  │  ├─ user.py
│  │  ├─ property.py
│  │  ├─ transaction.py
│  │  └─ ...
│  ├─ value_objects/
│  │  ├─ email.py
│  │  ├─ money.py
│  │  ├─ address.py
│  │  └─ ...
│  ├─ aggregates/
│  │  └─ property_listing.py
│  └─ interfaces/
│     └─ repositories/
│        ├─ user_repository.py
│        ├─ property_repository.py
│        └─ ...
└─ tests/

STRICT CONSTRAINTS:
- Pure domain logic ONLY (no external dependencies)
- Use dataclasses or Pydantic models
- Immutable value objects (frozen=True)
- Clear aggregate boundaries
- Repository interfaces (no implementations)

DELIVERABLES:
1. All domain entities
2. All value objects
3. Repository interfaces
4. Unit tests (>= 90% coverage)

START IMPLEMENTATION NOW.
```

---

**END OF PARALLEL AGENT ORCHESTRATION STRATEGY**

**Next Steps:**
1. Assign agents to tasks based on Agent Assignment Matrix
2. Give each agent their specific Delta Context prompt
3. Agents work in parallel, creating files ONLY in their assigned directories
4. Use Git workflow for integration
5. Review PRs and merge
6. Progress tracked in IMPLEMENTATION_PROGRESS_TRACKER.md
