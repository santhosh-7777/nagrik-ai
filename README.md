# Nagrik AI — AI-Powered Civic Companion

**Smart Bharat Challenge | PromptWars x Devengers | Build with AI**

Nagrik AI is a GenAI-powered civic platform that helps Indian citizens access government services, report public issues, and receive personalized, multilingual assistance through an intelligent AI companion — making everyday civic interactions faster, smarter, and more inclusive.

## Problem Statement

Build a GenAI-powered civic platform that helps citizens access government services, report public issues, and receive personalized assistance through an intelligent AI companion. The solution must use Generative AI to simplify complex government information, answer citizen queries, recommend relevant public services, assist with document requirements, track complaints, and provide multilingual support — promoting transparency, accessibility, and digital inclusion.

## Live Demo

- Live App: https://nagrik-ai-nu.vercel.app
- GitHub Repo: https://github.com/santhosh-7777/nagrik-ai

## Features

### 1. AI Civic Companion (Chat)
- Conversational assistant powered by Llama 3.3 70B (via Groq)
- Remembers context across the conversation — if a citizen mentions their occupation or location, the AI uses it to personalize every following answer without repeating questions
- Proactively recommends government schemes based on citizen details (e.g. mentioning "farmer" surfaces PM-KISAN; "senior citizen" surfaces pension schemes) — not just reactive Q&A
- Lists exact document requirements for common civic processes
- Quick-suggestion chips for common queries, so the feature is discoverable at a glance
- Multilingual support — detects the citizen's language and responds in the same language (English, Hindi, and other Indian languages)

### 2. Report an Issue (Complaint Filing)
- Citizens submit civic complaints with description and location
- AI automatically categorizes each complaint into critical / medium / not_urgent using Groq's LLM — no manual triage needed
- Stored in Firebase Firestore with a unique trackable ID

### 3. Track Your Complaint
- Citizens can look up any complaint by ID
- View live status, category, description, location, and filing timestamp
- Status updates (Received → In Progress → Resolved) reflect instantly, giving citizens real transparency into where their complaint stands — not a static "submitted and forgotten" system

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS |
| AI / LLM | Groq (Llama 3.3 70B Versatile) |
| Database | Firebase Firestore (via firebase-admin) |
| Hosting | Vercel |
## How This Maps to the Problem Statement

| Requirement | Implementation |
|---|---|
| Access government services | AI chat companion |
| Report public issues | Complaint filing form |
| Personalized assistance | Conversation memory + location/occupation-aware responses |
| Simplify complex information | System-prompt-enforced plain language |
| Answer citizen queries | Groq-powered chat |
| Recommend relevant public services | Proactive scheme recommendations + quick-suggestion chips |
| Assist with document requirements | Explicit document checklists per query |
| Track complaints | Dedicated tracking page with live status |
| Multilingual support | Automatic language detection and matched response |
| Transparency | Live, updatable complaint status |
| Accessibility | ARIA live regions, screen-reader labels on all inputs |
| Digital inclusion | Simple language, no login required, works on any device with a browser |

## Getting Started

Clone and install:
git clone https://github.com/santhosh-7777/nagrik-ai.git
cd nagrik-ai
npm install

Create a `.env.local` file with:
GROQ_API_KEY=your_groq_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"

Run locally:
npm run dev

Visit http://localhost:3000.

## Project Structure
app/
api/
chat/route.js              # Chat endpoint (Groq + conversation history)
complaint/route.js         # Complaint submission + AI categorization
complaint/[id]/route.js    # Fetch + update complaint status
chat/page.js                 # AI companion UI
complaint/page.js            # File a complaint
complaint/track/page.js      # Track complaint status
lib/
firebase.js                  # Firestore admin setup
grok.js                      # Groq LLM logic (chat + categorization)

## Roadmap / Future Improvements

- Voice input for low-literacy users
- Persistent user profiles across sessions
- Admin dashboard for government staff to manage complaint statuses at scale
- Offline-first support for low-connectivity areas
