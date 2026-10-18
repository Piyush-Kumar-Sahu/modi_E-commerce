import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/auth';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [associatedEmail, setAssociatedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate reset token on load
  useEffect(() => {
    if (!uid || !token) {
      setIsValidating(false);
      setIsTokenValid(false);
      setErrorMessage('Missing password reset credentials in link.');
      return;
    }

    authApi.validateResetToken(uid, token)
      .then((res) => {
        setIsTokenValid(res.valid);
        if (res.email) setAssociatedEmail(res.email);
        if (!res.valid) {
          setErrorMessage(res.message || 'This password reset link is invalid or has expired.');
        }
      })
      .catch((err) => {
        setIsTokenValid(false);
        setErrorMessage(err.message || 'This password reset link is invalid or has expired.');
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('The passwords entered do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authApi.resetPassword({
        uid,
        token,
        new_password: password,
        new_password_confirm: passwordConfirm,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-container py-16 sm:py-20 flex justify-center">
      <div className="max-w-md w-full bg-white border border-borderNeutral rounded-card p-6 sm:p-10 shadow-card space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Security Credential Update
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
            Reset Password
          </h1>
          <p className="text-xs text-mutedGrey leading-relaxed">
            Choose a strong, private password for your Modiecommers fine jewellery account.
          </p>
        </div>

        {/* Loading Token Validation State */}
        {isValidating && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-mutedGrey">Verifying secure reset token...</p>
          </div>
        )}

        {/* Success State */}
        {!isValidating && isSuccess && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-button text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Password Successfully Updated</span>
              </div>
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                Your account password has been established and your credentials have been secured.
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full text-xs font-semibold tracking-wide h-12 flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Invalid or Expired Token State */}
        {!isValidating && !isSuccess && !isTokenValid && (
          <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-button text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Link Expired or Invalid</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-600">
                {errorMessage || 'This password reset link has either already been used or has exceeded its 60-minute validity period.'}
              </p>
            </div>

            <Link
              to="/forgot-password"
              className="btn-primary w-full text-xs font-semibold tracking-wide h-12 flex items-center justify-center"
            >
              Request a New Reset Link
            </Link>
          </div>
        )}

        {/* Valid Token Form */}
        {!isValidating && !isSuccess && isTokenValid && (
          <>
            {associatedEmail && (
              <div className="text-xs bg-warmIvory border border-borderNeutral px-3.5 py-2 rounded-button text-charcoal flex items-center justify-between">
                <span className="text-mutedGrey">Resetting password for:</span>
                <span className="font-semibold text-primary">{associatedEmail}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-button text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="input-field pl-10 pr-10 text-xs"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 sm:top-4 text-mutedGrey hover:text-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    className="input-field pl-10 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-warmIvory/60 border border-borderNeutral/60 rounded-button text-[11px] text-mutedGrey space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Security Requirements:</span>
                </div>
                <p>• Minimum 8 characters in length</p>
                <p>• Avoid common passwords or passwords similar to your email</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-xs font-semibold tracking-wide h-12 mt-2"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </>
        )}

        {/* Back to Sign In */}
        <div className="text-center pt-2 border-t border-borderNeutral">
          <Link
            to="/login"
            className="text-xs text-mutedGrey hover:text-primary transition-colors font-medium"
          >
            Remember your credentials? <span className="text-primary font-semibold hover:underline">Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;
