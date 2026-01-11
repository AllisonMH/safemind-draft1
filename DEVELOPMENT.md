# Development Guide

## Quick Start

### 1. Setup
```bash
# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manual setup
npm install
cd apps/api && npm install
cd ../web && npm install
```

### 2. Configure API Keys

Edit `apps/api/.env`:
```bash
PERSPECTIVE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend API
npm run dev:api

# Terminal 2 - Frontend
npm run dev:web
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## Project Structure

```
safemind/
├── apps/
│   ├── api/                 # Backend Express API
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── index.ts     # Entry point
│   │   └── package.json
│   │
│   └── web/                 # Next.js Frontend
│       ├── app/             # Next.js app directory
│       ├── components/      # React components
│       ├── lib/             # Utilities
│       └── package.json
│
├── packages/
│   └── shared/              # Shared types & constants
│       ├── types/
│       └── constants/
│
├── config/                  # Configuration files
│   └── crisis-resources.json
│
├── examples/                # Example code
├── scripts/                 # Setup scripts
└── docs/                    # Documentation
```

## Available Scripts

### Root Level
- `npm run dev:api` - Start backend API
- `npm run dev:web` - Start frontend
- `npm run build` - Build all workspaces
- `npm run typecheck` - Type check all workspaces
- `npm run format` - Format code with Prettier

### Backend API (`apps/api`)
- `npm run dev` - Start with hot reload
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run typecheck` - Type check

### Frontend (`apps/web`)
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Lint code

## API Endpoints

### Health Check
```bash
GET /health
```

### Analyze Single Message
```bash
POST /api/analyze/message
Content-Type: application/json

{
  "text": "Your message here"
}
```

### Analyze Conversation
```bash
POST /api/analyze/conversation
Content-Type: application/json

{
  "messages": [
    "First message",
    "Second message",
    "Third message"
  ]
}
```

### Check Analysis Services
```bash
GET /api/analyze/health
```

## Testing with cURL

### Single Message
```bash
curl -X POST http://localhost:3001/api/analyze/message \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling really down today"}'
```

### Conversation
```bash
curl -X POST http://localhost:3001/api/analyze/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      "I am having a bad day",
      "Nothing seems to matter anymore",
      "I feel hopeless"
    ]
  }'
```

## Development Workflow

### 1. Making Changes

#### Backend Changes
1. Edit files in `apps/api/src/`
2. Server auto-reloads with `tsx watch`
3. Test with cURL or the frontend

#### Frontend Changes
1. Edit files in `apps/web/`
2. Changes appear immediately (hot reload)
3. Check browser console for errors

### 2. Adding New API Endpoints

1. Create route file: `apps/api/src/routes/your-route.ts`
2. Add to `apps/api/src/index.ts`:
   ```typescript
   import yourRoute from './routes/your-route';
   app.use('/api/your-route', yourRoute);
   ```

### 3. Adding New Components

1. Create in `apps/web/components/YourComponent.tsx`
2. Import and use in pages

### 4. Shared Types

Add shared types to `packages/shared/types/index.ts`:
```typescript
export interface YourType {
  // ...
}
```

Use in both frontend and backend:
```typescript
import { YourType } from '@safemind/shared';
```

## Environment Variables

### Backend (`apps/api/.env`)
```bash
# Required
PORT=3001
PERSPECTIVE_API_KEY=xxx
OPENAI_API_KEY=xxx

# Optional
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=SafeMind
```

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3001  # or :3000

# Kill process
kill -9 <PID>
```

### API Key Errors
- Check keys are in `apps/api/.env`
- Verify keys are valid
- Test keys with provided examples in TECHNICAL_RECOMMENDATIONS.md

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules apps/*/node_modules
npm install
cd apps/api && npm install
cd ../web && npm install
```

### TypeScript Errors
```bash
# Run type checking
npm run typecheck
```

## Code Style

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` types

### React
- Use functional components with hooks
- Prefer TypeScript interfaces over PropTypes
- Use meaningful component names

### API
- RESTful endpoints
- Proper HTTP status codes
- Consistent error responses
- Input validation with Zod

## Git Workflow

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push and create PR:
   ```bash
   git push origin feature/your-feature
   ```

## Performance Tips

### Backend
- Rate limiting is enabled by default
- Keep API responses under 1MB
- Use appropriate HTTP caching headers

### Frontend
- Use React.memo for expensive components
- Lazy load routes with Next.js dynamic imports
- Optimize images with Next.js Image component

## Security Checklist

- [ ] API keys in `.env` (never commit)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS configured properly
- [ ] Helmet.js security headers
- [ ] No sensitive data in logs

## Next Steps

1. **Add Database**
   - Set up Supabase
   - Add Prisma ORM
   - Create migration scripts

2. **Add Authentication**
   - Implement JWT auth
   - Add user registration
   - Role-based access control

3. **Add Testing**
   - Unit tests with Vitest
   - Integration tests
   - E2E tests with Playwright

4. **Deploy**
   - Backend to Railway
   - Frontend to Vercel
   - Set up CI/CD

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Perspective API Docs](https://developers.perspectiveapi.com/)
- [OpenAI Moderation Docs](https://platform.openai.com/docs/guides/moderation)
