// src/components/landing/Footer.tsx
import { Facebook, Twitter, Instagram, Linkedin, ChefHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-24">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold">RecipeApp</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover and order delicious recipes from around the world.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a href="/" className="text-gray-400 hover:text-orange-500 transition text-sm">Home</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">Browse Recipes</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">About Us</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">Contact</a>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Info</h4>
            <nav className="space-y-2">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">Help Center</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition text-sm block">FAQ</a>
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400 text-sm">&copy; 2026 RecipeApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
