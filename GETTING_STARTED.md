# Getting Started with SafeMind

This guide will walk you through setting up SafeMind from scratch.

## Prerequisites

Before you begin, ensure you have:
- Node.js 20+ or Python 3.10+ installed
- Git
- A code editor (VS Code recommended)
- Basic knowledge of JavaScript/TypeScript or Python

## Step 1: API Keys Setup

### Required APIs (Free Tiers)

#### 1. Perspective API (Google)
**Purpose**: Toxicity and harmful content detection

1. Visit: https://developers.perspectiveapi.com/s/
2. Click "Get Started" and sign in with Google
3. Enable the Perspective Comment Analyzer API
4. Create API credentials
5. Copy your API key

**Free Tier**: 1 request per second (unlimited requests)

#### 2. OpenAI API
**Purpose**: Comprehensive content moderation

1. Visit: https://platform.openai.com/signup
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy your API key (you won't see it again!)

**Free Tier**: $5 credit for new users (Moderation API is free to use)

#### 3. HuggingFace (Optional)
**Purpose**: Additional ML models

1. Visit: https://huggingface.co/join
2. Sign up
3. Go to Settings → Access Tokens
4. Create new token with "read" access
5. Copy your token

**Free Tier**: Limited inference API calls

## Step 2: Choose Your Tech Stack

### Option A: Node.js + TypeScript (Recommended for beginners)

**Advantages**:
- Single language for frontend and backend
- Large ecosystem
- Easy deployment

**Best for**: Full-stack developers, teams wanting unified codebase

### Option B: Python + FastAPI

**Advantages**:
- Superior ML/NLP libraries
- Better for custom model training
- Excellent data processing

**Best for**: Data scientists, ML engineers, Python experts

## Step 3: Initialize Your Project

### Option A: Node.js Setup

```bash
# Create project directory
mkdir safemind-app
cd safemind-app

# Initialize package manager
npm init -y

# Install pnpm (faster alternative to npm)
npm install -g pnpm

# Create workspace structure
mkdir -p apps/web apps/api packages/shared

# Initialize Next.js frontend
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir

# Initialize Express backend
cd ../api
pnpm init
pnpm add express cors helmet dotenv zod
pnpm add -D typescript @types/node @types/express tsx

# Return to root
cd ../..
```

### Option B: Python Setup

```bash
# Create project directory
mkdir safemind-app
cd safemind-app

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Create project structure
mkdir -p api/src api/tests frontend

# Initialize backend
cd api
pip install fastapi uvicorn python-dotenv pydantic
pip install openai google-cloud-aiplatform transformers
pip freeze > requirements.txt

# Initialize frontend (using React with Vite)
cd ../frontend
npm create vite@latest . -- --template react-ts
npm install
```

## Step 4: Environment Configuration

Create `.env` file in your API directory:

```bash
# API Server
PORT=3001
NODE_ENV=development

# API Keys
PERSPECTIVE_API_KEY=your_perspective_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_hf_key_here  # Optional

# Database (Supabase)
DATABASE_URL=your_supabase_postgres_url
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Notifications (setup later)
SENDGRID_API_KEY=your_sendgrid_key  # For email
TWILIO_ACCOUNT_SID=your_twilio_sid  # For SMS
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Security
JWT_SECRET=generate_a_random_secret_here
ENCRYPTION_KEY=generate_32_byte_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Add `.env` to your `.gitignore` file!

## Step 5: Database Setup with Supabase

1. **Create Supabase Account**
   - Visit: https://supabase.com
   - Sign up (free tier: 500MB database, 50K monthly active users)
   - Create new project

2. **Configure Database**
   - Go to SQL Editor in Supabase dashboard
   - Run the schema from `PROJECT_STRUCTURE.md`
   - Enable Row Level Security (RLS)

3. **Get Connection Details**
   - Go to Project Settings → Database
   - Copy connection string
   - Add to `.env` as `DATABASE_URL`

## Step 6: Build Your First Endpoint

### Node.js/TypeScript Example

Create `apps/api/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Import your analyzer
    const { CombinedContentAnalyzer } = await import('./services/analyzer');
    const analyzer = new CombinedContentAnalyzer(
      process.env.PERSPECTIVE_API_KEY!,
      process.env.OPENAI_API_KEY!
    );

    const result = await analyzer.analyzeMessage(text);

    res.json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed'
    });
  }
});

app.listen(PORT, () => {
  console.log(`SafeMind API running on port ${PORT}`);
});
```

Run it:
```bash
npx tsx src/index.ts
```

### Python/FastAPI Example

Create `api/src/main.py`:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="SafeMind API")

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    success: bool
    analysis: dict

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now()}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")

    try:
        # Import your analyzer
        from services.analyzer import CombinedContentAnalyzer

        analyzer = CombinedContentAnalyzer(
            perspective_api_key=os.getenv("PERSPECTIVE_API_KEY"),
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

        result = await analyzer.analyze_message(request.text)

        return {
            "success": True,
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
```

Run it:
```bash
python src/main.py
```

## Step 7: Test Your Setup

### Using cURL
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling really down today"}'
```

### Using Postman
1. Create new POST request
2. URL: `http://localhost:3001/api/analyze`
3. Body (JSON):
   ```json
   {
     "text": "I am feeling really down today"
   }
   ```
4. Send request

### Expected Response
```json
{
  "success": true,
  "analysis": {
    "riskScore": 35.2,
    "riskLevel": "medium",
    "flags": {
      "toxicity": false,
      "selfHarm": false,
      "mentalHealthConcern": true
    },
    "requiresAlert": false,
    "suggestedActions": [
      "Monitor conversation closely"
    ]
  }
}
```

## Step 8: Build the Frontend

### Create Dashboard Component

Create `apps/web/app/dashboard/page.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">SafeMind Monitor</h1>

      <div className="mb-6">
        <textarea
          className="w-full p-4 border rounded-lg"
          rows={6}
          placeholder="Enter text to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          onClick={analyzeText}
          disabled={loading || !text}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {analysis && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

          <div className="mb-4">
            <span className="font-medium">Risk Level: </span>
            <span className={`
              px-3 py-1 rounded
              ${analysis.riskLevel === 'critical' ? 'bg-red-500 text-white' : ''}
              ${analysis.riskLevel === 'high' ? 'bg-orange-500 text-white' : ''}
              ${analysis.riskLevel === 'medium' ? 'bg-yellow-500 text-white' : ''}
              ${analysis.riskLevel === 'low' ? 'bg-green-500 text-white' : ''}
            `}>
              {analysis.riskLevel.toUpperCase()}
            </span>
          </div>

          <div className="mb-4">
            <span className="font-medium">Risk Score: </span>
            <span>{analysis.riskScore.toFixed(1)}/100</span>
          </div>

          {analysis.requiresAlert && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Alert Required!</strong>
              <ul className="mt-2 list-disc list-inside">
                {analysis.suggestedActions.map((action: string, i: number) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

Run the frontend:
```bash
cd apps/web
pnpm dev
```

Visit: http://localhost:3000/dashboard

## Step 9: Next Steps

### Immediate (Week 1-2)
- [ ] Complete API integration testing
- [ ] Add error handling and logging
- [ ] Implement rate limiting
- [ ] Set up database tables
- [ ] Create user authentication

### Short-term (Week 3-4)
- [ ] Build alert notification system
- [ ] Create parent/guardian dashboard
- [ ] Add conversation history tracking
- [ ] Implement pattern detection
- [ ] Set up crisis resource library

### Medium-term (Month 2)
- [ ] Add multi-language support
- [ ] Improve ML models with custom training
- [ ] Build reporting system
- [ ] Add analytics dashboard
- [ ] Implement privacy controls

### Long-term (Month 3+)
- [ ] Platform integrations (APIs)
- [ ] Mobile app development
- [ ] Advanced pattern recognition
- [ ] Predictive risk modeling
- [ ] Community resource network

## Troubleshooting

### API Key Issues
```bash
# Test Perspective API
curl "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"comment": {"text": "test"}, "requestedAttributes": {"TOXICITY": {}}}'

# Test OpenAI API
curl https://api.openai.com/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"input": "test"}'
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database Connection Issues
- Check Supabase project is active
- Verify connection string in `.env`
- Check firewall/network settings
- Ensure database has been initialized with schema

## Resources

### Documentation
- [Perspective API Docs](https://developers.perspectiveapi.com/s/)
- [OpenAI Moderation Docs](https://platform.openai.com/docs/guides/moderation)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Learning
- [Node.js Tutorial](https://nodejs.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Tutorial](https://react.dev/learn)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

### Mental Health Resources
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review API documentation
3. Search for similar issues online
4. Consult with mental health professionals for detection criteria
5. Consider legal counsel for privacy/compliance questions

## Important Notes

- **Privacy First**: Always encrypt sensitive data
- **COPPA Compliance**: Obtain parental consent for users under 13
- **Test Thoroughly**: Use test data before deploying with real users
- **Professional Guidance**: Consult mental health experts for keyword lists
- **Legal Review**: Have privacy policy reviewed by legal counsel
- **Gradual Rollout**: Start with a small test group

---

**Ready to make a difference!** You're building an important tool to help keep youth safe in AI spaces.
