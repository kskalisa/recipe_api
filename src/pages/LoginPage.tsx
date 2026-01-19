// src/pages/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../store/hooks';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [credentials, setCredentialsState] = useState<{username: string; password: string}>({
    username: 'emilys',
    password: 'emilyspass',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(credentials).unwrap();
      console.log('Login result:', result);
      
      // DummyJSON login endpoint returns complete user data in the response
      const userData = {
        id: result.id,
        username: result.username,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        gender: result.gender,
        image: result.image,
        token: result.token,
      };
      
      dispatch(setCredentials({
        user: userData,
        token: result.token,
      }));
      
      toast.success('Logged in successfully!');
      
      // Navigate to dashboard immediately - user data already loaded from login response
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again with username: emilys, password: emilyspass');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RecipeApp</h1>
          </div> */}
          <p className="text-gray-600 text-lg">Welcome back!</p>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account to continue</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentialsState(prev => ({ ...prev, username: e.target.value }))}
                icon={<Mail className="w-5 h-5" />}
                required
                placeholder="Enter your username"
                className="w-full"
              />
              
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentialsState(prev => ({ ...prev, password: e.target.value }))}
                icon={<Lock className="w-5 h-5" />}
                required
                placeholder="Enter your password"
                className="w-full"
              />
              
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-2 border-orange-300 rounded cursor-pointer" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 px-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition font-medium text-gray-700">
              Google
            </button>
            <button className="py-2 px-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition font-medium text-gray-700">
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
              Sign up
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
