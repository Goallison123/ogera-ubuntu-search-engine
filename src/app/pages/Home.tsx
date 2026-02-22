import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Globe, Zap, Users, Shield, Languages, LogOut, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../components/ui/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Ubuntu Search
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Languages</Button>
          
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {user.fullName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>
      </header>

      {/* Main Search Area */}
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
              Ubuntu Search
            </h1>
            <p className="text-xl text-gray-600">
              Search differently. Search community-first.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything..."
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-orange-200 focus:border-orange-400 shadow-lg"
              />
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Ubuntu Search
              </Button>
              <Button type="button" variant="outline" size="lg">
                I'm Feeling Lucky
              </Button>
            </div>
          </form>

          {/* Language Quick Select */}
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Search in:</span>
            {["English", "Swahili", "Yoruba", "Zulu", "Amharic", "Hausa", "French", "Arabic"].map(
              (lang) => (
                <Button key={lang} variant="ghost" size="sm" className="h-7 text-xs">
                  {lang}
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Why Ubuntu Search is Different
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Community Trust Score</h3>
            <p className="text-gray-600 text-sm">
              Results ranked by local community verification, not just algorithms. Real people validate
              information relevance.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Africa-First Content</h3>
            <p className="text-gray-600 text-sm">
              Prioritizes African sources, local businesses, and regional content. Your context matters.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Data Efficient</h3>
            <p className="text-gray-600 text-sm">
              Optimized for low bandwidth. Lightweight pages, offline-ready, and respects your data limits.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Languages className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Multilingual by Default</h3>
            <p className="text-gray-600 text-sm">
              Native support for 2000+ African languages and dialects. Search in your mother tongue.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Privacy-First</h3>
            <p className="text-gray-600 text-sm">
              Your searches are private. No tracking, no selling data. Built for the people, not advertisers.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Cultural Relevance</h3>
            <p className="text-gray-600 text-sm">
              Results understand African context, slang, and culture. No more irrelevant Western-centric
              answers.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-orange-200 bg-white/50 backdrop-blur mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-3">About Ubuntu</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">For Developers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    API Access
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Open Source
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Regional Hubs</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-orange-600">
                    West Africa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    East Africa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600">
                    Southern Africa
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-200 mt-8 pt-6 text-center text-sm text-gray-600">
            <p>
              Ubuntu Search © 2026 • "I am because we are" • Built with ❤️ for Africa
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
