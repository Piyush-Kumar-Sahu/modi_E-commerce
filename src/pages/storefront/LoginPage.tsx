import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Sparkles, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setIsUnverified(false);

    try {
      const loggedUser = await login(email.trim(), password);
      const isAdmin = !!(
        loggedUser?.is_admin ||
        loggedUser?.is_staff ||
        loggedUser?.is_superuser ||
        loggedUser?.role === 'admin'
      );

      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from || '/account', { replace: true });
      }
    } catch (err: any) {
      const code = err.data?.code || err.data?.detail?.code;
      const message = err.message || 'Invalid email or password. Please verify your credentials.';
      
      if (code === 'email_not_verified' || message.toLowerCase().includes('verify your email')) {
        setIsUnverified(true);
        setErrorMessage('Your email address has not been verified yet. Please enter the OTP sent to your inbox.');
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@modiecommers.com');
    setPassword('ModiecommersAdmin2026!');
    setIsUnverified(false);
    setErrorMessage(null);
  };

  const handleFillDemoCustomer = () => {
    setEmail('priya.sharma@example.com');
    setPassword('CustomerPass2026!');
    setIsUnverified(false);
    setErrorMessage(null);
  };

  return (
    <div className="section-container py-16 sm:py-20 flex justify-center">
      <div className="max-w-md w-full bg-white border border-borderNeutral rounded-card p-6 sm:p-10 shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Patron Sign In
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
            Welcome to Modiecommers
          </h1>
          <p className="text-xs text-mutedGrey">
            Sign in to access your saved jewellery wishlist, order history, and addresses.
          </p>
        </div>

        {/* Demo Fast-Fill Shortcuts */}
        <div className="p-3 bg-warmIvory border border-borderNeutral rounded-button space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-primary font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Fast Fill Demo Credentials:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-2.5 py-1 bg-white border border-borderNeutral rounded text-[11px] font-semibold text-charcoal hover:border-primary hover:text-primary transition-colors"
            >
              Owner / Admin
            </button>
            <button
              type="button"
              onClick={handleFillDemoCustomer}
              className="px-2.5 py-1 bg-white border border-borderNeutral rounded text-[11px] font-semibold text-charcoal hover:border-primary hover:text-primary transition-colors"
            >
              Verified Customer (Priya)
            </button>
          </div>
        </div>

        {/* Error / Unverified Notice */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-button text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {isUnverified && (
              <div className="pt-2 border-t border-red-200 flex justify-end">
                <Link
                  to={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-white px-3 py-1.5 rounded-button border border-borderNeutral shadow-sm"
                >
                  <span>Verify Email with OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field pl-10 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal block">Password</label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 sm:top-4 text-mutedGrey hover:text-charcoal"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-xs font-semibold tracking-wide h-12 mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In to Account'}
          </button>
        </form>

        <div className="text-center text-xs text-mutedGrey pt-2 border-t border-borderNeutral">
          New to Modiecommers?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
