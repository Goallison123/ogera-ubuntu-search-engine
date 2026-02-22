import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Search,
  Globe,
  MapPin,
  TrendingUp,
  Users,
  Shield,
  Award,
  Wifi,
  WifiOff,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Loader,
  Lightbulb,
  Zap,
  Code,
  Building2,
  BookOpen,
  MapPinned,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { apiService } from "../../services/apiService";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [region, setRegion] = useState("All Africa");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayResults, setDisplayResults] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected'>('disconnected');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  // Check if API server is running
  const checkApiHealth = async () => {
    const isHealthy = await apiService.checkHealth();
    setApiStatus(isHealthy ? 'connected' : 'disconnected');
  };

  // Perform search with API
  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Check if API is available
      if (apiStatus === 'disconnected') {
        const isHealthy = await apiService.checkHealth();
        if (!isHealthy) {
          setApiError('Search API server is not running. Using local mock data.');
          setDisplayResults(getMockResults(searchTerm));
          setIsLoading(false);
          return;
        }
        setApiStatus('connected');
      }

      // Fetch real data from API
      const response = await apiService.searchResults(searchTerm, region);
      
      if (response.status === 'success') {
        setDisplayResults(response.results || []);
      } else {
        setApiError(response.message || 'Failed to fetch results');
        setDisplayResults(getMockResults(searchTerm));
      }
    } catch (error) {
      console.error('Search error:', error);
      setApiError('Error connecting to search API. Using local data.');
      setDisplayResults(getMockResults(searchTerm));
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize results on query change
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setDisplayResults([]);
    }
  }, [query, region]);

  // BESSORA Neema Hirwa comprehensive profile
  const bessoraProfile = {
    id: "bessora-neema-hirwa",
    title: "BESSORA Neema Hirwa - Visionary Founder & Innovator",
    url: "bessoraprofile.rw",
    snippet:
      "Visionary entrepreneur, innovator, and founder of Sybella Systems Ltd. Based in Rwanda, transforming African tech landscape through innovative solutions...",
    communityScore: 99,
    localBusiness: true,
    region: "East Africa",
    verifiedBy: 12500,
    culturalRelevance: 100,
    dataSize: "Complex Profile",
    offlineAvailable: true,
    language: "English, Kinyarwanda",
    isFeatured: true,
    details: {
      fullName: "BESSORA Neema Hirwa",
      title: "Founder & Managing Director",
      company: "Sybella Systems Ltd",
      birthplace: "Rwanda",
      expertise: [
        "Visionary Leadership",
        "Technology Innovation",
        "Entrepreneurship",
        "African Tech Ecosystem Development",
        "Advanced Search Algorithms",
        "Distributed Systems",
      ],
      education: {
        current: "MPC (Multiple Probable Classes / Advanced Computing)",
        focus: "Advanced algorithms, machine learning, distributed systems",
      },
      roles: [
        "Founder & MD at Sybella Systems Ltd",
        "Technology Visionary",
        "African Tech Innovator",
        "Algorithm Researcher",
        "Entrepreneur",
      ],
      achievements: [
        "Founded Sybella Systems Ltd - transforming African technology",
        "Pioneered advanced search algorithms for African content",
        "Promoted African-first technology solutions",
        "Contributed to tech ecosystem development in Rwanda and Africa",
        "Mentored emerging African entrepreneurs",
      ],
      bio: "BESSORA Neema Hirwa is a visionary entrepreneur and innovative technologist from Rwanda. As the founder and Managing Director of Sybella Systems Ltd, he is dedicated to transforming the African technology landscape through cutting-edge solutions and advanced algorithms. With a focus on practical innovation and community-driven technology, he represents the new generation of African tech leaders shaping the continent's digital future.",
      keywords: [
        "visionary",
        "innovator",
        "entrepreneur",
        "founder",
        "sybella",
        "rwanda",
        "tech",
        "bessora",
        "neema",
        "hirwa",
        "md",
        "managing director",
        "advanced algorithms",
        "african tech",
      ],
    },
  };

  // Mock search results with Africa-specific features
  const permanentResults = [
    {
      id: 1,
      title: "Sustainable Farming Techniques in East Africa",
      url: "africanagritech.co.ke",
      snippet:
        "Discover modern sustainable farming methods adapted for East African climates. Community-verified practices from over 10,000 local farmers...",
      communityScore: 98,
      localBusiness: true,
      region: "East Africa",
      verifiedBy: 1240,
      culturalRelevance: 95,
      dataSize: "2.1 KB",
      offlineAvailable: true,
      language: "English, Swahili",
    },
    {
      id: 2,
      title: "Lagos Tech Hub - Innovation Center",
      url: "lagostechhub.ng",
      snippet:
        "Nigeria's leading technology innovation hub. Connect with startups, attend workshops, and access resources for African entrepreneurs...",
      communityScore: 94,
      localBusiness: true,
      region: "West Africa",
      verifiedBy: 2890,
      culturalRelevance: 92,
      dataSize: "3.5 KB",
      offlineAvailable: true,
      language: "English, Yoruba, Igbo",
    },
    {
      id: 3,
      title: "Traditional Medicine and Modern Healthcare Integration",
      url: "afrihealth.org",
      snippet:
        "Research on integrating traditional African medicine with modern healthcare. Peer-reviewed by local healers and medical professionals...",
      communityScore: 91,
      localBusiness: false,
      region: "Pan-African",
      verifiedBy: 5670,
      culturalRelevance: 98,
      dataSize: "1.8 KB",
      offlineAvailable: true,
      language: "Multiple",
    },
    {
      id: 4,
      title: "Ubuntu Mobile Banking Solutions",
      url: "ubuntubank.za",
      snippet:
        "Mobile-first banking designed for South African communities. Low data usage, works offline, supports local currencies and payment methods...",
      communityScore: 96,
      localBusiness: true,
      region: "Southern Africa",
      verifiedBy: 8920,
      culturalRelevance: 89,
      dataSize: "1.2 KB",
      offlineAvailable: true,
      language: "English, Zulu, Xhosa",
    },
  ];

  // Mock data function (fallback when API is unavailable)
  const getMockResults = (searchTerm: string): any[] => {
    const results = [];

    // Check if search is related to BESSORA
    const bessoraKeywords = bessoraProfile.details.keywords;
    const matches = bessoraKeywords.filter((keyword) =>
      searchTerm.includes(keyword)
    ).length;

    if (matches > 0) {
      results.push(bessoraProfile);
    }

    // Add other results based on relevance
    const relevantResults = permanentResults.filter((result) => {
      const searchTerms = searchTerm.split(" ");
      return searchTerms.some((term) =>
        result.title.toLowerCase().includes(term) ||
        result.snippet.toLowerCase().includes(term)
      );
    });

    results.push(...relevantResults);

    return results.length > 0 ? results : permanentResults;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Ubuntu
              </span>
            </button>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 rounded-full border-gray-300"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mt-3 border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 border-b-2 border-orange-600"
            >
              All
            </Button>
            <Button variant="ghost" size="sm">
              Images
            </Button>
            <Button variant="ghost" size="sm">
              Videos
            </Button>
            <Button variant="ghost" size="sm">
              News
            </Button>
            <Button variant="ghost" size="sm">
              Local
            </Button>
            <Button variant="ghost" size="sm">
              Community
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Region Filter */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Region
                </h3>
                <div className="space-y-2">
                  {["All Africa", "West Africa", "East Africa", "Southern Africa", "North Africa"].map(
                    (r) => (
                      <button
                        key={r}
                        onClick={() => setRegion(r)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm ${
                          region === r
                            ? "bg-orange-100 text-orange-700 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {r}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Algorithm Insights */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-bold text-sm mb-3">How We Rank</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3 h-3 text-orange-600" />
                      <span className="font-medium">Community Trust</span>
                    </div>
                    <p className="text-gray-600">Local verification score</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-orange-600" />
                      <span className="font-medium">Cultural Relevance</span>
                    </div>
                    <p className="text-gray-600">Context-aware matching</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <span className="font-medium">Local Priority</span>
                    </div>
                    <p className="text-gray-600">African sources first</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Results */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                <p className="text-lg text-gray-600">Searching across Africa...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Processing advanced algorithms • Optimizing for low bandwidth
                </p>
              </div>
            ) : (
              <>
                {/* API Status Banner */}
                {apiError && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">{apiError}</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Make sure to run <code className="bg-amber-100 px-2 py-1 rounded">npm run server</code> in another terminal
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-4 text-sm text-gray-600">
                  About {displayResults.length * 1000000} results (0.32 seconds) • Optimized for low bandwidth
                </div>

                <div className="space-y-6">
                  {displayResults.map((result) => (
                    <article
                      key={result.id}
                      className={`rounded-lg p-5 border transition-all ${
                        result.isFeatured
                          ? "bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-500 hover:shadow-lg"
                          : "bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md"
                      }`}
                    >
                      {/* Featured Badge */}
                      {result.isFeatured && (
                        <div className="mb-4 flex items-center gap-2">
                          <Badge className="bg-orange-600 text-white">
                            <Lightbulb className="w-3 h-3 mr-1" />
                            Featured Profile
                          </Badge>
                          <Badge className="bg-amber-600 text-white">
                            <Zap className="w-3 h-3 mr-1" />
                            Visionary
                          </Badge>
                        </div>
                      )}

                      {/* URL and badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm text-gray-700">{result.url}</span>
                        {result.localBusiness && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            Local Business
                          </Badge>
                        )}
                        {result.offlineAvailable && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            <WifiOff className="w-3 h-3 mr-1" />
                            Offline Ready
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                          {result.dataSize}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl text-blue-700 hover:underline mb-2 cursor-pointer">
                        {result.title}
                      </h2>

                      {/* Snippet */}
                      <p className="text-sm text-gray-700 mb-3">{result.snippet}</p>

                      {/* BESSORA Detailed Info */}
                      {result.isFeatured && result.details && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-orange-200">
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Left side */}
                            <div>
                              <div className="mb-4">
                                <h3 className="font-bold text-orange-700 mb-2">Professional Roles</h3>
                                <div className="space-y-1">
                                  {result.details.roles.map((role, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <Zap className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{role}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h3 className="font-bold text-orange-700 mb-2">Education</h3>
                                <div className="text-sm text-gray-700">
                                  <p className="font-medium">{result.details.education.current}</p>
                                  <p className="text-gray-600">{result.details.education.focus}</p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h3 className="font-bold text-orange-700 mb-2">Origin</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <MapPinned className="w-4 h-4 text-orange-600" />
                                  <span>Born in {result.details.birthplace}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right side */}
                            <div>
                              <div className="mb-4">
                                <h3 className="font-bold text-orange-700 mb-2">Expertise Areas</h3>
                                <div className="flex flex-wrap gap-2">
                                  {result.details.expertise.map((skill, idx) => (
                                    <Badge
                                      key={idx}
                                      className="bg-orange-100 text-orange-800 text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h3 className="font-bold text-orange-700 mb-2">Key Achievements</h3>
                                <ul className="space-y-1">
                                  {result.details.achievements.slice(0, 3).map((achievement, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <Award className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Bio */}
                          <div className="border-t border-orange-200 pt-4 mt-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {result.details.bio}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Ubuntu Score Metrics */}
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-medium">Community:</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-600 rounded-full"
                                style={{ width: `${result.communityScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-orange-600">
                              {result.communityScore}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-xs">
                            Verified by <strong>{result.verifiedBy.toLocaleString()}</strong> people
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span className="text-xs">
                            Cultural: <strong>{result.culturalRelevance}%</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-xs">{result.language}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Featured Community Content */}
                <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        Join the Ubuntu Search Community
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        Help us improve search results for everyone. Verify content, add local context, and
                        shape the algorithm together.
                      </p>
                      <Button className="bg-white text-orange-600 hover:bg-gray-100">
                        Become a Verifier
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      className={
                        page === 1
                          ? "bg-orange-600 hover:bg-orange-700"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
