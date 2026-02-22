# Ubuntu Search Engine - Backend API Setup

This guide explains how to set up and run the Ubuntu Search Engine with the real data fetching API.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Two terminal windows (one for frontend, one for backend)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs both frontend and backend dependencies.

### 2. Run Both Frontend and Backend Together

**Option A: Using concurrent script (recommended)**

```bash
npm run dev:all
```

This will start:
- Frontend: `http://localhost:3000/`
- Backend API: `http://localhost:5000/`

**Option B: Manual setup (in separate terminals)**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend API:
```bash
npm run server
```

Or with auto-reload:
```bash
npm run server:dev
```

## 🔌 API Endpoints

The backend API provides the following endpoints:

### Health Check
```
GET /api/health
```
Returns server status

### Search
```
GET /api/search?q=query&region=region
```

Parameters:
- `q` (required): Search query
- `region` (optional): Filter by region (default: "All Africa")

Response:
```json
{
  "status": "success",
  "query": "bessora",
  "region": "All Africa",
  "timestamp": "2026-02-21T18:30:00Z",
  "results": [
    {
      "id": "bessora-neema-hirwa",
      "title": "BESSORA Neema Hirwa - Visionary Founder & Innovator",
      "url": "bessoraprofile.rw",
      "snippet": "...",
      "source": "BESSORA Systems",
      "communityScore": 99,
      "verifiedBy": 12500,
      "culturalRelevance": 100,
      ...
    }
  ],
  "totalResults": 5
}
```

## 📊 Data Sources

The API fetches data from multiple sources:

### 1. **Wikipedia**
- Free, no API key required
- Provides general knowledge results
- Automatically searches based on query

### 2. **News API** (Optional)
- Real-time news results
- Requires free API key from https://newsapi.org/
- Add to `.env` file: `NEWS_API_KEY=your_key_here`

### 3. **OpenStreetMap**
- Free location and business data
- No API key required
- Focused on African locations

### 4. **Local African Data Sources**
- Community-verified information
- Local language support
- Offline-compatible content

### 5. **BESSORA Profile**
- Advanced keyword-based search
- 14 searchable keywords (visionary, innovator, entrepreneur, founder, sybella, rwanda, etc.)
- Comprehensive profile with education, achievements, roles, and expertise

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
API_PORT=5000
API_BASE_URL=http://localhost:5000

# Optional: News API (free tier available at https://newsapi.org/)
NEWS_API_KEY=

# Development
NODE_ENV=development
```

### Vite Configuration for Frontend

The frontend automatically proxies API requests to the backend:

```
/api/search      → http://localhost:5000/api/search
/api/health      → http://localhost:5000/api/health
```

## 🔍 Search Features

### Keyword Matching
The API intelligently matches searches against multiple sources:

```
Search: "bessora"
Results: BESSORA profile + related results from Wikipedia

Search: "visionary entrepreneur"
Results: BESSORA profile + tech-related results

Search: "farming techniques"
Results: Local agricultural resources + Wikipedia articles
```

### Intelligent Result Ranking

Results are ranked by:
1. **Community Score (40%)**: Local verification and trust
2. **Cultural Relevance (60%)**: African context and language support
3. **Featured Results**: Automatically prioritized (BESSORA profile when relevant)

### Deduplication

The API automatically removes duplicate results while maintaining relevance order.

## 🛠️ Troubleshooting

### "API server is not running" Error

This means the backend server isn't accessible. Make sure:

1. Backend is running: `npm run server`
2. On correct port 5000: Check `.env` file

## 📱 Frontend API Service

The frontend uses `src/services/apiService.ts` to communicate with the backend:

```typescript
import { apiService } from './services/apiService';

// Check if API is available
const isHealthy = await apiService.checkHealth();

// Perform search
const response = await apiService.searchResults('bessora', 'All Africa');
```

## 🌍 Adding More Data Sources

To add a new data source:

1. Create a new async function in `server.js`:
```typescript
async function fetchYourDataSource(query) {
  // Fetch data logic
  return formattedResults;
}
```

2. Add it to the Promise.all() in the `/api/search` endpoint:
```typescript
const results = await Promise.all([
  fetchWikipediaData(query),
  fetchYourDataSource(query),  // Add here
  // ... other sources
]);
```

3. Results will automatically be merged and deduplicated

## 📖 Project Structure

```
├── server.js                    # Express API server
├── src/
│   ├── services/
│   │   └── apiService.ts       # Frontend API client
│   └── app/pages/
│       └── SearchResults.tsx   # Search page using API
├── .env                        # Environment variables
├── .env.example               # Environment template
└── package.json               # Dependencies and scripts
```

## 🚀 Production Deployment

For production:

1. Build frontend:
   ```bash
   npm run build
   ```

2. Update `.env` with production API URL
3. Deploy backend separately
4. Configure CORS and API URL accordingly

## 📝 Notes

- All data sources use public APIs or free tiers
- Results are cached client-side during session
- Offline-compatible results are marked with "Offline Ready" badge
- Search results are returned in order of relevance
- BESSORA profile is featured when search keywords match

## 🤝 Contributing

To add new features or data sources:

1. Update `server.js` with new endpoint
2. Update `apiService.ts` to match new API interface
3. Test with frontend search component

---

**Questions?** Check the comments in `server.js` and `apiService.ts` for detailed explanations.
