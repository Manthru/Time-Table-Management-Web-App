import React, { useState } from 'react';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import LandingPage from '../LandingPage';

type AuthView = 'home' | 'login' | 'signup' | 'forgot-password';

export function AuthContainer() {
  const [currentView, setCurrentView] = useState<AuthView>('home');

  const handleNavigateToLogin = () => setCurrentView('login');
  const handleNavigateToSignUp = () => setCurrentView('signup');
  const handleNavigateToForgotPassword = () => setCurrentView('forgot-password');
  const handleNavigateToHome = () => setCurrentView('home');

  switch (currentView) {
    case 'login':
      return (
        <Login
          onNavigateToSignUp={handleNavigateToSignUp}
          onNavigateToForgotPassword={handleNavigateToForgotPassword}
          onNavigateToHome={handleNavigateToHome}
        />
      );
    case 'signup':
      return (
        <SignUp
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToHome={handleNavigateToHome}
        />
      );
    case 'forgot-password':
      return (
        <ForgotPassword
          onNavigateToLogin={handleNavigateToLogin}
        />
      );
    default:
      return (
        <LandingPage 
          setCurrentPage={setCurrentView}
        />
      );
  }
}