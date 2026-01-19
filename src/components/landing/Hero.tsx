// src/components/landing/Hero.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import LoginModal from '../auth/LoginModal';
import { useAuth } from '../../hooks/useAuth';

const Hero = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to recipes page with search query
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center py-12 md:py-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-orange-500 mb-2 uppercase tracking-wider font-semibold">🍽️ Welcome to Recipe App</p>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Order Delicious Food Any Time
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Discover amazing recipes from around the world. Order fresh ingredients, get meal plans, and enjoy cooking like never before. All from your favorite platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-white px-6 py-3 rounded-full border-2 border-orange-200 shadow-sm hover:border-orange-400 transition-colors">
                <Search className="w-5 h-5 text-orange-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <Button 
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600 rounded-full px-8 whitespace-nowrap font-semibold inline-flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </Button>
            </form>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleGetStarted}
                className="inline-flex bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 rounded-full font-semibold text-lg justify-center items-center gap-2"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                className="inline-flex bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-full font-semibold text-lg justify-center items-center gap-2"
              >
                Learn More
              </Button>
            </div>

            {/* Popular Recipes */}
            <div>
              <p className="text-sm text-gray-600 mb-4 font-semibold">Popular recipes</p>
              <div className="flex flex-wrap gap-3">
                {['🍳', '🍲', '🍝', '🍰', '🥗', '🍔'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-linear-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform shadow-md border border-orange-200"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative h-96 md:h-125 bg-linear-to-br from-orange-100 via-pink-50 to-orange-50 rounded-3xl overflow-hidden flex items-center justify-center group">
              {/* Main Image Placeholder */}
              <div className="text-center relative z-10">
                <div className="text-9xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 animate-bounce" style={{ animationDelay: '0s' }}>
                  🍽️
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-6">Fresh & Delicious</p>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-8 right-8 bg-white rounded-full p-5 shadow-xl hover:shadow-2xl transition-all hover:scale-110 cursor-pointer" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <span className="text-4xl block">🍅</span>
              </div>
              <div className="absolute bottom-12 left-8 bg-white rounded-full p-5 shadow-xl hover:shadow-2xl transition-all hover:scale-110 cursor-pointer" style={{ animation: 'float 3s ease-in-out infinite 1s' }}>
                <span className="text-4xl block">🌿</span>
              </div>
              <div className="absolute top-1/3 right-4 bg-white rounded-full p-4 shadow-lg hover:shadow-xl" style={{ animation: 'float 3s ease-in-out infinite 0.5s' }}>
                <span className="text-3xl block">🧂</span>
              </div>

              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-20px); }
                }
              `}</style>
            </div>

            {/* Info Card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl max-w-xs border-l-4 border-orange-500">
              <p className="text-lg font-bold text-gray-900">⭐ 4.8/5 Rating</p>
              <p className="text-sm text-gray-600">From 50K+ happy users</p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </section>
  );
};

export default Hero;
