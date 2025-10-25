# SafeMind
**Youth Guardrails for Artificially Intelligent Spaces**

## Overview

SafeMind is a comprehensive safety monitoring application designed to detect harmful language and unsafe conversational patterns in AI interactions involving youth (ages 17 and younger). The system provides real-time analysis of conversations to identify:

- Self-harm and suicidal ideation
- Violence and threats
- Hate speech (racism, sexism, etc.)
- Sexual content
- Mental health concerns
- Bullying and harassment

When concerning patterns are detected, SafeMind alerts parents/guardians and provides access to mental health resources and crisis intervention services.

## Key Features

- **Multi-Layer Detection**: Combines Perspective API, OpenAI Moderation API, and custom ML models
- **Real-Time Monitoring**: Analyzes conversations as they happen
- **Risk Scoring**: Intelligent algorithm assigns risk levels (low/medium/high/critical)
- **Pattern Recognition**: Detects escalation and concerning trends over time
- **Alert System**: Notifies trusted contacts when intervention may be needed
- **Crisis Resources**: Integrates with mental health hotlines and support services
- **Privacy-Focused**: Encryption, anonymization, and COPPA compliance

## Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete setup guide from zero to deployment
- **[TECHNICAL_RECOMMENDATIONS.md](./TECHNICAL_RECOMMENDATIONS.md)** - Detailed stack recommendations, APIs, and architecture
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Recommended project layout and database schema

## Example Code

The `/examples` directory contains working implementations:

- **[perspective-api-example.ts](./examples/perspective-api-example.ts)** - Google Perspective API integration
- **[openai-moderation-example.ts](./examples/openai-moderation-example.ts)** - OpenAI Moderation API integration
- **[combined-content-analyzer.ts](./examples/combined-content-analyzer.ts)** - Multi-API analyzer with risk scoring

## Quick Start

### 1. Get API Keys (Free)

- **Perspective API**: https://developers.perspectiveapi.com/s/
- **OpenAI API**: https://platform.openai.com/signup

### 2. Clone and Setup

```bash
git clone <repository-url>
cd safemind-draft1
cp .env.example .env
# Edit .env with your API keys
```

### 3. Choose Your Stack

**Option A: Node.js/TypeScript** (Recommended for beginners)
```bash
npm install -g pnpm
pnpm install
```

**Option B: Python/FastAPI** (Best for ML/data science)
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Read the Guide

Follow the complete setup instructions in **[GETTING_STARTED.md](./GETTING_STARTED.md)**

## Technology Stack (Recommended)

### Free Tools & APIs

| Component | Tool | Free Tier |
|-----------|------|-----------|
| Content Detection | Perspective API | 1 req/sec unlimited |
| Moderation | OpenAI Moderation API | Free with API key |
| ML Models | HuggingFace | Limited free tier |
| Frontend | Next.js on Vercel | Generous free tier |
| Backend | Node.js/Express on Railway | $5/month credit |
| Database | Supabase PostgreSQL | 500MB free |
| Email | SendGrid | 100/day free |
| SMS | Twilio | Trial credits |

### Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Supabase)
- **APIs**: Perspective, OpenAI, HuggingFace
- **Deployment**: Vercel (frontend), Railway (backend)

## Crisis Resources

The `/config` directory contains:

- **[crisis-resources.json](./config/crisis-resources.json)** - Comprehensive list of crisis hotlines, mental health resources, and emergency protocols

### Immediate Help

- **988 Suicide & Crisis Lifeline**: 988 or https://988lifeline.org
- **Crisis Text Line**: Text HOME to 741741
- **Trevor Project (LGBTQ+ Youth)**: 1-866-488-7386

## Safety & Privacy

- **COPPA Compliant**: Designed for parental consent and youth protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Anonymization**: User identifiers hashed for privacy
- **Transparency**: Clear disclosure of monitoring to users
- **Professional Standards**: Follows mental health best practices

## Development Roadmap

### Phase 1: MVP (2-4 weeks)
- ✅ API integrations
- ✅ Risk scoring algorithm
- Alert notifications
- Basic dashboard

### Phase 2: Enhanced Detection (4-6 weeks)
- Pattern analysis
- Sentiment tracking
- Custom ML models
- Mental health keyword expansion

### Phase 3: User Experience (4-6 weeks)
- Parent dashboard
- Resource library
- Analytics
- Reporting system

### Phase 4: Advanced Features (6-8 weeks)
- Multi-language support
- Platform integrations
- Predictive modeling
- Custom model training

## Contributing

This is a safety-focused project. Contributions should:

1. Prioritize youth safety and privacy
2. Follow mental health best practices
3. Maintain COPPA compliance
4. Include proper testing
5. Document all changes

## Legal & Ethical Considerations

- Consult with mental health professionals for detection criteria
- Work with legal counsel on privacy compliance
- Partner with youth organizations for testing
- Maintain transparency with users and families
- Follow crisis intervention protocols
- Regular audits of detection accuracy

## License

[Specify license here]

## Disclaimer

SafeMind is a monitoring and alert system, not a replacement for professional mental health services. Always consult qualified mental health professionals for assessment and treatment. In case of emergency, contact 911 or your local emergency services.

## Resources

- **Perspective API**: https://perspectiveapi.com
- **OpenAI Moderation**: https://platform.openai.com/docs/guides/moderation
- **HuggingFace**: https://huggingface.co
- **Supabase**: https://supabase.com
- **COPPA Guidelines**: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa

## Contact

For questions about implementation, safety protocols, or partnerships, please [create an issue](https://github.com/your-repo/issues) or contact the development team.

---

**Building safer AI spaces for youth, one conversation at a time.**
