# Integration Quick Start Guide
## Propmubi Service Integrations - Implementation Guide

**Version:** 1.0
**For:** Developers implementing service integrations

---

## 📋 Overview

This guide helps you quickly integrate any of the 31+ external services into Propmubi.

---

## 🚀 Quick Setup

### 1. Environment Variables

Add to `.env`:

```bash
# Land & Trust
LANDEED_API_KEY=your_key_here
LANDEED_API_URL=https://api.landeed.com/v1
TEAL_API_KEY=your_key_here
SUREPASS_API_KEY=your_key_here
SENTINEL_API_KEY=your_key_here

# Finance & Identity
SETU_API_KEY=your_key_here
DIGILOCKER_API_KEY=your_key_here
EXPERIAN_API_KEY=your_key_here
RAZORPAY_KEY_ID=your_key_here
RAZORPAY_KEY_SECRET=your_secret_here

# Legal & Tax
LEGALKART_API_KEY=your_key_here
CLEARTAX_API_KEY=your_key_here
LEEGALITY_API_KEY=your_key_here
DOORKEYS_API_KEY=your_key_here

# Market Intelligence
ZAPKEY_API_KEY=your_key_here
GEOIQ_API_KEY=your_key_here

# Visuals & Design
MATTERPORT_API_KEY=your_key_here
SUPERBOLTER_API_KEY=your_key_here
INFURNIA_API_KEY=your_key_here
SOFABRAIN_API_KEY=your_key_here

# Lifecycle Services
PROPCHECK_API_KEY=your_key_here
UC_API_KEY=your_key_here  # Urban Company
SMARTPUJA_API_KEY=your_key_here
PORTER_API_KEY=your_key_here

# Management
MYGATE_API_KEY=your_key_here
BBPS_API_KEY=your_key_here
IDFY_API_KEY=your_key_here

# Sustainability
SOLARSQUARE_API_KEY=your_key_here
DRINKPRIME_API_KEY=your_key_here

# Webhooks
PROPCHECK_WEBHOOK_SECRET=your_secret_here
MYGATE_WEBHOOK_SECRET=your_secret_here
```

### 2. Install Dependencies

```bash
cd backend
npm install axios redis dotenv @temporalio/client
```

### 3. Import Configuration

```javascript
// In your service file
const config = require('./integrations-config');
const orchestrator = require('./service-orchestrator');
```

---

## 📝 Integration Patterns

### Pattern 1: Simple API Call

**Use for:** SurePass, DigiLocker, Experian

```javascript
const axios = require('axios');
const config = require('./integrations-config');

async function verifySurePassRERA(reraNumber, state) {
  const { baseUrl, apiKey, timeout } = config.landTrust.surepass;

  try {
    const response = await axios.post(
      `${baseUrl}/verify/rera`,
      { reraNumber, state },
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('[SurePass] Error:', error);
    throw error;
  }
}
```

### Pattern 2: Orchestrated Workflow

**Use for:** Due Diligence, Rental Onboarding

```javascript
const orchestrator = require('./service-orchestrator');

async function generateDueDiligenceReport(propertyId) {
  const propertyData = await getPropertyById(propertyId);

  // Orchestrator handles parallel + sequential calls
  const report = await orchestrator.executeDueDiligenceWorkflow({
    propertyId,
    surveyNumber: propertyData.surveyNumber,
    reraNumber: propertyData.reraNumber,
    district: propertyData.district,
    state: propertyData.state,
    coordinates: propertyData.coordinates
  });

  return report;
}
```

### Pattern 3: Webhook Handler

**Use for:** PropCheck, MyGate

```javascript
const crypto = require('crypto');

app.post('/webhooks/propcheck/inspection-complete', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-propcheck-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.PROPCHECK_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  const { inspectionId, propertyId, report } = req.body;

  // Update database
  await updateInspectionReport(inspectionId, report);

  // Notify user
  await sendNotification(propertyId, {
    title: 'Inspection Complete',
    body: `Your property inspection is ready. Score: ${report.overallScore}/100`
  });

  res.json({ received: true });
});
```

### Pattern 4: Web Scraping

**Use for:** Dharani, 99acres, PhantomBuster

```javascript
const puppeteer = require('puppeteer');

async function scrapeDharani(surveyNumber, district) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to Dharani portal
    await page.goto('https://dharani.telangana.gov.in');

    // Fill form
    await page.type('#surveyNumber', surveyNumber);
    await page.type('#district', district);
    await page.click('#searchButton');

    // Wait for results
    await page.waitForSelector('.results');

    // Extract data
    const data = await page.evaluate(() => {
      return {
        ownerName: document.querySelector('.owner-name').textContent,
        extent: document.querySelector('.extent').textContent,
        // ... more fields
      };
    });

    return data;
  } finally {
    await browser.close();
  }
}
```

---

## 🔄 Common Integration Tasks

### Task 1: Add New Service to Property View

**File:** `backend/src/server.js`

```javascript
// Add new endpoint
app.post('/api/properties/:id/solar-analysis', async (req, res) => {
  const property = await getPropertyById(req.params.id);

  // Call service via orchestrator
  const analysis = await orchestrator.callSolarSquare({
    propertyId: property.id,
    roofArea: property.roofArea,
    coordinates: property.coordinates
  });

  res.json(analysis);
});
```

**File:** `demo.html` (or React component)

```javascript
// Add button to property card
<button onclick="getSolarAnalysis('prop-1')">
  ☀️ Calculate Solar ROI
</button>

async function getSolarAnalysis(propertyId) {
  const response = await fetch(`/api/properties/${propertyId}/solar-analysis`, {
    method: 'POST'
  });
  const data = await response.json();
  displaySolarResults(data);
}
```

### Task 2: Add Service to Orchestrator

**File:** `backend/src/service-orchestrator.js`

```javascript
class ServiceOrchestrator {
  // ... existing methods

  async callSolarSquare(data) {
    const { baseUrl, apiKey, timeout } = config.sustainability.solarsquare;

    console.log('[API Call] SolarSquare - ROI calculation');

    const response = await axios.post(
      `${baseUrl}/solar/roi`,
      data,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout
      }
    );

    return response.data;
  }
}
```

### Task 3: Add Service Configuration

**File:** `backend/src/integrations-config.js`

```javascript
module.exports = {
  // ... existing config

  sustainability: {
    solarsquare: {
      enabled: true,
      name: 'SolarSquare',
      type: 'API',
      baseUrl: process.env.SOLARSQUARE_API_URL,
      apiKey: process.env.SOLARSQUARE_API_KEY,
      timeout: 25000,
      retries: 2,
      pricing: {
        commissionPercentage: 5
      },
      endpoints: {
        calculateROI: '/solar/roi'
      }
    }
  }
};
```

---

## 🧪 Testing Integrations

### Unit Test Example

```javascript
// tests/integrations/surepass.test.js
const { verifySurePassRERA } = require('../services/surepass');

describe('SurePass RERA Verification', () => {
  it('should verify valid RERA number', async () => {
    const result = await verifySurePassRERA('P02400004XXX', 'TELANGANA');

    expect(result.isValid).toBe(true);
    expect(result.projectName).toBeDefined();
    expect(result.builderName).toBeDefined();
  });

  it('should reject invalid RERA number', async () => {
    await expect(
      verifySurePassRERA('INVALID', 'TELANGANA')
    ).rejects.toThrow();
  });
});
```

### Integration Test

```javascript
// tests/workflows/due-diligence.test.js
const orchestrator = require('../service-orchestrator');

describe('Due Diligence Workflow', () => {
  it('should complete full workflow', async () => {
    const result = await orchestrator.executeDueDiligenceWorkflow({
      propertyId: 'test-prop-1',
      surveyNumber: '123/4A',
      reraNumber: 'P02400004XXX',
      district: 'Hyderabad',
      state: 'TELANGANA',
      coordinates: { lat: 17.4326, lng: 78.4071 }
    });

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.checks.landDocuments).toBeDefined();
    expect(result.checks.titleRisk).toBeDefined();
  });
});
```

---

## 🔍 Debugging

### Enable Debug Logging

```javascript
// Set in .env
LOG_LEVEL=debug

// In code
const logger = require('./logger');

logger.debug('[SurePass] Request:', { reraNumber, state });
logger.debug('[SurePass] Response:', response.data);
```

### Monitor API Health

```bash
# Check integration status
curl http://localhost:3001/api/admin/integrations/health

# Response
{
  "integrations": [
    {
      "name": "Landeed",
      "status": "OPERATIONAL",
      "uptime": 99.9,
      "avgResponseTime": 1200,
      "errorRate": 0.1
    }
  ]
}
```

---

## 📊 Monitoring & Alerts

### Setup DataDog Integration

```javascript
const tracer = require('dd-trace').init({
  service: 'propmubi-integrations',
  env: process.env.NODE_ENV
});

// Wrap API calls
tracer.wrap('axios', 'request', (request) => {
  return request;
});
```

### Setup Error Alerts

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Capture integration errors
try {
  await callExternalAPI();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      integration: 'SurePass',
      endpoint: '/verify/rera'
    }
  });
}
```

---

## 🔒 Security Best Practices

### 1. API Key Management

```javascript
// Use AWS Secrets Manager
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function getApiKey(serviceName) {
  const secret = await secretsManager.getSecretValue({
    SecretId: `propmubi/integrations/${serviceName}`
  }).promise();

  return JSON.parse(secret.SecretString).apiKey;
}
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

### 3. Input Validation

```javascript
const { z } = require('zod');

const PropertySchema = z.object({
  surveyNumber: z.string().regex(/^\d{1,4}\/\d{1,4}[A-Z]?$/),
  district: z.string().min(2).max(50),
  state: z.enum(['TELANGANA', 'ANDHRA_PRADESH'])
});

app.post('/api/verify', (req, res) => {
  const validated = PropertySchema.parse(req.body);
  // ... proceed with validated data
});
```

---

## 📚 Documentation Links

### Official Docs
- **Landeed:** [docs.landeed.com](https://docs.landeed.com)
- **TEAL:** [docs.teal.com](https://docs.teal.com)
- **SurePass:** [docs.surepass.io](https://docs.surepass.io)
- **Sentinel Hub:** [docs.sentinel-hub.com](https://docs.sentinel-hub.com)
- **Razorpay:** [razorpay.com/docs](https://razorpay.com/docs)

### Internal Docs
- **Full Integration Guide:** [SERVICE_INTEGRATIONS.md](SERVICE_INTEGRATIONS.md)
- **Service Showcase:** [SERVICES_SHOWCASE.md](SERVICES_SHOWCASE.md)
- **Configuration:** [integrations-config.js](backend/src/integrations-config.js)
- **Orchestrator:** [service-orchestrator.js](backend/src/service-orchestrator.js)

---

## 🆘 Troubleshooting

### Common Issues

#### Issue 1: API Key Not Found
```bash
Error: LANDEED_API_KEY is not defined
```

**Solution:**
```bash
# Check .env file exists
cat .env | grep LANDEED_API_KEY

# Restart server to reload env vars
npm run backend:dev
```

#### Issue 2: Timeout Errors
```bash
Error: Request timeout after 30000ms
```

**Solution:**
```javascript
// Increase timeout in config
landeed: {
  timeout: 60000, // Increase to 60 seconds
}
```

#### Issue 3: Rate Limit Exceeded
```bash
Error: 429 Too Many Requests
```

**Solution:**
```javascript
// Implement exponential backoff
async function retryWithBackoff(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        await delay(Math.pow(2, i) * 1000); // 1s, 2s, 4s
        continue;
      }
      throw error;
    }
  }
}
```

---

## 📞 Support

**Technical Support:** dev@propmubi.com
**Integration Issues:** integrations@propmubi.com
**Slack Channel:** #integrations

---

**Quick Links:**
- [Full Documentation](SERVICE_INTEGRATIONS.md)
- [Service Showcase](SERVICES_SHOWCASE.md)
- [API Reference](https://api.propmubi.com/docs)

---

*Last Updated: November 28, 2024*
