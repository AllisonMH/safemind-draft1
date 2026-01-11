# SafeMind - Complete Technical Walkthrough

**Last Updated**: 2026-01-10
**Version**: 0.1.0 (MVP)
**Project**: Youth Guardrails for Artificially Intelligent Spaces

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Design](#2-architecture--design)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Core Components Deep Dive](#5-core-components-deep-dive)
6. [Data Flow & Processing Pipeline](#6-data-flow--processing-pipeline)
7. [API Layer](#7-api-layer)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Content Analysis Engine](#9-content-analysis-engine)
10. [Risk Scoring Algorithm](#10-risk-scoring-algorithm)
11. [Integration Services](#11-integration-services)
12. [Security & Privacy](#12-security--privacy)
13. [Development Workflow](#13-development-workflow)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Testing Strategy](#15-testing-strategy)
16. [Performance Considerations](#16-performance-considerations)
17. [Future Enhancements](#17-future-enhancements)

---

## 1. Project Overview

### 1.1 Purpose

SafeMind is a **real-time AI safety monitoring application** designed to protect youth (ages 17 and younger) during their interactions with AI systems. The application analyzes conversations for harmful content and concerning patterns, alerting parents/guardians when intervention may be needed.

### 1.2 Key Capabilities

The system detects and monitors:

- **Self-harm and suicidal ideation** - Critical indicators requiring immediate intervention
- **Violence and threats** - Both self-directed and toward others
- **Hate speech** - Racism, sexism, homophobia, and other discriminatory language
- **Sexual content** - Age-inappropriate material and grooming patterns
- **Mental health concerns** - Depression, anxiety, hopelessness indicators
- **Bullying and harassment** - Toxic interactions and harmful language patterns

### 1.3 Current Status

**Phase**: MVP (Minimum Viable Product)
**Completion**: Core functionality implemented
**Next Steps**: Testing, refinement, and database integration

**Completed Features**:
- ✅ Full-stack application structure (monorepo)
- ✅ Backend API with Express + TypeScript
- ✅ Frontend dashboard with Next.js 14
- ✅ Multi-layer content analysis (Perspective API + OpenAI Moderation)
- ✅ Intelligent risk scoring algorithm
- ✅ Real-time analysis capabilities
- ✅ Interactive dashboard with two analysis modes

**Pending Features**:
- 🔄 Database persistence layer
- 🔄 User authentication & authorization
- 🔄 Alert notification system (email/SMS)
- 🔄 Conversation history tracking
- 🔄 Pattern analysis over time

---

## 2. Architecture & Design

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                            │
│                  (React / Next.js)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  API Gateway Layer                           │
│              (Express.js + Middleware)                       │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐           │
│  │  CORS    │  │ Rate Limit │  │   Helmet     │           │
│  │Protection│  │  Protection│  │   Security   │           │
│  └──────────┘  └────────────┘  └──────────────┘           │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
┌────────▼────────┐         ┌────────▼────────┐
│  Health Check   │         │  Analysis API   │
│   Endpoints     │         │    Endpoints    │
└─────────────────┘         └────────┬────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
          ┌─────────▼─────────┐          ┌──────────▼──────────┐
          │ Combined Content  │          │   Route Handler     │
          │     Analyzer      │          │   (Validation)      │
          └─────────┬─────────┘          └─────────────────────┘
                    │
     ┌──────────────┼──────────────┐
     │              │              │
┌────▼─────┐  ┌────▼─────┐  ┌────▼──────┐
│Perspective│  │  OpenAI  │  │  Custom   │
│    API    │  │Moderation│  │ Detection │
│Integration│  │    API   │  │  (Keywords│
└───────────┘  └──────────┘  └───────────┘
                                  │
                    ┌─────────────┴────────────┐
                    │                          │
         ┌──────────▼──────────┐    ┌─────────▼─────────┐
         │ Mental Health       │    │   Sentiment       │
         │ Keyword Matching    │    │   Analysis        │
         └─────────────────────┘    └───────────────────┘
```

### 2.2 Design Principles

1. **Layered Detection** - Multiple independent analysis layers for comprehensive coverage
2. **Fail-Safe Operation** - System continues functioning even if one API fails
3. **Privacy-First** - Minimal data retention, encryption focus
4. **Scalability** - Async operations, stateless API design
5. **Modularity** - Loosely coupled components for easy maintenance
6. **Type Safety** - TypeScript throughout for reliability

### 2.3 Architecture Patterns

**Pattern**: **Multi-Layer Defense in Depth**
- Each detection layer operates independently
- Results are aggregated for comprehensive analysis
- No single point of failure

**Pattern**: **API Gateway**
- Single entry point for all client requests
- Centralized security, rate limiting, logging
- Clean separation between frontend and backend

**Pattern**: **Monorepo Structure**
- Shared types and constants across apps
- Consistent tooling and dependencies
- Simplified cross-package refactoring

---

## 3. Technology Stack

### 3.1 Backend Stack

```typescript
{
  "runtime": "Node.js 20+ LTS",
  "language": "TypeScript 5.3",
  "framework": "Express.js 4.18",
  "validation": "Zod 3.22",
  "http_client": "Axios 1.6",
  "security": {
    "helmet": "7.1.0",      // Security headers
    "cors": "2.8.5",         // CORS protection
    "rate_limiting": "custom" // Custom implementation
  }
}
```

**Why Node.js + TypeScript?**
- Excellent async/await support for I/O-heavy operations
- Rich ecosystem for API integrations
- Type safety reduces runtime errors
- Fast development iteration
- Easy deployment options

### 3.2 Frontend Stack

```typescript
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript 5.3",
  "ui_framework": "React 18.2",
  "styling": "Tailwind CSS 3.3",
  "utilities": {
    "clsx": "2.0.0",       // Conditional classes
    "date-fns": "3.0.0",   // Date formatting
    "axios": "1.6.2"       // API client
  }
}
```

**Why Next.js 14?**
- Server-side rendering for better SEO and performance
- App Router for modern React patterns
- Built-in API routes (future expansion)
- Excellent developer experience
- Easy Vercel deployment

### 3.3 External Services

| Service | Purpose | Free Tier | Documentation |
|---------|---------|-----------|---------------|
| **Perspective API** | Toxicity & harmful language detection | 1 req/sec unlimited | [Link](https://perspectiveapi.com) |
| **OpenAI Moderation** | Content safety categories | Free with API key | [Link](https://platform.openai.com/docs/guides/moderation) |
| **Vercel** | Frontend hosting (planned) | Generous free tier | [Link](https://vercel.com) |
| **Railway** | Backend hosting (planned) | $5/month credit | [Link](https://railway.app) |
| **Supabase** | Database (planned) | 500MB free | [Link](https://supabase.com) |

### 3.4 Development Tools

- **Package Manager**: npm (workspace mode)
- **Build Tool**: TypeScript Compiler (tsc)
- **Dev Server**: tsx (TypeScript execution)
- **Linting**: ESLint (planned)
- **Formatting**: Prettier 3.1

---

## 4. Repository Structure

### 4.1 Monorepo Layout

```
safemind-draft1/
├── apps/                           # Application packages
│   ├── api/                        # Backend API server
│   │   ├── src/
│   │   │   ├── index.ts           # Server entry point
│   │   │   ├── routes/
│   │   │   │   └── analyze.ts     # Analysis endpoints
│   │   │   ├── services/
│   │   │   │   ├── content-analyzer.ts      # Main analyzer
│   │   │   │   └── integrations/
│   │   │   │       ├── perspective.ts       # Google API
│   │   │   │       └── openai.ts            # OpenAI API
│   │   │   └── middleware/
│   │   │       ├── rate-limit.ts  # Rate limiting
│   │   │       └── error-handler.ts # Error handling
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── web/                        # Next.js frontend
│       ├── app/
│       │   ├── layout.tsx         # Root layout
│       │   ├── page.tsx           # Landing page
│       │   ├── dashboard/
│       │   │   └── page.tsx       # Main dashboard
│       │   └── globals.css        # Global styles
│       ├── components/
│       │   ├── RiskLevelBadge.tsx # Risk display
│       │   └── AlertCard.tsx      # Alert component
│       ├── lib/
│       │   └── api-client.ts      # API integration
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                       # Shared packages
│   └── shared/
│       ├── types/index.ts         # TypeScript types
│       ├── constants/index.ts     # Constants
│       ├── index.ts               # Package entry
│       └── package.json
│
├── config/
│   └── crisis-resources.json      # Crisis hotlines
│
├── examples/                       # Example implementations
│   ├── perspective-api-example.ts
│   ├── openai-moderation-example.ts
│   └── combined-content-analyzer.ts
│
├── docs/                           # GitHub Pages website
│   ├── index.html
│   └── styles.css
│
├── scripts/
│   └── setup.sh                   # Setup automation
│
├── Documentation Files
├── README.md                       # Main readme
├── TECHNICAL_RECOMMENDATIONS.md    # Stack recommendations
├── PROJECT_STRUCTURE.md            # Structure guide
├── GETTING_STARTED.md              # Setup guide
├── DEVELOPMENT.md                  # Development guide
├── QUICK_START.md                  # Quick reference
├── GITHUB_PAGES_SETUP.md           # Pages setup
└── claude.md                       # AI assistant context
```

### 4.2 Key Directories Explained

**`apps/api/`** - Backend Express server
- Handles all API requests
- Integrates with external AI services
- Performs content analysis
- Returns risk assessments

**`apps/web/`** - Next.js frontend
- User interface for analysis
- Real-time results display
- Two analysis modes (single message & conversation)

**`packages/shared/`** - Shared code
- TypeScript interfaces used by both frontend and backend
- Ensures type consistency across the stack

**`config/`** - Configuration files
- Crisis resources (hotlines, mental health services)
- Future: Risk thresholds, keyword lists

**`examples/`** - Standalone examples
- Demonstrate API usage
- Testing individual components
- Learning resources

---

## 5. Core Components Deep Dive

### 5.1 Backend Server (apps/api/src/index.ts)

**Purpose**: Main Express application entry point

**Key Features**:
```typescript
// Security middleware stack
app.use(helmet());              // Security headers
app.use(cors());                // CORS protection
app.use(rateLimiter());         // Rate limiting

// Request processing
app.use(express.json());        // JSON body parser
app.use(requestLogger);         // Custom logging

// Routes
app.get('/health');             // Health check
app.use('/api/analyze');        // Analysis routes

// Error handling
app.use(errorHandler);          // Centralized errors
```

**Startup Flow**:
1. Load environment variables from `.env`
2. Initialize Express app
3. Apply security middleware
4. Register routes
5. Start listening on configured port
6. Log startup status (including API key status)

**Environment Validation**:
- Checks for required API keys on startup
- Displays configuration status
- Graceful shutdown handling (SIGTERM, SIGINT)

### 5.2 Content Analyzer (apps/api/src/services/content-analyzer.ts)

**Purpose**: Orchestrates all detection layers and generates risk assessments

**Architecture**:
```typescript
class CombinedContentAnalyzer {
  // External API clients
  private perspective: PerspectiveAnalyzer;
  private openai: OpenAIModerator;

  // Custom detection
  private mentalHealthKeywords: Set<string>;
  private suicidalIdeationKeywords: Set<string>;

  // Methods
  async analyzeMessage(text: string): Promise<AnalysisResult>
  async analyzeConversation(messages: string[]): Promise<ConversationAnalysis>
}
```

**Analysis Pipeline** (Single Message):
```typescript
async analyzeMessage(text: string) {
  // 1. Parallel API calls for speed
  const [perspectiveResult, openaiResult, keywords, sentiment] =
    await Promise.all([
      this.perspective.analyzeText(text),    // Toxicity scores
      this.openai.moderateText(text),        // Safety categories
      this.detectKeywords(text),             // Mental health keywords
      this.analyzeSentiment(text),           // Positive/negative
    ]);

  // 2. Calculate composite risk score (0-100)
  const riskScore = this.calculateRiskScore({
    perspective: perspectiveResult,    // Weight: 30%
    openai: openaiResult,              // Weight: 40%
    keywords: keywords,                // Weight: 20%
    sentiment: sentiment               // Weight: 10%
  });

  // 3. Determine risk level
  const riskLevel = this.determineRiskLevel(riskScore);

  // 4. Set safety flags
  const flags = {
    selfHarm: /* from OpenAI categories */,
    violence: /* from OpenAI categories */,
    toxicity: /* from Perspective scores */,
    // ... more flags
  };

  // 5. Generate suggested actions
  const suggestedActions = this.generateSuggestedActions(flags, riskLevel);

  // 6. Return comprehensive result
  return { riskScore, riskLevel, flags, suggestedActions, ... };
}
```

**Conversation Analysis** (Multiple Messages):
```typescript
async analyzeConversation(messages: string[]) {
  // 1. Analyze each message individually
  const analyses = await Promise.all(
    messages.map(msg => this.analyzeMessage(msg))
  );

  // 2. Calculate overall metrics
  const overallRiskScore = average(analyses.map(a => a.riskScore));
  const overallRiskLevel = this.determineRiskLevel(overallRiskScore);

  // 3. Detect patterns
  const isEscalating = this.detectEscalation(
    analyses.map(a => a.riskScore)
  );

  const sentimentTrend = this.analyzeSentimentTrend(
    analyses.map(a => a.sentiment)
  );

  // 4. Identify critical messages
  const criticalMessages = analyses.filter(
    a => a.riskLevel === 'critical' || a.riskLevel === 'high'
  );

  // 5. Generate recommendations
  const recommendations = this.generateRecommendations({ ... });

  return { overallRiskScore, isEscalating, criticalMessages, ... };
}
```

### 5.3 Analysis Routes (apps/api/src/routes/analyze.ts)

**Purpose**: HTTP endpoints for content analysis

**Endpoints**:

**1. Analyze Single Message**
```typescript
POST /api/analyze/message
Content-Type: application/json

Request:
{
  "text": "Message content to analyze"
}

Response:
{
  "success": true,
  "analysis": {
    "timestamp": "2026-01-10T...",
    "text": "...",
    "riskScore": 45.3,
    "riskLevel": "medium",
    "categories": ["TOXICITY", "INSULT"],
    "flags": {
      "toxicity": true,
      "selfHarm": false,
      "violence": false,
      "hate": false,
      "sexual": false,
      "mentalHealthConcern": false
    },
    "requiresAlert": false,
    "suggestedActions": [
      "Monitor conversation closely",
      "Consider reaching out to mental health resources"
    ],
    "details": { /* Raw API results */ }
  }
}
```

**2. Analyze Conversation**
```typescript
POST /api/analyze/conversation
Content-Type: application/json

Request:
{
  "messages": [
    "First message",
    "Second message",
    "Third message"
  ]
}

Response:
{
  "success": true,
  "analysis": {
    "messageCount": 3,
    "overallRiskScore": 52.7,
    "overallRiskLevel": "medium",
    "isEscalating": false,
    "sentimentTrend": "stable",
    "criticalMessages": [ /* High/critical messages */ ],
    "recommendations": [
      "Continue monitoring",
      "No immediate action required"
    ]
  }
}
```

**3. Health Check**
```typescript
GET /api/analyze/health

Response:
{
  "success": true,
  "status": "ready",
  "services": {
    "perspective": true,
    "openai": true
  }
}
```

**Input Validation** (using Zod):
```typescript
const analyzeMessageSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(10000, 'Text too long')
});

const analyzeConversationSchema = z.object({
  messages: z.array(z.string().min(1).max(10000))
    .min(1)
    .max(100)  // Max 100 messages per conversation
});
```

### 5.4 Frontend Dashboard (apps/web/app/dashboard/page.tsx)

**Purpose**: Interactive UI for analyzing messages and conversations

**Component Structure**:
```typescript
export default function Dashboard() {
  // State management
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>(['']);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [conversationAnalysis, setConversationAnalysis] =
    useState<ConversationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'single' | 'conversation'>('single');

  // Analysis handlers
  const handleAnalyzeSingle = async () => { /* ... */ };
  const handleAnalyzeConversation = async () => { /* ... */ };

  // UI helpers
  const addMessage = () => { /* ... */ };
  const updateMessage = (index, value) => { /* ... */ };
  const removeMessage = (index) => { /* ... */ };

  return (/* JSX */)
}
```

**UI Layout**:
```
┌─────────────────────────────────────────────────┐
│  Header: SafeMind Dashboard                     │
│  [Single Message] [Conversation]   <-- Mode     │
└─────────────────────────────────────────────────┘
┌──────────────────────┬──────────────────────────┐
│  Input Panel         │  Results Panel           │
│                      │                          │
│  [Text Area]         │  Risk Level Badge        │
│  or                  │  Safety Flags            │
│  [Multiple Text]     │  Suggested Actions       │
│                      │  Detailed Results        │
│  Quick Examples      │                          │
│  [Analyze Button]    │                          │
└──────────────────────┴──────────────────────────┘
```

**Key Features**:
- **Two Analysis Modes**: Single message vs. full conversation
- **Real-time Analysis**: Results update immediately
- **Quick Test Examples**: Pre-filled test cases for demo
- **Visual Risk Display**: Color-coded badges for risk levels
- **Detailed Breakdowns**: All flags and suggested actions visible
- **Conversation Tools**: Add/remove messages dynamically

---

## 6. Data Flow & Processing Pipeline

### 6.1 Single Message Analysis Flow

```
User Input
    │
    ▼
┌─────────────────────────────────────┐
│  Frontend Dashboard (React)         │
│  - User enters text                 │
│  - Clicks "Analyze"                 │
└──────────────┬──────────────────────┘
               │ HTTP POST /api/analyze/message
               │ { "text": "..." }
               ▼
┌─────────────────────────────────────┐
│  API Gateway (Express)              │
│  - Rate limiting check              │
│  - Input validation (Zod)           │
│  - Request logging                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Content Analyzer                   │
│  - Orchestrates analysis            │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Perspective  │  │   OpenAI     │
│     API      │  │ Moderation   │
│              │  │     API      │
│ Returns:     │  │              │
│ - Toxicity   │  │ Returns:     │
│ - Threats    │  │ - Self-harm  │
│ - Insults    │  │ - Violence   │
│ - Profanity  │  │ - Hate       │
│   scores     │  │   categories │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
      ┌─────────┴─────────┐
      │                   │
      ▼                   ▼
┌──────────────┐  ┌──────────────┐
│   Keyword    │  │  Sentiment   │
│   Detection  │  │   Analysis   │
│              │  │              │
│ Matches:     │  │ Returns:     │
│ - Mental     │  │ -1 to +1     │
│   health     │  │   score      │
│ - Suicidal   │  │              │
│   ideation   │  │              │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Risk Scoring Algorithm             │
│                                     │
│  riskScore = (                      │
│    perspective * 0.3 +              │
│    openai * 0.4 +                   │
│    keywords * 0.2 +                 │
│    sentiment * 0.1                  │
│  )                                  │
│                                     │
│  riskLevel =                        │
│    score >= 80 ? 'critical' :       │
│    score >= 60 ? 'high' :           │
│    score >= 40 ? 'medium' : 'low'   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Action Generation                  │
│  - If selfHarm: Crisis resources    │
│  - If violence: Authority alert     │
│  - If high risk: Increase monitoring│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Response Assembly                  │
│  {                                  │
│    timestamp, text, riskScore,      │
│    riskLevel, flags, categories,    │
│    suggestedActions, details        │
│  }                                  │
└──────────────┬──────────────────────┘
               │ HTTP 200 OK
               │ JSON response
               ▼
┌─────────────────────────────────────┐
│  Frontend Dashboard                 │
│  - Parse response                   │
│  - Update UI state                  │
│  - Display results                  │
│  - Show risk badges                 │
│  - List suggested actions           │
└─────────────────────────────────────┘
```

### 6.2 Error Handling Flow

```
API Call Fails
    │
    ▼
┌─────────────────────────────────────┐
│  Service Layer (try-catch)          │
│  - Catches API errors               │
│  - Returns safe default             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Analyzer continues with            │
│  remaining services                 │
│  (fail-safe operation)              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Route Handler (try-catch)          │
│  - Catches validation errors        │
│  - Catches analysis errors          │
│  - Formats error response           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Error Handler Middleware           │
│  - Logs error                       │
│  - Returns safe error message       │
│  - HTTP 400/500 status              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend Error Display             │
│  - Shows user-friendly message      │
│  - Maintains UI state               │
└─────────────────────────────────────┘
```

---

## 7. API Layer

### 7.1 API Design Principles

1. **RESTful Design** - Standard HTTP methods and status codes
2. **JSON Communication** - All requests/responses use JSON
3. **Validation First** - Input validated before processing
4. **Consistent Responses** - Standardized response format
5. **Error Transparency** - Clear error messages for debugging

### 7.2 Response Format

**Success Response**:
```typescript
{
  "success": true,
  "analysis": { /* Analysis result object */ }
}
```

**Error Response**:
```typescript
{
  "success": false,
  "error": "Error message",
  "details": [ /* Validation errors (optional) */ ]
}
```

### 7.3 Rate Limiting

**Implementation** (apps/api/src/middleware/rate-limit.ts):
```typescript
export function rateLimiter(options: RateLimitOptions) {
  const requests = new Map<string, number[]>();

  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    // Get request history for this IP
    const userRequests = requests.get(key) || [];

    // Filter to window
    const recentRequests = userRequests.filter(
      time => time > windowStart
    );

    // Check limit
    if (recentRequests.length >= options.maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests'
      });
    }

    // Add current request
    recentRequests.push(now);
    requests.set(key, recentRequests);

    next();
  };
}
```

**Configuration**:
- Window: 60 seconds (configurable via env)
- Max requests: 100 per window (configurable via env)
- Identifier: IP address

---

## 8. Frontend Architecture

### 8.1 Next.js App Router Structure

```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout (wraps all pages)
│   ├── page.tsx            # Home/landing page
│   ├── globals.css         # Global Tailwind styles
│   └── dashboard/
│       └── page.tsx        # Main dashboard (analysis UI)
```

**Benefits of App Router**:
- File-system based routing
- Automatic code splitting
- Server components by default
- Simplified data fetching
- Built-in loading/error states

### 8.2 Component Architecture

**Component Hierarchy**:
```
Dashboard (Page)
├── Header
│   ├── Title
│   └── Mode Selector (Single/Conversation)
├── Input Panel
│   ├── Single Mode
│   │   ├── Textarea
│   │   └── Analyze Button
│   ├── Conversation Mode
│   │   ├── Message List
│   │   │   └── Message Input (multiple)
│   │   ├── Add Message Button
│   │   └── Analyze Button
│   └── Quick Examples
└── Results Panel
    ├── Risk Level Badge (Component)
    ├── Safety Flags Display
    ├── Alert Card (Component)
    └── Detailed Results
```

**Shared Components**:

**RiskLevelBadge.tsx**:
```typescript
interface RiskLevelBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  score?: number;
}

export default function RiskLevelBadge({ level, score }) {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <span className={colors[level]}>
      {level.toUpperCase()}
      {score && ` (${score.toFixed(1)}/100)`}
    </span>
  );
}
```

**AlertCard.tsx**:
```typescript
interface AlertCardProps {
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  actions?: string[];
}

export default function AlertCard({ type, title, message, actions }) {
  // Color schemes based on type
  // Displays title, message, and optional action list
}
```

### 8.3 State Management

**Current Approach**: React useState hooks
- Simple and effective for MVP
- No external state management library needed
- State is local to Dashboard component

**State Variables**:
```typescript
const [text, setText] = useState('');              // Single message input
const [messages, setMessages] = useState(['']);    // Conversation inputs
const [analysis, setAnalysis] = useState(null);    // Single result
const [conversationAnalysis, setConversationAnalysis] = useState(null);
const [loading, setLoading] = useState(false);     // Loading state
const [error, setError] = useState(null);          // Error message
const [mode, setMode] = useState('single');        // UI mode
```

**Future Consideration**: For complex features (user sessions, history), consider:
- **Zustand** - Lightweight state management
- **React Query** - Server state caching
- **Context API** - Cross-component state

### 8.4 API Client (apps/web/lib/api-client.ts)

**Purpose**: Centralized API communication

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const response = await axios.post(`${API_URL}/api/analyze/message`, {
    text
  });
  return response.data.analysis;
}

export async function analyzeConversation(
  messages: string[]
): Promise<ConversationAnalysis> {
  const response = await axios.post(`${API_URL}/api/analyze/conversation`, {
    messages
  });
  return response.data.analysis;
}
```

**Error Handling**:
```typescript
try {
  const result = await analyzeMessage(text);
  setAnalysis(result);
} catch (err) {
  setError(err.message || 'Analysis failed');
}
```

---

## 9. Content Analysis Engine

### 9.1 Detection Layers

**Layer 1: Perspective API** (Google)
- **Purpose**: Toxicity and harmful language detection
- **Attributes Analyzed**:
  - TOXICITY - Overall toxicity
  - SEVERE_TOXICITY - Extreme toxicity
  - IDENTITY_ATTACK - Attacks on identity
  - INSULT - Insulting language
  - PROFANITY - Swear words
  - THREAT - Threatening language
  - SEXUALLY_EXPLICIT - Sexual content
  - FLIRTATION - Flirtatious language

**Layer 2: OpenAI Moderation API**
- **Purpose**: Comprehensive content safety
- **Categories Detected**:
  - sexual / sexual/minors - Sexual content
  - hate / hate/threatening - Hate speech
  - violence / violence/graphic - Violent content
  - self-harm / self-harm/intent / self-harm/instructions
  - harassment / harassment/threatening

**Layer 3: Mental Health Keyword Detection**
- **Purpose**: Catch mental health concerns
- **Keyword Sets**:
  ```typescript
  mentalHealthKeywords = [
    'depressed', 'depression', 'anxious', 'anxiety',
    'hopeless', 'worthless', 'lonely', 'isolated',
    'empty', 'numb', 'tired of living', 'can\'t go on',
    'give up', 'no point', 'burden',
    'better off without me', 'end it all', 'done with life'
  ];

  suicidalIdeationKeywords = [
    'kill myself', 'suicide', 'end my life', 'want to die',
    'wish i was dead', 'wouldn\'t miss me',
    'goodbye forever', 'final message',
    'take my own life', 'self harm', 'cut myself',
    'overdose', 'jump off', 'hang myself'
  ];
  ```

**Layer 4: Sentiment Analysis**
- **Purpose**: Detect emotional tone
- **Method**: Simple keyword counting
- **Output**: Score from -1 (negative) to +1 (positive)

### 9.2 Integration Service Details

**Perspective API Integration** (apps/api/src/services/integrations/perspective.ts):

```typescript
class PerspectiveAnalyzer {
  private apiUrl = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

  async analyzeText(text: string) {
    const requestBody = {
      comment: { text },
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        INSULT: {},
        PROFANITY: {},
        THREAT: {},
        SEXUALLY_EXPLICIT: {},
        FLIRTATION: {}
      },
      languages: ['en']
    };

    const response = await fetch(
      `${this.apiUrl}?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    // Extract scores and find highest
    const scores = {};
    let highestScore = 0;
    const flaggedCategories = [];

    for (const [attr, result] of Object.entries(data.attributeScores)) {
      const score = result.summaryScore.value;
      scores[attr] = score;

      if (score > highestScore) highestScore = score;
      if (score > 0.7) flaggedCategories.push(attr);
    }

    return { scores, highestScore, flaggedCategories };
  }
}
```

**OpenAI Moderation Integration** (apps/api/src/services/integrations/openai.ts):

```typescript
class OpenAIModerator {
  private apiUrl = 'https://api.openai.com/v1/moderations';

  async moderateText(text: string) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ input: text })
    });

    const data = await response.json();
    const result = data.results[0];

    // Extract flagged categories
    const categories = Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category, _]) => category);

    // Identify critical flags
    const criticalCategories = [
      'self-harm/intent',
      'self-harm/instructions',
      'violence/graphic',
      'harassment/threatening',
      'sexual/minors'
    ];

    const criticalFlags = categories.filter(
      cat => criticalCategories.includes(cat)
    );

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(
      result.category_scores,
      criticalFlags
    );

    return {
      flagged: result.flagged,
      categories,
      scores: result.category_scores,
      criticalFlags,
      riskLevel
    };
  }
}
```

---

## 10. Risk Scoring Algorithm

### 10.1 Composite Score Calculation

**Formula**:
```
riskScore = (
  perspectiveScore × 0.3 +
  openaiScore × 0.4 +
  keywordScore × 0.2 +
  sentimentScore × 0.1
)
```

**Component Scores** (all normalized to 0-100):

**1. Perspective Score**:
```typescript
perspectiveScore = perspective.highestScore × 100
// Example: 0.85 toxicity → 85 points
```

**2. OpenAI Score**:
```typescript
openaiScore = Math.max(...Object.values(openai.scores)) × 100
// Example: 0.92 self-harm/intent → 92 points
```

**3. Keyword Score**:
```typescript
if (keywords.some(k => k.includes('[CRITICAL]'))) {
  keywordScore = 100;  // Suicidal ideation detected
} else {
  keywordScore = keywords.length × 20;  // Each keyword = 20 points
}
```

**4. Sentiment Score**:
```typescript
sentimentScore = (1 - sentiment) × 50
// sentiment ranges from -1 to +1
// More negative = higher risk
// Example: -0.6 sentiment → (1 - (-0.6)) × 50 = 80 points
```

### 10.2 Risk Level Determination

```typescript
function determineRiskLevel(score: number, criticalFlags: string[]) {
  // Critical flags override score
  if (criticalFlags.length > 0) return 'critical';

  // Score-based levels
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}
```

**Risk Level Matrix**:

| Risk Level | Score Range | Criteria | Action Required |
|------------|-------------|----------|-----------------|
| **Low** | 0-39 | Safe content, no concerns | Continue monitoring |
| **Medium** | 40-59 | Some concerning language | Increased attention |
| **High** | 60-79 | Harmful content detected | Alert guardians |
| **Critical** | 80-100 or critical flags | Self-harm, violence, explicit threats | Immediate intervention |

### 10.3 Escalation Detection

**Purpose**: Identify worsening patterns over time

```typescript
function detectEscalation(scores: number[]): boolean {
  if (scores.length < 3) return false;

  // Compare recent vs. older scores
  const recentScores = scores.slice(-3);      // Last 3 messages
  const olderScores = scores.slice(-6, -3);   // Previous 3 messages

  if (olderScores.length === 0) return false;

  const recentAvg = average(recentScores);
  const olderAvg = average(olderScores);

  // Escalation = 30% increase
  return recentAvg > olderAvg × 1.3;
}
```

**Example**:
- Older scores: [25, 30, 28] → avg = 27.7
- Recent scores: [45, 50, 48] → avg = 47.7
- Ratio: 47.7 / 27.7 = 1.72 > 1.3 → **Escalating**

### 10.4 Sentiment Trend Analysis

```typescript
function analyzeSentimentTrend(sentiments: number[]):
  'improving' | 'declining' | 'stable' {

  if (sentiments.length < 3) return 'stable';

  const recentAvg = average(sentiments.slice(-3));
  const olderAvg = average(sentiments.slice(-6, -3));

  if (recentAvg > olderAvg × 1.2) return 'improving';   // 20% better
  if (recentAvg < olderAvg × 0.8) return 'declining';   // 20% worse
  return 'stable';
}
```

---

## 11. Integration Services

### 11.1 External API Communication

**Error Handling Strategy**:
```typescript
async analyzeMessage(text: string) {
  const [perspectiveResult, openaiResult] = await Promise.all([
    this.perspective.analyzeText(text).catch(() => ({
      scores: {},
      highestScore: 0,
      flaggedCategories: []
    })),
    this.openai.moderateText(text).catch(() => ({
      flagged: false,
      categories: [],
      scores: {},
      criticalFlags: [],
      riskLevel: 'low'
    }))
  ]);

  // Analysis continues with available data
}
```

**Benefits**:
- System remains functional if one API fails
- Partial results better than complete failure
- Logged errors allow debugging

### 11.2 API Rate Limiting

**Perspective API**:
- Free tier: 1 request/second
- Unlimited total requests
- Current implementation: No client-side throttling (single requests)
- Future: Implement queue for high-volume scenarios

**OpenAI Moderation API**:
- Free for OpenAI API users
- No documented rate limits for moderation endpoint
- Generous usage allowances

**Application-Level Rate Limiting**:
- Protects backend from abuse
- Prevents API quota exhaustion
- See section 7.3 for implementation

### 11.3 Response Caching

**Current State**: No caching implemented (MVP)

**Future Enhancement**:
```typescript
// Cache identical text analysis for 1 hour
const cache = new Map<string, { result: any, timestamp: number }>();

function getCachedAnalysis(text: string) {
  const hash = createHash(text);
  const cached = cache.get(hash);

  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.result;
  }

  return null;
}
```

**Benefits**:
- Faster responses for repeated content
- Reduced API costs
- Lower latency

---

## 12. Security & Privacy

### 12.1 Current Security Measures

**1. CORS Protection**:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

**2. Security Headers (Helmet)**:
```typescript
app.use(helmet());
// Sets:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security
// - Content-Security-Policy
```

**3. Rate Limiting**:
- IP-based request tracking
- Configurable windows and limits
- 429 responses for exceeded limits

**4. Input Validation**:
```typescript
// Zod schemas validate ALL inputs
const schema = z.object({
  text: z.string().min(1).max(10000)
});

const validated = schema.parse(req.body); // Throws on invalid
```

**5. Environment Variable Protection**:
- API keys in `.env` (git-ignored)
- No secrets in code
- Example file (`.env.example`) for guidance

**6. Request Size Limits**:
```typescript
app.use(express.json({ limit: '1mb' }));
```

### 12.2 Privacy Considerations

**Current State (MVP)**:
- ✅ No data persistence (in-memory only)
- ✅ No user identification
- ✅ No message logging (except server logs)
- ✅ Stateless architecture

**Future Database Integration**:
When implementing persistence:

1. **Encryption at Rest**:
```typescript
const encrypted = encrypt(messageContent, ENCRYPTION_KEY);
// Store encrypted data only
```

2. **Anonymization**:
```typescript
const userId = hash(actualUserId + SALT);
// Store hashed IDs, not real identifiers
```

3. **Data Minimization**:
- Store only what's necessary
- Content hashes instead of full text
- Analysis results without original messages

4. **Retention Policies**:
- Auto-delete after N days
- Purge resolved alerts
- User-initiated data deletion

### 12.3 COPPA Compliance Roadmap

**Requirements for Youth Safety Apps**:

1. **Parental Consent**:
   - Verifiable consent mechanism
   - Email + verification link
   - Age verification

2. **Disclosure**:
   - Clear privacy policy
   - Explain what's monitored
   - Explain how data is used

3. **Data Protection**:
   - Minimal PII collection
   - Secure storage
   - Limited retention

4. **Parental Control**:
   - Parents can view data
   - Parents can delete data
   - Parents can revoke consent

**Implementation Checklist** (Future):
- [ ] Consent flow in frontend
- [ ] Age verification system
- [ ] Privacy policy page
- [ ] Parental dashboard
- [ ] Data export functionality
- [ ] Data deletion API
- [ ] Audit logging

---

## 13. Development Workflow

### 13.1 Local Development Setup

**Prerequisites**:
```bash
# Required
- Node.js 20+
- npm 10+
- Git

# Recommended
- VS Code
- Postman (API testing)
```

**Initial Setup**:
```bash
# 1. Clone repository
git clone <repository-url>
cd safemind-draft1

# 2. Install dependencies (root)
npm install

# 3. Install app dependencies
cd apps/api && npm install
cd ../web && npm install
cd ../..

# 4. Configure environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your API keys

# Optional: Frontend env
cp apps/web/.env.local.example apps/web/.env.local
```

**API Keys Setup**:

1. **Perspective API**:
   - Visit: https://developers.perspectiveapi.com/s/
   - Enable API
   - Create credentials
   - Copy key to `.env`

2. **OpenAI API**:
   - Visit: https://platform.openai.com/signup
   - Create account
   - Generate API key
   - Copy key to `.env`

### 13.2 Running the Application

**Development Mode** (recommended):

```bash
# Terminal 1 - Backend
npm run dev:api
# Server starts on http://localhost:3001

# Terminal 2 - Frontend
npm run dev:web
# Next.js starts on http://localhost:3000
```

**Alternative** (manual):
```bash
# Backend
cd apps/api
npm run dev

# Frontend
cd apps/web
npm run dev
```

**Production Build**:
```bash
# Build all workspaces
npm run build

# Start backend in production
cd apps/api
npm start

# Start frontend in production
cd apps/web
npm run build && npm start
```

### 13.3 Development Scripts

**Root-level scripts** (package.json):
```json
{
  "dev:api": "npm run dev --workspace=apps/api",
  "dev:web": "npm run dev --workspace=apps/web",
  "build": "npm run build --workspaces",
  "test": "npm run test --workspaces",
  "lint": "npm run lint --workspaces",
  "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
  "typecheck": "npm run typecheck --workspaces"
}
```

**Backend scripts** (apps/api/package.json):
```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "typecheck": "tsc --noEmit"
}
```

**Frontend scripts** (apps/web/package.json):
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

### 13.4 Testing APIs

**Using cURL**:
```bash
# Health check
curl http://localhost:3001/health

# Analyze message
curl -X POST http://localhost:3001/api/analyze/message \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling sad and hopeless"}'

# Analyze conversation
curl -X POST http://localhost:3001/api/analyze/conversation \
  -H "Content-Type: application/json" \
  -d '{"messages": ["First message", "Second message", "Third message"]}'
```

**Using Postman**:
1. Import collection (create from examples above)
2. Set `{{baseUrl}}` variable to `http://localhost:3001`
3. Run requests

**Using Frontend**:
1. Navigate to `http://localhost:3000/dashboard`
2. Enter text or use quick examples
3. Click "Analyze"
4. View results

---

## 14. Deployment Strategy

### 14.1 Recommended Hosting

**Frontend** (Next.js):
- **Platform**: Vercel
- **Free Tier**: Yes (generous)
- **Features**:
  - Automatic deployments from GitHub
  - Built-in CDN
  - Custom domains
  - Serverless functions
  - Environment variables

**Backend** (Express):
- **Platform**: Railway or Render
- **Railway Free Tier**: $5/month credit
- **Render Free Tier**: Yes (with limitations)
- **Features**:
  - GitHub integration
  - Automatic deployments
  - Environment variables
  - Custom domains
  - Logs and monitoring

**Database** (Future):
- **Platform**: Supabase
- **Free Tier**: 500MB + 50K users
- **Features**:
  - PostgreSQL
  - Built-in authentication
  - Real-time subscriptions
  - Row-level security
  - Automatic backups

### 14.2 Frontend Deployment (Vercel)

**Setup**:
1. Push code to GitHub
2. Connect Vercel to repository
3. Configure project:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

**Deploy**:
- Automatic on every push to main
- Preview deployments for pull requests
- Custom domain support

### 14.3 Backend Deployment (Railway)

**Setup**:
1. Create Railway account
2. Create new project
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

**Environment Variables**:
```
PORT=3001
NODE_ENV=production
PERSPECTIVE_API_KEY=your_key
OPENAI_API_KEY=your_key
CORS_ORIGIN=https://your-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**Deploy**:
- Automatic on every push
- Logs available in dashboard
- Health checks enabled

### 14.4 Deployment Checklist

**Pre-Deployment**:
- [ ] All API keys configured in environment variables
- [ ] CORS_ORIGIN set to production frontend URL
- [ ] Production environment variables set
- [ ] Build succeeds locally (`npm run build`)
- [ ] Type checking passes (`npm run typecheck`)

**Post-Deployment**:
- [ ] Health endpoint returns 200 (`/health`)
- [ ] Analysis endpoints functional
- [ ] Frontend can connect to backend
- [ ] Error logging configured
- [ ] Rate limiting tested
- [ ] SSL/HTTPS enabled
- [ ] Custom domains configured (if applicable)

### 14.5 Monitoring & Logging

**Backend Logging**:
```typescript
// Current: Console logging
console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);

// Future: Structured logging
import winston from 'winston';

logger.info('Request processed', {
  method: req.method,
  path: req.path,
  status: res.statusCode,
  duration,
  ip: req.ip
});
```

**Error Tracking** (Future):
- **Sentry**: Error monitoring and reporting
- **LogRocket**: Session replay for debugging
- **Railway Logs**: Built-in log viewing

**Uptime Monitoring** (Future):
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Website monitoring
- **StatusPage**: Public status page

---

## 15. Testing Strategy

### 15.1 Current State

**Status**: Testing infrastructure not yet implemented (MVP focus)

**Manual Testing**:
- API endpoints tested via Postman
- Frontend tested in browser
- Integration tested end-to-end

### 15.2 Planned Testing Approach

**Unit Tests** (apps/api/src/**/*.test.ts):
```typescript
// Example: Risk scoring
describe('CombinedContentAnalyzer', () => {
  describe('calculateRiskScore', () => {
    it('should return 100 for critical keywords', () => {
      const analyzer = new CombinedContentAnalyzer(apiKey1, apiKey2);
      const score = analyzer.calculateRiskScore({
        perspective: { highestScore: 0.5 },
        openai: { scores: { 'self-harm/intent': 0.3 } },
        keywords: ['[CRITICAL] kill myself'],
        sentiment: -0.5
      });
      expect(score).toBeGreaterThan(80);
    });
  });
});
```

**Integration Tests** (apps/api/tests/integration):
```typescript
// Example: API endpoint
describe('POST /api/analyze/message', () => {
  it('should analyze toxic message', async () => {
    const response = await request(app)
      .post('/api/analyze/message')
      .send({ text: 'You are stupid and worthless' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.analysis.riskLevel).toBe('medium' || 'high');
    expect(response.body.analysis.flags.toxicity).toBe(true);
  });
});
```

**E2E Tests** (Playwright/Cypress):
```typescript
// Example: Dashboard workflow
test('should analyze message and display results', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');

  await page.fill('textarea', 'I am feeling depressed');
  await page.click('button:has-text("Analyze")');

  await expect(page.locator('.risk-badge')).toContainText('MEDIUM');
  await expect(page.locator('.flags')).toContainText('Mental Health');
});
```

### 15.3 Testing Tools Recommendation

| Type | Tool | Purpose |
|------|------|---------|
| **Unit** | Jest | Backend logic testing |
| **Integration** | Supertest | API endpoint testing |
| **E2E** | Playwright | Full user flows |
| **Mocking** | MSW | API response mocking |
| **Coverage** | c8/nyc | Code coverage reporting |

---

## 16. Performance Considerations

### 16.1 Current Performance Characteristics

**Backend**:
- **Response Time**: ~1-3 seconds (dependent on external APIs)
  - Perspective API: ~500-800ms
  - OpenAI Moderation: ~300-600ms
  - Keyword/Sentiment: <10ms
  - Parallel execution minimizes total time

**Frontend**:
- **Initial Load**: ~200-500ms (Next.js SSR)
- **Interaction**: Instant (React state updates)
- **Analysis**: 1-3 seconds (API call)

### 16.2 Optimization Strategies

**1. Parallel API Calls**:
```typescript
// ✅ Good: Parallel (current implementation)
const [p, o, k, s] = await Promise.all([
  perspective.analyze(text),
  openai.moderate(text),
  detectKeywords(text),
  analyzeSentiment(text)
]);

// ❌ Bad: Sequential
const p = await perspective.analyze(text);
const o = await openai.moderate(text);
const k = await detectKeywords(text);
const s = await analyzeSentiment(text);
```

**2. Request Batching** (Future):
```typescript
// Instead of analyzing 10 messages with 10 API calls:
const results = await Promise.all(
  messages.map(msg => analyzeMessage(msg))
);

// Batch into single API call (if supported):
const results = await analyzeBatch(messages);
```

**3. Caching** (Future):
- Cache identical text analysis
- Cache API responses for 1 hour
- Reduces duplicate processing

**4. Database Indexing** (Future):
```sql
CREATE INDEX idx_conversation_timestamp ON messages(conversation_id, timestamp);
CREATE INDEX idx_alert_severity ON alerts(severity, created_at);
```

**5. Frontend Optimization**:
- Code splitting (Next.js automatic)
- Image optimization (Next.js Image component)
- Debouncing real-time analysis (if implemented)

### 16.3 Scalability Considerations

**Current Limits**:
- **Stateless**: Can scale horizontally
- **API Rate Limits**:
  - Perspective: 1 req/sec
  - OpenAI: Generous (no published limit)
- **Memory**: Minimal (no persistence)

**Future Scaling** (1000+ users):

1. **Database Connection Pooling**:
```typescript
const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

2. **Load Balancing**:
- Multiple backend instances
- Round-robin distribution
- Health check routing

3. **Queue System** (High Volume):
```typescript
// Instead of synchronous analysis:
await queue.add('analyze', { text, userId });

// Worker processes queue
worker.process('analyze', async (job) => {
  const result = await analyzer.analyzeMessage(job.data.text);
  await saveResult(job.data.userId, result);
});
```

4. **CDN for Frontend**:
- Vercel Edge Network (automatic)
- Cloudflare (additional layer)

---

## 17. Future Enhancements

### 17.1 Phase 2: Database & Authentication (4-6 weeks)

**Database Schema**:
- Users (guardians)
- Monitored users (youth)
- Conversations
- Messages (encrypted)
- Analysis results
- Alerts

**Authentication**:
- JWT-based auth
- Parent/guardian accounts
- Role-based access control
- Password reset flow

**Implementation**:
```typescript
// Supabase client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Store analysis result
await supabase.from('analysis_results').insert({
  message_id,
  risk_score,
  risk_level,
  flags,
  analyzed_at: new Date()
});
```

### 17.2 Phase 3: Alert Notifications (4-6 weeks)

**Notification Channels**:
1. **Email** (SendGrid):
```typescript
await sendgrid.send({
  to: guardian.email,
  from: 'alerts@safemind.app',
  subject: '🚨 SafeMind Alert: High-Risk Message Detected',
  html: alertTemplate({ analysis })
});
```

2. **SMS** (Twilio):
```typescript
await twilio.messages.create({
  to: guardian.phone,
  from: TWILIO_NUMBER,
  body: 'SafeMind Alert: High-risk message detected. Check dashboard.'
});
```

3. **Push Notifications** (Firebase):
```typescript
await messaging.send({
  token: guardian.fcmToken,
  notification: {
    title: 'SafeMind Alert',
    body: 'High-risk message detected'
  }
});
```

**Alert Rules**:
- Critical risk level → Immediate alert
- High risk level → Alert within 5 minutes
- Pattern escalation → Daily summary
- Mental health keywords → Immediate alert

### 17.3 Phase 4: Advanced Analytics (6-8 weeks)

**Pattern Recognition**:
- Long-term trend analysis
- Recurring themes detection
- Risk trajectory forecasting
- Intervention effectiveness tracking

**Dashboard Features**:
- Historical charts (risk over time)
- Category breakdown
- Sentiment trends
- Alert history
- Export reports (PDF/CSV)

**Visualization**:
```typescript
import { LineChart, BarChart } from 'recharts';

<LineChart data={riskHistory}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line type="monotone" dataKey="riskScore" stroke="#8884d8" />
</LineChart>
```

### 17.4 Phase 5: Machine Learning (8-12 weeks)

**Custom Model Training**:
```python
# Fine-tune transformer for mental health detection
from transformers import AutoModelForSequenceClassification, Trainer

model = AutoModelForSequenceClassification.from_pretrained(
    'bert-base-uncased',
    num_labels=6  # Categories: safe, depression, anxiety, self-harm, etc.
)

trainer = Trainer(
    model=model,
    train_dataset=mental_health_dataset,
    eval_dataset=eval_dataset
)

trainer.train()
```

**Features**:
- Custom mental health classifier
- Context-aware detection
- Reduced false positives
- Personalized risk thresholds
- Continuous learning from feedback

### 17.5 Phase 6: Multi-Language Support (6-8 weeks)

**Translation API Integration**:
```typescript
// Detect language
const language = await detectLanguage(text);

// Translate to English for analysis
if (language !== 'en') {
  text = await translate(text, 'en');
}

// Analyze (all models are English)
const result = await analyzer.analyzeMessage(text);
```

**Supported Languages** (planned):
- Spanish
- French
- German
- Portuguese
- Mandarin

### 17.6 Phase 7: Platform Integrations (8-12 weeks)

**Integration APIs**:
- Discord bot
- Slack bot
- Chrome extension (ChatGPT/Claude monitoring)
- Browser extension (general web monitoring)

**Example: Chrome Extension**:
```typescript
// Content script monitors chat interfaces
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (isMessageNode(node)) {
        const text = extractText(node);
        analyzeAndFlag(text);
      }
    });
  });
});
```

---

## Appendix A: Quick Reference

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server health check |
| GET | `/api/analyze/health` | Analysis services status |
| POST | `/api/analyze/message` | Analyze single message |
| POST | `/api/analyze/conversation` | Analyze conversation |

### Risk Levels

| Level | Score | Description | Action |
|-------|-------|-------------|--------|
| Low | 0-39 | Safe content | Continue monitoring |
| Medium | 40-59 | Some concerns | Increased attention |
| High | 60-79 | Harmful content | Alert guardians |
| Critical | 80-100 | Immediate danger | Immediate intervention |

### Directory Quick Access

| Purpose | Path |
|---------|------|
| Backend entry | `apps/api/src/index.ts` |
| Content analyzer | `apps/api/src/services/content-analyzer.ts` |
| API routes | `apps/api/src/routes/analyze.ts` |
| Frontend dashboard | `apps/web/app/dashboard/page.tsx` |
| Shared types | `packages/shared/types/index.ts` |
| Crisis resources | `config/crisis-resources.json` |

### Environment Variables

**Backend** (`apps/api/.env`):
```bash
PORT=3001
PERSPECTIVE_API_KEY=your_key
OPENAI_API_KEY=your_key
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Appendix B: Troubleshooting

### Common Issues

**1. "API Keys not configured"**
- **Cause**: Missing `.env` file or keys
- **Solution**: Copy `.env.example` to `.env` and add keys

**2. "Cannot connect to backend"**
- **Cause**: Backend not running or wrong URL
- **Solution**: Check backend is running on port 3001, verify `NEXT_PUBLIC_API_URL`

**3. "Rate limit exceeded"**
- **Cause**: Too many requests
- **Solution**: Wait 60 seconds or adjust `RATE_LIMIT_MAX_REQUESTS`

**4. "Module not found"**
- **Cause**: Dependencies not installed
- **Solution**: Run `npm install` in root, `apps/api`, and `apps/web`

**5. Perspective API errors**
- **Cause**: Invalid API key or quota exceeded
- **Solution**: Verify key in Google Cloud Console, check quotas

---

## Appendix C: Resources

### Documentation
- [Perspective API](https://developers.perspectiveapi.com/)
- [OpenAI Moderation](https://platform.openai.com/docs/guides/moderation)
- [Next.js](https://nextjs.org/docs)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Crisis Resources
- **988 Suicide & Crisis Lifeline**: https://988lifeline.org
- **Crisis Text Line**: Text HOME to 741741
- **Trevor Project** (LGBTQ+ Youth): 1-866-488-7386

### Community
- GitHub Issues: Report bugs and request features
- Stack Overflow: Technical questions
- Reddit r/webdev: General web development

---

**End of Technical Walkthrough**

*This document provides a complete technical overview of the SafeMind project. For specific implementation details, refer to the source code and inline comments.*

**Version**: 1.0
**Last Updated**: 2026-01-10
**Maintainer**: SafeMind Development Team
