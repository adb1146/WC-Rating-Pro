import React from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { PSAdvisoryLogo } from '../PSAdvisoryLogo';

type AuthView = 'login' | 'signup' | 'reset';

export function AuthContainer() {
  const [view, setView] = React.useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <PSAdvisoryLogo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {view === 'login' && 'Welcome back'}
          {view === 'signup' && 'Create your account'}
          {view === 'reset' && 'Reset your password'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {view === 'login' && (
          <LoginForm
            onSignUp={() => setView('signup')}
            onForgotPassword={() => setView('reset')}
          />
        )}
        {view === 'signup' && (
          <SignUpForm
            onSignIn={() => setView('login')}
          />
        )}
        {view === 'reset' && (
          <ResetPasswordForm
            onBack={() => setView('login')}
          />
        )}
      </div>
    </div>
  );
}