import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import dns from 'dns/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup lowdb (simple JSON file DB)
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { users: [] });
await db.read();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Search endpoint that integrates multiple data sources
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const region = req.query.region || 'All Africa';

    // Fetch from multiple sources in parallel
    const results = await Promise.all([
      fetchWikipediaData(query),
      fetchNewsData(query),
      fetchBusinessData(query),
      fetchLocalData(query),
      fetchBessoraProfile(query),
    ]);

    // Merge and deduplicate results
    const mergedResults = mergeResults(results, query);

    res.json({
      status: 'success',
      query,
      region,
      timestamp: new Date().toISOString(),
      results: mergedResults,
      totalResults: mergedResults.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      results: [],
    });
  }
});

// Fetch from Wikipedia API
async function fetchWikipediaData(query) {
  try {
    if (!query || query.length < 2) return [];

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&srlimit=5`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.query || !data.query.search) return [];

    return data.query.search.map((item, idx) => ({
      id: `wiki-${idx}`,
      title: item.title,
      url: `en.wikipedia.org/wiki/${item.title.replace(/ /g, '_')}`,
      snippet: item.snippet.replace(/<[^>]*>/g, ''),
      source: 'Wikipedia',
      communityScore: 85,
      verifiedBy: 5000 + idx * 1000,
      culturalRelevance: 80,
      dataSize: '1.2 KB',
      offlineAvailable: false,
      language: 'English, Multiple',
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Wikipedia fetch error:', error);
    return [];
  }
}

// Fetch news from NewsAPI or similar (requires API key)
async function fetchNewsData(query) {
  try {
    // NewsAPI endpoint (free tier available)
    const newsApiKey = process.env.NEWS_API_KEY || 'demo';
    if (newsApiKey === 'demo') return []; // Skip if no API key

    const searchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&sortBy=publishedAt&language=en&maxResults=5&apiKey=${newsApiKey}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.articles) return [];

    return data.articles.map((article, idx) => ({
      id: `news-${idx}`,
      title: article.title,
      url: article.source.name,
      snippet: article.description || article.content,
      source: article.source.name,
      communityScore: 75 + Math.random() * 20,
      verifiedBy: 2000 + idx * 500,
      culturalRelevance: 70,
      dataSize: '1.5 KB',
      offlineAvailable: false,
      language: 'English',
      timestamp: article.publishedAt,
    }));
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
}

// Fetch business data from local sources
async function fetchBusinessData(query) {
  try {
    // OpenStreetMap Nominatim API for location-based business data
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&countrycodes=rw,ug,ke,tz,et&limit=5`;

    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Ubuntu-Search-Engine' },
    });
    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map((item, idx) => ({
      id: `osm-${idx}`,
      title: item.name || item.display_name,
      url: item.display_name || 'location-data.local',
      snippet: `Location in ${item.address?.country_code}. Coordinates: ${item.lat}, ${item.lon}`,
      source: 'OpenStreetMap',
      communityScore: 80,
      verifiedBy: 1500 + idx * 500,
      culturalRelevance: 85,
      dataSize: '0.9 KB',
      offlineAvailable: true,
      language: 'Local Languages',
      localBusiness: true,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Business data fetch error:', error);
    return [];
  }
}

// Fetch local African data sources
async function fetchLocalData(query) {
  try {
    // Simulated local African data sources
    const localSources = [
      {
        id: 'local-1',
        title: `Local African Business Directory - ${query}`,
        url: 'africabiz.local',
        snippet: `Find local African businesses and services related to ${query}. Community-verified listings from East and West Africa.`,
        source: 'African Business Hub',
        communityScore: 92,
        verifiedBy: 8900,
        culturalRelevance: 95,
        dataSize: '2.1 KB',
        offlineAvailable: true,
        language: 'Multiple African Languages',
        localBusiness: true,
      },
      {
        id: 'local-2',
        title: `Community Resources for ${query}`,
        url: 'ubuntu-community.local',
        snippet: `Ubuntu community initiatives and local resources. Verified by African community members for ${query}.`,
        source: 'Ubuntu Africa Community',
        communityScore: 89,
        verifiedBy: 5600,
        culturalRelevance: 98,
        dataSize: '1.8 KB',
        offlineAvailable: true,
        language: 'Swahili, Kinyarwanda, Amharic, Yoruba',
        localBusiness: false,
      },
    ];

    return localSources.filter((source) =>
      query.toLowerCase().split(' ').some((term) =>
        source.title.toLowerCase().includes(term) ||
        source.snippet.toLowerCase().includes(term)
      )
    );
  } catch (error) {
    console.error('Local data fetch error:', error);
    return [];
  }
}

// BESSORA Neema Hirwa profile (advanced search support)
async function fetchBessoraProfile(query) {
  const bessoraKeywords = [
    'visionary',
    'innovator',
    'entrepreneur',
    'founder',
    'sybella',
    'rwanda',
    'tech',
    'bessora',
    'neema',
    'hirwa',
    'md',
    'managing director',
    'advanced algorithms',
    'african tech',
  ];

  const normalizedQuery = query.toLowerCase();
  const matches = bessoraKeywords.filter((keyword) =>
    normalizedQuery.includes(keyword)
  ).length;

  if (matches === 0) return [];

  return [
    {
      id: 'bessora-neema-hirwa',
      title: 'BESSORA Neema Hirwa - Visionary Founder & Innovator',
      url: 'bessoraprofile.rw',
      snippet:
        'Visionary entrepreneur, innovator, and founder of Sybella Systems Ltd. Based in Rwanda, transforming African tech landscape through innovative solutions and advanced algorithms.',
      source: 'BESSORA Systems',
      communityScore: 99,
      verifiedBy: 12500,
      culturalRelevance: 100,
      dataSize: 'Complex Profile',
      offlineAvailable: true,
      language: 'English, Kinyarwanda',
      isFeatured: true,
      details: {
        fullName: 'BESSORA Neema Hirwa',
        title: 'Founder & Managing Director',
        company: 'Sybella Systems Ltd',
        birthplace: 'Rwanda',
        expertise: [
          'Visionary Leadership',
          'Technology Innovation',
          'Entrepreneurship',
          'African Tech Ecosystem Development',
          'Advanced Search Algorithms',
          'Distributed Systems',
        ],
        education: {
          current: 'MPC (Multiple Probable Classes / Advanced Computing)',
          focus: 'Advanced algorithms, machine learning, distributed systems',
        },
        roles: [
          'Founder & MD at Sybella Systems Ltd',
          'Technology Visionary',
          'African Tech Innovator',
          'Algorithm Researcher',
          'Entrepreneur',
        ],
        achievements: [
          'Founded Sybella Systems Ltd - transforming African technology',
          'Pioneered advanced search algorithms for African content',
          'Promoted African-first technology solutions',
          'Contributed to tech ecosystem development in Rwanda and Africa',
          'Mentored emerging African entrepreneurs',
        ],
        bio: 'BESSORA Neema Hirwa is a visionary entrepreneur and innovative technologist from Rwanda. As the founder and Managing Director of Sybella Systems Ltd, he is dedicated to transforming the African technology landscape through cutting-edge solutions and advanced algorithms.',
      },
      timestamp: new Date().toISOString(),
    },
  ];
}

// Merge and deduplicate results
function mergeResults(resultArrays, query) {
  const allResults = resultArrays.flat();
  const seenUrls = new Set();
  const deduped = [];

  // Prioritize featured results
  const featured = allResults.filter((r) => r.isFeatured);
  featured.forEach((result) => {
    if (!seenUrls.has(result.url)) {
      seenUrls.add(result.url);
      deduped.push(result);
    }
  });

  // Sort by relevance score
  const others = allResults.filter((r) => !r.isFeatured);
  others.sort((a, b) => {
    const aScore = a.communityScore * 0.4 + a.culturalRelevance * 0.6;
    const bScore = b.communityScore * 0.4 + b.culturalRelevance * 0.6;
    return bScore - aScore;
  });

  others.forEach((result) => {
    if (!seenUrls.has(result.url)) {
      seenUrls.add(result.url);
      deduped.push(result);
    }
  });

  return deduped.slice(0, 20); // Return top 20 results
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });

    await db.read();
    const exists = (db.data.users || []).find((u) => u.email === email.toLowerCase());
    if (exists) return res.status(409).json({ status: 'error', message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: makeId(),
      fullName: fullName || '',
      email: email.toLowerCase(),
      passwordHash: hashed,
      createdAt: new Date().toISOString(),
    };
    db.data.users.push(user);
    await db.write();

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ status: 'success', user: { id: user.id, fullName: user.fullName, email: user.email }, token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ status: 'error', message: 'Signup failed' });
  }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });

    await db.read();
    const user = (db.data.users || []).find((u) => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ status: 'success', user: { id: user.id, fullName: user.fullName, email: user.email }, token });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ status: 'error', message: 'Signin failed' });
  }
});

// Auth middleware
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}

// Get current user
app.get('/api/me', authenticate, async (req, res) => {
  await db.read();
  const user = (db.data.users || []).find((u) => u.id === req.user.sub);
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  return res.json({ status: 'success', user: { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt } });
});

// Secure proxy endpoint to fetch external web resources server-side
app.get('/api/proxy', async (req, res) => {
  try {
    const target = req.query.url;
    if (!target || typeof target !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Missing url query parameter' });
    }

    if (!/^https?:\/\//i.test(target)) {
      return res.status(400).json({ status: 'error', message: 'Only http/https URLs are allowed' });
    }

    // Prevent SSRF: resolve hostname and block private IP ranges
    const urlObj = new URL(target);
    const host = urlObj.hostname;
    const records = await dns.lookup(host, { all: true });

    const isPrivateIp = (ip) => {
      if (!ip) return false;
      // IPv4 quick checks
      if (/^127\./.test(ip)) return true;
      if (/^10\./.test(ip)) return true;
      if (/^192\.168\./.test(ip)) return true;
      if (/^169\.254\./.test(ip)) return true;
      if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
      // IPv6 loopback/local
      if (ip === '::1') return true;
      if (/^fc00:|^fe80:|^fd00:/.test(ip)) return true;
      return false;
    };

    for (const r of records) {
      if (isPrivateIp(r.address)) {
        return res.status(403).json({ status: 'error', message: 'Forbidden host (private IP)' });
      }
    }

    // Fetch the external resource
    const upstream = await fetch(target, { method: 'GET' });
    const contentType = upstream.headers.get('content-type') || 'text/plain';
    const body = await upstream.text();

    res.set('content-type', contentType);
    return res.status(200).send(body);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ status: 'error', message: 'Proxy fetch failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ubuntu Search API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - GET /api/health`);
  console.log(`   - GET /api/search?q=query&region=region`);
  console.log(`\n⚙️  Environment:`);
  console.log(`   - API_PORT: ${PORT}`);
  console.log(`   - NEWS_API_KEY: ${process.env.NEWS_API_KEY ? 'Set' : 'Not set (optional)'}`);
});

export default app;
