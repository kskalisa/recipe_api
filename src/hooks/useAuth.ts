// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: false,
    logout: () => dispatch(logout()),
  };
};