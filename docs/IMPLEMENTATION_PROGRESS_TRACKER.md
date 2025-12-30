# PROPMUBI IMPLEMENTATION PROGRESS TRACKER
## Real-Time Task Status Dashboard

**Version:** 1.0
**Last Updated:** December 29, 2025
**Project Start Date:** December 29, 2025
**Target Launch:** Q3 2026

---

## 📊 OVERALL PROGRESS

```
Total Tasks: 85
Completed: 0 (0%)
In Progress: 0 (0%)
Blocked: 0 (0%)
Not Started: 85 (100%)

Phase Breakdown:
├─ Phase 1: Infrastructure          [░░░░░░░░░░] 0/13   (0%)
├─ Phase 2: Core Services           [░░░░░░░░░░] 0/12   (0%)
├─ Phase 3: AI/ML Services          [░░░░░░░░░░] 0/3    (0%)
├─ Phase 4: Integration Services    [░░░░░░░░░░] 0/4    (0%)
├─ Phase 5: Frontend & UX/UI        [░░░░░░░░░░] 0/8    (0%)
├─ Phase 6: Mobile Applications     [░░░░░░░░░░] 0/4    (0%)
├─ Phase 7: DevOps & CI/CD          [░░░░░░░░░░] 0/4    (0%)
├─ Phase 8: Testing & QA            [░░░░░░░░░░] 0/5    (0%)
└─ Phase 9: Deployment              [░░░░░░░░░░] 0/4    (0%)
```

---

## 🎯 CRITICAL PATH TRACKER

**Current Active Node:** [INFRA-001] Local Development Setup
**Next Milestone:** Infrastructure Foundation Complete
**Days Since Start:** 0
**Days to Next Milestone:** 14 (Target)

### Critical Path Chain (Must complete in sequence)
```
[INFRA-001] ✗ → [INFRA-002] ✗ → [INFRA-010] ✗ → [INFRA-011] ✗ →
[INFRA-012] ✗ → [INFRA-013] ✗ → [SVC-001] ✗ → [SVC-002] ✗ →
[SVC-003] ✗ → [SVC-010] ✗ → [AI-001] ✗ → [FE-001] ✗ →
[DEPLOY-004] ✗

Legend: ✓ Done | ⧗ In Progress | ✗ Not Started | ⚠ Blocked
```

---

## 📋 DETAILED TASK STATUS

# PHASE 1: INFRASTRUCTURE FOUNDATION

## [INFRA-001] Local Development Infrastructure Setup
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Start Date:** -
- **End Date:** -
- **Dependencies:** None (START NODE)
- **Blocks:** INFRA-002, INFRA-003, INFRA-004
- **Effort:** Small (2-3 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Docker Desktop Setup**
  - [ ] Install Docker Desktop 4.25+ for Windows
  - [ ] Enable Kubernetes in Docker Desktop
  - [ ] Allocate 8GB+ RAM, 4+ CPUs
  - [ ] Verify: `docker --version && kubectl version`
  - [ ] Test: `docker run hello-world`

- [ ] **Local Development Tools**
  - [ ] Install Helm 3.13+: `choco install kubernetes-helm`
  - [ ] Install Terraform 1.6+: `choco install terraform`
  - [ ] Install kubectl: Already in Docker Desktop
  - [ ] Install k9s (optional): `choco install k9s`
  - [ ] Verify: `helm version && terraform version`

- [ ] **Local Docker Registry**
  - [ ] Run local registry: `docker run -d -p 5000:5000 --name registry registry:2`
  - [ ] Test push: `docker tag hello-world localhost:5000/hello-world`
  - [ ] Verify: `curl http://localhost:5000/v2/_catalog`

- [ ] **Base Configuration**
  - [ ] Create docker-compose.yml ✓ (Already exists)
  - [ ] Setup /etc/hosts entries:
    ```
    127.0.0.1 api.propmubi.local
    127.0.0.1 app.propmubi.local
    127.0.0.1 admin.propmubi.local
    ```
  - [ ] Create .env file ✓ (Script creates it)

- [ ] **WSL Ubuntu Setup**
  - [ ] Install WSL 2: `wsl --install`
  - [ ] Setup Ubuntu 22.04 LTS
  - [ ] Run setup script: `bash scripts/setup-wsl.sh`
  - [ ] Verify Python 3.11: `python3 --version`
  - [ ] Verify Node 18+: `node --version`

### Test Gate:
```bash
# Infrastructure Smoke Test
docker ps | grep -E "postgres|mongo|redis"
kubectl get nodes
helm list
terraform version
```

### Acceptance Criteria:
- [ ] Docker Desktop running with Kubernetes enabled
- [ ] All CLI tools installed and accessible
- [ ] Local registry accepting pushes
- [ ] WSL Ubuntu configured with Python 3.11 and Node 18+
- [ ] All smoke tests passing

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-001-local-dev-setup`
- [ ] Commit: Documentation and setup scripts
- [ ] PR: Reviewed and merged to `develop`
- [ ] Tag: `INFRA-001-complete`

**Notes:**
_Add notes, blockers, or issues here_

---

## [INFRA-002] Local Database Setup
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Start Date:** -
- **End Date:** -
- **Dependencies:** INFRA-001
- **Blocks:** SVC-002, SVC-003, SVC-010
- **Effort:** Medium (3-5 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **PostgreSQL 15 Setup**
  - [ ] Start via docker-compose: `docker-compose up -d postgres`
  - [ ] Verify running: `docker exec propmubi-postgres pg_isready`
  - [ ] Run init script: `scripts/init-databases.sql` ✓ (Auto-runs)
  - [ ] Create databases:
    - [ ] propmubi_properties
    - [ ] propmubi_users
    - [ ] propmubi_transactions
    - [ ] propmubi_crm
    - [ ] propmubi_documents
  - [ ] Enable extensions: uuid-ossp, postgis, pg_trgm
  - [ ] Test connection: `psql -U propmubi -h localhost -d propmubi_properties`

- [ ] **PgBouncer Connection Pooling**
  - [ ] Start PgBouncer: `docker-compose up -d pgbouncer`
  - [ ] Configure pool_mode = transaction
  - [ ] Set max_client_conn = 1000, default_pool_size = 25
  - [ ] Test: `psql -U propmubi -h localhost -p 6432`

- [ ] **MongoDB 6 Setup**
  - [ ] Start via docker-compose: `docker-compose up -d mongodb`
  - [ ] Verify: `docker exec propmubi-mongodb mongosh --eval "db.version()"`
  - [ ] Run init script: `scripts/init-mongodb.js` ✓ (Auto-runs)
  - [ ] Create collections:
    - [ ] documents
    - [ ] document_versions
    - [ ] knowledge_graphs
    - [ ] event_logs
  - [ ] Create indexes (see init-mongodb.js)
  - [ ] Test: `mongosh mongodb://propmubi:propmubi_dev_pass@localhost:27017`

- [ ] **Redis 7 Setup**
  - [ ] Start via docker-compose: `docker-compose up -d redis`
  - [ ] Verify: `docker exec propmubi-redis redis-cli -a propmubi_dev_pass ping`
  - [ ] Enable RDB + AOF persistence
  - [ ] Configure maxmemory-policy: allkeys-lru
  - [ ] Test: `redis-cli -a propmubi_dev_pass SET test "Hello"`

- [ ] **Elasticsearch 8 Setup**
  - [ ] Start via docker-compose: `docker-compose up -d elasticsearch`
  - [ ] Verify: `curl http://localhost:9200/_cluster/health`
  - [ ] Create indices:
    - [ ] properties
    - [ ] users
    - [ ] documents
  - [ ] Configure mappings for each index
  - [ ] Test: `curl -X POST http://localhost:9200/properties/_doc/1 -H 'Content-Type: application/json' -d '{"test":"data"}'`

- [ ] **Qdrant Vector DB Setup**
  - [ ] Start via docker-compose: `docker-compose up -d qdrant`
  - [ ] Verify: `curl http://localhost:6333/`
  - [ ] Create collections:
    - [ ] property_embeddings (768 dimensions)
    - [ ] document_embeddings (1536 dimensions)
  - [ ] Test: `curl http://localhost:6333/collections`

### Alembic Migration Setup:
```bash
# For each service that uses PostgreSQL
cd services/property-service
alembic init migrations
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

### Test Gate:
```bash
# Database Connection Tests
pytest tests/infrastructure/test_databases.py
# Expected: All connection tests pass
# Coverage: N/A (infrastructure)
```

### Acceptance Criteria:
- [ ] All 5 databases running and healthy
- [ ] All databases accessible with correct credentials
- [ ] All initial schemas/collections created
- [ ] Connection pooling configured
- [ ] Persistence configured (Redis, Elasticsearch)
- [ ] Migrations framework initialized

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-002-database-setup`
- [ ] Files: docker-compose updates, init scripts, Alembic configs
- [ ] PR: Reviewed and merged
- [ ] Tag: `INFRA-002-complete`

**Notes:**

---

## [INFRA-003] Message Queue & Event Bus Setup
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** INFRA-001
- **Parallel With:** INFRA-002
- **Blocks:** All [SVC-*] services
- **Effort:** Medium (3-4 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Redis Streams Configuration**
  - [ ] Already running from INFRA-002
  - [ ] Create stream groups:
    - [ ] property.events (groups: crm-service, analytics-service)
    - [ ] user.events (groups: crm-service, communication-service)
    - [ ] transaction.events (groups: analytics-service, payment-service)
    - [ ] document.events (groups: legal-service, loan-service)
  - [ ] Configure consumer group settings
  - [ ] Setup dead letter queue: `dlq:failed_events`

- [ ] **Event Schema Registry**
  - [ ] Create `schemas/events/` directory
  - [ ] Define event schemas (Pydantic):
    ```
    schemas/events/
    ├─ property_events.py
    ├─ user_events.py
    ├─ transaction_events.py
    └─ document_events.py
    ```
  - [ ] Document event versioning strategy

- [ ] **Event Publisher Template**
  - [ ] Create base publisher class: `common/events/publisher.py`
  - [ ] Features:
    - [ ] JSON serialization
    - [ ] Schema validation
    - [ ] Error handling with DLQ
    - [ ] Event ID generation (UUID)
    - [ ] Timestamp addition
    - [ ] Correlation ID tracking

- [ ] **Event Consumer Template**
  - [ ] Create base consumer class: `common/events/consumer.py`
  - [ ] Features:
    - [ ] Consumer group management
    - [ ] Automatic acknowledgment
    - [ ] Retry logic (3 attempts)
    - [ ] DLQ forwarding on failure
    - [ ] Idempotency check

### Event Flow Testing:
```python
# Test event publish-subscribe
async def test_event_flow():
    # Publish
    await publisher.publish('property.created', {'id': 123})

    # Consume
    events = await consumer.read_stream('property.events', 'test-group')
    assert len(events) == 1
```

### Test Gate:
```bash
pytest tests/infrastructure/test_event_bus.py --cov=common/events
# Expected: 90%+ coverage
```

### Acceptance Criteria:
- [ ] Redis Streams configured with consumer groups
- [ ] Event schemas defined and validated
- [ ] Publisher/Consumer base classes implemented
- [ ] DLQ configured and tested
- [ ] At least 3 event types tested end-to-end

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-003-event-bus`
- [ ] Files: Event schemas, publisher, consumer templates
- [ ] Tag: `INFRA-003-complete`

**Notes:**

---

## [INFRA-004] Local Object Storage (MinIO)
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** INFRA-001
- **Parallel With:** INFRA-002, INFRA-003
- **Blocks:** SVC-011 (Document Service)
- **Effort:** Small (1-2 days)
- **Priority:** P1 (High)

### Detailed Checklist:
- [ ] **MinIO Setup**
  - [ ] Start via docker-compose: `docker-compose up -d minio`
  - [ ] Verify: `curl http://localhost:9000/minio/health/live`
  - [ ] Access console: http://localhost:9001 (propmubi/propmubi_dev_pass)

- [ ] **Bucket Creation**
  - [ ] Create buckets:
    ```bash
    docker exec propmubi-minio mc alias set local http://localhost:9000 propmubi propmubi_dev_pass
    docker exec propmubi-minio mc mb local/documents
    docker exec propmubi-minio mc mb local/images
    docker exec propmubi-minio mc mb local/videos
    docker exec propmubi-minio mc mb local/backups
    ```
  - [ ] Verify: `mc ls local/`

- [ ] **Access Policies**
  - [ ] documents bucket: Private (authenticated only)
  - [ ] images bucket: Public read
  - [ ] videos bucket: Public read
  - [ ] backups bucket: Private
  - [ ] Apply policies: `mc policy set <policy> local/<bucket>`

- [ ] **Lifecycle Rules**
  - [ ] Configure expiration for backups (90 days)
  - [ ] Configure transition to glacier (optional for prod)

- [ ] **S3 Client Integration**
  - [ ] Install boto3: `pip install boto3`
  - [ ] Create S3 client helper: `common/storage/s3_client.py`
  - [ ] Implement methods:
    - [ ] upload_file()
    - [ ] download_file()
    - [ ] generate_presigned_url()
    - [ ] delete_file()
    - [ ] list_files()

### Test Gate:
```python
# Test S3 operations
def test_s3_upload_download():
    s3 = S3Client()
    s3.upload_file('test.txt', 'documents', 'test.txt')
    content = s3.download_file('documents', 'test.txt')
    assert content == b'test content'
```

### Acceptance Criteria:
- [ ] MinIO running and accessible
- [ ] All 4 buckets created with correct policies
- [ ] S3 client library integrated
- [ ] Upload/Download/Delete operations tested
- [ ] Presigned URL generation working

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-004-object-storage`
- [ ] Tag: `INFRA-004-complete`

**Notes:**

---

## [INFRA-010] Terraform Base Modules
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** INFRA-004
- **Blocks:** INFRA-011
- **Effort:** Large (7-10 days)
- **Priority:** P1 (High)

### Detailed Checklist:
- [ ] **Project Structure**
  - [ ] Create terraform directory structure:
    ```
    terraform/
    ├─ modules/
    │  ├─ network/
    │  ├─ compute/
    │  ├─ database/
    │  └─ storage/
    ├─ environments/
    │  ├─ local/
    │  ├─ dev/
    │  ├─ staging/
    │  └─ prod/
    └─ backend.tf
    ```

- [ ] **Network Module (terraform/modules/network/)**
  - [ ] VPC configuration
    - [ ] main.tf: VPC with CIDR 10.0.0.0/16
    - [ ] Public subnets (3 AZs): 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24
    - [ ] Private subnets (3 AZs): 10.0.11.0/24, 10.0.12.0/24, 10.0.13.0/24
    - [ ] Internet Gateway
    - [ ] NAT Gateways (3, one per AZ)
    - [ ] Route tables
  - [ ] Security Groups
    - [ ] ALB Security Group (80, 443)
    - [ ] EKS Control Plane SG
    - [ ] EKS Worker Node SG
    - [ ] Database SG (5432, 27017, 6379)
  - [ ] variables.tf: Define all variables
  - [ ] outputs.tf: Export VPC ID, subnet IDs, SG IDs
  - [ ] Test: `terraform plan -var-file=../environments/dev/terraform.tfvars`

- [ ] **Compute Module (terraform/modules/compute/)**
  - [ ] EKS Cluster (AWS) / GKE (GCP) / AKS (Azure)
  - [ ] AWS:
    - [ ] EKS 1.28+
    - [ ] Node groups:
      - [ ] General purpose: t3.medium (2-10 nodes)
      - [ ] ML workloads: g4dn.xlarge (0-3 nodes)
    - [ ] OIDC provider for IRSA
    - [ ] Cluster autoscaler
  - [ ] GCP (for multi-cloud DR):
    - [ ] GKE Autopilot
    - [ ] Node pools with spot instances
  - [ ] outputs.tf: cluster_endpoint, cluster_ca, kubeconfig

- [ ] **Database Module (terraform/modules/database/)**
  - [ ] PostgreSQL
    - [ ] AWS RDS PostgreSQL 15
    - [ ] Multi-AZ deployment
    - [ ] Instance class: db.r6g.xlarge (prod), db.t3.medium (dev)
    - [ ] Storage: 100GB, auto-scaling to 500GB
    - [ ] Automated backups (7 days retention)
    - [ ] Read replicas (prod only)
  - [ ] MongoDB
    - [ ] AWS DocumentDB or MongoDB Atlas
    - [ ] 3-node replica set
    - [ ] Instance: db.r6g.large
  - [ ] Redis
    - [ ] AWS ElastiCache Redis 7
    - [ ] Cluster mode enabled (3 shards)
    - [ ] Node type: cache.r6g.large
  - [ ] Elasticsearch
    - [ ] AWS OpenSearch 2.9
    - [ ] 3 data nodes (r6g.large.search)
    - [ ] 3 master nodes (c6g.large.search)
  - [ ] outputs.tf: All connection endpoints

- [ ] **Storage Module (terraform/modules/storage/)**
  - [ ] S3 Buckets (AWS) / GCS (GCP)
    - [ ] documents-{env}
    - [ ] images-{env}
    - [ ] videos-{env}
    - [ ] backups-{env}
    - [ ] logs-{env}
  - [ ] Versioning enabled (documents, backups)
  - [ ] Lifecycle policies:
    - [ ] Backups: Transition to Glacier after 30 days
    - [ ] Logs: Delete after 90 days
  - [ ] Encryption at rest (AES-256)
  - [ ] CORS configuration for images/videos

- [ ] **Environment Configurations**
  - [ ] Local (terraform/environments/local/)
    - [ ] Use local docker-compose (no cloud resources)
    - [ ] terraform.tfvars with local settings
  - [ ] Dev (terraform/environments/dev/)
    - [ ] Smaller instance sizes
    - [ ] Single AZ for cost savings
    - [ ] terraform.tfvars
  - [ ] Staging (terraform/environments/staging/)
    - [ ] Production-like setup
    - [ ] Multi-AZ
    - [ ] terraform.tfvars
  - [ ] Prod (terraform/environments/prod/)
    - [ ] Full HA setup
    - [ ] Multi-region (primary + DR)
    - [ ] terraform.tfvars

- [ ] **State Management**
  - [ ] backend.tf:
    ```hcl
    terraform {
      backend "s3" {
        bucket         = "propmubi-terraform-state"
        key            = "prod/terraform.tfstate"
        region         = "ap-south-1"
        encrypt        = true
        dynamodb_table = "terraform-lock"
      }
    }
    ```
  - [ ] Create S3 bucket for state
  - [ ] Create DynamoDB table for locking

### Test Gate:
```bash
# Validate all modules
cd terraform/modules/network && terraform validate
cd terraform/modules/compute && terraform validate
cd terraform/modules/database && terraform validate
cd terraform/modules/storage && terraform validate

# Plan dev environment (dry-run)
cd terraform/environments/dev
terraform init
terraform plan
# Expected: No errors, plan shows resources to create
```

### Acceptance Criteria:
- [ ] All 4 modules created with proper structure
- [ ] Variables and outputs defined
- [ ] terraform validate passes for all modules
- [ ] terraform plan shows expected resources
- [ ] Documentation in README.md for each module
- [ ] Multi-cloud support (AWS primary, GCP DR)

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-010-terraform-modules`
- [ ] Tag: `INFRA-010-complete`

**Notes:**

---

## [INFRA-011] Helm Chart Base Templates
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** INFRA-010
- **Blocks:** SVC-001 (API Gateway)
- **Effort:** Large (7-10 days)
- **Priority:** P1 (High)

### Detailed Checklist:
- [ ] **Base Chart Structure (helm-charts/propmubi-base/)**
  - [ ] Create Helm chart: `helm create propmubi-base`
  - [ ] Clean up default files
  - [ ] Create templates:
    ```
    templates/
    ├─ _helpers.tpl
    ├─ configmap.yaml
    ├─ secret.yaml
    ├─ deployment.yaml
    ├─ service.yaml
    ├─ hpa.yaml
    ├─ ingress.yaml
    ├─ serviceaccount.yaml
    ├─ pdb.yaml (Pod Disruption Budget)
    └─ networkpolicy.yaml
    ```

- [ ] **ConfigMap Template**
  - [ ] Support environment variables from values.yaml
  - [ ] Support file mounting (config files)
  - [ ] Example:
    ```yaml
    data:
      APP_ENV: {{ .Values.environment }}
      LOG_LEVEL: {{ .Values.logLevel }}
    ```

- [ ] **Secret Template**
  - [ ] Support base64 encoded secrets
  - [ ] Integration with external-secrets-operator
  - [ ] Example secrets:
    - Database passwords
    - API keys
    - JWT secrets

- [ ] **Deployment Template**
  - [ ] Container spec:
    - [ ] Image from values.yaml
    - [ ] Pull policy: IfNotPresent (dev), Always (prod)
    - [ ] Resource limits and requests
    - [ ] Environment variables from ConfigMap/Secret
  - [ ] Probes:
    - [ ] livenessProbe: /health/live
    - [ ] readinessProbe: /health/ready
    - [ ] startupProbe: /health/startup
  - [ ] Volume mounts
  - [ ] Security context (non-root, read-only filesystem)
  - [ ] Affinity rules (pod anti-affinity)

- [ ] **Service Template**
  - [ ] Type: ClusterIP (default), LoadBalancer (ingress)
  - [ ] Port configuration
  - [ ] Session affinity (optional)

- [ ] **HPA Template (Horizontal Pod Autoscaler)**
  - [ ] Min/max replicas from values.yaml
  - [ ] CPU target: 70%
  - [ ] Memory target: 80%
  - [ ] Custom metrics (optional): requests per second

- [ ] **Ingress Template**
  - [ ] Support for multiple ingress controllers (nginx, traefik)
  - [ ] TLS configuration
  - [ ] Host and path rules
  - [ ] Annotations for cert-manager

- [ ] **Values Schema**
  - [ ] values.yaml with sensible defaults
  - [ ] values.schema.json for validation
  - [ ] Example structure:
    ```yaml
    replicaCount: 2
    image:
      repository: propmubi/api-gateway
      tag: latest
      pullPolicy: IfNotPresent

    resources:
      limits:
        cpu: 1000m
        memory: 1Gi
      requests:
        cpu: 500m
        memory: 512Mi

    autoscaling:
      enabled: true
      minReplicas: 2
      maxReplicas: 10
      targetCPUUtilizationPercentage: 70
    ```

- [ ] **Microservices Chart (helm-charts/propmubi-microservices/)**
  - [ ] Use propmubi-base as dependency
  - [ ] Create values files for each service:
    ```
    values/
    ├─ api-gateway-values.yaml
    ├─ auth-service-values.yaml
    ├─ user-service-values.yaml
    ├─ property-service-values.yaml
    └─ ... (all services)
    ```
  - [ ] Chart.yaml with dependencies:
    ```yaml
    dependencies:
      - name: propmubi-base
        version: "0.1.0"
        repository: "file://../propmubi-base"
    ```

- [ ] **Infrastructure Chart (helm-charts/propmubi-infra/)**
  - [ ] Prometheus stack
    - [ ] prometheus-operator
    - [ ] prometheus
    - [ ] alertmanager
    - [ ] node-exporter
  - [ ] Grafana
    - [ ] Pre-configured datasources
    - [ ] Dashboard provisioning
  - [ ] Loki stack
    - [ ] loki
    - [ ] promtail
  - [ ] Jaeger
    - [ ] jaeger-operator
    - [ ] jaeger instance

### Test Gate:
```bash
# Lint all charts
helm lint helm-charts/propmubi-base
helm lint helm-charts/propmubi-microservices
helm lint helm-charts/propmubi-infra

# Template rendering
helm template test helm-charts/propmubi-base --values test-values.yaml

# Dry-run install
helm install test helm-charts/propmubi-base --dry-run --debug
```

### Acceptance Criteria:
- [ ] All templates created and validated
- [ ] helm lint passes with no errors
- [ ] helm template generates valid YAML
- [ ] Values schema validation working
- [ ] Documentation in README.md for each chart
- [ ] At least 1 microservice deployed using the chart

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-011-helm-charts`
- [ ] Tag: `INFRA-011-complete`

**Notes:**

---

## [INFRA-012] GitHub Actions CI/CD Workflows
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** INFRA-011
- **Blocks:** All service deployments
- **Effort:** Medium (5-7 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Backend CI Workflow (.github/workflows/ci-backend.yml)**
  - [ ] Triggers:
    - [ ] push to develop, main
    - [ ] pull_request to develop, main
    - [ ] paths: services/**, packages/**
  - [ ] Jobs:
    - [ ] Lint:
      - [ ] pylint (score >= 8.0)
      - [ ] black --check
      - [ ] isort --check
      - [ ] mypy (type checking)
    - [ ] Unit Tests:
      - [ ] pytest --cov --cov-report=xml
      - [ ] Coverage >= 85%
      - [ ] Upload coverage to Codecov
    - [ ] Security Scan:
      - [ ] bandit -r services/
      - [ ] safety check
      - [ ] Trivy scan Dockerfile
    - [ ] Build Docker Images:
      - [ ] Matrix build for all services
      - [ ] Tag: {service}:{commit-sha}
      - [ ] Push to registry (dev only)
  - [ ] Test matrix:
    ```yaml
    strategy:
      matrix:
        service: [api-gateway, auth-service, user-service, property-service]
        python-version: [3.11]
    ```

- [ ] **Frontend CI Workflow (.github/workflows/ci-frontend.yml)**
  - [ ] Triggers: paths: apps/web/**, apps/mobile/**
  - [ ] Jobs:
    - [ ] Lint:
      - [ ] eslint
      - [ ] prettier --check
      - [ ] tsc --noEmit (type check)
    - [ ] Unit Tests:
      - [ ] Vitest (web)
      - [ ] Jest (mobile)
      - [ ] Coverage >= 80%
    - [ ] Build:
      - [ ] Next.js build (web)
      - [ ] React Native build (mobile - Android only initially)
    - [ ] E2E Tests (web only, in separate job):
      - [ ] Playwright tests
      - [ ] Run on ubuntu-latest
      - [ ] Headless mode
  - [ ] Test matrix:
    ```yaml
    strategy:
      matrix:
        app: [web, mobile]
        node-version: [18]
    ```

- [ ] **Deploy Dev Workflow (.github/workflows/deploy-dev.yml)**
  - [ ] Trigger: push to develop branch
  - [ ] Jobs:
    - [ ] Build & Push Images:
      - [ ] Build all changed services
      - [ ] Tag: {service}:dev-{commit-sha}
      - [ ] Push to ECR/GCR
    - [ ] Update Helm Values:
      - [ ] Update image tags in values-dev.yaml
      - [ ] Commit changes to GitOps repo
    - [ ] ArgoCD Sync:
      - [ ] Trigger sync via ArgoCD CLI
      - [ ] Wait for sync completion
    - [ ] Smoke Tests:
      - [ ] Health check all services
      - [ ] Basic API tests
    - [ ] Notify:
      - [ ] Slack notification
      - [ ] Include: commit, author, deployed services

- [ ] **Deploy Staging Workflow (.github/workflows/deploy-staging.yml)**
  - [ ] Trigger: Manual (workflow_dispatch) or push to release/* branch
  - [ ] Jobs:
    - [ ] Manual Approval:
      - [ ] Use environment: staging (requires approval)
      - [ ] Approvers: 1 required
    - [ ] Build & Push (same as dev)
    - [ ] Deploy to Staging:
      - [ ] Blue-green deployment strategy
      - [ ] Update Helm values
      - [ ] ArgoCD sync
    - [ ] Integration Tests:
      - [ ] Run full integration test suite
      - [ ] pytest tests/integration/
    - [ ] E2E Tests:
      - [ ] Playwright against staging
    - [ ] Performance Tests:
      - [ ] k6 load test (light)
    - [ ] Notify stakeholders

- [ ] **Deploy Production Workflow (.github/workflows/deploy-prod.yml)**
  - [ ] Trigger: Manual only (workflow_dispatch)
  - [ ] Inputs:
    - [ ] version (required): vX.Y.Z
    - [ ] rollback (boolean): default false
  - [ ] Jobs:
    - [ ] Manual Approval:
      - [ ] Environment: production
      - [ ] Approvers: 2 required
      - [ ] 4-hour timeout
    - [ ] Pre-deployment:
      - [ ] Database backup
      - [ ] Create rollback snapshot
      - [ ] Notify on-call team
    - [ ] Canary Deployment:
      - [ ] Deploy to 10% of pods
      - [ ] Monitor for 5 minutes:
        - Error rate < 1%
        - Latency p95 < baseline + 20%
      - [ ] Decision: proceed or rollback
    - [ ] Progressive Rollout:
      - [ ] 25% (wait 5 min, monitor)
      - [ ] 50% (wait 10 min, monitor)
      - [ ] 100%
    - [ ] Post-deployment:
      - [ ] Smoke tests
      - [ ] Verify all services healthy
      - [ ] Update release notes
      - [ ] Tag: v{version}
    - [ ] Notify:
      - [ ] Slack #releases channel
      - [ ] Email to stakeholders

- [ ] **Rollback Workflow (.github/workflows/rollback.yml)**
  - [ ] Trigger: Manual
  - [ ] Inputs:
    - [ ] environment: dev/staging/prod
    - [ ] target_version: vX.Y.Z
  - [ ] Jobs:
    - [ ] Verify target version exists
    - [ ] Update Helm values to target version
    - [ ] ArgoCD sync
    - [ ] Restore database if needed (manual step)
    - [ ] Verify rollback success
    - [ ] Notify team

### GitHub Secrets Configuration:
- [ ] Repository secrets:
  - [ ] AWS_ACCESS_KEY_ID
  - [ ] AWS_SECRET_ACCESS_KEY
  - [ ] DOCKERHUB_USERNAME
  - [ ] DOCKERHUB_TOKEN
  - [ ] CODECOV_TOKEN
  - [ ] SLACK_WEBHOOK_URL
  - [ ] ARGOCD_SERVER
  - [ ] ARGOCD_AUTH_TOKEN

### Test Gate:
```bash
# Validate workflow syntax
actionlint .github/workflows/*.yml

# Test workflows locally
act -l  # List workflows
act -j lint  # Run lint job locally
```

### Acceptance Criteria:
- [ ] All 6 workflows created
- [ ] Workflows pass syntax validation
- [ ] At least 1 backend service deployed through CI/CD
- [ ] Code coverage reporting working
- [ ] Notifications working (Slack)
- [ ] Rollback tested successfully

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-012-github-actions`
- [ ] Tag: `INFRA-012-complete`

**Notes:**

---

## [INFRA-013] ArgoCD GitOps Setup
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** INFRA-012
- **Blocks:** SVC-001 (First service deployment)
- **Effort:** Medium (4-5 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Install ArgoCD**
  - [ ] Create namespace: `kubectl create namespace argocd`
  - [ ] Install ArgoCD:
    ```bash
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    ```
  - [ ] Expose ArgoCD server:
    ```bash
    kubectl port-forward svc/argocd-server -n argocd 8080:443
    ```
  - [ ] Get admin password:
    ```bash
    kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
    ```
  - [ ] Login: https://localhost:8080 (admin / <password>)

- [ ] **Configure ArgoCD**
  - [ ] Change admin password
  - [ ] Configure RBAC: argocd-rbac-cm ConfigMap
  - [ ] Setup SSO (optional): Google OAuth
  - [ ] Configure repository:
    ```bash
    argocd repo add https://github.com/propmubi/propmubi \
      --username <github-username> \
      --password <github-pat>
    ```
  - [ ] Configure Helm repository

- [ ] **Create ArgoCD Projects**
  - [ ] argocd/projects/backend.yaml:
    ```yaml
    apiVersion: argoproj.io/v1alpha1
    kind: AppProject
    metadata:
      name: propmubi-backend
    spec:
      description: Backend microservices
      sourceRepos:
        - 'https://github.com/propmubi/propmubi'
      destinations:
        - namespace: 'propmubi-*'
          server: https://kubernetes.default.svc
      clusterResourceWhitelist:
        - group: '*'
          kind: '*'
    ```
  - [ ] frontend.yaml
  - [ ] infrastructure.yaml

- [ ] **App-of-Apps Pattern**
  - [ ] argocd/applications/root-app.yaml:
    ```yaml
    apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
      name: propmubi-root
    spec:
      project: default
      source:
        repoURL: https://github.com/propmubi/propmubi
        targetRevision: HEAD
        path: argocd/applications
      destination:
        server: https://kubernetes.default.svc
        namespace: argocd
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
    ```

- [ ] **Environment-Specific Applications**
  - [ ] argocd/applications/dev/:
    - [ ] api-gateway.yaml
    - [ ] auth-service.yaml
    - [ ] user-service.yaml
    - [ ] property-service.yaml
    - [ ] ... (all services)
  - [ ] argocd/applications/staging/
  - [ ] argocd/applications/prod/

- [ ] **Application Template Example (api-gateway.yaml):**
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: api-gateway-dev
  spec:
    project: propmubi-backend
    source:
      repoURL: https://github.com/propmubi/propmubi
      targetRevision: develop
      path: helm-charts/propmubi-microservices
      helm:
        valueFiles:
          - values/api-gateway-dev.yaml
    destination:
      server: https://kubernetes.default.svc
      namespace: propmubi-dev
    syncPolicy:
      automated:
        prune: true
        selfHeal: true
      syncOptions:
        - CreateNamespace=true
  ```

- [ ] **Sync Policies**
  - [ ] Dev: Automated sync, prune, self-heal
  - [ ] Staging: Automated sync, manual prune
  - [ ] Prod: Manual sync only

- [ ] **Health Checks**
  - [ ] Configure custom health checks for FastAPI apps
  - [ ] Resource health check script

- [ ] **Notifications**
  - [ ] Install argocd-notifications
  - [ ] Configure Slack notifications:
    - Sync started
    - Sync succeeded
    - Sync failed
    - Health degraded

- [ ] **GitHub Webhook**
  - [ ] Configure webhook in GitHub repo
  - [ ] Payload URL: https://<argocd-server>/api/webhook
  - [ ] Events: push to develop, main, release/*

### Test Gate:
```bash
# Deploy a test application
argocd app create test-app \
  --repo https://github.com/propmubi/propmubi \
  --path helm-charts/propmubi-base \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace test

argocd app sync test-app
argocd app wait test-app --health
argocd app delete test-app
```

### Acceptance Criteria:
- [ ] ArgoCD installed and accessible
- [ ] All projects created
- [ ] App-of-apps pattern working
- [ ] At least 1 service deployed via ArgoCD
- [ ] Auto-sync working for dev environment
- [ ] Notifications configured
- [ ] GitHub webhook triggering syncs

### Git Checkpoint:
- [ ] Branch: `feature/INFRA-013-argocd-setup`
- [ ] Tag: `INFRA-013-complete`
- [ ] **MILESTONE:** Infrastructure Foundation Complete ✓

**Notes:**

---

# PHASE 2: CORE PLATFORM SERVICES

## [SVC-001] API Gateway Service
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Start Date:** -
- **End Date:** -
- **Dependencies:** INFRA-013
- **Blocks:** All other services (routing layer)
- **Effort:** Large (7-10 days)
- **Priority:** P0 (Critical)
- **MCP/LLM Integration:** No
- **Agentic Support:** No

### Detailed Checklist:
- [ ] **Project Setup**
  - [ ] Create directory: `services/api-gateway/`
  - [ ] Initialize Poetry: `poetry init`
  - [ ] Add dependencies:
    ```toml
    [tool.poetry.dependencies]
    python = "^3.11"
    fastapi = "^0.104.1"
    uvicorn = {extras = ["standard"], version = "^0.24.0"}
    pydantic = "^2.5.0"
    pydantic-settings = "^2.1.0"
    redis = "^5.0.1"
    python-jose = {extras = ["cryptography"], version = "^3.3.0"}
    httpx = "^0.25.2"
    structlog = "^23.2.0"
    prometheus-client = "^0.19.0"
    opentelemetry-api = "^1.21.0"
    opentelemetry-sdk = "^1.21.0"
    opentelemetry-instrumentation-fastapi = "^0.42b0"

    [tool.poetry.group.dev.dependencies]
    pytest = "^7.4.3"
    pytest-cov = "^4.1.0"
    pytest-asyncio = "^0.21.1"
    black = "^23.12.0"
    isort = "^5.13.2"
    pylint = "^3.0.3"
    mypy = "^1.7.1"
    ```
  - [ ] Create pyproject.toml
  - [ ] Install: `poetry install`

- [ ] **Directory Structure**
  ```
  services/api-gateway/
  ├─ src/
  │  ├─ main.py
  │  ├─ config/
  │  │  └─ settings.py
  │  ├─ middleware/
  │  │  ├─ __init__.py
  │  │  ├─ auth.py
  │  │  ├─ rate_limit.py
  │  │  ├─ cors.py
  │  │  └─ logging.py
  │  ├─ routes/
  │  │  ├─ __init__.py
  │  │  ├─ health.py
  │  │  ├─ proxy.py
  │  │  └─ metrics.py
  │  ├─ services/
  │  │  ├─ __init__.py
  │  │  ├─ jwt_service.py
  │  │  └─ rate_limiter.py
  │  └─ utils/
  │     ├─ __init__.py
  │     └─ logger.py
  ├─ tests/
  │  ├─ unit/
  │  │  ├─ test_auth_middleware.py
  │  │  ├─ test_rate_limit.py
  │  │  └─ test_jwt_service.py
  │  └─ integration/
  │     └─ test_proxy.py
  ├─ Dockerfile
  ├─ Dockerfile.dev
  ├─ .dockerignore
  ├─ pyproject.toml
  └─ README.md
  ```

- [ ] **Implementation Checklist**
  - [ ] **main.py (FastAPI App)**
    ```python
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from contextlib import asynccontextmanager
    import structlog

    from src.config.settings import get_settings
    from src.middleware.auth import AuthMiddleware
    from src.middleware.rate_limit import RateLimitMiddleware
    from src.middleware.logging import LoggingMiddleware
    from src.routes import health, proxy, metrics

    settings = get_settings()
    logger = structlog.get_logger()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        logger.info("Starting API Gateway")
        yield
        logger.info("Shutting down API Gateway")

    app = FastAPI(
        title="Propmubi API Gateway",
        version="1.0.0",
        lifespan=lifespan
    )

    # Middleware
    app.add_middleware(CORSMiddleware, ...)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(AuthMiddleware)

    # Routes
    app.include_router(health.router, tags=["health"])
    app.include_router(proxy.router, prefix="/api/v1")
    app.include_router(metrics.router, tags=["metrics"])
    ```

  - [ ] **config/settings.py (Pydantic Settings)**
    ```python
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        environment: str = "development"
        debug: bool = True

        # Services
        auth_service_url: str = "http://auth-service:8001"
        user_service_url: str = "http://user-service:8002"
        property_service_url: str = "http://property-service:8003"

        # Redis
        redis_url: str = "redis://localhost:6379/0"

        # JWT
        jwt_secret_key: str
        jwt_algorithm: str = "HS256"

        # Rate Limiting
        rate_limit_per_minute: int = 60

        class Config:
            env_file = ".env"
    ```

  - [ ] **middleware/auth.py (JWT Validation)**
    ```python
    from fastapi import Request, HTTPException
    from jose import jwt, JWTError
    import structlog

    logger = structlog.get_logger()

    EXEMPT_PATHS = ["/health", "/metrics", "/api/v1/auth/login"]

    async def verify_token(token: str, settings) -> dict:
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm]
            )
            return payload
        except JWTError as e:
            logger.error("JWT validation failed", error=str(e))
            raise HTTPException(status_code=401, detail="Invalid token")

    class AuthMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            if request.url.path in EXEMPT_PATHS:
                return await call_next(request)

            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="Missing token")

            token = auth_header.split(" ")[1]
            payload = await verify_token(token, settings)
            request.state.user = payload

            return await call_next(request)
    ```

  - [ ] **middleware/rate_limit.py (Redis-based)**
    ```python
    import redis.asyncio as redis
    from fastapi import Request, HTTPException
    import time

    class RateLimitMiddleware(BaseHTTPMiddleware):
        def __init__(self, app, redis_url: str, max_requests: int = 60):
            super().__init__(app)
            self.redis = redis.from_url(redis_url)
            self.max_requests = max_requests

        async def dispatch(self, request: Request, call_next):
            # Extract user ID or IP
            user_id = request.state.user.get("sub") if hasattr(request.state, "user") else request.client.host
            key = f"rate_limit:{user_id}:{int(time.time() / 60)}"

            # Increment counter
            count = await self.redis.incr(key)
            if count == 1:
                await self.redis.expire(key, 60)

            if count > self.max_requests:
                raise HTTPException(status_code=429, detail="Rate limit exceeded")

            response = await call_next(request)
            response.headers["X-RateLimit-Limit"] = str(self.max_requests)
            response.headers["X-RateLimit-Remaining"] = str(self.max_requests - count)
            return response
    ```

  - [ ] **routes/health.py**
    ```python
    from fastapi import APIRouter

    router = APIRouter()

    @router.get("/health/live")
    async def liveness():
        return {"status": "alive"}

    @router.get("/health/ready")
    async def readiness():
        # Check dependencies (Redis, downstream services)
        return {"status": "ready"}

    @router.get("/health/startup")
    async def startup():
        return {"status": "started"}
    ```

  - [ ] **routes/proxy.py (Service Routing)**
    ```python
    import httpx
    from fastapi import APIRouter, Request, Response

    router = APIRouter()

    SERVICE_MAP = {
        "auth": settings.auth_service_url,
        "users": settings.user_service_url,
        "properties": settings.property_service_url,
    }

    @router.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    async def proxy_request(service: str, path: str, request: Request):
        if service not in SERVICE_MAP:
            return Response(status_code=404, content="Service not found")

        target_url = f"{SERVICE_MAP[service]}/{path}"

        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=dict(request.headers),
                content=await request.body()
            )

        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    ```

  - [ ] **routes/metrics.py (Prometheus)**
    ```python
    from prometheus_client import Counter, Histogram, generate_latest
    from fastapi import APIRouter, Response

    router = APIRouter()

    REQUEST_COUNT = Counter("http_requests_total", "Total HTTP requests", ["method", "endpoint", "status"])
    REQUEST_DURATION = Histogram("http_request_duration_seconds", "HTTP request duration")

    @router.get("/metrics")
    async def metrics():
        return Response(content=generate_latest(), media_type="text/plain")
    ```

- [ ] **Testing**
  - [ ] **tests/unit/test_auth_middleware.py**
    - [ ] Test valid JWT token
    - [ ] Test invalid JWT token
    - [ ] Test missing token
    - [ ] Test exempt paths

  - [ ] **tests/unit/test_rate_limit.py**
    - [ ] Test under limit
    - [ ] Test over limit
    - [ ] Test rate limit reset

  - [ ] **tests/integration/test_proxy.py**
    - [ ] Test request forwarding
    - [ ] Test response handling
    - [ ] Test error handling

  - [ ] Run tests:
    ```bash
    pytest tests/ --cov=src --cov-report=html --cov-report=term
    # Target: 85%+ coverage
    ```

- [ ] **Docker Configuration**
  - [ ] **Dockerfile (Multi-stage)**
    ```dockerfile
    # Build stage
    FROM python:3.11-slim as builder
    WORKDIR /app
    COPY pyproject.toml poetry.lock ./
    RUN pip install poetry && poetry export -f requirements.txt --output requirements.txt

    # Runtime stage
    FROM python:3.11-slim
    WORKDIR /app
    COPY --from=builder /app/requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY src/ ./src/

    EXPOSE 8000
    CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```

  - [ ] Build: `docker build -t propmubi/api-gateway:latest .`
  - [ ] Test: `docker run -p 8000:8000 propmubi/api-gateway:latest`

- [ ] **Helm Chart**
  - [ ] Create values file: `helm-charts/propmubi-microservices/values/api-gateway-values.yaml`
  - [ ] Configure:
    - Image: propmubi/api-gateway
    - Replicas: 2
    - Resources: 500m CPU, 512Mi RAM
    - HPA: 2-10 replicas
    - Ingress: api.propmubi.local

### Test Gate:
```bash
# Unit tests
pytest tests/unit/ --cov=src --cov-report=term
# Expected: >= 85% coverage

# Integration tests
pytest tests/integration/
# Expected: All pass

# Linting
black --check src/
isort --check src/
pylint src/
mypy src/

# Security
bandit -r src/
safety check

# Docker build
docker build -t propmubi/api-gateway:test .
```

### Acceptance Criteria:
- [ ] API Gateway routes requests to downstream services
- [ ] JWT authentication working
- [ ] Rate limiting working (Redis-based)
- [ ] Health endpoints responding
- [ ] Metrics endpoint exposing Prometheus metrics
- [ ] >= 85% code coverage
- [ ] All linting/security checks passing
- [ ] Docker image builds successfully
- [ ] Deployed to dev via ArgoCD
- [ ] Smoke test passing in dev

### Git Checkpoint:
- [ ] Branch: `feature/SVC-001-api-gateway`
- [ ] Commits:
  - [ ] "feat(SVC-001): initialize project structure"
  - [ ] "feat(SVC-001): implement auth middleware"
  - [ ] "feat(SVC-001): implement rate limiting"
  - [ ] "feat(SVC-001): implement service proxy"
  - [ ] "test(SVC-001): add unit and integration tests"
  - [ ] "chore(SVC-001): add Dockerfile and Helm chart"
- [ ] PR: #1 - API Gateway Service
- [ ] Reviews: 2 approvals
- [ ] Merge to develop
- [ ] Tag: `SVC-001-complete`

**Notes:**

---

_[Continue this detailed format for ALL remaining tasks: SVC-002 through DEPLOY-004]_

---

# PHASE 5: FRONTEND & UX/UI (ATOMIC DESIGN)

## [FE-001] Design System & Atomic Components
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** None (Can start in parallel)
- **Parallel With:** INFRA tasks, Backend services
- **Blocks:** FE-002 (Web App), FE-003 (Mobile App)
- **Effort:** Large (10-14 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Design System Foundation**
  - [ ] Create `packages/design-system/` directory
  - [ ] Initialize: `pnpm create vite@latest design-system --template react-ts`
  - [ ] Install dependencies:
    ```bash
    pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
    pnpm add @radix-ui/react-select @radix-ui/react-tabs
    pnpm add class-variance-authority clsx tailwind-merge
    pnpm add lucide-react
    pnpm add -D tailwindcss postcss autoprefixer
    pnpm add -D storybook @storybook/react-vite
    ```

  - [ ] Initialize Tailwind:
    ```bash
    npx tailwindcss init -p
    ```

  - [ ] Configure tailwind.config.js:
    ```js
    module.exports = {
      content: ['./src/**/*.{ts,tsx}'],
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#f0f9ff',
              500: '#0ea5e9',
              900: '#0c4a6e'
            },
            secondary: {...},
            accent: {...}
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Poppins', 'sans-serif']
          }
        }
      }
    }
    ```

- [ ] **Design Tokens**
  - [ ] Create `src/tokens/colors.ts`:
    ```ts
    export const colors = {
      primary: {
        main: '#0ea5e9',
        light: '#38bdf8',
        dark: '#0284c7',
      },
      // ... all colors
    }
    ```

  - [ ] `src/tokens/spacing.ts`
  - [ ] `src/tokens/typography.ts`
  - [ ] `src/tokens/shadows.ts`
  - [ ] `src/tokens/breakpoints.ts`

- [ ] **Atomic Design Structure**
  ```
  packages/design-system/src/
  ├─ atoms/
  │  ├─ Button/
  │  │  ├─ Button.tsx
  │  │  ├─ Button.stories.tsx
  │  │  ├─ Button.test.tsx
  │  │  └─ index.ts
  │  ├─ Input/
  │  ├─ Label/
  │  ├─ Badge/
  │  ├─ Avatar/
  │  ├─ Icon/
  │  ├─ Spinner/
  │  └─ Checkbox/
  ├─ molecules/
  │  ├─ SearchBar/
  │  ├─ FormField/
  │  ├─ Card/
  │  ├─ PropertyCard/
  │  ├─ Dropdown/
  │  └─ Modal/
  ├─ organisms/
  │  ├─ Header/
  │  ├─ Footer/
  │  ├─ PropertyList/
  │  ├─ FilterPanel/
  │  ├─ ChatWidget/
  │  └─ UserProfile/
  ├─ templates/
  │  ├─ PageLayout/
  │  ├─ DashboardLayout/
  │  └─ AuthLayout/
  └─ tokens/
  ```

- [ ] **Atoms Implementation**
  - [ ] **Button Component** (`atoms/Button/Button.tsx`):
    ```tsx
    import { cva, type VariantProps } from 'class-variance-authority'
    import { cn } from '@/lib/utils'

    const buttonVariants = cva(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      {
        variants: {
          variant: {
            default: 'bg-primary text-white hover:bg-primary/90',
            destructive: 'bg-red-500 text-white hover:bg-red-600',
            outline: 'border border-input bg-background hover:bg-accent',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
          },
          size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      }
    )

    export interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
      isLoading?: boolean
    }

    export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
          <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            disabled={isLoading}
            {...props}
          >
            {isLoading && <Spinner className="mr-2" size="sm" />}
            {children}
          </button>
        )
      }
    )
    ```

  - [ ] **Input Component** (`atoms/Input/Input.tsx`)
  - [ ] **Label Component**
  - [ ] **Badge Component**
  - [ ] **Avatar Component**
  - [ ] **Icon Component** (using lucide-react)
  - [ ] **Spinner Component**
  - [ ] **Checkbox Component**
  - [ ] **Radio Component**
  - [ ] **Switch Component**

- [ ] **Molecules Implementation**
  - [ ] **SearchBar** (`molecules/SearchBar/SearchBar.tsx`):
    ```tsx
    import { Input } from '@/atoms/Input'
    import { Button } from '@/atoms/Button'
    import { Search, Filter } from 'lucide-react'

    interface SearchBarProps {
      onSearch: (query: string) => void
      onFilterClick?: () => void
      placeholder?: string
    }

    export const SearchBar: React.FC<SearchBarProps> = ({
      onSearch,
      onFilterClick,
      placeholder = 'Search properties...'
    }) => {
      const [query, setQuery] = useState('')

      return (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
              placeholder={placeholder}
            />
          </div>
          {onFilterClick && (
            <Button variant="outline" size="icon" onClick={onFilterClick}>
              <Filter size={20} />
            </Button>
          )}
          <Button onClick={() => onSearch(query)}>Search</Button>
        </div>
      )
    }
    ```

  - [ ] **FormField** (Label + Input + Error)
  - [ ] **Card** (Container with shadow)
  - [ ] **PropertyCard** (Image + Title + Price + CTA)
  - [ ] **Dropdown Menu**
  - [ ] **Modal/Dialog**
  - [ ] **Toast Notification**
  - [ ] **Pagination**

- [ ] **Organisms Implementation**
  - [ ] **Header** (Logo + Nav + User Menu)
  - [ ] **Footer** (Links + Social + Copyright)
  - [ ] **PropertyList** (Grid of PropertyCards)
  - [ ] **FilterPanel** (Multiple filters with apply/reset)
  - [ ] **ChatWidget** (Chatbot interface)
  - [ ] **UserProfile** (Avatar + Name + Stats)
  - [ ] **PropertyDetailsPanel**
  - [ ] **DocumentUploader**

- [ ] **Templates Implementation**
  - [ ] **PageLayout**:
    ```tsx
    interface PageLayoutProps {
      header: React.ReactNode
      sidebar?: React.ReactNode
      children: React.ReactNode
      footer: React.ReactNode
    }

    export const PageLayout: React.FC<PageLayoutProps> = ({
      header, sidebar, children, footer
    }) => (
      <div className="min-h-screen flex flex-col">
        <header>{header}</header>
        <div className="flex-1 flex">
          {sidebar && <aside className="w-64">{sidebar}</aside>}
          <main className="flex-1">{children}</main>
        </div>
        <footer>{footer}</footer>
      </div>
    )
    ```

  - [ ] **DashboardLayout** (Sidebar + Main + Top Bar)
  - [ ] **AuthLayout** (Centered with brand)

- [ ] **Storybook Setup**
  - [ ] Initialize: `npx storybook@latest init`
  - [ ] Configure `.storybook/main.ts`
  - [ ] Create stories for all components
  - [ ] Example story (`Button.stories.tsx`):
    ```tsx
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
        variant: 'default',
        children: 'Button',
      },
    }

    export const Loading: Story = {
      args: {
        isLoading: true,
        children: 'Loading...',
      },
    }
    ```

  - [ ] Run Storybook: `pnpm storybook`
  - [ ] Deploy Storybook to Chromatic (optional)

- [ ] **Testing**
  - [ ] Install testing libraries:
    ```bash
    pnpm add -D @testing-library/react @testing-library/jest-dom
    pnpm add -D @testing-library/user-event vitest
    ```

  - [ ] Configure Vitest
  - [ ] Write tests for all components (>80% coverage)
  - [ ] Example test:
    ```tsx
    import { render, screen, fireEvent } from '@testing-library/react'
    import { Button } from './Button'

    describe('Button', () => {
      it('renders children', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
      })

      it('handles click events', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)
        fireEvent.click(screen.getByText('Click me'))
        expect(handleClick).toHaveBeenCalledTimes(1)
      })

      it('shows loading state', () => {
        render(<Button isLoading>Loading</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
      })
    })
    ```

- [ ] **Documentation**
  - [ ] README.md with component usage
  - [ ] Prop tables for all components
  - [ ] Design principles document
  - [ ] Contribution guidelines

### Test Gate:
```bash
# Unit tests
pnpm test --coverage
# Expected: >= 80% coverage

# Storybook build
pnpm build-storybook
# Expected: No errors

# Type checking
pnpm tsc --noEmit
# Expected: No errors
```

### Acceptance Criteria:
- [ ] All atomic components implemented and tested
- [ ] All molecule components implemented and tested
- [ ] All organism components implemented and tested
- [ ] All template components implemented and tested
- [ ] Storybook running with all component stories
- [ ] >= 80% test coverage
- [ ] Design tokens defined and documented
- [ ] Accessible (WCAG 2.1 AA compliance)
- [ ] Responsive (mobile-first)
- [ ] Dark mode support (optional)

### Git Checkpoint:
- [ ] Branch: `feature/FE-001-design-system`
- [ ] Tag: `FE-001-complete`

**Notes:**

---

## [FE-002] Chatbot Component & AI Chat Interface
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** FE-001, AI-001 (AI Orchestration)
- **Parallel With:** FE-003 (Web App)
- **Effort:** Medium (5-7 days)
- **Priority:** P1 (High)

### Detailed Checklist:
- [ ] **Chat UI Components**
  - [ ] `organisms/ChatWidget/`:
    - [ ] ChatWindow.tsx (Main container)
    - [ ] ChatHeader.tsx (Minimize/Close buttons)
    - [ ] ChatMessage.tsx (Single message bubble)
    - [ ] ChatInput.tsx (Input field + Send button)
    - [ ] TypingIndicator.tsx (Animated dots)
    - [ ] SuggestedQueries.tsx (Quick action buttons)

  - [ ] **ChatMessage Component**:
    ```tsx
    interface ChatMessageProps {
      message: {
        id: string
        role: 'user' | 'assistant'
        content: string
        timestamp: Date
        isStreaming?: boolean
      }
    }

    export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
      const isUser = message.role === 'user'

      return (
        <div className={cn(
          'flex gap-3 mb-4',
          isUser && 'flex-row-reverse'
        )}>
          <Avatar>
            {isUser ? <User /> : <Bot />}
          </Avatar>
          <div className={cn(
            'max-w-[70%] rounded-lg p-3',
            isUser ? 'bg-primary text-white' : 'bg-gray-100'
          )}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.isStreaming && <TypingIndicator />}
            <span className="text-xs opacity-70">
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>
        </div>
      )
    }
    ```

- [ ] **Chat State Management**
  - [ ] Create Zustand store: `stores/useChatStore.ts`:
    ```tsx
    interface ChatStore {
      conversations: Map<string, Message[]>
      activeConversationId: string | null
      isOpen: boolean

      sendMessage: (content: string) => Promise<void>
      clearConversation: () => void
      toggleChat: () => void
    }

    export const useChatStore = create<ChatStore>((set, get) => ({
      conversations: new Map(),
      activeConversationId: null,
      isOpen: false,

      sendMessage: async (content: string) => {
        const { activeConversationId } = get()
        const userMessage: Message = {
          id: nanoid(),
          role: 'user',
          content,
          timestamp: new Date()
        }

        // Add user message
        set((state) => {
          const messages = state.conversations.get(activeConversationId!) || []
          return {
            conversations: new Map(state.conversations).set(
              activeConversationId!,
              [...messages, userMessage]
            )
          }
        })

        // Stream AI response
        const stream = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: content })
        })

        // Handle streaming response
        // ... (implement streaming logic)
      },

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen }))
    }))
    ```

- [ ] **WebSocket Integration for Real-time Chat**
  - [ ] Install: `pnpm add socket.io-client`
  - [ ] Create `lib/socketClient.ts`:
    ```tsx
    import { io, Socket } from 'socket.io-client'

    export const createChatSocket = (conversationId: string): Socket => {
      const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
        path: '/ws/chat',
        query: { conversationId }
      })

      socket.on('connect', () => {
        console.log('Connected to chat')
      })

      socket.on('message', (data) => {
        // Handle incoming message
      })

      socket.on('typing', (data) => {
        // Show typing indicator
      })

      return socket
    }
    ```

- [ ] **Streaming Response Handling**
  - [ ] Implement SSE (Server-Sent Events) for token streaming
  - [ ] Or use WebSocket for bidirectional streaming
  - [ ] Update UI in real-time as tokens arrive

- [ ] **Context-Aware Suggestions**
  - [ ] Property search suggestions
  - [ ] EMI calculator shortcuts
  - [ ] Document upload prompts
  - [ ] Common queries:
    - "Show me 3BHK apartments under ₹1 Cr"
    - "Calculate EMI for ₹80 lakhs"
    - "Upload property documents"

- [ ] **Voice Input (Optional)**
  - [ ] Install: `pnpm add react-speech-recognition`
  - [ ] Add microphone button
  - [ ] Speech-to-text integration

- [ ] **Multi-modal Support**
  - [ ] Image upload for property inquiries
  - [ ] Document upload for analysis
  - [ ] PDF rendering in chat

### Test Gate:
```bash
pnpm test organisms/ChatWidget --coverage
# Expected: >= 80%
```

### Acceptance Criteria:
- [ ] Chat widget opens/closes smoothly
- [ ] Messages sent and received
- [ ] Streaming responses working
- [ ] Typing indicators working
- [ ] Markdown rendering in messages
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation)

### Git Checkpoint:
- [ ] Branch: `feature/FE-002-chatbot-interface`
- [ ] Tag: `FE-002-complete`

**Notes:**

---

## [FE-003] Next.js Web Application
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** FE-001 (Design System)
- **Parallel With:** FE-004 (React Native Mobile)
- **Blocks:** TEST-003 (E2E Tests)
- **Effort:** X-Large (14-21 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Project Setup**
  - [ ] Create Next.js app:
    ```bash
    cd apps/
    pnpx create-next-app@latest web --typescript --tailwind --app --src-dir
    ```
  - [ ] Install dependencies:
    ```bash
    pnpm add @tanstack/react-query zustand
    pnpm add axios zod
    pnpm add react-hook-form @hookform/resolvers
    pnpm add date-fns
    pnpm add @propmubi/design-system (local package)
    ```

- [ ] **Directory Structure**
  ```
  apps/web/
  ├─ src/
  │  ├─ app/
  │  │  ├─ (auth)/
  │  │  │  ├─ login/page.tsx
  │  │  │  ├─ register/page.tsx
  │  │  │  └─ layout.tsx
  │  │  ├─ (buyer)/
  │  │  │  ├─ search/page.tsx
  │  │  │  ├─ property/[id]/page.tsx
  │  │  │  └─ dashboard/page.tsx
  │  │  ├─ (investor)/
  │  │  ├─ (builder)/
  │  │  ├─ (agent)/
  │  │  ├─ api/
  │  │  │  ├─ auth/[...nextauth]/route.ts
  │  │  │  └─ chat/route.ts
  │  │  ├─ layout.tsx
  │  │  └─ page.tsx
  │  ├─ components/ (app-specific, not in design-system)
  │  ├─ lib/
  │  │  ├─ api.ts
  │  │  ├─ queryClient.ts
  │  │  └─ utils.ts
  │  ├─ hooks/
  │  │  ├─ useAuth.ts
  │  │  ├─ useProperties.ts
  │  │  └─ useChat.ts
  │  └─ stores/
  │     ├─ authStore.ts
  │     └─ searchStore.ts
  ├─ public/
  └─ tests/
  ```

- [ ] **Authentication Pages**
  - [ ] `app/(auth)/login/page.tsx`:
    ```tsx
    'use client'
    import { LoginForm } from '@propmubi/design-system'
    import { useAuth } from '@/hooks/useAuth'

    export default function LoginPage() {
      const { login, isLoading } = useAuth()

      const handleLogin = async (data: LoginData) => {
        await login(data)
      }

      return (
        <AuthLayout>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </AuthLayout>
      )
    }
    ```

  - [ ] Register page
  - [ ] OTP verification page
  - [ ] Forgot password flow

- [ ] **Buyer Journey Pages**
  - [ ] **Property Search** (`app/(buyer)/search/page.tsx`):
    - [ ] Search bar with filters
    - [ ] Property cards grid
    - [ ] Pagination
    - [ ] Sort options
    - [ ] Map view toggle

  - [ ] **Property Details** (`app/(buyer)/property/[id]/page.tsx`):
    - [ ] Image gallery
    - [ ] Property info (price, area, BHK, etc.)
    - [ ] Floor plan
    - [ ] Amenities
    - [ ] Location map
    - [ ] Similar properties
    - [ ] CTA: Book site visit, Apply for loan

  - [ ] **Buyer Dashboard** (`app/(buyer)/dashboard/page.tsx`):
    - [ ] Saved properties
    - [ ] Site visit schedule
    - [ ] Loan application status
    - [ ] Notifications

- [ ] **Investor Journey Pages**
  - [ ] Portfolio overview
  - [ ] Satellite monitoring
  - [ ] ROI analytics
  - [ ] Market intelligence

- [ ] **Builder Journey Pages**
  - [ ] Inventory management
  - [ ] Lead dashboard
  - [ ] Unit status tracker
  - [ ] Analytics

- [ ] **API Integration**
  - [ ] `lib/api.ts`:
    ```tsx
    import axios from 'axios'

    export const apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
    })

    // Request interceptor (add auth token)
    apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor (handle errors)
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
    ```

- [ ] **React Query Setup**
  - [ ] `lib/queryClient.ts`:
    ```tsx
    import { QueryClient } from '@tanstack/react-query'

    export const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          cacheTime: 10 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
    ```

  - [ ] Wrap app in QueryClientProvider
  - [ ] Create query hooks:
    ```tsx
    // hooks/useProperties.ts
    export const useProperties = (filters: SearchFilters) => {
      return useQuery({
        queryKey: ['properties', filters],
        queryFn: () => apiClient.get('/properties', { params: filters }),
      })
    }

    export const useProperty = (id: string) => {
      return useQuery({
        queryKey: ['property', id],
        queryFn: () => apiClient.get(`/properties/${id}`),
      })
    }
    ```

- [ ] **State Management**
  - [ ] Auth store (Zustand)
  - [ ] Search filters store
  - [ ] Cart/Wishlist store

- [ ] **SEO Optimization**
  - [ ] Metadata for all pages
  - [ ] Open Graph tags
  - [ ] JSON-LD structured data
  - [ ] Sitemap generation
  - [ ] robots.txt

- [ ] **Performance Optimization**
  - [ ] Image optimization (Next.js Image)
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Prefetching
  - [ ] Bundle analysis

- [ ] **PWA Support (Optional)**
  - [ ] Service worker
  - [ ] manifest.json
  - [ ] Offline fallback

### Test Gate:
```bash
# Build
pnpm build
# Expected: No errors

# Lighthouse score
# Expected: Performance > 90, Accessibility > 95

# E2E tests (Playwright)
pnpm test:e2e
```

### Acceptance Criteria:
- [ ] All persona pages implemented
- [ ] Authentication working
- [ ] API integration working
- [ ] Responsive on all screen sizes
- [ ] SEO optimized
- [ ] Lighthouse score > 90
- [ ] Deployed to dev environment

### Git Checkpoint:
- [ ] Branch: `feature/FE-003-web-app`
- [ ] Tag: `FE-003-complete`

**Notes:**

---

# PHASE 6: MOBILE APPLICATIONS

## [FE-004] React Native Mobile App (Android First, then iOS)
- **Status:** ✗ Not Started
- **Owner:** [Unassigned]
- **Dependencies:** FE-001 (Design System - adapt for RN)
- **Parallel With:** FE-003 (Web App)
- **Effort:** X-Large (14-21 days)
- **Priority:** P0 (Critical)

### Detailed Checklist:
- [ ] **Project Setup**
  - [ ] Initialize Expo:
    ```bash
    cd apps/
    npx create-expo-app mobile --template tabs
    ```
  - [ ] Install dependencies:
    ```bash
    npx expo install react-native-reanimated react-native-gesture-handler
    npx expo install @tanstack/react-query zustand
    npx expo install expo-image expo-camera expo-location
    ```

- [ ] **Adapt Design System for React Native**
  - [ ] Create `packages/design-system-native/`
  - [ ] Port atomic components to RN:
    - [ ] Button (Pressable)
    - [ ] Input (TextInput)
    - [ ] Card (View)
    - [ ] etc.
  - [ ] Use NativeWind for styling (Tailwind for RN)

- [ ] **Directory Structure**
  ```
  apps/mobile/
  ├─ app/
  │  ├─ (tabs)/
  │  │  ├─ index.tsx (Home)
  │  │  ├─ search.tsx
  │  │  ├─ saved.tsx
  │  │  └─ profile.tsx
  │  ├─ (auth)/
  │  │  ├─ login.tsx
  │  │  └─ register.tsx
  │  ├─ property/[id].tsx
  │  └─ _layout.tsx
  ├─ components/
  ├─ hooks/
  ├─ stores/
  ├─ lib/
  └─ assets/
  ```

- [ ] **Core Screens**
  - [ ] **Login Screen** (Expo Router)
  - [ ] **Property Search** (FlatList with PropertyCard)
  - [ ] **Property Details** (ScrollView with Image Carousel)
  - [ ] **Saved Properties**
  - [ ] **User Profile**

- [ ] **Native Features**
  - [ ] **Camera Integration**:
    ```tsx
    import { Camera } from 'expo-camera'

    const DocumentScanner = () => {
      const [hasPermission, setHasPermission] = useState(null)

      useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync()
          setHasPermission(status === 'granted')
        })()
      }, [])

      // Camera UI
    }
    ```

  - [ ] **Location Services**:
    ```tsx
    import * as Location from 'expo-location'

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      let location = await Location.getCurrentPositionAsync({})
      return location.coords
    }
    ```

  - [ ] **Push Notifications** (Expo Notifications)
  - [ ] **Deep Linking** (for property sharing)
  - [ ] **Biometric Auth** (Face ID / Fingerprint)

- [ ] **Offline Support**
  - [ ] Install: `npx expo install @react-native-async-storage/async-storage`
  - [ ] Cache API responses
  - [ ] Offline queue for actions
  - [ ] Sync when online

- [ ] **Android Build**
  - [ ] Configure `app.json`:
    ```json
    {
      "expo": {
        "name": "Propmubi",
        "slug": "propmubi",
        "android": {
          "package": "com.propmubi.app",
          "versionCode": 1,
          "adaptiveIcon": {
            "foregroundImage": "./assets/adaptive-icon.png",
            "backgroundColor": "#ffffff"
          }
        }
      }
    }
    ```

  - [ ] Build APK:
    ```bash
    eas build --platform android --profile preview
    ```

  - [ ] Test on physical device
  - [ ] Submit to Google Play (internal testing)

- [ ] **iOS Build (Same Codebase)**
  - [ ] Configure `app.json` for iOS:
    ```json
    {
      "ios": {
        "bundleIdentifier": "com.propmubi.app",
        "buildNumber": "1.0.0",
        "supportsTablet": true
      }
    }
    ```

  - [ ] Build IPA:
    ```bash
    eas build --platform ios --profile preview
    ```

  - [ ] Test on simulator and physical device
  - [ ] Submit to TestFlight

### Test Gate:
```bash
# Build
eas build --platform android --profile preview
eas build --platform ios --profile preview

# E2E (Detox)
pnpm test:e2e:android
```

### Acceptance Criteria:
- [ ] All core screens implemented
- [ ] Android APK builds successfully
- [ ] iOS IPA builds successfully (same code)
- [ ] Native features working (camera, location, push)
- [ ] Offline support working
- [ ] Performance: 60fps on mid-range devices
- [ ] Published to internal testing

### Git Checkpoint:
- [ ] Branch: `feature/FE-004-mobile-app`
- [ ] Tag: `FE-004-complete`

**Notes:**

---

# PROGRESS SUMMARY TEMPLATE

## Weekly Status Report

**Week Ending:** [Date]
**Sprint:** [Sprint Number]
**Team Velocity:** [Story Points Completed] / [Story Points Planned]

### Completed This Week
- [ ] [TASK-ID] Task Name (Owner: Name)
  - **Status:** ✓ Complete
  - **Completion Date:** YYYY-MM-DD
  - **Notes:** Brief summary of work

### In Progress
- [ ] [TASK-ID] Task Name (Owner: Name)
  - **Status:** ⧗ In Progress (60% complete)
  - **Blockers:** None / [Description]
  - **ETA:** YYYY-MM-DD

### Blocked
- [ ] [TASK-ID] Task Name (Owner: Name)
  - **Status:** ⚠ Blocked
  - **Blocker:** [Dependency not ready / Technical issue]
  - **Action:** [What needs to happen]

### Upcoming Next Week
- [ ] [TASK-ID] Task Name
- [ ] [TASK-ID] Task Name

### Risks & Issues
1. **Risk:** [Description]
   - **Impact:** High/Medium/Low
   - **Mitigation:** [Plan]

### Metrics
- **Code Coverage:** XX%
- **Build Success Rate:** XX%
- **Deployment Frequency:** X times/week
- **Mean Time to Recovery:** X hours
- **Lead Time:** X days

---

## APPENDIX: REVIEWER CHECKLIST FOR EACH TASK

### Code Review Checklist
- [ ] Code follows style guide (Pylint/ESLint passing)
- [ ] Tests written and passing (coverage >= target)
- [ ] No security vulnerabilities (Bandit/Snyk)
- [ ] Documentation updated (README, API docs)
- [ ] No hardcoded secrets
- [ ] Error handling implemented
- [ ] Logging added (structured logs)
- [ ] Performance considered (no N+1 queries)
- [ ] Accessibility (WCAG 2.1 AA for frontend)
- [ ] Mobile responsive (for web apps)
- [ ] Browser compatibility (latest 2 versions)
- [ ] Breaking changes documented
- [ ] Migration script provided (if DB changes)

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured
- [ ] Feature flags set (if applicable)
- [ ] Documentation updated
- [ ] Stakeholders notified
- [ ] Post-deployment smoke test plan ready

### Architecture Review Checklist
- [ ] Follows microservices principles (single responsibility)
- [ ] Proper separation of concerns
- [ ] API contracts defined (OpenAPI spec)
- [ ] Event schemas defined (for event-driven)
- [ ] No tight coupling
- [ ] Scalability considered
- [ ] Observability (logs, metrics, traces)
- [ ] Security best practices
- [ ] Data consistency strategy
- [ ] Failure modes considered

---

**END OF IMPLEMENTATION PROGRESS TRACKER**
