# PROPMUBI TECHNOLOGY DECISIONS
## Final Technology Stack & Architecture Decisions

**Version:** 1.0
**Date:** December 29, 2025
**Status:** Approved

---

## CORE TECHNOLOGY DECISIONS

### 1. Event-Driven Architecture

**Decision:** Redis Streams
**Rationale:**
- Lightweight and already part of our Redis infrastructure
- Built-in persistence (RDB + AOF)
- Consumer groups with automatic load balancing
- Scales to 100K+ messages/sec (sufficient for MVP and growth)
- Lower operational complexity vs Kafka
- Native support in Python (redis-py)
- Cost-effective (no additional infrastructure)

**Implementation:**
```python
# Event Bus Configuration
REDIS_STREAMS_CONFIG = {
    "host": "redis-cluster",
    "port": 6379,
    "decode_responses": True,
    "max_connections": 50,
    "streams": {
        "property.events": ["property.created", "property.updated", "unit.status_changed"],
        "user.events": ["user.registered", "user.kyc_verified", "subscription.changed"],
        "transaction.events": ["payment.success", "loan.disbursed", "booking.confirmed"],
        "document.events": ["document.uploaded", "document.verified"],
        "crm.events": ["lead.created", "lead.scored", "lead.assigned"]
    }
}
```

**Backup Plan:** If scale exceeds Redis Streams capacity (>500K msgs/sec), migrate to Apache Kafka using same event schema.

---

### 2. LLM & AI Strategy

**Decision:** Hybrid (LiteLLM Router)
**Rationale:**
- Flexibility to use best model for each use case
- Cost optimization (use cheaper models for simple tasks)
- Failover and redundancy
- No vendor lock-in
- Ability to test and compare models easily

**Model Assignment Strategy:**
```python
# LLM Router Configuration
LLM_ROUTING_RULES = {
    # Critical: High accuracy required
    "critical": {
        "primary": "gpt-4-turbo",           # OpenAI
        "fallback": "claude-sonnet-4.5",    # Anthropic
        "use_cases": ["underwriting", "legal_analysis", "tax_optimization"]
    },

    # Document Processing: Long context needed
    "document": {
        "primary": "claude-sonnet-4.5",     # 200K context
        "fallback": "gpt-4-turbo",
        "use_cases": ["document_analysis", "contract_review", "title_verification"]
    },

    # Conversational: Balance cost & quality
    "conversational": {
        "primary": "gpt-4o-mini",           # OpenAI (cheaper)
        "fallback": "claude-haiku",         # Anthropic (cheaper)
        "use_cases": ["chat", "property_search", "recommendations"]
    },

    # Background/Batch: Cost-effective
    "background": {
        "primary": "ollama/llama3:70b",     # Self-hosted
        "fallback": "gpt-4o-mini",
        "use_cases": ["lead_scoring", "data_enrichment", "classification"]
    }
}
```

**Cost Estimates (per 1M tokens):**
- GPT-4 Turbo: $10 (input) + $30 (output)
- Claude Sonnet 4.5: $3 (input) + $15 (output)
- GPT-4o Mini: $0.15 (input) + $0.60 (output)
- Ollama (self-hosted): $0 (one-time GPU cost)

**Monthly Estimate:** ~$2,000-5,000 for 10K active users

---

### 3. Cloud Strategy

**Decision:** Multi-Cloud (Terraform)
**Rationale:**
- Cloud agnostic architecture (no vendor lock-in)
- Flexibility to deploy on any cloud or on-premises
- Cost optimization (choose cheapest for each region)
- Disaster recovery across clouds
- Leverage best services from each provider

**Infrastructure Strategy:**
```
Primary (Production - India):
├─ AWS ap-south-1 (Mumbai)
│  ├─ EKS cluster (Kubernetes)
│  ├─ RDS PostgreSQL (Multi-AZ)
│  ├─ ElastiCache Redis (cluster mode)
│  ├─ S3 (document storage)
│  └─ CloudFront (CDN)

Secondary (DR - India):
├─ Google Cloud asia-south1 (Mumbai)
│  ├─ GKE cluster (standby)
│  ├─ Cloud SQL PostgreSQL (replica)
│  └─ Cloud Storage (backup)

Development/Staging:
├─ Local (minikube/kind)
├─ Dev: AWS us-east-1 (cheaper, low traffic)
└─ Staging: AWS ap-south-1 (production parity)
```

**Terraform Module Structure:**
```
terraform/
├─ modules/
│  ├─ network/           # VPC, subnets, security groups
│  ├─ compute/           # EKS/GKE/AKS cluster
│  ├─ database/          # RDS/Cloud SQL/Cosmos DB
│  ├─ cache/             # ElastiCache/Memorystore/Azure Cache
│  ├─ storage/           # S3/GCS/Azure Blob
│  └─ monitoring/        # CloudWatch/Stackdriver/Azure Monitor
├─ providers/
│  ├─ aws/               # AWS-specific configs
│  ├─ gcp/               # GCP-specific configs
│  └─ azure/             # Azure-specific configs
└─ environments/
   ├─ local/
   ├─ dev/
   ├─ staging/
   └─ prod/
```

**Cost Optimization:**
- Use Spot/Preemptible instances for non-critical workloads (70% savings)
- Auto-scaling based on load
- Reserved instances for stable workloads (40% savings)
- Cross-region data transfer optimization

---

### 4. Frontend State Management

**Decision:** React Query + Zustand
**Rationale:**
- Best practice separation: Server state (React Query) vs Client state (Zustand)
- React Query handles caching, refetching, optimistic updates automatically
- Zustand is lightweight and easy to learn
- TypeScript-first design
- Minimal boilerplate

**State Architecture:**
```typescript
// Server State (React Query)
// For data from API: properties, users, bookings, etc.
import { useQuery, useMutation } from '@tanstack/react-query';

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => api.searchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Client State (Zustand)
// For UI state: modals, forms, search filters, theme, etc.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  searchFilters: SearchFilters;
  setUser: (user: User) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      searchFilters: {},
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      updateSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters }
        })),
    }),
    { name: 'app-storage' }
  )
);
```

**Benefits:**
- Automatic background refetching
- Optimistic updates
- Cache invalidation
- Pagination & infinite queries
- Offline support
- DevTools for debugging

---

## ADDITIONAL TECHNOLOGY DECISIONS

### 5. Database Strategy

**Primary Database:** PostgreSQL 15+
**Document Store:** MongoDB 6+
**Cache:** Redis 7+
**Search:** Elasticsearch 8+
**Vector DB:** Qdrant

**Rationale:**
- PostgreSQL: ACID compliance, JSONB for flexibility, PostGIS for geospatial
- MongoDB: Document storage, flexible schema for logs and metadata
- Redis: Caching, session store, message queue, rate limiting
- Elasticsearch: Full-text search, aggregations, analytics
- Qdrant: Vector similarity search for AI/ML

---

### 6. API Design

**Decision:** REST + GraphQL (Hybrid)

**REST APIs:**
- All CRUD operations
- OpenAPI/Swagger documentation
- Versioned (v1, v2)
- Rate limited
- JWT authentication

**GraphQL (Future):**
- Complex queries with multiple joins
- Frontend-driven data fetching
- Real-time subscriptions (WebSocket)
- Mobile app optimization (reduce over-fetching)

---

### 7. Authentication & Authorization

**Authentication:** JWT (JSON Web Tokens)
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Stored in httpOnly cookies (web) / secure storage (mobile)

**Authorization:** RBAC + ABAC
- Role-Based Access Control (RBAC): Buyer, Seller, Agent, Builder, Admin
- Attribute-Based Access Control (ABAC): OPA (Open Policy Agent) for feature flags

**MFA:** Optional for sensitive operations
- Aadhaar OTP
- SMS OTP
- Email OTP
- Authenticator apps (TOTP)

---

### 8. Container & Orchestration

**Containers:** Docker (multi-stage builds)
**Orchestration:** Kubernetes (EKS/GKE/AKS)
**Service Mesh:** Optional (Istio for advanced routing, later phase)
**Package Manager:** Helm 3

---

### 9. CI/CD Pipeline

**Version Control:** GitHub
**CI/CD:** GitHub Actions
**GitOps:** ArgoCD
**Container Registry:** AWS ECR / GCR / Docker Hub

**Pipeline Stages:**
```
Code Push → GitHub
  ↓
GitHub Actions:
  1. Lint & Format
  2. Unit Tests
  3. Build Docker Image
  4. Security Scan (Trivy)
  5. Push to Registry
  ↓
ArgoCD:
  1. Detect new image
  2. Update Helm values
  3. Deploy to cluster
  4. Health check
  5. Notify team
```

---

### 10. Monitoring & Observability

**Metrics:** Prometheus + Grafana
**Logging:** Loki + Promtail
**Tracing:** Jaeger (OpenTelemetry)
**Error Tracking:** Sentry
**APM:** Optional (Datadog/New Relic for production)

**Key Metrics:**
- API response times (p50, p95, p99)
- Error rates
- Request rates
- Database query performance
- Cache hit ratio
- Event queue lag
- LLM token usage & costs

---

### 11. Security

**Code Security:**
- Bandit (Python static analysis)
- Safety (dependency scanning)
- Trivy (container scanning)
- Snyk (vulnerability scanning)

**Runtime Security:**
- WAF (Web Application Firewall)
- DDoS protection (Cloudflare/AWS Shield)
- Rate limiting (per IP, per user)
- SQL injection prevention (ORM)
- XSS prevention (React automatic escaping)
- CSRF tokens

**Data Security:**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII tokenization
- Secrets management (Vault/Sealed Secrets)
- Regular backups (automated, tested)

---

### 12. Testing Strategy

**Unit Tests:** pytest (Python), Vitest (TypeScript)
- Coverage: 85%+ overall, 90%+ for critical paths
- Fast execution (<5 minutes)

**Integration Tests:** pytest + docker-compose
- Test inter-service communication
- Test event propagation
- Test database transactions

**E2E Tests:** Playwright (web), Detox (mobile)
- Critical user journeys
- Cross-browser testing
- Visual regression testing

**Performance Tests:** k6
- Load tests (10K concurrent users)
- Stress tests (find breaking point)
- Spike tests (sudden traffic surge)

**Security Tests:** OWASP ZAP, Burp Suite
- Automated DAST
- Manual penetration testing (quarterly)

---

## DEVELOPMENT WORKFLOW

### Local Development
```bash
# Start infrastructure
docker-compose up -d postgres mongodb redis elasticsearch qdrant minio

# Start microservices (hot reload)
cd services/property-service && uvicorn main:app --reload

# Start frontend (hot reload)
cd apps/web && npm run dev

# Run tests
pytest tests/ --cov --cov-report=html
```

### Code Quality Checks
```bash
# Python
black . && isort . && pylint src/ && mypy src/

# TypeScript
eslint . && prettier --check . && tsc --noEmit
```

### Git Workflow
```
main (production)
  ↓
develop (integration)
  ↓
feature/TASK-ID-description
  ↓
Pull Request → Code Review → Tests → Merge
```

---

## COST ESTIMATES

### Infrastructure (Production - 10K users)

**AWS (Primary):**
- EKS cluster: $145/month (control plane) + $500/month (3 nodes t3.large)
- RDS PostgreSQL: $200/month (db.t3.medium Multi-AZ)
- ElastiCache Redis: $150/month (cache.t3.medium)
- S3 + CloudFront: $100/month (1TB storage, 10TB transfer)
- **Total AWS: ~$1,100/month**

**LLM Costs:**
- GPT-4 (critical): $1,500/month
- Claude (documents): $500/month
- Ollama (self-hosted): $300/month (GPU instance)
- **Total LLM: ~$2,300/month**

**Third-Party Services:**
- Twilio (SMS): $200/month
- SendGrid (Email): $100/month
- Satellite imagery: $500/month
- **Total Third-Party: ~$800/month**

**Grand Total: ~$4,200/month** for 10K active users
**Per User: $0.42/month**

**Scaling:**
- 50K users: ~$12,000/month ($0.24/user)
- 100K users: ~$20,000/month ($0.20/user)

---

## TECHNOLOGY STACK SUMMARY

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Backend** | FastAPI + Python 3.11 | API framework |
| **Frontend** | Next.js 14 + React 18 + TypeScript | Web app |
| **Mobile** | React Native + TypeScript | Mobile app |
| **State** | React Query + Zustand | State management |
| **Database** | PostgreSQL 15 | Primary database |
| **Cache** | Redis 7 | Cache + Message queue |
| **Search** | Elasticsearch 8 | Full-text search |
| **Vector DB** | Qdrant | AI/ML embeddings |
| **Storage** | S3/MinIO | Object storage |
| **Event Bus** | Redis Streams | Event-driven architecture |
| **LLM** | LiteLLM (GPT-4 + Claude + Ollama) | AI agents |
| **Orchestration** | LangGraph | Agent workflows |
| **Container** | Docker + Kubernetes | Deployment |
| **IaC** | Terraform | Infrastructure as Code |
| **GitOps** | ArgoCD | Continuous deployment |
| **CI/CD** | GitHub Actions | Automation |
| **Monitoring** | Prometheus + Grafana | Metrics |
| **Logging** | Loki + Promtail | Logs |
| **Tracing** | Jaeger | Distributed tracing |
| **Cloud** | AWS (primary) + GCP (DR) | Multi-cloud |

---

**Status:** ✅ APPROVED
**Next Action:** Start implementation with [INFRA-001] Local Development Setup
