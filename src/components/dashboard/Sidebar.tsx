import { useState } from 'react';
import { ChefHat, Menu, X, LayoutDashboard, List, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: 'dashboard' | 'recipes' | 'settings';
  onTabChange: (tab: 'dashboard' | 'recipes' | 'settings') => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recipes', label: 'Manage Recipes', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-linear-to-b from-blue-900 to-blue-800 text-white w-64 shadow-lg transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40 md:z-10`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <ChefHat className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Foodala</h2>
              <p className="text-xs text-blue-300">Recipe Manager</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-4 bg-blue-700/50 m-4 rounded-lg">
            <p className="text-sm text-blue-100">Welcome back,</p>
            <p className="text-lg font-semibold text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-blue-300">{user.email}</p>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as 'dashboard' | 'recipes' | 'settings');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-yellow-500 text-blue-900 font-semibold shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 space-y-3 border-t border-blue-700 m-4">
          <div className="bg-blue-700/50 p-4 rounded-lg">
            <p className="text-xs text-blue-300 mb-1">Total Recipes</p>
            <p className="text-2xl font-bold">Manage</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
