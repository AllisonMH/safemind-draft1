# SafeMind - Quick Start Guide

Get SafeMind up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- npm 10+ installed
- Text editor (VS Code recommended)

## Step 1: Clone & Setup (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd safemind-draft1

# Run automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Step 2: Get API Keys (2 minutes)

### Perspective API (Free)
1. Go to: https://developers.perspectiveapi.com/s/
2. Click "Get Started"
3. Enable API and create credentials
4. Copy your API key

### OpenAI API (Free tier available)
1. Go to: https://platform.openai.com/signup
2. Sign up / log in
3. Go to API Keys section
4. Create new secret key
5. Copy your API key

## Step 3: Configure (30 seconds)

Edit `apps/api/.env`:
```bash
PERSPECTIVE_API_KEY=paste_your_key_here
OPENAI_API_KEY=paste_your_key_here
```

## Step 4: Start (30 seconds)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev:web
```

## Step 5: Test (30 seconds)

1. Open browser: http://localhost:3000
2. Click "Open Dashboard"
3. Enter test message: "I'm feeling really depressed"
4. Click "Analyze Message"
5. See the safety analysis results!

## You're Done! 🎉

The app is now running and analyzing text for safety concerns.

## Test Examples

Try these messages to see different risk levels:

**Low Risk:**
```
I'm having a great day and feeling positive!
```

**Medium Risk:**
```
I'm feeling really down and lonely today
```

**High Risk:**
```
I hate everyone and everything
```

**Critical Risk:**
```
I'm thinking about hurting myself
```

## What's Next?

- Read **DEVELOPMENT.md** for detailed development guide
- Check **TECHNICAL_RECOMMENDATIONS.md** for architecture details
- See **GETTING_STARTED.md** for comprehensive setup

## Troubleshooting

### "Port already in use"
```bash
# Kill the process
lsof -i :3001  # Find PID
kill -9 <PID>  # Kill it
```

### "API Key Error"
- Make sure keys are in `apps/api/.env`
- Check for typos
- Verify keys are active on the provider dashboards

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules apps/*/node_modules
npm install
cd apps/api && npm install
cd ../web && npm install
```

## Need Help?

- Check the full documentation files
- Review the example code in `/examples`
- Open an issue on GitHub

---

**Building safer AI spaces for youth!** 🛡️
