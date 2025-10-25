# Claude.md - SafeMind Project Context

This file provides context about the SafeMind project to help AI assistants (like Claude) understand the codebase and provide better assistance.

## Project Overview

**SafeMind** is a youth safety monitoring application that detects harmful language and unsafe conversational patterns in AI interactions. It's designed to protect youth (ages 17 and younger) by analyzing conversations in real-time and alerting guardians when concerning patterns are detected.

### Purpose
- Detect harmful language (violence, hate speech, sexual content)
- Identify mental health concerns and self-harm ideation
- Monitor conversation patterns and escalation
- Alert trusted contacts when intervention may be needed
- Provide crisis resources and suggested actions

### Target Users
- Parents/guardians of youth using AI platforms
- Educational institutions
- Mental health organizations
- Youth advocacy groups

## Technology Stack

### Backend (apps/api)
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **APIs**:
  - Perspective API (Google) - Toxicity detection
  - OpenAI Moderation API - Safety categories
- **Key Libraries**:
  - `zod` - Input validation
  - `helmet` - Security headers
  - `cors` - CORS handling
  - `dotenv` - Environment variables
  - `axios` - HTTP client

### Frontend (apps/web)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Key Libraries**:
  - `axios` - API client
  - `date-fns` - Date formatting
  - `clsx` - Conditional classes

### Shared Packages
- **@safemind/shared**: Common types and constants

## Project Structure

```
safemind-draft1/
├── apps/
│   ├── api/                          # Backend API
│   │   ├── src/
│   │   │   ├── index.ts             # Main server entry point
│   │   │   ├── routes/
│   │   │   │   └── analyze.ts       # Analysis endpoints
│   │   │   ├── services/
│   │   │   │   ├── content-analyzer.ts          # Main analyzer
│   │   │   │   └── integrations/
│   │   │   │       ├── perspective.ts           # Perspective API
│   │   │   │       └── openai.ts                # OpenAI API
│   │   │   ├── middleware/
│   │   │   │   ├── rate-limit.ts    # Rate limiting
│   │   │   │   └── error-handler.ts # Error handling
│   │   │   └── utils/               # Utility functions
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── web/                          # Frontend
│       ├── app/
│       │   ├── layout.tsx           # Root layout
│       │   ├── page.tsx             # Home page
│       │   ├── globals.css          # Global styles
│       │   └── dashboard/
│       │       └── page.tsx         # Main dashboard
│       ├── components/
│       │   ├── RiskLevelBadge.tsx   # Risk display component
│       │   └── AlertCard.tsx        # Alert component
│       ├── lib/
│       │   └── api-client.ts        # API integration
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                       # Shared code
│       ├── types/index.ts           # TypeScript types
│       └── constants/index.ts       # Constants
│
├── config/
│   └── crisis-resources.json        # Crisis hotlines
│
├── examples/                         # Code examples
│   ├── perspective-api-example.ts
│   ├── openai-moderation-example.ts
│   └── combined-content-analyzer.ts
│
├── scripts/
│   └── setup.sh                     # Setup script
│
└── [Documentation files]
```

## Key Concepts

### 1. Content Analysis Pipeline

```
User Input → API Endpoint → Content Analyzer → Multiple Detection Layers → Risk Scoring → Results
```

**Detection Layers:**
1. **Perspective API**: Toxicity, threats, insults, profanity, etc.
2. **OpenAI Moderation**: Self-harm, violence, hate, sexual content, etc.
3. **Keyword Detection**: Mental health keywords, suicidal ideation
4. **Sentiment Analysis**: Simple positive/negative scoring

### 2. Risk Scoring System

Risk scores are calculated from 0-100:
- **0-40**: Low risk (safe content)
- **40-60**: Medium risk (monitor)
- **60-80**: High risk (concerning)
- **80-100**: Critical risk (immediate action)

**Formula:**
```
riskScore =
  (perspectiveScore * 0.3) +
  (openaiScore * 0.4) +
  (keywordScore * 0.2) +
  (sentimentScore * 0.1)
```

### 3. Safety Categories

**Primary Flags:**
- `selfHarm` - Self-harm intent or instructions
- `violence` - Violence, threats, graphic content
- `toxicity` - Toxic language, insults
- `hate` - Hate speech, discrimination
- `sexual` - Sexual content, especially minors
- `mentalHealthConcern` - Depression, anxiety indicators

### 4. Analysis Types

**Single Message Analysis:**
```typescript
POST /api/analyze/message
{ "text": "message content" }
```

**Conversation Analysis:**
```typescript
POST /api/analyze/conversation
{ "messages": ["msg1", "msg2", "msg3"] }
```

## Common Development Tasks

### Adding a New API Endpoint

1. Create route in `apps/api/src/routes/your-route.ts`:
```typescript
import { Router } from 'express';
const router = Router();

router.post('/endpoint', async (req, res) => {
  // Implementation
});

export default router;
```

2. Register in `apps/api/src/index.ts`:
```typescript
import yourRoute from './routes/your-route';
app.use('/api/your-route', yourRoute);
```

### Adding a New Frontend Component

1. Create in `apps/web/components/YourComponent.tsx`:
```typescript
interface YourComponentProps {
  // props
}

export default function YourComponent({ }: YourComponentProps) {
  return (
    <div>Component content</div>
  );
}
```

2. Import and use:
```typescript
import YourComponent from '@/components/YourComponent';
```

### Adding a New Detection Service

1. Create service in `apps/api/src/services/your-service.ts`:
```typescript
export class YourService {
  async analyze(text: string) {
    // Analysis logic
  }
}
```

2. Integrate in `apps/api/src/services/content-analyzer.ts`:
```typescript
import { YourService } from './your-service';
// Use in analyzeMessage method
```

### Adding Shared Types

1. Add to `packages/shared/types/index.ts`:
```typescript
export interface YourType {
  // fields
}
```

2. Use in both frontend and backend:
```typescript
import { YourType } from '@safemind/shared';
```

## API Endpoints

### Health Checks

**Server Health:**
```
GET /health
Response: { status, timestamp, uptime, environment }
```

**Analysis Services Health:**
```
GET /api/analyze/health
Response: { status, services: { perspective, openai } }
```

### Analysis Endpoints

**Analyze Single Message:**
```
POST /api/analyze/message
Body: { text: string }
Response: {
  success: boolean,
  analysis: AnalysisResult
}
```

**Analyze Conversation:**
```
POST /api/analyze/conversation
Body: { messages: string[] }
Response: {
  success: boolean,
  analysis: ConversationAnalysis
}
```

## Environment Variables

### Backend (apps/api/.env)
```bash
# Required
PORT=3001
PERSPECTIVE_API_KEY=xxx
OPENAI_API_KEY=xxx

# Optional
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ENABLE_LOGGING=true
LOG_LEVEL=info
```

### Frontend (apps/web/.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=SafeMind
NEXT_PUBLIC_ENVIRONMENT=development
```

## Code Patterns and Conventions

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` types
- Use type imports: `import type { Type } from '...'`

### React Components
- Use functional components with hooks
- Props interfaces above component definition
- Use TypeScript for all props
- Export as default

### API Routes
- Validate inputs with Zod schemas
- Use try-catch for error handling
- Return consistent response format:
  ```typescript
  { success: boolean, data?: any, error?: string }
  ```

### Error Handling
- Backend: Centralized error handler middleware
- Frontend: Try-catch with user-friendly messages
- Log errors appropriately (console.error in dev)

### Naming Conventions
- **Files**: kebab-case (`content-analyzer.ts`)
- **Components**: PascalCase (`RiskLevelBadge.tsx`)
- **Functions**: camelCase (`analyzeMessage`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_MESSAGE_LENGTH`)
- **Interfaces**: PascalCase (`AnalysisResult`)

## Testing Strategy

### Unit Tests (To Be Implemented)
- Test individual services (content-analyzer, integrations)
- Test utility functions
- Test React components

### Integration Tests (To Be Implemented)
- Test API endpoints
- Test full analysis pipeline
- Test frontend-backend integration

### E2E Tests (To Be Implemented)
- Test complete user workflows
- Test dashboard functionality
- Test error scenarios

## Security Considerations

### Current Implementation
- ✅ Rate limiting (configurable)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ Environment variable protection
- ✅ No API keys in code

### Future Enhancements
- [ ] Authentication (JWT)
- [ ] Authorization (RBAC)
- [ ] Data encryption at rest
- [ ] Audit logging
- [ ] CSRF protection
- [ ] SQL injection prevention (when DB added)

## Privacy and Compliance

### COPPA Compliance Considerations
- Parental consent required for users under 13
- Minimal data collection
- Transparent monitoring disclosure
- Data retention policies needed

### Data Handling
- **Current**: In-memory processing only
- **Future**: Encrypted database storage
- **Required**: Anonymization of user identifiers
- **Important**: Never log full message content in production

## Performance Optimization

### Backend
- Rate limiting prevents abuse
- Async/await for non-blocking operations
- Parallel API calls where possible
- Appropriate timeouts

### Frontend
- React.memo for expensive components (to be added)
- Lazy loading for routes (to be added)
- Debouncing for real-time analysis (to be added)
- Image optimization with Next.js Image

## Common Issues and Solutions

### "Port already in use"
```bash
lsof -i :3001
kill -9 <PID>
```

### "API Key Error"
- Check keys are in `apps/api/.env`
- Verify keys are valid on provider dashboards
- Ensure no trailing spaces in .env file

### "Module not found"
```bash
rm -rf node_modules apps/*/node_modules
npm install
cd apps/api && npm install
cd ../web && npm install
```

### TypeScript Errors
```bash
npm run typecheck
```

### CORS Errors
- Check `CORS_ORIGIN` in backend .env
- Verify frontend is using correct API_URL
- Check browser console for details

## Deployment

### Backend (Railway/Render/Fly.io)
1. Set environment variables in dashboard
2. Connect GitHub repository
3. Configure build command: `cd apps/api && npm install && npm run build`
4. Configure start command: `cd apps/api && npm start`

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set root directory: `apps/web`
3. Framework preset: Next.js
4. Set environment variables
5. Deploy

### Database (Supabase - Future)
1. Create Supabase project
2. Run migrations
3. Configure connection string
4. Enable RLS (Row Level Security)

## Future Enhancements

### Phase 2 Features
- [ ] User authentication system
- [ ] Database persistence (Supabase)
- [ ] Alert notification system (email/SMS)
- [ ] Parent/guardian dashboard
- [ ] Conversation history
- [ ] Pattern analysis over time

### Phase 3 Features
- [ ] Multi-language support
- [ ] Custom ML model training
- [ ] Platform integrations (APIs)
- [ ] Analytics dashboard
- [ ] Export reports

### Phase 4 Features
- [ ] Mobile app (React Native)
- [ ] Advanced pattern recognition
- [ ] Predictive risk modeling
- [ ] Professional network integration

## Resources

### Documentation
- [Perspective API Docs](https://developers.perspectiveapi.com/)
- [OpenAI Moderation Docs](https://platform.openai.com/docs/guides/moderation)
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)

### Crisis Resources
- 988 Suicide & Crisis Lifeline: https://988lifeline.org
- Crisis Text Line: https://www.crisistextline.org
- Trevor Project: https://www.thetrevorproject.org

### Development
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Getting Help

When asking for help with this project, provide:
1. What you're trying to accomplish
2. What you've tried
3. Error messages (full stack trace)
4. Relevant code snippets
5. Environment (Node version, OS, etc.)

## Project Status

**Current Version**: 0.1.0 (MVP)

**Completed:**
- ✅ Full-stack application structure
- ✅ Backend API with Express + TypeScript
- ✅ Frontend dashboard with Next.js
- ✅ Content analysis services
- ✅ API integrations (Perspective, OpenAI)
- ✅ Risk scoring algorithm
- ✅ Basic UI components
- ✅ Development environment setup

**In Progress:**
- 🔄 Testing and refinement
- 🔄 Documentation improvements

**Planned:**
- 📋 Database integration
- 📋 Authentication system
- 📋 Alert notifications
- 📋 Conversation history
- 📋 Analytics dashboard

## Contributing Guidelines

When contributing to SafeMind:

1. **Safety First**: Always prioritize youth safety and privacy
2. **Mental Health Best Practices**: Consult with professionals for detection criteria
3. **COPPA Compliance**: Maintain compliance with children's privacy laws
4. **Testing**: Test all changes thoroughly
5. **Documentation**: Update docs for significant changes
6. **Code Quality**: Follow existing patterns and conventions
7. **Security**: Never commit API keys or sensitive data

## License

[To be determined - specify license here]

---

**Last Updated**: 2025-10-25
**Branch**: claude/scaffold-full-project-011CUULxQNjQAUeCw7o63GXB
**Maintained By**: SafeMind Development Team

**Mission**: Building safer AI spaces for youth, one conversation at a time. 🛡️
