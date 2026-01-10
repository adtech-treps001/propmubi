# 📋 IMPLEMENTATION INDEX - PropMubi Real Estate Platform

**Master Document: Complete Roadmap from Documentation to Implementation**

---

## 🎯 Purpose of This Document

This is the **MASTER INDEX** that connects all documentation and provides agents with a **linear path** from understanding requirements to completing implementation **without hallucinations**.

> **Golden Rule**: If it's not documented here, it doesn't exist. Don't guess, don't assume, don't hallucinate.

---

## 📚 Documentation Hierarchy (Read in This Order)

### Phase 1: Understanding (Read First)

```
00-START-HERE/README.md
   ↓
01-PRODUCT/PRD.md
   ↓
02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
   ↓
02-ARCHITECTURE/DATA_ARCHITECTURE.md (Backend Agents)
   ↓
03-DESIGN/UI_DESIGN_SYSTEM.md (Frontend Agents)
```

**Purpose**: Understand WHAT we're building, WHY, and FOR WHOM.

**Time Required**: 2-3 hours
**Mandatory For**: ALL agents before writing code

---

### Phase 2: Implementation Details (Reference Continuously)

```
04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
   ├─→ Setup instructions
   ├─→ Development workflows
   ├─→ Testing strategies
   └─→ Troubleshooting

04-IMPLEMENTATION/API_OVERVIEW.md
   ├─→ All API endpoints
   ├─→ Request/response formats
   ├─→ Authentication flows
   └─→ Error handling

04-IMPLEMENTATION/SERVICE_CATALOG.md
   ├─→ All 12 microservices
   ├─→ Database schemas
   ├─→ Technology stacks
   └─→ Configuration examples
```

**Purpose**: HOW to implement features with exact specifications.

**Time Required**: Keep open while coding
**Mandatory For**: ALL agents during implementation

---

### Phase 3: Standards & Quality (Enforce Always)

```
09-STANDARDS/CODING_STANDARDS.md
   ├─→ TypeScript/Python style
   ├─→ Naming conventions
   └─→ Best practices

09-STANDARDS/GIT_WORKFLOW.md
   ├─→ Branch strategy
   ├─→ Commit messages
   └─→ PR templates

05-TESTING/TEST_STRATEGY.md
   ├─→ TDD workflow
   ├─→ Coverage requirements
   └─→ Test patterns
```

**Purpose**: ENSURE code quality, consistency, and maintainability.

**Time Required**: Review before each commit
**Mandatory For**: ALL agents for every task

---

## 🗺️ Complete Documentation Map

### 00-START-HERE

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| [README.md](00-START-HERE/README.md) | Entry point, rules, quick start | ALL agents | ✅ Complete |

**When to Read**: FIRST, before anything else
**What You Learn**: Project overview, agent rules, documentation structure

---

### 01-PRODUCT

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| PRD.md | Product requirements, features, user stories | ALL agents | ✅ Complete |
| FEATURES.md | Complete feature list with acceptance criteria | ALL agents | 🚧 Pending |
| USER_STORIES.md | User stories and journeys | Frontend, Product | 🚧 Pending |

**When to Read**: After 00-START-HERE, before coding
**What You Learn**: WHAT we're building and WHY

**Key Sections in PRD.md**:
- Trust OS concept (canonical system of truth)
- Core features (property listing, AI search, digital twin)
- User types (buyer, seller, agent, builder)
- Revenue model (subscription + services)

---

### 02-ARCHITECTURE

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| SYSTEM_ARCHITECTURE.md | High-level system design | ALL agents | ✅ Complete |
| DATA_ARCHITECTURE.md | Database schemas, PostGIS | Backend agents | 🚧 Pending |
| API_ARCHITECTURE.md | API design patterns | Backend agents | 🚧 Pending |
| INFRASTRUCTURE.md | Cloud, K8s, Docker | DevOps agents | 🚧 Pending |

**When to Read**: After 01-PRODUCT, before implementation
**What You Learn**: HOW the system is structured

**Key Sections in SYSTEM_ARCHITECTURE.md**:
- Monorepo structure
- Microservices architecture (12 services)
- Data architecture (PostgreSQL + PostGIS)
- Event-driven architecture (Redis Streams)

---

### 03-DESIGN

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| UI_DESIGN_SYSTEM.md | Design tokens, colors, typography | Frontend agents | 🚧 Pending |
| COMPONENT_LIBRARY.md | Reusable components | Frontend agents | 🚧 Pending |
| SCREENS.md | Screen-by-screen designs | Frontend agents | 🚧 Pending |
| UX_FLOWS.md | User journey flows | Frontend agents | 🚧 Pending |
| 3D_VISUALIZATION.md | Digital twin, 3D specs | Digital Twin agent | 🚧 Pending |

**When to Read**: Frontend agents before building UI
**What You Learn**: HOW it should look and feel

---

### 04-IMPLEMENTATION

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| [DEVELOPMENT_GUIDE.md](04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md) | ⭐ Setup, workflows, testing | ALL agents | ✅ Complete |
| [API_OVERVIEW.md](04-IMPLEMENTATION/API_OVERVIEW.md) | ⭐ Complete API docs | Backend agents | ✅ Complete |
| [SERVICE_CATALOG.md](04-IMPLEMENTATION/SERVICE_CATALOG.md) | ⭐ All microservices | Backend agents | ✅ Complete |
| DEPLOYMENT_GUIDE.md | Deployment procedures | DevOps agents | 🚧 Pending |
| MONOREPO_GUIDE.md | Monorepo management | ALL agents | 🚧 Pending |

**When to Read**: CONTINUOUSLY during implementation
**What You Learn**: EXACT steps to implement features

**Critical Sections**:

**DEVELOPMENT_GUIDE.md**:
- Quick start (5 minutes)
- Monorepo structure
- Frontend development (React + Vite)
- Backend development (FastAPI)
- Database management (PostgreSQL + PostGIS)
- Docker services
- Testing strategies
- Debugging
- Troubleshooting

**API_OVERVIEW.md**:
- API architecture
- Authentication (JWT + OAuth 2.1)
- **9 Core Services with ALL endpoints**:
  1. Auth Service (Port 3001)
  2. Property Service (Port 3002)
  3. User Service (Port 3003)
  4. Document Service (Port 3004)
  5. Payment Service (Port 3005)
  6. Loan Service (Port 3006)
  7. CRM Service (Port 3007)
  8. Notification Service (Port 3008)
  9. AI Orchestrator (Port 3009)
- Request/response patterns
- Error handling
- Rate limiting

**SERVICE_CATALOG.md**:
- **All 12 microservices** with:
  - Responsibilities
  - Key features
  - Technology stack
  - Database schemas (copy-paste ready)
  - Configuration examples
  - Health checks
- Infrastructure services
- Service dependencies

---

### 05-TESTING

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| TEST_STRATEGY.md | Testing approach, TDD | ALL agents | 🚧 Pending |
| TEST_CASES.md | Specific test scenarios | ALL agents | 🚧 Pending |
| E2E_TESTS.md | End-to-end flows | QA agents | 🚧 Pending |

**When to Read**: Before writing ANY code
**What You Learn**: HOW to test (TDD mandatory)

---

### 06-AGENTS

| Directory | Purpose | Audience | Status |
|-----------|---------|----------|--------|
| AGENT-MOB/ | Mobile app tasks | Mobile agent | 🚧 Pending |
| AGENT-WEB/ | Web app tasks | Web agent | 🚧 Pending |
| AGENT-BE/ | Backend services tasks | Backend agent | 🚧 Pending |
| AGENT-DT/ | Digital Twin tasks | Digital Twin agent | 🚧 Pending |
| AGENT-AI/ | AI/ML tasks | AI/ML agent | 🚧 Pending |
| AGENT-INFRA/ | Infrastructure tasks | DevOps agent | 🚧 Pending |

**When to Read**: YOUR agent directory for YOUR tasks
**What You Learn**: EXACT tasks with step-by-step instructions

**Each Agent Directory Contains**:
- `TASKS.md` - Prioritized task list
- `CONTEXT.md` - Agent-specific context
- `CHECKLIST.md` - Task completion checklist
- `EXAMPLES.md` - Code examples

---

### 09-STANDARDS

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| CODING_STANDARDS.md | Code style, conventions | ALL agents | 🚧 Pending |
| GIT_WORKFLOW.md | Branch strategy, commits | ALL agents | 🚧 Pending |
| API_STANDARDS.md | API design standards | Backend agents | 🚧 Pending |
| DATABASE_STANDARDS.md | DB naming conventions | Backend agents | 🚧 Pending |
| SECURITY_STANDARDS.md | Security best practices | ALL agents | 🚧 Pending |

**When to Read**: Before coding, reference continuously
**What You Learn**: HOW to write consistent, quality code

---

## 🔥 Critical Implementation Documents (Must Read)

### For ALL Agents

1. **[00-START-HERE/README.md](00-START-HERE/README.md)** ✅
   - **Why Critical**: Entry point, agent rules, no-hallucination policy
   - **Read When**: FIRST, before anything
   - **Time**: 30 minutes

2. **[04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md](04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md)** ✅
   - **Why Critical**: Setup, workflows, testing, troubleshooting
   - **Read When**: Before coding, keep open while coding
   - **Time**: 1 hour initial, reference continuously

---

### For Backend Agents (AGENT-BE)

3. **[04-IMPLEMENTATION/API_OVERVIEW.md](04-IMPLEMENTATION/API_OVERVIEW.md)** ✅
   - **Why Critical**: ALL API endpoints with exact request/response formats
   - **Read When**: Before implementing any endpoint
   - **Time**: 2 hours initial, reference continuously
   - **What to Copy**: Endpoint paths, request bodies, response structures

4. **[04-IMPLEMENTATION/SERVICE_CATALOG.md](04-IMPLEMENTATION/SERVICE_CATALOG.md)** ✅
   - **Why Critical**: Database schemas, service configs, tech stacks
   - **Read When**: Before implementing any service
   - **Time**: 2 hours initial, reference continuously
   - **What to Copy**: SQL schemas, configuration YAMLs, code examples

---

### For Frontend Agents (AGENT-MOB, AGENT-WEB)

5. **03-DESIGN/UI_DESIGN_SYSTEM.md** 🚧
   - **Why Critical**: Design tokens, component specs, style guidelines
   - **Read When**: Before building any UI component
   - **Time**: 1 hour

6. **[04-IMPLEMENTATION/API_OVERVIEW.md](04-IMPLEMENTATION/API_OVERVIEW.md)** ✅
   - **Why Critical**: API endpoints for frontend integration
   - **Read When**: Before calling any API
   - **Time**: 1 hour

---

## 🎯 Agent-Specific Roadmaps

### Mobile App Agent (AGENT-MOB)

**Reading Order**:
```
1. 00-START-HERE/README.md
2. 01-PRODUCT/PRD.md
3. 02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
4. 03-DESIGN/UI_DESIGN_SYSTEM.md
5. 04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
6. 04-IMPLEMENTATION/API_OVERVIEW.md
7. 06-AGENTS/AGENT-MOB/TASKS.md
```

**Implementation Steps**:
1. Setup React Native + Expo environment
2. Configure API client with base URL
3. Implement authentication flow (JWT)
4. Build reusable UI components
5. Implement screens (Home, Search, Property Detail, etc.)
6. Integrate with backend APIs
7. Add offline support (React Query cache)
8. Implement push notifications
9. Test on iOS + Android
10. Build and deploy

**Tech Stack**:
- React Native + Expo
- TypeScript
- NativeWind (Tailwind CSS)
- React Navigation
- React Query
- Zustand
- Expo SDK (Camera, Location, etc.)

---

### Web App Agent (AGENT-WEB)

**Reading Order**:
```
1. 00-START-HERE/README.md
2. 01-PRODUCT/PRD.md
3. 02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
4. 03-DESIGN/UI_DESIGN_SYSTEM.md
5. 04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
6. 04-IMPLEMENTATION/API_OVERVIEW.md
7. 06-AGENTS/AGENT-WEB/TASKS.md
```

**Implementation Steps**:
1. Setup React + Vite environment
2. Configure API client with axios
3. Implement authentication flow (JWT)
4. Build reusable UI components
5. Implement pages (Home, Search, Property Detail, etc.)
6. Integrate with backend APIs
7. Add SEO optimization
8. Implement analytics
9. Test across browsers
10. Build and deploy

**Tech Stack**:
- React 18 + Vite
- TypeScript
- Vanilla CSS (Glassmorphism)
- React Router
- React Query
- Zustand

---

### Backend Agent (AGENT-BE)

**Reading Order**:
```
1. 00-START-HERE/README.md
2. 01-PRODUCT/PRD.md
3. 02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
4. 02-ARCHITECTURE/DATA_ARCHITECTURE.md
5. 04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
6. 04-IMPLEMENTATION/API_OVERVIEW.md ⭐⭐⭐
7. 04-IMPLEMENTATION/SERVICE_CATALOG.md ⭐⭐⭐
8. 06-AGENTS/AGENT-BE/TASKS.md
```

**Implementation Steps (Per Service)**:

**Example: Auth Service (Port 3001)**

1. **Read Documentation**:
   - API_OVERVIEW.md → Auth Service section
   - SERVICE_CATALOG.md → Auth Service section

2. **Copy Exact Database Schema**:
   ```sql
   -- From SERVICE_CATALOG.md
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     full_name VARCHAR(255),
     phone VARCHAR(20),
     user_type VARCHAR(50),
     is_active BOOLEAN DEFAULT true,
     is_verified BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Write Tests FIRST (TDD)**:
   ```python
   # tests/test_auth.py
   def test_register_user():
       response = client.post("/api/v1/auth/register", json={
           "email": "test@example.com",
           "password": "SecurePass123!",
           "full_name": "Test User",
           "phone": "+919876543210",
           "user_type": "buyer"
       })
       assert response.status_code == 201
       assert "access_token" in response.json()
   ```

4. **Implement Endpoint (Copy from API_OVERVIEW.md)**:
   ```python
   @app.post("/api/v1/auth/register")
   async def register(user: UserCreate):
       # Implementation
       pass
   ```

5. **Run Tests**:
   ```bash
   pytest tests/ --cov=src
   ```

6. **Repeat for All Endpoints**

**Tech Stack**:
- FastAPI (Python 3.11)
- SQLAlchemy + Alembic
- PostgreSQL + PostGIS
- Redis
- PyJWT
- Passlib

---

### Digital Twin Agent (AGENT-DT)

**Reading Order**:
```
1. 00-START-HERE/README.md
2. 01-PRODUCT/PRD.md (Digital Twin section)
3. 02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md
4. 03-DESIGN/3D_VISUALIZATION.md
5. 04-IMPLEMENTATION/DEVELOPMENT_GUIDE.md
6. 04-IMPLEMENTATION/SERVICE_CATALOG.md (Digital Twin Service)
7. 06-AGENTS/AGENT-DT/TASKS.md
```

**Implementation Steps**:
1. Setup Three.js + React Three Fiber
2. Implement GLTF model loading
3. Build Gate-to-Key Navigator
4. Build Sunlight Simulator
5. Build Balcony View 360
6. Implement X-Ray mode
7. Add AR support (React Native)
8. Optimize performance
9. Test on web + mobile
10. Deploy 3D assets to CDN

**Tech Stack**:
- Three.js
- React Three Fiber (Web)
- Unity (React Native modules)
- GLTF/GLB models

---

### AI/ML Agent (AGENT-AI)

**Reading Order**:
```
1. 00-START-HERE/README.md
2. 01-PRODUCT/PRD.md (AI features)
3. 02-ARCHITECTURE/SYSTEM_ARCHITECTURE.md (AI Orchestrator)
4. 04-IMPLEMENTATION/SERVICE_CATALOG.md (AI Orchestrator)
5. 06-AGENTS/AGENT-AI/TASKS.md
```

**Implementation Steps**:
1. Setup LangGraph agent framework
2. Implement LiteLLM router
3. Build property search agent
4. Build chatbot agent
5. Implement RAG (Retrieval Augmented Generation)
6. Add vector database (Qdrant)
7. Implement conversation memory
8. Add guardrails (no hallucinations)
9. Test with different LLMs
10. Deploy with API

**Tech Stack**:
- LangChain + LangGraph
- LiteLLM (GPT-4, Claude, Ollama)
- Qdrant (Vector DB)
- FastAPI

---

### Infrastructure Agent (AGENT-INFRA)

**Reading Order**:
```
1. 00-START-HERE/README.md
2. 02-ARCHITECTURE/INFRASTRUCTURE.md
3. 04-IMPLEMENTATION/DEPLOYMENT_GUIDE.md
4. 06-AGENTS/AGENT-INFRA/TASKS.md
```

**Implementation Steps**:
1. Setup Terraform for AWS/GCP
2. Create Kubernetes manifests
3. Configure Docker images
4. Setup CI/CD (GitHub Actions)
5. Configure monitoring (Prometheus + Grafana)
6. Setup logging (Loki + Promtail)
7. Configure secrets (Vault)
8. Setup autoscaling
9. Configure backups
10. Deploy to staging/production

**Tech Stack**:
- Terraform
- Kubernetes (EKS/GKE)
- Docker
- GitHub Actions
- Prometheus + Grafana
- Loki + Promtail
- Jaeger

---

## 🚫 Anti-Hallucination Checklist

### Before Writing ANY Code

- [ ] I have read ALL assigned documentation
- [ ] I know the EXACT endpoint from API_OVERVIEW.md
- [ ] I have the EXACT database schema from SERVICE_CATALOG.md
- [ ] I have written a FAILING test first
- [ ] I know which directory I'm allowed to write in
- [ ] I have the environment variables I need

### While Writing Code

- [ ] I am copying schemas/endpoints from docs (not inventing)
- [ ] I am staying in my assigned directory
- [ ] I am following coding standards
- [ ] I am handling all error cases
- [ ] I am adding logs for debugging
- [ ] I am testing as I go

### Before Committing

- [ ] All tests pass (≥85% coverage)
- [ ] Code matches documentation exactly
- [ ] No hardcoded values
- [ ] Error handling implemented
- [ ] Logs added
- [ ] Documentation updated if needed

---

## 📊 Progress Tracking

### Documentation Status

| Section | Complete | In Progress | Pending |
|---------|----------|-------------|---------|
| 00-START-HERE | 100% (1/1) | - | - |
| 01-PRODUCT | 33% (1/3) | - | 2 |
| 02-ARCHITECTURE | 25% (1/4) | - | 3 |
| 03-DESIGN | 0% (0/5) | - | 5 |
| 04-IMPLEMENTATION | 60% (3/5) | - | 2 |
| 05-TESTING | 0% (0/3) | - | 3 |
| 06-AGENTS | 0% (0/6) | - | 6 |
| 09-STANDARDS | 0% (0/5) | - | 5 |

**Overall**: 24% complete (6/25 documents)

---

### Implementation Status

| Component | Status | Agent | Priority |
|-----------|--------|-------|----------|
| Web App Frontend | 🟢 Operational | AGENT-WEB | P0 |
| Mobile App | 🔴 Not Started | AGENT-MOB | P1 |
| Auth Service | 🔴 Not Started | AGENT-BE | P0 |
| Property Service | 🔴 Not Started | AGENT-BE | P0 |
| User Service | 🔴 Not Started | AGENT-BE | P1 |
| Document Service | 🔴 Not Started | AGENT-BE | P1 |
| Payment Service | 🔴 Not Started | AGENT-BE | P1 |
| Loan Service | 🔴 Not Started | AGENT-BE | P2 |
| CRM Service | 🔴 Not Started | AGENT-BE | P2 |
| Notification Service | 🔴 Not Started | AGENT-BE | P1 |
| AI Orchestrator | 🔴 Not Started | AGENT-AI | P1 |
| Integration Service | 🔴 Not Started | AGENT-BE | P2 |
| Digital Twin Service | 🔴 Not Started | AGENT-DT | P2 |
| Builder OS Service | 🔴 Not Started | AGENT-BE | P3 |
| Infrastructure | 🔴 Not Started | AGENT-INFRA | P0 |

**Legend**:
- 🟢 Operational
- 🟡 In Progress
- 🔴 Not Started
- P0 = Critical
- P1 = High
- P2 = Medium
- P3 = Low

---

## 🎯 Next Steps

### Immediate (This Week)

1. **Complete Critical Documentation** (🔥 Priority)
   - [ ] 09-STANDARDS/CODING_STANDARDS.md
   - [ ] 09-STANDARDS/GIT_WORKFLOW.md
   - [ ] 06-AGENTS/AGENT-BE/TASKS.md
   - [ ] 06-AGENTS/AGENT-WEB/TASKS.md
   - [ ] 06-AGENTS/AGENT-MOB/TASKS.md

2. **Setup Development Environment**
   - [ ] Docker services running
   - [ ] Database migrations ready
   - [ ] Environment variables configured

3. **Start Backend Development** (AGENT-BE)
   - [ ] Auth Service (Port 3001)
   - [ ] Property Service (Port 3002)
   - [ ] User Service (Port 3003)

---

### Short Term (Next 2 Weeks)

1. **Complete Core Backend Services**
   - [ ] Document Service
   - [ ] Payment Service
   - [ ] Notification Service
   - [ ] AI Orchestrator

2. **Mobile App Development** (AGENT-MOB)
   - [ ] Setup + Authentication
   - [ ] Core screens
   - [ ] API integration

3. **Infrastructure Setup** (AGENT-INFRA)
   - [ ] Kubernetes manifests
   - [ ] CI/CD pipelines
   - [ ] Monitoring setup

---

### Medium Term (Next Month)

1. **Complete All Services**
   - [ ] Loan Service
   - [ ] CRM Service
   - [ ] Integration Service
   - [ ] Digital Twin Service
   - [ ] Builder OS Service

2. **Frontend Polish**
   - [ ] UI/UX refinement
   - [ ] Performance optimization
   - [ ] E2E testing

3. **Production Deployment**
   - [ ] Staging environment
   - [ ] Load testing
   - [ ] Security audit
   - [ ] Production deployment

---

## 📞 Support & Questions

### When You're Stuck

1. **Check Documentation** (90% of questions answered here)
2. **Search for Examples** (Look at completed code)
3. **Ask Specific Questions** (Provide context, what you tried)

### Documentation Issues

If documentation is unclear or missing:
1. Document the gap
2. Create PR with proposed fix
3. Tag maintainer for review

---

**Last Updated**: January 8, 2026
**Status**: ✅ Master Index Complete
**Version**: 1.0
**Maintainer**: AGENT-TL

**START HERE**: [00-START-HERE/README.md](00-START-HERE/README.md)
