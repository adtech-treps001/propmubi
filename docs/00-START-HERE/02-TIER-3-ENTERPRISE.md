# 🚀 TIER 3: ENTERPRISE SCALE (Weeks 9-24)

**Starting Score**: 7.8/10
**Target Score**: 9.2+/10
**Gain**: +1.4 points
**Effort**: 640 hours (16 weeks × 40h)
**Goal**: FAANG-Level Architecture

---

## 🎯 TIER 3 OBJECTIVES

Transform from Series A to enterprise-grade:
1. **Microservices Architecture**: Decompose monolith into 9 independent services
2. **Event-Driven**: Async communication with event bus
3. **Production Infrastructure**: Kubernetes, auto-scaling, multi-region
4. **Complete Observability**: Distributed tracing, metrics, alerts
5. **CI/CD Pipeline**: Automated testing, staging, production deployments

---

## 📋 TIER 3 TASKS

### 🔴 Task 11: Microservices Decomposition
**Priority**: P0
**Impact**: +1.5 architecture, +1.0 scalability
**Effort**: 200 hours
**Status**: ❌ Not Started

#### Current Monolithic Structure
```
apps/api/
├── main.py               # Single FastAPI app
├── routers/
│   ├── auth.py           # Should be auth-service
│   ├── projects.py       # Should be property-service
│   ├── agent.py          # Should be agent-service
│   ├── crm.py            # Should be crm-service
│   ├── builder.py        # Should be builder-service
│   ├── trust.py          # Should be trust-service
│   ├── reputation.py     # Should be reputation-service
│   ├── legal.py          # Should be legal-service
│   └── content.py        # Should be content-service
```

#### Target Microservices Architecture
```
apps/
├── auth-service/         # Port 3001 - Authentication & Authorization
├── property-service/     # Port 3002 - Property listings, projects, units
├── trust-service/        # Port 3006 - Buyer trust scoring
├── legal-service/        # Port 3007 - Document verification
├── reputation-service/   # Port 3012 - Builder reputation scoring
├── inspection-service/   # Port 3013 - Property inspections
├── marketing-service/    # Port 3014 - Content, video reels
├── agent-service/        # Port 3015 - Agent onboarding, listings
└── crm-service/          # Port 3016 - Lead management, commissions
```

#### Implementation

**11.1 Service Template Structure**
```
apps/auth-service/
├── src/
│   ├── main.py                 # FastAPI app
│   ├── routers/
│   │   ├── login.py
│   │   ├── otp.py
│   │   └── consent.py
│   ├── models/
│   │   └── user.py             # SQLAlchemy models
│   ├── schemas/
│   │   └── auth_schemas.py     # Pydantic schemas
│   ├── repositories/
│   │   └── user_repository.py
│   ├── services/
│   │   └── jwt_service.py
│   └── config.py               # Service-specific config
├── tests/
│   ├── unit/
│   └── integration/
├── migrations/                 # Alembic
├── Dockerfile
├── requirements.txt
└── README.md
```

**11.2 Service Independence**

Each service must have:
- ✅ Dedicated database schema (or separate DB)
- ✅ Independent deployment
- ✅ Own CI/CD pipeline
- ✅ Service-to-service authentication
- ✅ API versioning
- ✅ Health checks

**11.3 Inter-Service Communication**

**Option A: REST (Synchronous)**
```python
# property-service calls trust-service
import httpx

TRUST_SERVICE_URL = os.getenv("TRUST_SERVICE_URL", "http://trust-service:3006")

async def get_buyer_trust_score(buyer_id: str) -> int:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TRUST_SERVICE_URL}/api/v1/trust/score/{buyer_id}",
            headers={"X-Service-Token": SERVICE_API_KEY}
        )
        response.raise_for_status()
        data = response.json()
        return data["score"]
```

**Option B: gRPC (High Performance)**
```proto
// protos/trust_service.proto
syntax = "proto3";

service TrustService {
  rpc GetTrustScore(TrustScoreRequest) returns (TrustScoreResponse);
}

message TrustScoreRequest {
  string buyer_id = 1;
}

message TrustScoreResponse {
  int32 score = 1;
  string tier = 2; // PLATINUM, GOLD, SILVER, BRONZE
}
```

```python
# property-service calls trust-service via gRPC
import grpc
from protos import trust_service_pb2, trust_service_pb2_grpc

channel = grpc.aio.insecure_channel('trust-service:50051')
stub = trust_service_pb2_grpc.TrustServiceStub(channel)

async def get_buyer_trust_score(buyer_id: str) -> int:
    request = trust_service_pb2.TrustScoreRequest(buyer_id=buyer_id)
    response = await stub.GetTrustScore(request)
    return response.score
```

**11.4 API Gateway**

Use Kong or Traefik to route requests:

```yaml
# kong.yml
services:
  - name: auth-service
    url: http://auth-service:3001
    routes:
      - name: auth-route
        paths:
          - /api/v1/auth

  - name: property-service
    url: http://property-service:3002
    routes:
      - name: property-route
        paths:
          - /api/v1/projects
          - /api/v1/units

  - name: trust-service
    url: http://trust-service:3006
    routes:
      - name: trust-route
        paths:
          - /api/v1/trust

plugins:
  - name: rate-limiting
    config:
      minute: 100
  - name: cors
  - name: jwt
```

**Client Request Flow**:
```
Frontend → API Gateway (Kong) → Service
http://localhost:8000/api/v1/projects/feed
    ↓
Kong routes to property-service:3002
    ↓
Property Service returns data
```

**11.5 Service Discovery (Kubernetes)**
```yaml
# k8s/base/property-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: property-service
spec:
  selector:
    app: property-service
  ports:
    - port: 3002
      targetPort: 3002
  type: ClusterIP
```

Services can call each other using DNS:
```python
PROPERTY_SERVICE_URL = "http://property-service.default.svc.cluster.local:3002"
```

#### Migration Strategy

**Phase 1: Extract Auth Service** (Week 9-10)
- Create `apps/auth-service/`
- Move auth routers, models, logic
- Deploy alongside monolith
- Update frontend to call auth-service directly

**Phase 2: Extract High-Traffic Services** (Week 11-12)
- property-service (most reads)
- trust-service (critical path)

**Phase 3: Extract Remaining Services** (Week 13-16)
- agent-service, crm-service, builder-service
- legal-service, reputation-service
- marketing-service, inspection-service

**Phase 4: Retire Monolith** (Week 17)
- All traffic routed to microservices
- Delete `apps/api/` (monolith)

#### Acceptance Criteria
- [ ] 9 independent microservices deployed
- [ ] Each service has dedicated database schema
- [ ] API Gateway routing all requests
- [ ] Service-to-service auth with JWT
- [ ] gRPC for internal high-throughput calls
- [ ] Service mesh (Istio) for observability
- [ ] Circuit breakers for fault tolerance
- [ ] All services independently scalable

#### Files to Create
- Create: `apps/auth-service/` (complete service)
- Create: `apps/property-service/`
- Create: `apps/trust-service/`
- Create: `apps/agent-service/`
- Create: `apps/crm-service/`
- Create: `apps/builder-service/`
- Create: `apps/legal-service/`
- Create: `apps/reputation-service/`
- Create: `apps/marketing-service/`
- Create: `k8s/base/api-gateway.yaml`
- Create: `protos/*.proto` (if using gRPC)

---

### 🔴 Task 12: Event-Driven Architecture
**Priority**: P0
**Impact**: +0.8 architecture, +0.7 scalability
**Effort**: 80 hours
**Status**: ❌ Not Started

#### Problem: Tight Coupling
```python
# Current: CRM service directly calls Agent service
@router.post("/leads/{lead_id}/assign")
async def assign_lead(lead_id: str, agent_id: str):
    # Update lead in CRM database
    lead.advisor_id = agent_id
    lead.status = "ACTIVE"

    # ❌ Tight coupling: CRM must know about Agent service
    agent_response = await httpx.post(
        f"{AGENT_SERVICE_URL}/notifications",
        json={"agent_id": agent_id, "message": "New lead assigned"}
    )

    # ❌ What if notification fails? Lead is already assigned.
    # ❌ Synchronous - CRM waits for Agent service
```

#### Solution: Event Bus

**12.1 Event Bus Architecture**
```
[CRM Service] → Publishes: "LeadAssigned" event → [Redis Streams]
                                                        ↓
                          [Agent Service] ← Subscribes to events
                          [Marketing Service] ← Also subscribes
                          [Analytics Service] ← Also subscribes
```

**Benefits**:
- Loose coupling (services don't know about each other)
- Asynchronous (non-blocking)
- Fault-tolerant (events persisted, can replay)
- Scalable (multiple consumers)

**12.2 Redis Streams Setup**
```python
# shared/events/event_bus.py
import redis.asyncio as redis
import json
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def publish_event(stream: str, event_type: str, data: dict):
    """Publish event to Redis stream"""
    event = {
        "type": event_type,
        "data": json.dumps(data),
        "timestamp": time.time()
    }
    await redis_client.xadd(stream, event)

async def subscribe_to_events(stream: str, consumer_group: str, consumer_name: str):
    """Subscribe to events from stream"""
    # Create consumer group if not exists
    try:
        await redis_client.xgroup_create(stream, consumer_group, id='0', mkstream=True)
    except redis.ResponseError:
        pass  # Group already exists

    while True:
        # Read new messages
        messages = await redis_client.xreadgroup(
            groupname=consumer_group,
            consumername=consumer_name,
            streams={stream: '>'},
            count=10,
            block=5000
        )

        for stream_name, stream_messages in messages:
            for message_id, message_data in stream_messages:
                yield message_id, message_data

                # Acknowledge message
                await redis_client.xack(stream, consumer_group, message_id)
```

**12.3 Domain Events**
```python
# shared/events/domain_events.py
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class DomainEvent:
    event_id: str
    event_type: str
    aggregate_id: str
    timestamp: datetime
    data: dict

class LeadAssignedEvent(DomainEvent):
    def __init__(self, lead_id: str, agent_id: str, project_id: str):
        super().__init__(
            event_id=str(uuid.uuid4()),
            event_type="LeadAssigned",
            aggregate_id=lead_id,
            timestamp=datetime.utcnow(),
            data={
                "lead_id": lead_id,
                "agent_id": agent_id,
                "project_id": project_id
            }
        )

class TrustScoreUpdatedEvent(DomainEvent):
    def __init__(self, buyer_id: str, old_score: int, new_score: int):
        super().__init__(
            event_id=str(uuid.uuid4()),
            event_type="TrustScoreUpdated",
            aggregate_id=buyer_id,
            timestamp=datetime.utcnow(),
            data={
                "buyer_id": buyer_id,
                "old_score": old_score,
                "new_score": new_score
            }
        )
```

**12.4 Publishing Events**
```python
# crm-service/src/routers/leads.py
from shared.events.event_bus import publish_event
from shared.events.domain_events import LeadAssignedEvent

@router.post("/leads/{lead_id}/assign")
async def assign_lead(lead_id: str, agent_id: str):
    # Update lead
    lead.advisor_id = agent_id
    lead.status = "ACTIVE"
    await db.commit()

    # Publish event (non-blocking)
    event = LeadAssignedEvent(lead_id, agent_id, lead.project_id)
    await publish_event(
        stream="crm:events",
        event_type="LeadAssigned",
        data=event.data
    )

    return {"status": "success"}
```

**12.5 Consuming Events**
```python
# agent-service/src/workers/event_consumer.py
from shared.events.event_bus import subscribe_to_events
import asyncio

async def handle_lead_assigned(event_data: dict):
    """Send notification to agent about new lead"""
    agent_id = event_data["agent_id"]
    lead_id = event_data["lead_id"]

    # Send push notification
    await send_push_notification(
        agent_id,
        f"New lead assigned: {lead_id}"
    )

async def consume_crm_events():
    async for message_id, message_data in subscribe_to_events(
        stream="crm:events",
        consumer_group="agent-service",
        consumer_name="worker-1"
    ):
        event_type = message_data["type"]

        if event_type == "LeadAssigned":
            data = json.loads(message_data["data"])
            await handle_lead_assigned(data)

# Run as background task
asyncio.create_task(consume_crm_events())
```

#### Event Catalog

| Event | Publisher | Subscribers | Purpose |
|-------|-----------|-------------|---------|
| `LeadAssigned` | CRM | Agent, Marketing | Notify agent, trigger follow-up |
| `TrustScoreUpdated` | Trust | Property, CRM | Update buyer eligibility |
| `ProjectCreated` | Property | Marketing, Agent | Generate content, notify agents |
| `DocumentVerified` | Legal | Trust, Reputation | Update trust/reputation scores |
| `PaymentReceived` | CRM | Builder, Agent | Trigger commission, update status |

#### Acceptance Criteria
- [ ] Redis Streams configured as event bus
- [ ] 10+ domain events defined
- [ ] All services publish events for state changes
- [ ] All services consume relevant events
- [ ] Event replay capability for debugging
- [ ] Dead-letter queue for failed events
- [ ] Event monitoring dashboard

---

### 🟡 Task 13: Production Infrastructure (Kubernetes)
**Priority**: P1
**Impact**: +1.0 scalability, +0.5 DevOps
**Effort**: 120 hours
**Status**: ❌ Not Started

#### Current State
- docker-compose for local dev only
- No production deployment
- Manual scaling

#### Target
- Kubernetes on AWS EKS or GCP GKE
- Auto-scaling
- Multi-region capability
- High availability

#### Implementation

**13.1 Kubernetes Cluster Setup**
```hcl
# terraform/aws/eks.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "propmubi-prod"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      min_size     = 3
      max_size     = 10
      desired_size = 5

      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"
    }

    cpu_optimized = {
      min_size     = 1
      max_size     = 5
      desired_size = 2

      instance_types = ["c6i.xlarge"]
      capacity_type  = "SPOT"

      labels = {
        workload = "compute-intensive"
      }
    }
  }

  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}
```

**13.2 Service Deployment**
```yaml
# k8s/base/property-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: property-service
  labels:
    app: property-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: property-service
  template:
    metadata:
      labels:
        app: property-service
    spec:
      containers:
      - name: property-service
        image: propmubi/property-service:1.0.0
        ports:
        - containerPort: 3002
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: redis_url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3002
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3002
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: property-service
spec:
  selector:
    app: property-service
  ports:
    - port: 3002
      targetPort: 3002
  type: ClusterIP
```

**13.3 Horizontal Pod Autoscaling**
```yaml
# k8s/base/property-service-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: property-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: property-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
```

**13.4 Ingress (Load Balancer)**
```yaml
# k8s/base/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: propmubi-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.propmubi.com
    secretName: propmubi-tls
  rules:
  - host: api.propmubi.com
    http:
      paths:
      - path: /api/v1/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 3001
      - path: /api/v1/projects
        pathType: Prefix
        backend:
          service:
            name: property-service
            port:
              number: 3002
      - path: /api/v1/trust
        pathType: Prefix
        backend:
          service:
            name: trust-service
            port:
              number: 3006
```

**13.5 Database Migration (RDS Upgrade)**
```hcl
# terraform/aws/rds.tf
resource "aws_db_instance" "postgres" {
  identifier = "propmubi-prod"

  # ✅ Upgrade from db.t3.micro
  instance_class = "db.r6g.xlarge"  # 4 vCPU, 32 GB RAM

  engine         = "postgres"
  engine_version = "15.4"

  allocated_storage     = 500  # GB
  max_allocated_storage = 2000 # Auto-scale to 2 TB
  storage_type          = "gp3"
  iops                  = 12000

  multi_az               = true  # High availability
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  performance_insights_enabled = true

  # Read replicas
  replicate_source_db = null  # Master
}

resource "aws_db_instance" "postgres_read_replica" {
  identifier = "propmubi-prod-read-replica"

  replicate_source_db = aws_db_instance.postgres.id
  instance_class      = "db.r6g.large"  # 2 vCPU, 16 GB RAM

  # Read-only queries go here
  publicly_accessible = false
}
```

**13.6 ElastiCache (Redis)**
```hcl
# terraform/aws/elasticache.tf
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "propmubi-redis"
  replication_group_description = "PropMubi Redis cluster"

  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.r6g.large"
  number_cache_clusters = 3

  automatic_failover_enabled = true
  multi_az_enabled          = true

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  subnet_group_name = aws_elasticache_subnet_group.redis.name

  parameter_group_name = "default.redis7"

  snapshot_retention_limit = 5
  snapshot_window         = "03:00-04:00"
}
```

#### Acceptance Criteria
- [ ] EKS/GKE cluster provisioned with Terraform
- [ ] All 9 microservices deployed
- [ ] Horizontal Pod Autoscaling configured
- [ ] RDS upgraded to db.r6g.xlarge with read replica
- [ ] ElastiCache Redis cluster (3 nodes, multi-AZ)
- [ ] Ingress controller with TLS
- [ ] Secrets managed via Kubernetes Secrets or AWS Secrets Manager
- [ ] Resource requests and limits set for all pods

---

### 🟡 Task 14: Complete Observability Stack
**Priority**: P1
**Impact**: +2.0 observability
**Effort**: 80 hours
**Status**: ❌ Not Started

#### Three Pillars of Observability
1. **Logs**: Structured logs with context
2. **Metrics**: Performance counters, business metrics
3. **Traces**: Distributed request tracing

#### Implementation

**14.1 Structured Logging (Already in TIER 1)**
```python
# ✅ Already implemented in TIER 1
logger.info("Request completed", extra={
    "correlation_id": correlation_id,
    "duration_ms": 125,
    "status_code": 200
})
```

**14.2 Metrics (Prometheus)**
```python
# shared/metrics/prometheus_metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest

# Request counter
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

# Response time histogram
http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

# Active connections gauge
active_connections = Gauge(
    'active_connections',
    'Number of active connections'
)

# Business metrics
leads_created_total = Counter(
    'leads_created_total',
    'Total leads created',
    ['source']
)

trust_scores = Histogram(
    'trust_scores',
    'Distribution of trust scores',
    buckets=[0, 60, 75, 90, 100]
)

@router.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

```python
# Middleware to track metrics
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    http_requests_total.labels(
        method=request.method,
        endpoint=request.url.path,
        status_code=response.status_code
    ).inc()

    http_request_duration_seconds.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)

    return response

app.middleware("http")(metrics_middleware)
```

**14.3 Distributed Tracing (Jaeger + OpenTelemetry)**
```python
# shared/tracing/opentelemetry_config.py
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

def setup_tracing(app, service_name: str):
    # Setup tracer provider
    trace.set_tracer_provider(TracerProvider())

    # Configure Jaeger exporter
    jaeger_exporter = JaegerExporter(
        agent_host_name="jaeger",
        agent_port=6831,
    )

    # Add span processor
    trace.get_tracer_provider().add_span_processor(
        BatchSpanProcessor(jaeger_exporter)
    )

    # Auto-instrument FastAPI
    FastAPIInstrumentor.instrument_app(app, tracer_provider=trace.get_tracer_provider())

    # Auto-instrument httpx (for service-to-service calls)
    HTTPXClientInstrumentor().instrument()

    # Auto-instrument SQLAlchemy
    SQLAlchemyInstrumentor().instrument(
        engine=engine,
        service=service_name
    )

# In each service's main.py
from shared.tracing.opentelemetry_config import setup_tracing

app = FastAPI()
setup_tracing(app, service_name="property-service")
```

**Trace Propagation**:
```python
# property-service calls trust-service
import httpx
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

async def get_buyer_trust_score(buyer_id: str):
    with tracer.start_as_current_span("get_trust_score"):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{TRUST_SERVICE_URL}/api/v1/trust/score/{buyer_id}"
            )
            return response.json()
```

**14.4 Monitoring Stack Deployment**
```yaml
# k8s/monitoring/prometheus.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
        - role: pod
        relabel_configs:
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
          target_label: __metrics_path__
          regex: (.+)
        - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          target_label: __address__
          regex: ([^:]+)(?::\d+)?;(\d+)
          replacement: $1:$2

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
        - name: storage
          mountPath: /prometheus
      volumes:
      - name: config
        configMap:
          name: prometheus-config
      - name: storage
        persistentVolumeClaim:
          claimName: prometheus-storage
```

**14.5 Grafana Dashboards**
```json
// grafana/dashboards/api-overview.json
{
  "dashboard": {
    "title": "PropMubi API Overview",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Response Time (p95)",
        "targets": [{
          "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
        }]
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])"
        }]
      },
      {
        "title": "Trust Score Distribution",
        "targets": [{
          "expr": "trust_scores_bucket"
        }]
      }
    ]
  }
}
```

**14.6 Alerting (Alertmanager)**
```yaml
# prometheus/alerts.yml
groups:
- name: api_alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} req/s"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High response time"
      description: "P95 latency is {{ $value }}s"

  - alert: DatabaseConnectionPoolExhausted
    expr: active_connections > 18
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Database connection pool near limit"
```

#### Acceptance Criteria
- [ ] Prometheus deployed and scraping all services
- [ ] Grafana dashboards for API, database, cache, business metrics
- [ ] Jaeger for distributed tracing
- [ ] OpenTelemetry instrumentation in all services
- [ ] Alertmanager configured with PagerDuty/Slack integration
- [ ] 10+ alerts defined for critical metrics
- [ ] Logs aggregated in Loki or ELK stack

---

### 🟡 Task 15: CI/CD Pipeline
**Priority**: P1
**Impact**: +1.5 DevOps
**Effort**: 60 hours
**Status**: ❌ Not Started

#### Current State
- Manual deployment
- No automated testing
- No staging environment

#### Target
- GitHub Actions for CI/CD
- Automated testing on every PR
- Staging environment
- Blue-green deployments to production

#### Implementation

**15.1 GitHub Actions Workflow**
```yaml
# .github/workflows/property-service.yml
name: Property Service CI/CD

on:
  pull_request:
    paths:
      - 'apps/property-service/**'
  push:
    branches:
      - main
    paths:
      - 'apps/property-service/**'

env:
  SERVICE_NAME: property-service
  AWS_REGION: ap-south-1
  EKS_CLUSTER: propmubi-prod

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:15-3.3
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd apps/${{ env.SERVICE_NAME }}
          pip install poetry
          poetry install

      - name: Run linters
        run: |
          cd apps/${{ env.SERVICE_NAME }}
          poetry run black --check src/
          poetry run ruff check src/

      - name: Run tests
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
        run: |
          cd apps/${{ env.SERVICE_NAME }}
          poetry run pytest tests/ --cov=src --cov-report=xml --cov-report=term

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: apps/${{ env.SERVICE_NAME }}/coverage.xml
          flags: ${{ env.SERVICE_NAME }}

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd apps/${{ env.SERVICE_NAME }}
          docker build -t $ECR_REGISTRY/$SERVICE_NAME:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$SERVICE_NAME:$IMAGE_TAG $ECR_REGISTRY/$SERVICE_NAME:latest
          docker push $ECR_REGISTRY/$SERVICE_NAME:$IMAGE_TAG
          docker push $ECR_REGISTRY/$SERVICE_NAME:latest

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }}-staging --region ${{ env.AWS_REGION }}

      - name: Deploy to Staging
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          kubectl set image deployment/$SERVICE_NAME \
            $SERVICE_NAME=${{ steps.login-ecr.outputs.registry }}/$SERVICE_NAME:$IMAGE_TAG \
            -n staging

          kubectl rollout status deployment/$SERVICE_NAME -n staging

      - name: Run smoke tests
        run: |
          curl --fail https://staging-api.propmubi.com/api/v1/health || exit 1

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }} --region ${{ env.AWS_REGION }}

      - name: Blue-Green Deployment
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          # Deploy to green environment
          kubectl set image deployment/$SERVICE_NAME-green \
            $SERVICE_NAME=${{ steps.login-ecr.outputs.registry }}/$SERVICE_NAME:$IMAGE_TAG \
            -n production

          kubectl rollout status deployment/$SERVICE_NAME-green -n production

          # Switch traffic to green
          kubectl patch service $SERVICE_NAME -n production \
            -p '{"spec":{"selector":{"version":"green"}}}'

          # Wait for traffic to stabilize
          sleep 60

          # Update blue to new version (for rollback capability)
          kubectl set image deployment/$SERVICE_NAME-blue \
            $SERVICE_NAME=${{ steps.login-ecr.outputs.registry }}/$SERVICE_NAME:$IMAGE_TAG \
            -n production
```

#### Acceptance Criteria
- [ ] CI pipeline runs tests on every PR
- [ ] CD pipeline deploys to staging on merge to main
- [ ] Production deployment requires manual approval
- [ ] Blue-green deployments for zero-downtime
- [ ] Automated rollback on health check failure
- [ ] Separate workflows for each microservice
- [ ] Test coverage reports in PR comments

---

## 📊 TIER 3 COMPLETION METRICS

### Score Impact
| Dimension | Before (T2) | After (T3) | Gain |
|-----------|-------------|------------|------|
| Architecture | 7.5 | 9.5 | +2.0 |
| Scalability | 6.5 | 9.5 | +3.0 |
| DevOps | 3.0 | 9.0 | +6.0 |
| Observability | 5.5 | 9.5 | +4.0 |
| Testing | 7.5 | 9.0 | +1.5 |
| Security | 6.5 | 8.5 | +2.0 |
| **Overall** | **7.8** | **9.2** | **+1.4** |

---

**Document Status**: ✅ Complete
**Last Updated**: 2026-01-10
**Next**: `03-IMPLEMENTATION-CHECKLIST.md`
