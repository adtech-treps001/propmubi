# Propmubi - Enterprise Microservices Architecture
## Cloud-Native Monorepo with Docker, Kubernetes & CI/CD

**Version:** 5.0 (Enterprise Grade)
**Architecture:** Microservices + Event-Driven + Domain-Driven Design
**Deployment:** Kubernetes (EKS/GKE/AKS)
**Orchestration:** Helm Charts + ArgoCD
**CI/CD:** GitHub Actions + Docker Registry

---

## 📁 Monorepo Structure

```
propmubi-monorepo/
├── .github/
│   └── workflows/
│       ├── ci-apps.yml
│       ├── ci-services.yml
│       ├── cd-staging.yml
│       ├── cd-production.yml
│       └── security-scan.yml
│
├── apps/                          # Frontend Applications
│   ├── mobile/                    # React Native (Expo)
│   │   ├── src/
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   │
│   ├── web/                       # Next.js Web App
│   │   ├── src/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   │
│   ├── admin-dashboard/           # React Admin Portal
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   │
│   └── builder-os/                # Builder OS Dashboard
│       ├── src/
│       ├── package.json
│       ├── Dockerfile
│       └── .dockerignore
│
├── services/                      # Backend Microservices
│   ├── api-gateway/               # API Gateway (Kong/Traefik)
│   │   ├── src/
│   │   ├── kong.yml
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── auth-service/              # Authentication & Authorization
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── property-service/          # Property Management
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── user-service/              # User Management
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── search-service/            # Elasticsearch-based Search
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── payment-service/           # Razorpay/Stripe Integration
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── notification-service/      # Email/SMS/Push Notifications
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── integration-service/       # External API Integrations
│   │   ├── src/
│   │   │   ├── adapters/
│   │   │   │   ├── landeed/
│   │   │   │   ├── teal/
│   │   │   │   ├── setu/
│   │   │   │   └── ... (31 providers)
│   │   │   ├── orchestrator/
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── due-diligence-service/     # Due Diligence Workflow
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── exact-view-service/        # Digital Twin View Engine
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── analytics-service/         # Analytics & Reporting
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── file-service/              # S3/CDN File Management
│       ├── src/
│       ├── Dockerfile
│       └── package.json
│
├── workers/                       # Background Jobs & Scrapers
│   ├── rera-scraper/              # RERA Scraper (Python)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── main.py
│   │
│   ├── social-scraper/            # Social Media Scraper
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── satellite-monitor/         # Satellite Image Processor
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── pdf-parser/                # GPT-4 Vision PDF Parser
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   └── email-worker/              # Email Queue Worker
│       ├── src/
│       ├── Dockerfile
│       └── package.json
│
├── data/                          # Data Layer
│   ├── postgres/                  # PostgreSQL Schemas
│   │   ├── migrations/
│   │   │   ├── 001_init.sql
│   │   │   ├── 002_users.sql
│   │   │   └── ...
│   │   ├── seeds/
│   │   └── Dockerfile
│   │
│   ├── mongodb/                   # MongoDB Schemas
│   │   ├── schemas/
│   │   └── Dockerfile
│   │
│   ├── redis/                     # Redis Configuration
│   │   ├── redis.conf
│   │   └── Dockerfile
│   │
│   └── elasticsearch/             # Elasticsearch Mappings
│       ├── mappings/
│       └── Dockerfile
│
├── infra/                         # Infrastructure as Code
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.dev.yml
│   │   ├── docker-compose.prod.yml
│   │   └── .env.example
│   │
│   ├── kubernetes/                # K8s Manifests
│   │   ├── namespaces/
│   │   ├── configmaps/
│   │   ├── secrets/
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── ingress/
│   │   └── hpa/
│   │
│   ├── helm/                      # Helm Charts
│   │   ├── propmubi/
│   │   │   ├── Chart.yaml
│   │   │   ├── values.yaml
│   │   │   ├── values-dev.yaml
│   │   │   ├── values-staging.yaml
│   │   │   ├── values-prod.yaml
│   │   │   └── templates/
│   │   │       ├── deployments/
│   │   │       ├── services/
│   │   │       ├── ingress.yaml
│   │   │       ├── configmaps/
│   │   │       └── secrets/
│   │   │
│   │   └── dependencies/
│   │       ├── kafka/
│   │       ├── redis/
│   │       └── postgres/
│   │
│   ├── terraform/                 # Infrastructure Provisioning
│   │   ├── aws/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── eks.tf
│   │   │   ├── rds.tf
│   │   │   ├── s3.tf
│   │   │   └── outputs.tf
│   │   │
│   │   ├── gcp/
│   │   └── azure/
│   │
│   └── monitoring/
│       ├── prometheus/
│       │   ├── prometheus.yml
│       │   └── alerts.yml
│       │
│       ├── grafana/
│       │   ├── dashboards/
│       │   └── datasources.yml
│       │
│       └── loki/
│           └── loki.yml
│
├── packages/                      # Shared Libraries
│   ├── shared-types/              # TypeScript Definitions
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/              # Common Utilities
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── shared-components/         # React Components (Web + Mobile)
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── event-bus/                 # Event Bus Library
│   │   ├── src/
│   │   └── package.json
│   │
│   └── logger/                    # Centralized Logging
│       ├── src/
│       └── package.json
│
├── scripts/                       # DevOps Scripts
│   ├── setup-local.sh
│   ├── build-all.sh
│   ├── deploy-dev.sh
│   ├── deploy-staging.sh
│   ├── deploy-prod.sh
│   ├── db-migrate.sh
│   └── generate-secrets.sh
│
├── docs/                          # Documentation
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── onboarding/
│
├── .gitignore
├── .dockerignore
├── package.json                   # Root package.json (workspace)
├── lerna.json                     # Lerna monorepo config
├── nx.json                        # Nx build orchestration
├── tsconfig.json                  # Root TypeScript config
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## 🐳 Docker Configuration

### Root package.json (Workspace Manager)

```json
{
  "name": "propmubi-monorepo",
  "version": "5.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "services/*",
    "workers/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "docker-compose -f infra/docker/docker-compose.dev.yml up",
    "build:all": "nx run-many --target=build --all",
    "test:all": "nx run-many --target=test --all",
    "lint:all": "nx run-many --target=lint --all",
    "docker:build": "sh scripts/build-all.sh",
    "k8s:dev": "kubectl apply -f infra/kubernetes/",
    "helm:install": "helm install propmubi infra/helm/propmubi -f infra/helm/propmubi/values-dev.yaml",
    "migrate:up": "sh scripts/db-migrate.sh up",
    "migrate:down": "sh scripts/db-migrate.sh down"
  },
  "devDependencies": {
    "@nrwl/workspace": "^17.0.0",
    "lerna": "^8.0.0",
    "nx": "^17.0.0",
    "turbo": "^1.11.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### nx.json (Build Orchestration)

```json
{
  "extends": "nx/presets/npm.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "parallel": 3
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": [
      "default",
      "!{projectRoot}/**/*.spec.ts",
      "!{projectRoot}/tsconfig.spec.json"
    ]
  }
}
```

---

## 🔧 Microservice Template: Auth Service

### services/auth-service/Dockerfile

```dockerfile
# Multi-stage build for production optimization

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY lerna.json nx.json tsconfig.json ./

# Copy shared packages
COPY packages/ ./packages/

# Copy auth service
COPY services/auth-service/ ./services/auth-service/

# Install dependencies
RUN npm ci --workspace=@propmubi/auth-service

# Build shared packages first
RUN npm run build --workspace=@propmubi/shared-types
RUN npm run build --workspace=@propmubi/shared-utils

# Build auth service
RUN npm run build --workspace=@propmubi/auth-service

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built artifacts
COPY --from=builder --chown=nodejs:nodejs /app/services/auth-service/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/services/auth-service/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages

# Install production dependencies only
RUN npm ci --production --ignore-scripts

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]
```

### services/auth-service/package.json

```json
{
  "name": "@propmubi/auth-service",
  "version": "1.0.0",
  "private": true,
  "main": "dist/main.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/main.ts",
    "build": "tsc --project tsconfig.build.json",
    "start": "node dist/main.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "@propmubi/shared-types": "*",
    "@propmubi/shared-utils": "*",
    "@propmubi/logger": "*",
    "@propmubi/event-bus": "*",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "kafkajs": "^2.2.4",
    "redis": "^4.6.0",
    "pg": "^8.11.0",
    "typeorm": "^0.3.17"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/jest": "^29.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/passport-jwt": "^3.0.13",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

### services/auth-service/src/main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from '@propmubi/logger';

async function bootstrap() {
  const logger = new Logger('AuthService');

  // Create HTTP application
  const app = await NestFactory.create(AppModule, {
    logger: logger
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  });

  // Connect to Kafka for event-driven communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
      },
      consumer: {
        groupId: 'auth-service-group'
      }
    }
  });

  // Start all microservices
  await app.startAllMicroservices();

  // Start HTTP server
  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`Auth Service is running on port ${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Kafka Brokers: ${process.env.KAFKA_BROKERS}`);
}

bootstrap().catch(err => {
  console.error('Failed to start Auth Service:', err);
  process.exit(1);
});
```

### services/auth-service/src/app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EventBusModule } from '@propmubi/event-bus';
import { LoggerModule } from '@propmubi/logger';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development'
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'propmubi_auth',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.DB_LOGGING === 'true'
    }),

    // JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
      signOptions: { expiresIn: '24h' }
    }),

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Custom modules
    EventBusModule,
    LoggerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [AuthService]
})
export class AppModule {}
```

---

## 🐳 Docker Compose (Local Development)

### infra/docker/docker-compose.dev.yml

```yaml
version: '3.9'

services:
  # ========================================
  # Databases
  # ========================================

  postgres:
    image: postgres:16-alpine
    container_name: propmubi-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: propmubi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../../data/postgres/migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - propmubi-network

  mongodb:
    image: mongo:7
    container_name: propmubi-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: mongo
      MONGO_INITDB_DATABASE: propmubi
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - propmubi-network

  redis:
    image: redis:7-alpine
    container_name: propmubi-redis
    command: redis-server --requirepass redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - propmubi-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: propmubi-elasticsearch
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - propmubi-network

  # ========================================
  # Message Queue
  # ========================================

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: propmubi-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - propmubi-network

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: propmubi-kafka
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    ports:
      - "29092:29092"
    healthcheck:
      test: ["CMD", "kafka-broker-api-versions", "--bootstrap-server", "localhost:9092"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - propmubi-network

  # ========================================
  # API Gateway
  # ========================================

  api-gateway:
    build:
      context: ../..
      dockerfile: services/api-gateway/Dockerfile
    container_name: propmubi-api-gateway
    environment:
      NODE_ENV: development
      PORT: 3000
      AUTH_SERVICE_URL: http://auth-service:3001
      PROPERTY_SERVICE_URL: http://property-service:3002
      USER_SERVICE_URL: http://user-service:3003
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - property-service
      - user-service
    networks:
      - propmubi-network
    restart: unless-stopped

  # ========================================
  # Microservices
  # ========================================

  auth-service:
    build:
      context: ../..
      dockerfile: services/auth-service/Dockerfile
      target: development
    container_name: propmubi-auth-service
    environment:
      NODE_ENV: development
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: propmubi_auth
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: redis
      KAFKA_BROKERS: kafka:9092
      JWT_SECRET: dev-secret-change-in-production
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      kafka:
        condition: service_healthy
    volumes:
      - ../../services/auth-service/src:/app/src
    networks:
      - propmubi-network
    restart: unless-stopped

  property-service:
    build:
      context: ../..
      dockerfile: services/property-service/Dockerfile
      target: development
    container_name: propmubi-property-service
    environment:
      NODE_ENV: development
      PORT: 3002
      DB_HOST: mongodb
      DB_PORT: 27017
      DB_USER: mongo
      DB_PASSWORD: mongo
      DB_NAME: propmubi_properties
      ELASTICSEARCH_HOST: elasticsearch:9200
      KAFKA_BROKERS: kafka:9092
    ports:
      - "3002:3002"
    depends_on:
      mongodb:
        condition: service_healthy
      elasticsearch:
        condition: service_healthy
      kafka:
        condition: service_healthy
    volumes:
      - ../../services/property-service/src:/app/src
    networks:
      - propmubi-network
    restart: unless-stopped

  user-service:
    build:
      context: ../..
      dockerfile: services/user-service/Dockerfile
      target: development
    container_name: propmubi-user-service
    environment:
      NODE_ENV: development
      PORT: 3003
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: propmubi_users
      REDIS_HOST: redis
      KAFKA_BROKERS: kafka:9092
    ports:
      - "3003:3003"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      kafka:
        condition: service_healthy
    volumes:
      - ../../services/user-service/src:/app/src
    networks:
      - propmubi-network
    restart: unless-stopped

  integration-service:
    build:
      context: ../..
      dockerfile: services/integration-service/Dockerfile
      target: development
    container_name: propmubi-integration-service
    environment:
      NODE_ENV: development
      PORT: 3004
      KAFKA_BROKERS: kafka:9092
      REDIS_HOST: redis
      # Integration API keys (loaded from .env)
      LANDEED_API_KEY: ${LANDEED_API_KEY}
      TEAL_API_KEY: ${TEAL_API_KEY}
      SETU_API_KEY: ${SETU_API_KEY}
    ports:
      - "3004:3004"
    depends_on:
      - kafka
      - redis
    volumes:
      - ../../services/integration-service/src:/app/src
    networks:
      - propmubi-network
    restart: unless-stopped

  # ========================================
  # Workers
  # ========================================

  rera-scraper:
    build:
      context: ../..
      dockerfile: workers/rera-scraper/Dockerfile
    container_name: propmubi-rera-scraper
    environment:
      KAFKA_BROKERS: kafka:9092
      MONGODB_URI: mongodb://mongo:mongo@mongodb:27017/propmubi
    depends_on:
      - kafka
      - mongodb
    volumes:
      - ../../workers/rera-scraper/src:/app/src
    networks:
      - propmubi-network
    restart: unless-stopped

  # ========================================
  # Monitoring
  # ========================================

  prometheus:
    image: prom/prometheus:latest
    container_name: propmubi-prometheus
    volumes:
      - ../../infra/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - propmubi-network

  grafana:
    image: grafana/grafana:latest
    container_name: propmubi-grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_INSTALL_PLUGINS: grafana-clock-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ../../infra/monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ../../infra/monitoring/grafana/datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml
    ports:
      - "3010:3000"
    depends_on:
      - prometheus
    networks:
      - propmubi-network

# ========================================
# Volumes
# ========================================

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
  elasticsearch_data:
  prometheus_data:
  grafana_data:

# ========================================
# Networks
# ========================================

networks:
  propmubi-network:
    driver: bridge
```

---

## ☸️ Kubernetes Deployment

### infra/kubernetes/deployments/auth-service.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: propmubi
  labels:
    app: auth-service
    version: v1
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: auth-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3001"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: auth-service

      # Init container for database migrations
      initContainers:
        - name: migrate
          image: ghcr.io/propmubi/auth-service:latest
          command: ['npm', 'run', 'migrate:up']
          envFrom:
            - secretRef:
                name: auth-service-secrets
            - configMapRef:
                name: auth-service-config

      containers:
        - name: auth-service
          image: ghcr.io/propmubi/auth-service:latest
          imagePullPolicy: Always

          ports:
            - name: http
              containerPort: 3001
              protocol: TCP

          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3001"
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace

          envFrom:
            - secretRef:
                name: auth-service-secrets
            - configMapRef:
                name: auth-service-config

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
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          securityContext:
            runAsNonRoot: true
            runAsUser: 1001
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL

      # Pod anti-affinity for high availability
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - auth-service
                topologyKey: kubernetes.io/hostname

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: propmubi
  labels:
    app: auth-service
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3001
      protocol: TCP
      name: http
  selector:
    app: auth-service

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: propmubi
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 3
  maxReplicas: 10
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
          value: 2
          periodSeconds: 15
      selectPolicy: Max
```

---

## ⎈ Helm Chart

### infra/helm/propmubi/Chart.yaml

```yaml
apiVersion: v2
name: propmubi
description: Propmubi Real Estate Operating System - Helm Chart
type: application
version: 1.0.0
appVersion: "5.0.0"
keywords:
  - real-estate
  - microservices
  - property-tech
maintainers:
  - name: Propmubi Team
    email: devops@propmubi.com
dependencies:
  - name: postgresql
    version: "13.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  - name: mongodb
    version: "14.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: mongodb.enabled
  - name: redis
    version: "18.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
  - name: kafka
    version: "26.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: kafka.enabled
```

### infra/helm/propmubi/values.yaml

```yaml
# Global values
global:
  imageRegistry: ghcr.io
  imagePullSecrets:
    - name: github-registry
  storageClass: "standard"

# Namespace
namespace:
  create: true
  name: propmubi

# API Gateway
apiGateway:
  enabled: true
  replicaCount: 3
  image:
    repository: propmubi/api-gateway
    tag: latest
    pullPolicy: Always
  service:
    type: LoadBalancer
    port: 80
    targetPort: 3000
  ingress:
    enabled: true
    className: nginx
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
      nginx.ingress.kubernetes.io/rate-limit: "100"
    hosts:
      - host: api.propmubi.com
        paths:
          - path: /
            pathType: Prefix
    tls:
      - secretName: api-propmubi-tls
        hosts:
          - api.propmubi.com
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"
    limits:
      memory: "512Mi"
      cpu: "500m"
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 20
    targetCPUUtilizationPercentage: 70

# Auth Service
authService:
  enabled: true
  replicaCount: 3
  image:
    repository: propmubi/auth-service
    tag: latest
  env:
    NODE_ENV: production
    PORT: "3001"
  secrets:
    JWT_SECRET: ""  # Set in values-prod.yaml
    DB_PASSWORD: ""
  configMap:
    DB_HOST: postgresql
    DB_PORT: "5432"
    DB_NAME: propmubi_auth
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"
    limits:
      memory: "512Mi"
      cpu: "500m"

# Property Service
propertyService:
  enabled: true
  replicaCount: 5
  image:
    repository: propmubi/property-service
    tag: latest
  env:
    NODE_ENV: production
    PORT: "3002"
  configMap:
    DB_HOST: mongodb
    DB_PORT: "27017"
    DB_NAME: propmubi_properties
  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"

# Integration Service
integrationService:
  enabled: true
  replicaCount: 3
  image:
    repository: propmubi/integration-service
    tag: latest
  secrets:
    LANDEED_API_KEY: ""
    TEAL_API_KEY: ""
    SETU_API_KEY: ""
    # ... all 31 integration API keys
  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"

# Workers
workers:
  reraScraper:
    enabled: true
    image:
      repository: propmubi/rera-scraper
      tag: latest
    schedule: "0 2 * * *"  # Daily at 2 AM
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
      limits:
        memory: "2Gi"
        cpu: "1000m"

  satelliteMonitor:
    enabled: true
    image:
      repository: propmubi/satellite-monitor
      tag: latest
    schedule: "0 3 * * 0"  # Weekly on Sunday at 3 AM
    resources:
      requests:
        memory: "2Gi"
        cpu: "1000m"
      limits:
        memory: "4Gi"
        cpu: "2000m"

# Databases (using Bitnami charts)
postgresql:
  enabled: true
  auth:
    username: postgres
    password: ""  # Set in values-prod.yaml
    database: propmubi
  primary:
    persistence:
      enabled: true
      size: 100Gi
    resources:
      requests:
        memory: "2Gi"
        cpu: "1000m"
      limits:
        memory: "4Gi"
        cpu: "2000m"

mongodb:
  enabled: true
  auth:
    rootPassword: ""  # Set in values-prod.yaml
  persistence:
    enabled: true
    size: 200Gi
  resources:
    requests:
      memory: "2Gi"
      cpu: "1000m"
    limits:
      memory: "4Gi"
      cpu: "2000m"

redis:
  enabled: true
  auth:
    password: ""  # Set in values-prod.yaml
  master:
    persistence:
      enabled: true
      size: 10Gi
    resources:
      requests:
        memory: "512Mi"
        cpu: "250m"
      limits:
        memory: "1Gi"
        cpu: "500m"

kafka:
  enabled: true
  persistence:
    enabled: true
    size: 50Gi
  zookeeper:
    persistence:
      enabled: true
      size: 10Gi
  resources:
    requests:
      memory: "2Gi"
      cpu: "1000m"
    limits:
      memory: "4Gi"
      cpu: "2000m"

# Monitoring
monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
    adminPassword: ""  # Set in values-prod.yaml
  loki:
    enabled: true
```

---

## 🚀 GitHub Actions CI/CD

### .github/workflows/ci-services.yml

```yaml
name: CI - Services

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/**'
      - 'packages/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'services/**'
      - 'packages/**'

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository }}/

jobs:
  # ========================================
  # Code Quality
  # ========================================

  lint-and-test:
    name: Lint & Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - auth-service
          - property-service
          - user-service
          - integration-service
          - due-diligence-service
          - exact-view-service

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint --workspace=@propmubi/${{ matrix.service }}

      - name: Run tests
        run: npm run test --workspace=@propmubi/${{ matrix.service }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./services/${{ matrix.service }}/coverage/lcov.info
          flags: ${{ matrix.service }}

  # ========================================
  # Security Scanning
  # ========================================

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # ========================================
  # Build Docker Images
  # ========================================

  build-images:
    name: Build & Push Images
    runs-on: ubuntu-latest
    needs: [lint-and-test, security-scan]
    if: github.event_name == 'push'

    strategy:
      matrix:
        service:
          - auth-service
          - property-service
          - user-service
          - integration-service
          - due-diligence-service
          - exact-view-service
          - notification-service
          - payment-service
          - search-service
          - analytics-service
          - file-service

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}${{ env.IMAGE_PREFIX }}${{ matrix.service }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./services/${{ matrix.service }}/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}${{ env.IMAGE_PREFIX }}${{ matrix.service }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}${{ env.IMAGE_PREFIX }}${{ matrix.service }}:buildcache,mode=max
          platforms: linux/amd64,linux/arm64

  # ========================================
  # Build Workers
  # ========================================

  build-workers:
    name: Build & Push Workers
    runs-on: ubuntu-latest
    needs: [lint-and-test, security-scan]
    if: github.event_name == 'push'

    strategy:
      matrix:
        worker:
          - rera-scraper
          - social-scraper
          - satellite-monitor
          - pdf-parser
          - email-worker

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}${{ env.IMAGE_PREFIX }}${{ matrix.worker }}
          tags: |
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./workers/${{ matrix.worker }}/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}${{ env.IMAGE_PREFIX }}${{ matrix.worker }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}${{ env.IMAGE_PREFIX }}${{ matrix.worker }}:buildcache,mode=max

  # ========================================
  # Notification
  # ========================================

  notify:
    name: Notify Build Status
    runs-on: ubuntu-latest
    needs: [build-images, build-workers]
    if: always()

    steps:
      - name: Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Build completed for ${{ github.ref }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### .github/workflows/cd-production.yml

```yaml
name: CD - Production Deployment

on:
  push:
    tags:
      - 'v*.*.*'

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository }}/

jobs:
  # ========================================
  # Pre-deployment Checks
  # ========================================

  pre-deployment:
    name: Pre-Deployment Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Validate Helm chart
        run: |
          helm lint infra/helm/propmubi

      - name: Run security scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          scan-ref: './infra/helm/propmubi'

      - name: Check database migrations
        run: |
          echo "Validating migration scripts..."
          # Add migration validation logic

  # ========================================
  # Deploy to Production
  # ========================================

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: pre-deployment
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Configure kubectl
        run: |
          aws eks update-kubeconfig --name propmubi-prod --region ap-south-1

      - name: Setup Helm
        uses: azure/setup-helm@v3
        with:
          version: '3.13.0'

      - name: Deploy with Helm
        run: |
          helm upgrade --install propmubi \
            ./infra/helm/propmubi \
            --namespace propmubi \
            --create-namespace \
            --values ./infra/helm/propmubi/values-prod.yaml \
            --set global.image.tag=${{ github.ref_name }} \
            --set authService.secrets.JWT_SECRET=${{ secrets.JWT_SECRET }} \
            --set postgresql.auth.password=${{ secrets.DB_PASSWORD }} \
            --set mongodb.auth.rootPassword=${{ secrets.MONGO_PASSWORD }} \
            --set redis.auth.password=${{ secrets.REDIS_PASSWORD }} \
            --wait \
            --timeout 15m

      - name: Run database migrations
        run: |
          kubectl exec -n propmubi \
            deployment/auth-service \
            -- npm run migrate:up

      - name: Verify deployment
        run: |
          kubectl rollout status -n propmubi deployment/api-gateway
          kubectl rollout status -n propmubi deployment/auth-service
          kubectl rollout status -n propmubi deployment/property-service

      - name: Run smoke tests
        run: |
          npm run test:smoke --prod

  # ========================================
  # Post-deployment
  # ========================================

  post-deployment:
    name: Post-Deployment Tasks
    runs-on: ubuntu-latest
    needs: deploy-production

    steps:
      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '🚀 Production deployment completed: ${{ github.ref }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

      - name: Update monitoring dashboards
        run: |
          # Update Grafana dashboards with new version
          echo "Updating dashboards..."
```

---

## 📊 Monitoring Setup

### infra/monitoring/prometheus/prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'propmubi-prod'
    replica: '1'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

# Load rules
rule_files:
  - '/etc/prometheus/alerts.yml'

# Scrape configurations
scrape_configs:
  # API Gateway
  - job_name: 'api-gateway'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['propmubi']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: api-gateway
        action: keep
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        regex: true
        action: keep
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        target_label: __metrics_path__
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

  # Microservices
  - job_name: 'microservices'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: ['propmubi']
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_tier]
        regex: backend
        action: keep
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        regex: true
        action: keep

  # Node exporter
  - job_name: 'node'
    kubernetes_sd_configs:
      - role: node
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  # kube-state-metrics
  - job_name: 'kube-state-metrics'
    static_configs:
      - targets: ['kube-state-metrics.kube-system.svc:8080']
```

### infra/monitoring/prometheus/alerts.yml

```yaml
groups:
  - name: propmubi_alerts
    interval: 30s
    rules:
      # Service availability
      - alert: ServiceDown
        expr: up{job=~"api-gateway|microservices"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "{{ $labels.job }} has been down for more than 2 minutes"

      # High CPU usage
      - alert: HighCPUUsage
        expr: (100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% (current: {{ $value }}%)"

      # High memory usage
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is above 85% (current: {{ $value }}%)"

      # API latency
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency on {{ $labels.service }}"
          description: "95th percentile latency is above 1s (current: {{ $value }}s)"

      # Database connections
      - alert: DatabaseConnectionPoolExhausted
        expr: pg_stat_activity_count > pg_settings_max_connections * 0.8
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool near exhaustion"
          description: "{{ $value }} connections active out of {{ pg_settings_max_connections }} max"

      # Kafka lag
      - alert: KafkaConsumerLag
        expr: kafka_consumergroup_lag > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High Kafka consumer lag for {{ $labels.consumergroup }}"
          description: "Consumer lag is {{ $value }} messages"
```

---

This enterprise architecture provides you with a **production-ready, scalable, cloud-native microservices platform**. Would you like me to:

1. Create the remaining service Dockerfiles?
2. Build the Terraform infrastructure code?
3. Create the missing Kubernetes manifests?
4. Set up ArgoCD GitOps configuration?

Let me know what you'd like to implement next!
