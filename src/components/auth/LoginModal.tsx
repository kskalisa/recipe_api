// src/components/auth/LoginModal.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
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
      
      // DummyJSON login endpoint returns user data in the response
      // Create user object from the response
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
      onClose();
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again with username: emilys, password: emilyspass');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentialsState(prev => ({ ...prev, username: e.target.value }))}
            icon={<Mail className="w-5 h-5" />}
            required
            placeholder="Enter your username"
          />
          
          <Input
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentialsState(prev => ({ ...prev, password: e.target.value }))}
            icon={<Lock className="w-5 h-5" />}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Test Credentials:</strong><br />
            Username: <code>emilys</code><br />
            Password: <code>emilyspass</code>
          </p>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold"
        >
          Sign In
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => {
                toast.success('Registration is disabled in demo. Use test credentials.');
              }}
            >
              Sign up here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
