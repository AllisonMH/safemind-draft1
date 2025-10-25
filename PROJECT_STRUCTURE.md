# SafeMind - Recommended Project Structure

## Full-Stack Monorepo Structure

```
safemind/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── dashboard/           # Parent/guardian dashboard
│   │   │   ├── monitor/             # Real-time monitoring
│   │   │   ├── alerts/              # Alert management
│   │   │   ├── resources/           # Crisis resources
│   │   │   └── api/                 # API routes
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn components
│   │   │   ├── monitoring/          # Monitoring widgets
│   │   │   ├── alerts/              # Alert components
│   │   │   └── analytics/           # Charts and stats
│   │   ├── lib/
│   │   │   ├── api-client.ts        # API client
│   │   │   └── utils.ts             # Utilities
│   │   └── public/
│   │
│   └── api/                          # Backend API
│       ├── src/
│       │   ├── routes/
│       │   │   ├── analyze.ts       # Content analysis endpoints
│       │   │   ├── alerts.ts        # Alert management
│       │   │   ├── users.ts         # User management
│       │   │   └── webhooks.ts      # Platform webhooks
│       │   ├── services/
│       │   │   ├── content-analyzer.ts
│       │   │   ├── pattern-detector.ts
│       │   │   ├── risk-scorer.ts
│       │   │   ├── notification.ts
│       │   │   └── integrations/
│       │   │       ├── perspective.ts
│       │   │       ├── openai.ts
│       │   │       ├── huggingface.ts
│       │   │       └── crisis-lines.ts
│       │   ├── models/
│       │   │   ├── conversation.ts
│       │   │   ├── alert.ts
│       │   │   └── user.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── rate-limit.ts
│       │   │   └── validation.ts
│       │   └── utils/
│       │       ├── logger.ts
│       │       └── crypto.ts
│       └── tests/
│
├── packages/
│   ├── shared/                       # Shared utilities
│   │   ├── types/                   # TypeScript types
│   │   ├── constants/               # Shared constants
│   │   └── validators/              # Zod schemas
│   │
│   └── ml-models/                    # ML model utilities
│       ├── keyword-detector.ts
│       ├── sentiment-analyzer.ts
│       └── pattern-recognizer.ts
│
├── config/
│   ├── risk-categories.json         # Risk category definitions
│   ├── keywords.json                # Mental health keywords
│   └── crisis-resources.json        # Crisis hotlines/resources
│
├── docs/
│   ├── api/                         # API documentation
│   ├── deployment/                  # Deployment guides
│   └── privacy/                     # Privacy policies
│
├── scripts/
│   ├── setup.sh                     # Initial setup
│   └── seed.ts                      # Database seeding
│
├── .env.example
├── .gitignore
├── docker-compose.yml               # Local development
├── package.json
├── pnpm-workspace.yaml
└── turbo.json                       # Turborepo config
```

## Alternative: Separate Repositories

If you prefer separate repos:

### Frontend Repository: `safemind-web`
```
safemind-web/
├── src/
│   ├── app/                         # Next.js app directory
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
├── .env.local
└── package.json
```

### Backend Repository: `safemind-api`
```
safemind-api/
├── src/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── tests/
├── .env
└── package.json
```

## Database Schema (PostgreSQL)

```sql
-- Users table (parents/guardians)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'guardian',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Monitored youth
CREATE TABLE monitored_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID REFERENCES users(id),
    pseudonym VARCHAR(255), -- Anonymized identifier
    age_range VARCHAR(20), -- e.g., "13-15"
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitored_user_id UUID REFERENCES monitored_users(id),
    platform VARCHAR(100), -- e.g., "ChatGPT", "Claude"
    session_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    message_count INTEGER DEFAULT 0
);

-- Messages (encrypted/anonymized)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(50), -- 'user' or 'assistant'
    content_hash VARCHAR(255), -- Hashed content for privacy
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_conversation_timestamp (conversation_id, timestamp)
);

-- Analysis results
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id),
    perspective_scores JSONB, -- Perspective API results
    openai_categories JSONB, -- OpenAI Moderation results
    custom_flags JSONB, -- Custom detection results
    risk_score DECIMAL(5,2), -- 0-100
    risk_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitored_user_id UUID REFERENCES monitored_users(id),
    conversation_id UUID REFERENCES conversations(id),
    alert_type VARCHAR(100), -- 'self_harm', 'violence', etc.
    severity VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    risk_score DECIMAL(5,2),
    description TEXT,
    context JSONB, -- Relevant message context
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'acknowledged', 'resolved'
    created_at TIMESTAMP DEFAULT NOW(),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Alert notifications
CREATE TABLE alert_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES alerts(id),
    recipient_id UUID REFERENCES users(id),
    channel VARCHAR(50), -- 'email', 'sms', 'push'
    sent_at TIMESTAMP DEFAULT NOW(),
    delivered BOOLEAN DEFAULT FALSE
);

-- Pattern tracking
CREATE TABLE conversation_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitored_user_id UUID REFERENCES monitored_users(id),
    pattern_type VARCHAR(100), -- 'sentiment_decline', 'escalation', etc.
    detection_date TIMESTAMP DEFAULT NOW(),
    confidence DECIMAL(5,2),
    details JSONB
);

-- Crisis resources
CREATE TABLE crisis_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    type VARCHAR(50), -- 'hotline', 'text_line', 'chat'
    phone VARCHAR(50),
    url TEXT,
    description TEXT,
    available_hours VARCHAR(100),
    languages JSONB,
    active BOOLEAN DEFAULT TRUE
);
```

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=SafeMind
NEXT_PUBLIC_ENVIRONMENT=development
```

### Backend (.env)
```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/safemind
DATABASE_SSL=false

# API Keys
PERSPECTIVE_API_KEY=your_perspective_key
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_hf_key

# Supabase (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Notifications
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Key Files to Create

1. **Risk Scoring Algorithm** (`packages/ml-models/risk-scorer.ts`)
2. **Content Analyzer Service** (`apps/api/src/services/content-analyzer.ts`)
3. **Alert Manager** (`apps/api/src/services/alert-manager.ts`)
4. **API Integration Wrappers** (`apps/api/src/services/integrations/`)
5. **Dashboard Components** (`apps/web/components/dashboard/`)

## Development Workflow

1. **Local Development**
   ```bash
   pnpm install
   pnpm dev
   ```

2. **Testing**
   ```bash
   pnpm test
   pnpm test:e2e
   ```

3. **Build**
   ```bash
   pnpm build
   ```

4. **Deployment**
   - Frontend: Push to Vercel
   - Backend: Push to Railway
   - Database: Managed by Supabase

## Security Considerations

1. **Data Encryption**
   - Encrypt all message content at rest
   - Use TLS for all communications
   - Hash user identifiers

2. **Access Control**
   - JWT-based authentication
   - Role-based access (guardian, admin)
   - Row-level security (Supabase)

3. **Rate Limiting**
   - API rate limiting
   - Prevent abuse
   - DDoS protection via Cloudflare

4. **Audit Logging**
   - Log all access to sensitive data
   - Track alert acknowledgments
   - Monitor system usage
