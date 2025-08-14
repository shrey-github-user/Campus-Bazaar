import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Simple re-export hook for AuthContext
 */
export default function useAuth() {
  return useContext(AuthContext);
}
