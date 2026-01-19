import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, User, LogIn } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 bg-linear-to-r from-orange-500 to-pink-500 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-white rounded-lg group-hover:scale-105 transition-transform">
                <ChefHat className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xl font-bold text-white">RecipeApp</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-orange-100 transition-colors font-medium">
                Home 
              </Link>
              
              <a href="#" className="text-white hover:text-orange-100 transition-colors font-medium">
                Recipes
              </a>
              <a href="#" className="text-white hover:text-orange-100 transition-colors font-medium">
                Categories
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  
                  <div className="flex items-center space-x-3 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                        {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                      </div>
                    )}
                    <div className="hidden md:block text-sm">
                      <p className="font-medium text-white">{user?.firstName || user?.username}</p>
                      <p className="text-xs text-white/80">{user?.email}</p>
                    </div>
                  </div>

                  <Button
                    onClick={logout}
                    className="bg-white/20 text-white hover:bg-white/30 font-semibold border border-white/30"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;