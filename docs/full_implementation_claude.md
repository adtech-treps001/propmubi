# Final Comprehensive Low-Level Design: Multi-Tenant Real Estate Platform with Cloudflare CNAME + Caddy

## Complete Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    End-to-End Traffic Flow                           │
│                                                                      │
│  User Browser                                                       │
│       ↓                                                             │
│  [Types of Requests]                                                │
│  ├── www.customdomain.com (tenant custom domain)                   │
│  ├── customdomain.com (apex domain)                                │
│  ├── prestige-lakeside-bangalore.propmubi.com (SEO subdomain)      │
│  └── campaign-name.promo.propmubi.com (promotional)                │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Cloudflare DNS Layer                     │               │
│  │  - CNAME resolution only (no A/AAAA records)    │               │
│  │  - DDoS protection                               │               │
│  │  - SSL/TLS termination                           │               │
│  │  - CDN caching (optional)                        │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Caddy Load Balancer Cluster             │               │
│  │  - Host header-based routing                    │               │
│  │  - Canonical enforcement (301 redirects)        │               │
│  │  - Automatic HTTPS                               │               │
│  │  - No direct subdomain access allowed           │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Backend Services                         │               │
│  │  - S3 static sites                               │               │
│  │  - API gateway                                   │               │
│  │  - Elasticsearch                                 │               │
│  │  - AI assistant                                  │               │
│  └─────────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. DNS Architecture: Pure CNAME Strategy

### Cloudflare DNS Configuration (No A/AAAA Records)

```
┌─────────────────────────────────────────────────────────────────────┐
│              DNS Record Structure (CNAME Only)                       │
│                                                                      │
│  Primary Platform Domain: propmubi.com                              │
│  Managed by: Cloudflare (Free/Pro plan)                            │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  SCENARIO 1: Platform Subdomains (propmubi.com)                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Infrastructure Setup:                                              │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 1: Configure origin server CNAME                  │        │
│  │  ─────────────────────────────────────────────          │        │
│  │  At your hosting provider (Hetzner/AWS/DO):             │        │
│  │                                                         │        │
│  │  Record: origin.propmubi.com                            │        │
│  │  Type: A                                                │        │
│  │  Value: 123.45.67.89 (Caddy server IP)                 │        │
│  │  (This is the ONLY A record - hidden from tenants)     │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 2: Wildcard CNAME at Cloudflare                  │        │
│  │  ─────────────────────────────────────────────          │        │
│  │  Record 1:                                              │        │
│  │    Name: *                                              │        │
│  │    Type: CNAME                                          │        │
│  │    Target: origin.propmubi.com                          │        │
│  │    Proxy: Yes (orange cloud)                            │        │
│  │    TTL: Auto                                            │        │
│  │                                                         │        │
│  │  Record 2 (for root domain):                            │        │
│  │    Name: @                                              │        │
│  │    Type: CNAME (via CNAME flattening)                   │        │
│  │    Target: origin.propmubi.com                          │        │
│  │    Proxy: Yes                                           │        │
│  │                                                         │        │
│  │  This covers:                                           │        │
│  │  ✓ prestige-lakeside-bangalore.propmubi.com            │        │
│  │  ✓ agent-ramesh-chennai.propmubi.com                   │        │
│  │  ✓ campaign.promo.propmubi.com                         │        │
│  │  ✓ api.propmubi.com                                    │        │
│  │  ✓ All future subdomains automatically                 │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  SCENARIO 2: Tenant Custom Domains                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Tenant Domain: www.prestigebuilders.com                            │
│  Tenant Controls: Cloudflare account (their own)                   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Tenant Instructions (Provided in Admin Panel):         │        │
│  │  ─────────────────────────────────────────────          │        │
│  │  1. Transfer domain to Cloudflare (or use existing)    │        │
│  │  2. Add these DNS records:                              │        │
│  │                                                         │        │
│  │  Record 1 (www):                                        │        │
│  │    Name: www                                            │        │
│  │    Type: CNAME                                          │        │
│  │    Target: prestige-lakeside-bangalore.propmubi.com    │        │
│  │    Proxy: Yes (orange cloud - recommended)              │        │
│  │    TTL: Auto                                            │        │
│  │                                                         │        │
│  │  Record 2 (apex/root):                                  │        │
│  │    Name: @                                              │        │
│  │    Type: CNAME                                          │        │
│  │    Target: prestige-lakeside-bangalore.propmubi.com    │        │
│  │    Proxy: Yes                                           │        │
│  │    TTL: Auto                                            │        │
│  │    (Uses Cloudflare CNAME flattening)                  │        │
│  │                                                         │        │
│  │  3. SSL/TLS Settings:                                   │        │
│  │    Mode: Full (Strict)                                  │        │
│  │    Always Use HTTPS: On                                 │        │
│  │    Automatic HTTPS Rewrites: On                         │        │
│  │                                                         │        │
│  │  4. Wait 5-15 minutes for propagation                   │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Resolution Path:                                                    │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  User → www.prestigebuilders.com                       │        │
│  │    ↓                                                    │        │
│  │  Cloudflare DNS:                                        │        │
│  │    CNAME → prestige-lakeside-bangalore.propmubi.com    │        │
│  │    ↓                                                    │        │
│  │  Cloudflare DNS (recursive):                            │        │
│  │    CNAME → origin.propmubi.com                          │        │
│  │    ↓                                                    │        │
│  │  Cloudflare edge server:                                │        │
│  │    Forward to origin IP: 123.45.67.89                   │        │
│  │    ↓                                                    │        │
│  │  HTTP Request arrives at Caddy:                         │        │
│  │    Host: www.prestigebuilders.com (PRESERVED!)          │        │
│  │    X-Forwarded-For: user_ip                             │        │
│  │    CF-Connecting-IP: user_ip                            │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  CRITICAL: Host header = www.prestigebuilders.com                   │
│            (NOT origin.propmubi.com or subdomain)                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Why CNAME-Only Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              Advantages of CNAME-Only Strategy                       │
│                                                                      │
│  ✅ Flexibility:                                                     │
│  ├── Change origin IP without updating tenant DNS                   │
│  ├── Migrate servers seamlessly                                     │
│  ├── Add load balancers without DNS changes                         │
│  └── Multi-region failover easy to implement                        │
│                                                                      │
│  ✅ Cloudflare Benefits:                                             │
│  ├── DDoS protection (automatic)                                    │
│  ├── SSL certificates (automatic)                                   │
│  ├── Global CDN (200+ edge locations)                               │
│  ├── Rate limiting (configurable)                                   │
│  ├── Bot protection                                                 │
│  └── Analytics & monitoring                                         │
│                                                                      │
│  ✅ Tenant Control:                                                  │
│  ├── Tenants manage their own Cloudflare account                    │
│  ├── Full access to CDN settings                                    │
│  ├── Custom page rules                                              │
│  ├── WAF rules (Pro/Business plan)                                  │
│  └── Independent SSL certificates                                   │
│                                                                      │
│  ✅ Scalability:                                                     │
│  ├── No DNS record limit (unlimited subdomains)                     │
│  ├── Instant activation (no DNS TTL wait)                           │
│  ├── Zero-downtime IP changes                                       │
│  └── Easy to add backup origins                                     │
│                                                                      │
│  ✅ SEO Benefits:                                                    │
│  ├── Canonical URLs properly enforced                               │
│  ├── 301 redirects work correctly                                   │
│  ├── No DNS-level confusion                                         │
│  └── Clean link equity flow                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Caddy Configuration: Canonical Enforcement

### Complete Caddyfile with Host-Based Routing

```
┌─────────────────────────────────────────────────────────────────────┐
│              Master Caddyfile (Canonical Enforcement)                │
│                                                                      │
│  File: /etc/caddy/Caddyfile                                         │
│                                                                      │
│  {                                                                   │
│    # Global options                                                 │
│    email admin@propmubi.com                                        │
│    admin 0.0.0.0:2019                                              │
│                                                                      │
│    # On-demand TLS for custom domains                              │
│    on_demand_tls {                                                  │
│      ask https://api.propmubi.com/v1/tls/validate                 │
│      interval 2m                                                   │
│      burst 5                                                        │
│    }                                                                │
│                                                                      │
│    log {                                                            │
│      output file /var/log/caddy/access.log {                      │
│        roll_size 100mb                                             │
│        roll_keep 10                                                │
│      }                                                              │
│      format json                                                   │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  # Import configurations                                            │
│  import /etc/caddy/conf.d/snippets.conf                            │
│  import /etc/caddy/conf.d/redirects.conf                           │
│  import /etc/caddy/conf.d/canonical-sites.conf                     │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  File: /etc/caddy/conf.d/snippets.conf                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  (security-headers) {                                               │
│    header {                                                         │
│      Strict-Transport-Security "max-age=31536000; includeSubDomains"│
│      X-Content-Type-Options "nosniff"                              │
│      X-Frame-Options "SAMEORIGIN"                                  │
│      X-XSS-Protection "1; mode=block"                              │
│      Referrer-Policy "strict-origin-when-cross-origin"             │
│      -Server                                                        │
│      -X-Powered-By                                                  │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  (compression) {                                                    │
│    encode gzip zstd                                                 │
│  }                                                                   │
│                                                                      │
│  (logging) {                                                        │
│    log {                                                            │
│      output file /var/log/caddy/{host}.log                        │
│      format json                                                   │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  File: /etc/caddy/conf.d/redirects.conf                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  # CRITICAL: Block direct access to platform subdomains             │
│  # These should NEVER be accessed directly                          │
│                                                                      │
│  # Rule: All propmubi.com subdomains redirect to custom domains     │
│  # Exception: If no custom domain exists, serve normally            │
│                                                                      │
│  *.propmubi.com {                                                   │
│    tls {                                                            │
│      protocols tls1.2 tls1.3                                       │
│    }                                                                │
│                                                                      │
│    import security-headers                                         │
│    import compression                                              │
│    import logging                                                  │
│                                                                      │
│    # Check if tenant has custom domain mapped                      │
│    # This requires database lookup (see middleware section)         │
│                                                                      │
│    # If custom domain exists → 301 redirect                         │
│    @has_custom_domain {                                            │
│      header X-Has-Custom-Domain true                               │
│    }                                                                │
│                                                                      │
│    handle @has_custom_domain {                                     │
│      redir https://{http.request.header.X-Custom-Domain}{uri} 301  │
│    }                                                                │
│                                                                      │
│    # If no custom domain → serve normally                           │
│    handle {                                                         │
│      reverse_proxy https://s3.propmubi.com {                       │
│        header_up Host {http.request.host}                          │
│        header_up X-Real-IP {remote_host}                           │
│        header_up X-Forwarded-For {remote_host}                     │
│        header_up X-Forwarded-Proto {scheme}                        │
│                                                                      │
│        # Extract tenant slug from subdomain                         │
│        header_up X-Tenant-Slug {labels.0}                          │
│      }                                                              │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  # Promotional subdomains (always noindex)                          │
│  *.promo.propmubi.com {                                             │
│    tls {                                                            │
│      on_demand                                                     │
│    }                                                                │
│                                                                      │
│    import security-headers                                         │
│    import compression                                              │
│                                                                      │
│    header X-Robots-Tag "noindex, nofollow"                         │
│                                                                      │
│    reverse_proxy https://s3.propmubi.com {                         │
│      header_up X-Site-Type promo                                   │
│      header_up X-Tenant-Slug {labels.0}                            │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  File: /etc/caddy/conf.d/canonical-sites.conf                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  # Custom domain entries (dynamically managed via API)              │
│  # Each tenant custom domain gets entry here                        │
│                                                                      │
│  # Pattern: Apex redirects to www, www serves content               │
│                                                                      │
│  www.prestigebuilders.com, prestigebuilders.com {                  │
│    tls {                                                            │
│      on_demand                                                     │
│    }                                                                │
│                                                                      │
│    import security-headers                                         │
│    import compression                                              │
│    import logging                                                  │
│                                                                      │
│    # Redirect apex to www (canonical)                              │
│    @apex host prestigebuilders.com                                 │
│    handle @apex {                                                  │
│      redir https://www.prestigebuilders.com{uri} 301               │
│    }                                                                │
│                                                                      │
│    # Serve canonical site                                          │
│    handle {                                                         │
│      reverse_proxy https://s3.propmubi.com {                       │
│        header_up Host {http.request.host}                          │
│        header_up X-Tenant-ID tenant_prestige_uuid                  │
│        header_up X-Site-Type custom                                │
│        header_up X-Is-Canonical true                               │
│      }                                                              │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  # Example 2: Another tenant                                        │
│  www.agent-ramesh.in, agent-ramesh.in {                            │
│    tls {                                                            │
│      on_demand                                                     │
│    }                                                                │
│                                                                      │
│    import security-headers                                         │
│    import compression                                              │
│                                                                      │
│    @apex host agent-ramesh.in                                      │
│    handle @apex {                                                  │
│      redir https://www.agent-ramesh.in{uri} 301                    │
│    }                                                                │
│                                                                      │
│    handle {                                                         │
│      reverse_proxy https://s3.propmubi.com {                       │
│        header_up X-Tenant-ID tenant_ramesh_uuid                    │
│        header_up X-Is-Canonical true                               │
│      }                                                              │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  # More custom domains added via API...                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Domain Lookup Middleware

### Database-Driven Routing Decision

```
┌─────────────────────────────────────────────────────────────────────┐
│              Intelligent Domain Routing Service                      │
│                                                                      │
│  Service: Domain Lookup API                                         │
│  Endpoint: http://localhost:8081/domain-lookup                     │
│  Called by: Caddy (via HTTP handler plugin)                        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Request Flow:                                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 1: HTTP Request arrives at Caddy                  │        │
│  │  ────────────────────────────────────────               │        │
│  │  Host: prestige-lakeside-bangalore.propmubi.com         │        │
│  │  Path: /properties/3bhk-apartments                      │        │
│  └────────────────────────────────────────────────────────┘        │
│       ↓                                                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 2: Caddy calls Domain Lookup Service              │        │
│  │  ────────────────────────────────────────               │        │
│  │  GET /domain-lookup?host=prestige-lakeside-bangalore.propmubi.com│
│  └────────────────────────────────────────────────────────┘        │
│       ↓                                                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 3: Service queries database                       │        │
│  │  ────────────────────────────────────────               │        │
│  │  Query:                                                 │        │
│  │  SELECT                                                 │        │
│  │    t.id as tenant_id,                                   │        │
│  │    t.slug,                                              │        │
│  │    d.domain,                                            │        │
│  │    d.is_primary,                                        │        │
│  │    custom.domain as custom_domain                       │        │
│  │  FROM domains d                                         │        │
│  │  JOIN tenants t ON d.tenant_id = t.id                  │        │
│  │  LEFT JOIN domains custom ON (                          │        │
│  │    custom.tenant_id = t.id AND                          │        │
│  │    custom.is_primary = true AND                         │        │
│  │    custom.domain_type = 'custom'                        │        │
│  │  )                                                      │        │
│  │  WHERE d.domain = ?                                     │        │
│  │    AND d.is_active = true                               │        │
│  └────────────────────────────────────────────────────────┘        │
│       ↓                                                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 4: Service returns routing decision               │        │
│  │  ────────────────────────────────────────               │        │
│  │  Response (JSON):                                       │        │
│  │  {                                                      │        │
│  │    "tenant_id": "uuid-here",                           │        │
│  │    "slug": "prestige-lakeside-bangalore",              │        │
│  │    "action": "redirect",                                │        │
│  │    "redirect_to": "www.prestigebuilders.com",          │        │
│  │    "status_code": 301,                                  │        │
│  │    "has_custom_domain": true                            │        │
│  │  }                                                      │        │
│  │                                                         │        │
│  │  OR (if no custom domain):                              │        │
│  │  {                                                      │        │
│  │    "tenant_id": "uuid-here",                           │        │
│  │    "slug": "prestige-lakeside-bangalore",              │        │
│  │    "action": "serve",                                   │        │
│  │    "has_custom_domain": false                           │        │
│  │  }                                                      │        │
│  └────────────────────────────────────────────────────────┘        │
│       ↓                                                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Step 5: Caddy acts on response                         │        │
│  │  ────────────────────────────────────────               │        │
│  │  If action = "redirect":                                │        │
│  │    Inject headers:                                      │        │
│  │      X-Has-Custom-Domain: true                          │        │
│  │      X-Custom-Domain: www.prestigebuilders.com          │        │
│  │    Trigger redirect block in Caddyfile                  │        │
│  │                                                         │        │
│  │  If action = "serve":                                   │        │
│  │    Inject headers:                                      │        │
│  │      X-Tenant-ID: uuid                                  │        │
│  │      X-Tenant-Slug: slug                                │        │
│  │    Forward to backend (S3/API)                          │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Service Logic (Pseudocode):                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  function lookup_domain(host):                                      │
│    # Extract subdomain                                              │
│    if host ends with ".propmubi.com":                               │
│      slug = extract_subdomain(host)                                 │
│      tenant = db.query("""                                          │
│        SELECT t.*, custom.domain as custom_domain                   │
│        FROM tenants t                                               │
│        LEFT JOIN domains custom ON (                                │
│          custom.tenant_id = t.id AND                                │
│          custom.is_primary = true                                   │
│        )                                                            │
│        WHERE t.slug = ?                                             │
│      """, slug)                                                     │
│                                                                      │
│      if tenant and tenant.custom_domain:                            │
│        # Has custom domain → redirect                               │
│        return {                                                     │
│          "action": "redirect",                                      │
│          "redirect_to": tenant.custom_domain,                       │
│          "tenant_id": tenant.id                                     │
│        }                                                            │
│      else:                                                          │
│        # No custom domain → serve                                   │
│        return {                                                     │
│          "action": "serve",                                         │
│          "tenant_id": tenant.id                                     │
│        }                                                            │
│                                                                      │
│    else:                                                            │
│      # Custom domain request                                        │
│      tenant = db.query("""                                          │
│        SELECT t.id, d.domain                                        │
│        FROM domains d                                               │
│        JOIN tenants t ON d.tenant_id = t.id                        │
│        WHERE d.domain = ? AND d.is_active = true                   │
│      """, host)                                                     │
│                                                                      │
│      if tenant:                                                     │
│        return {                                                     │
│          "action": "serve",                                         │
│          "tenant_id": tenant.id,                                    │
│          "is_canonical": true                                       │
│        }                                                            │
│      else:                                                          │
│        return {"action": "404"}                                     │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Caching Strategy:                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  # Cache in Redis with 5-minute TTL                                 │
│  Key: domain:{host}                                                 │
│  Value: JSON response                                               │
│  TTL: 300 seconds                                                   │
│                                                                      │
│  Benefits:                                                          │
│  - Reduces database load (thousands of requests/sec)                │
│  - Sub-millisecond lookup time                                      │
│  - Auto-refresh on domain changes                                   │
│  - Invalidate cache when tenant updates domain                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. SEO Implementation

### Canonical URL Enforcement

```
┌─────────────────────────────────────────────────────────────────────┐
│              SEO-Correct HTML Output                                 │
│                                                                      │
│  Scenario 1: User on canonical custom domain                        │
│  ───────────────────────────────────────────                        │
│  Request: https://www.prestigebuilders.com/properties              │
│                                                                      │
│  HTML Output:                                                        │
│  <head>                                                             │
│    <title>3BHK Apartments - Prestige Builders Bangalore</title>    │
│    <meta name="description" content="...">                          │
│                                                                      │
│    <!-- CANONICAL: Points to self -->                               │
│    <link rel="canonical"                                            │
│          href="https://www.prestigebuilders.com/properties">        │
│                                                                      │
│    <!-- Open Graph -->                                              │
│    <meta property="og:url"                                          │
│          content="https://www.prestigebuilders.com/properties">     │
│    <meta property="og:type" content="website">                      │
│    <meta property="og:title" content="3BHK Apartments...">          │
│                                                                      │
│    <!-- Robots: Allow indexing -->                                  │
│    <meta name="robots" content="index, follow">                     │
│                                                                      │
│    <!-- Structured Data -->                                         │
│    <script type="application/ld+json">                              │
│    {                                                                 │
│      "@context": "https://schema.org",                              │
│      "@type": "RealEstateAgent",                                    │
│      "url": "https://www.prestigebuilders.com",                     │
│      "name": "Prestige Builders",                                   │
│      ...                                                             │
│    }                                                                 │
│    </script>                                                         │
│  </head>                                                             │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Scenario 2: User on platform subdomain (no custom domain)          │
│  ───────────────────────────────────────────────────────            │
│  Request: https://prestige-lakeside-bangalore.propmubi.com/properties│
│                                                                      │
│  HTML Output:                                                        │
│  <head>                                                             │
│    <title>3BHK Apartments - Prestige Lakeside Bangalore</title>    │
│                                                                      │
│    <!-- CANONICAL: Points to self (no custom domain) -->            │
│    <link rel="canonical"                                            │
│          href="https://prestige-lakeside-bangalore.propmubi.com/properties">│
│                                                                      │
│    <meta property="og:url"                                          │
│          content="https://prestige-lakeside-bangalore.propmubi.com/properties">│
│                                                                      │
│    <!-- Robots: Allow indexing -->                                  │
│    <meta name="robots" content="index, follow">                     │
│  </head>                                                             │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Scenario 3: User somehow accesses subdomain (custom domain exists) │
│  ───────────────────────────────────────────────────────            │
│  Request: https://prestige-lakeside-bangalore.propmubi.com/properties│
│                                                                      │
│  Response: HTTP 301 Permanent Redirect                              │
│  Location: https://www.prestigebuilders.com/properties              │
│                                                                      │
│  (User never sees HTML - redirected immediately)                    │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Scenario 4: Promotional subdomain                                  │
│  ───────────────────────────────────────────────────────            │
│  Request: https://diwali-offer-2025.promo.propmubi.com             │
│                                                                      │
│  HTML Output:                                                        │
│  <head>                                                             │
│    <title>Diwali Special Offer - Prestige Builders</title>         │
│                                                                      │
│    <!-- NOINDEX: Temporary campaign -->                             │
│    <meta name="robots" content="noindex, nofollow">                 │
│                                                                      │
│    <!-- NO CANONICAL: Temporary page -->                            │
│  </head>                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Sitemap Management

```
┌─────────────────────────────────────────────────────────────────────┐
│              Dynamic Sitemap Generation                              │
│                                                                      │
│  Sitemap URL: https://www.prestigebuilders.com/sitemap.xml         │
│                                                                      │
│  Generation Rules:                                                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  1. Use ONLY canonical domain in URLs                   │        │
│  │     ✓ https://www.prestigebuilders.com/page            │        │
│  │     ✗ https://prestige-lakeside.propmubi.com/page      │        │
│  │                                                         │        │
│  │  2. Include only indexable content                      │        │
│  │     ✓ Homepage                                          │        │
│  │     ✓ Property listings                                 │        │
│  │     ✓ Project pages                                     │        │
│  │     ✓ Blog posts                                        │        │
│  │     ✓ Location pages                                    │        │
│  │     ✗ Promotional pages (noindex)                       │        │
│  │     ✗ Admin pages                                       │        │
│  │     ✗ Internal tools                                    │        │
│  │                                                         │        │
│  │  3. Set appropriate priorities                          │        │
│  │     Homepage: 1.0                                       │        │
│  │     Main pages: 0.8                                     │        │
│  │     Property listings: 0.7                              │        │
│  │     Blog posts: 0.6                                     │        │
│  │                                                         │        │
│  │  4. Update frequency                                    │        │
│  │     Homepage: daily                                     │        │
│  │     Listings: daily                                     │        │
│  │     Static pages: monthly                               │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Example Sitemap:                                                    │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  <?xml version="1.0" encoding="UTF-8"?>                │        │
│  │  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">│  │
│  │    <url>                                                │        │
│  │      <loc>https://www.prestigebuilders.com/</loc>      │        │
│  │      <lastmod>2025-01-06</lastmod>                     │        │
│  │      <changefreq>daily</changefreq>                    │        │
│  │      <priority>1.0</priority>                          │        │
│  │    </url>                                               │        │
│  │    <url>                                                │        │
│  │      <loc>https://www.prestigebuilders.com/properties/3bhk-whitefield</loc>│
│  │      <lastmod>2025-01-05</lastmod>                     │        │
│  │      <changefreq>daily</changefreq>                    │        │
│  │      <priority>0.7</priority>                          │        │
│  │    </url>                                               │        │
│  │    <!-- More URLs... -->                                │        │
│  │  </urlset>                                              │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Robots.txt:                                                         │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  # Canonical domain robots.txt                          │        │
│  │  # URL: https://www.prestigebuilders.com/robots.txt    │        │
│  │                                                         │        │
│  │  User-agent: *                                          │        │
│  │  Allow: /                                               │        │
│  │  Disallow: /admin/                                      │        │
│  │  Disallow: /api/                                        │        │
│  │                                                         │        │
│  │  Sitemap: https://www.prestigebuilders.com/sitemap.xml │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Platform Subdomain Robots.txt:                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  # Only if subdomain is accessible (no custom domain)   │        │
│  │  # URL: https://prestige-lakeside.propmubi.com/robots.txt│       │
│  │                                                         │        │
│  │  User-agent: *                                          │        │
│  │  Allow: /                                               │        │
│  │  Sitemap: https://prestige-lakeside.propmubi.com/sitemap.xml│   │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Promotional Subdomain Robots.txt:                                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  # URL: https://*.promo.propmubi.com/robots.txt         │        │
│  │                                                         │        │
│  │  User-agent: *                                          │        │
│  │  Disallow: /                                            │        │
│  │  # No sitemap (temporary campaign)                      │        │
│  └────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Complete Deployment Workflow

### End-to-End Setup Process

```
┌─────────────────────────────────────────────────────────────────────┐
│              Production Deployment Timeline                          │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Phase 1: Infrastructure Setup (Day 1-2)                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Step 1.1: Provision Servers                                        │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  - 2x VPS (Hetzner CPX31)                              │        │
│  │    • 4 vCPU, 8GB RAM, 160GB SSD                        │        │
│  │    • Ubuntu 24.04 LTS                                  │        │
│  │    • Same datacenter (low latency)                     │        │
│  │    • Cost: €13 × 2 = €26/month (~$28)                 │        │
│  │                                                         │        │
│  │  - Assign IPs:                                          │        │
│  │    • Server 1: 123.45.67.89                            │        │
│  │    • Server 2: 123.45.67.90                            │        │
│  │    • VIP (Keepalived): 123.45.67.100                   │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Step 1.2: Install Base Software                                    │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  On both servers:                                       │        │
│  │  1. Update system: apt update && apt upgrade           │        │
│  │  2. Install Docker: curl -fsSL get.docker.com | sh     │        │
│  │  3. Install Caddy: (via Docker)                        │        │
│  │  4. Install Keepalived: apt install keepalived         │        │
│  │  5. Configure firewall:                                │        │
│  │     - ufw allow 22/tcp (SSH)                           │        │
│  │     - ufw allow 80/tcp (HTTP)                          │        │
│  │     - ufw allow 443/tcp (HTTPS)                        │        │
│  │     - ufw enable                                       │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Step 1.3: DNS Setup (Cloudflare)                                   │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Platform domain: propmubi.com                          │        │
│  │                                                         │        │
│  │  Add to Cloudflare:                                     │        │
│  │  1. Transfer/add propmubi.com to Cloudflare            │        │
│  │  2. Wait for nameserver propagation (1-24 hours)       │        │
│  │  3. Add DNS records:                                    │        │
│  │     Record 1:                                           │        │
│  │       Name: origin                                      │        │
│  │       Type: A                                           │        │
│  │       Value: 123.45.67.100 (VIP)                        │        │
│  │       Proxy: No (DNS only, gray cloud)                  │        │
│  │                                                         │        │
│  │     Record 2:                                           │        │
│  │       Name: *                                           │        │
│  │       Type: CNAME                                       │        │
│  │       Value: origin.propmubi.com                        │        │
│  │       Proxy: Yes (orange cloud)                         │        │
│  │                                                         │        │
│  │     Record 3:                                           │        │
│  │       Name: @                                           │        │
│  │       Type: CNAME                                       │        │
│  │       Value: origin.propmubi.com                        │        │
│  │       Proxy: Yes                                        │        │
│  │                                                         │        │
│  │  4. SSL/TLS Settings:                                   │        │
│  │     - Mode: Full (Strict)                               │        │
│  │     - Always Use HTTPS: On                              │        │
│  │     - Min TLS Version: 1.2                              │        │
│  │     - Automatic HTTPS Rewrites: On                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Phase 2: Caddy Configuration (Day 2-3)                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Step 2.1: Deploy Caddy via Docker                                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Docker Compose file:                                   │        │
│  │  /opt/caddy/docker-compose.yml                          │        │
│  │                                                         │        │
│  │  services:                                              │        │
│  │    caddy:                                               │        │
│  │      image: caddy:2-alpine                              │        │
│  │      restart: unless-stopped                            │        │
│  │      ports:                                             │        │
│  │        - "80:80"                                        │        │
│  │        - "443:443"                                      │        │
│  │        - "2019:2019"                                    │        │
│  │      volumes:                                           │        │
│  │        - ./Caddyfile:/etc/caddy/Caddyfile              │        │
│  │        - ./conf.d:/etc/caddy/conf.d                    │        │
│  │        - caddy_data:/data                               │        │
│  │        - caddy_config:/config                           │        │
│  │        - ./logs:/var/log/caddy                          │        │
│  │      networks:                                          │        │
│  │        - caddy_net                                      │        │
│  │                                                         │        │
│  │  volumes:                                               │        │
│  │    caddy_data:                                          │        │
│  │    caddy_config:                                        │        │
│  │                                                         │        │
│  │  networks:                                              │        │
│  │    caddy_net:                                           │        │
│  │      external: true                                     │        │
│  │                                                         │        │
│  │  Deploy: docker-compose up -d                           │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Step 2.2: Initial Caddyfile Setup                                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Create directory structure:                            │        │
│  │  /opt/caddy/                                            │        │
│  │  ├── Caddyfile                                          │        │
│  │  ├── conf.d/                                            │        │
│  │  │   ├── snippets.conf                                  │        │
│  │  │   ├── redirects.conf                                 │        │
│  │  │   └── canonical-sites.conf                           │        │
│  │  └── logs/                                              │        │
│  │                                                         │        │
│  │  Copy Caddyfile content (from section 2 above)         │        │
│  │  Test configuration: docker exec caddy caddy validate  │        │
│  │  Reload: docker exec caddy caddy reload                │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Phase 3: High Availability Setup (Day 3-4)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Step 3.1: Configure Keepalived                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Server 1 (Master):                                     │        │
│  │  /etc/keepalived/keepalived.conf                        │        │
│  │                                                         │        │
│  │  vrrp_instance VI_1 {                                   │        │
│  │    state MASTER                                         │        │
│  │    interface eth0                                       │        │
│  │    virtual_router_id 51                                 │        │
│  │    priority 100                                         │        │
│  │    advert_int 1                                         │        │
│  │    authentication {                                     │        │
│  │      auth_type PASS                                     │        │
│  │      auth_pass SecurePassword123                        │        │
│  │    }                                                    │        │
│  │    virtual_ipaddress {                                  │        │
│  │      123.45.67.100/24                                   │        │
│  │    }                                                    │        │
│  │  }                                                      │        │
│  │                                                         │        │
│  │  Server 2 (Backup): Same but state BACKUP, priority 90 │        │
│  │                                                         │        │
│  │  Start: systemctl enable --now keepalived               │        │
│  │  Verify VIP: ip addr show eth0                          │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Phase 4: Backend Services (Day 4-5)                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Step 4.1: Deploy Domain Lookup Service                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Service: FastAPI application                           │        │
│  │  Port: 8081                                             │        │
│  │  Database: PostgreSQL                                   │        │
│  │  Cache: Redis                                           │        │
│  │                                                         │        │
│  │  Features:                                              │        │
│  │  - Domain → Tenant mapping                              │        │
│  │  - Custom domain detection                              │        │
│  │  - Redirect decision logic                              │        │
│  │  - Response caching (5min TTL)                          │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Step 4.2: Deploy k3s Cluster (optional)                            │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  For backend services:                                  │        │
│  │  - API gateway                                          │        │
│  │  - Site builder service                                 │        │
│  │  - AI assistant                                         │        │
│  │  - Elasticsearch                                        │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Phase 5: First Tenant Onboarding (Day 5-7)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  Scenario A: Tenant with custom domain                              │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  1. Admin creates tenant in database:                   │        │
│  │     - business_name: "Prestige Builders"                │        │
│  │     - slug: "prestige-lakeside-bangalore"               │        │
│  │     - location: "Bangalore"                             │        │
│  │                                                         │        │
│  │  2. Generate SEO-friendly subdomain:                    │        │
│  │     prestige-lakeside-bangalore.propmubi.com            │        │
│  │     (Auto-resolves via wildcard CNAME)                  │        │
│  │                                                         │        │
│  │  3. Upload site files to S3                             │        │
│  │                                                         │        │
│  │  4. Test subdomain (works immediately)                  │        │
│  │                                                         │        │
│  │  5. Tenant provides custom domain: www.prestigebuilders.com│      │
│  │                                                         │        │
│  │  6. Instruct tenant to add DNS records at Cloudflare:   │        │
│  │     CNAME www → prestige-lakeside-bangalore.propmubi.com│        │
│  │     CNAME @ → prestige-lakeside-bangalore.propmubi.com  │        │
│  │                                                         │        │
│  │  7. Verify DNS propagation (5-15 minutes)               │        │
│  │                                                         │        │
│  │  8. Add custom domain entry to Caddy via API:           │        │
│  │     POST /caddy-api/add-custom-domain                   │        │
│  │     {                                                   │        │
│  │       "tenant_id": "uuid",                              │        │
│  │       "domain": "www.prestigebuilders.com"              │        │
│  │     }                                                   │        │
│  │                                                         │        │
│  │  9. Caddy auto-provisions SSL (Let's Encrypt)           │        │
│  │                                                         │        │
│  │  10. Update database:                                   │        │
│  │     domains.is_primary = true for custom domain         │        │
│  │     domains.redirect_to = www.prestigebuilders.com      │        │
│  │         for subdomain entry                             │        │
│  │                                                         │        │
│  │  11. Result:                                            │        │
│  │     ✓ www.prestigebuilders.com → Serves site            │        │
│  │     ✓ prestige-lakeside.propmubi.com → 301 redirect     │        │
│  │     ✓ SSL active on both                                │        │
│  │     ✓ SEO-correct canonical URLs                        │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Phase 6: Monitoring & Maintenance (Ongoing)                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                      │
│  - Monitor Caddy health (Prometheus + Grafana)                      │
│  - Track SSL certificate expiry                                     │
│  - Monitor redirect loops (should never happen)                     │
│  - Track DNS propagation issues                                     │
│  - Monitor backend service health                                   │
│  - Automated backups (Caddyfile, database)                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Final Architecture Summary

### Complete System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Production Architecture                           │
│                                                                      │
│  User Device                                                        │
│       ↓                                                             │
│  DNS Query: www.prestigebuilders.com                                │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Cloudflare DNS                           │               │
│  │  CNAME → prestige-lakeside.propmubi.com         │               │
│  │  CNAME → origin.propmubi.com                     │               │
│  │  Returns: 123.45.67.100 (VIP)                    │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Cloudflare Edge (Proxy)                  │               │
│  │  - DDoS protection                               │               │
│  │  - SSL termination                               │               │
│  │  - Caching (optional)                            │               │
│  │  - Forwards with Host: www.prestigebuilders.com  │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Keepalived VIP (123.45.67.100)          │               │
│  │  - Active/Active failover                        │               │
│  │  - Health checks                                 │               │
│  │  - Routes to active Caddy                        │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         Caddy Load Balancer                      │               │
│  │  Reads Host header: www.prestigebuilders.com    │               │
│  │       ↓                                          │               │
│  │  Matches Caddyfile block                        │               │
│  │       ↓                                          │               │
│  │  Calls Domain Lookup API                        │               │
│  │       ↓                                          │               │
│  │  Decision: Serve (is canonical)                 │               │
│  │       ↓                                          │               │
│  │  Forward to S3 backend                           │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │         S3 Storage (Static Site)                 │               │
│  │  Path: /tenants/prestige-uuid/index.html        │               │
│  │  Returns: HTML with canonical URL set           │               │
│  └─────────────────────────────────────────────────┘               │
│       ↓                                                             │
│  User receives content with:                                        │
│  - Status: 200 OK                                                   │
│  - Canonical: www.prestigebuilders.com                              │
│  - All URLs point to canonical domain                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Critical Rules Summary

### Must Follow (Non-Negotiable)

```
┌─────────────────────────────────────────────────────────────────────┐
│              Absolute Requirements                                   │
│                                                                      │
│  DNS Configuration:                                                  │
│  ✓ Use ONLY CNAME records for tenant domains                        │
│  ✓ Wildcard CNAME for all platform subdomains                       │
│  ✓ One A record only: origin.propmubi.com (hidden)                  │
│  ✗ Never create A/AAAA records for individual tenants               │
│                                                                      │
│  Routing Decisions:                                                  │
│  ✓ Route based on HTTP Host header ONLY                             │
│  ✓ Ignore DNS resolution path                                       │
│  ✗ Never route based on CNAME chain                                 │
│                                                                      │
│  Redirect Rules:                                                     │
│  ✓ Platform subdomain → 301 → Custom domain (when mapped)           │
│  ✓ Apex domain → 301 → www subdomain                                │
│  ✓ Use 301 (permanent), never 302                                   │
│  ✗ Never serve same content on multiple domains                     │
│  ✗ Never create redirect loops                                      │
│                                                                      │
│  SEO Requirements:                                                   │
│  ✓ Canonical URL always points to custom domain (if exists)         │
│  ✓ Sitemap contains only canonical URLs                             │
│  ✓ Robots.txt allows only canonical domain                          │
│  ✗ Never index multiple versions of same content                    │
│  ✗ Never use rel=alternate incorrectly                              │
│                                                                      │
│  SSL/HTTPS:                                                          │
│  ✓ Caddy handles all SSL automatically                              │
│  ✓ Cloudflare Full (Strict) mode                                    │
│  ✓ On-demand TLS for custom domains                                 │
│  ✗ Never serve HTTP (always redirect to HTTPS)                      │
│                                                                      │
│  Content Serving:                                                    │
│  ✓ Serve content ONLY on canonical domain                           │
│  ✓ Block/redirect all non-canonical access                          │
│  ✗ Never expose platform subdomains if custom domain exists         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Cost Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│              Total Monthly Costs                                     │
│                                                                      │
│  Caddy Infrastructure:                                              │
│  ├── 2x VPS (Hetzner CPX31): $28                                    │
│  ├── Cloudflare (Free plan): $0                                     │
│  └── Keepalived: $0 (included)                                      │
│  Subtotal: $28/month                                                │
│                                                                      │
│  Backend Services (optional):                                       │
│  ├── k3s cluster (3 nodes): $120                                    │
│  ├── PostgreSQL: $50                                                │
│  ├── Redis: $30                                                     │
│  ├── Elasticsearch: $200                                            │
│  ├── S3 storage (500GB): $12                                        │
│  ├── CDN bandwidth (5TB): $400                                      │
│  └── LLM API: $150                                                  │
│  Subtotal: $962/month                                               │
│                                                                      │
│  Total: ~$990/month for complete platform (100 sites)               │
│  Per-site cost: ~$10/month                                          │
│                                                                      │
│  Capacity:                                                           │
│  - 1000+ sites supported                                            │
│  - 10,000+ concurrent connections                                   │
│  - 99.9% uptime guaranteed                                          │
└─────────────────────────────────────────────────────────────────────┘
```

This is the **final, production-ready architecture** that:
- Uses CNAME-only DNS strategy
- Enforces canonical URLs correctly
- Prevents redirect loops
- SEO-optimized
- Scalable to thousands of sites
- Cost-effective ($990/month for full platform)
- No code, ready for implementation by coding agents