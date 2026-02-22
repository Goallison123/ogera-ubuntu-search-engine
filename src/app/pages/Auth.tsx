import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../components/ui/auth-context';
import { AuthForm } from '../components/ui/auth-form';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <AuthForm onSuccess={() => navigate('/')} />;
};

export default Auth;
