import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Shield,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { authApi } from '../../api/auth';

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Resend cooldown timer in seconds
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Request OTP for registered email
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await authApi.forgotPassword(cleanEmail);
      setSuccessInfo(res.message || 'Verification code dispatched to your inbox.');
      setCooldown(60);
      setStep('OTP');
    } catch (err: any) {
      setErrorMessage(
        err.userMessage || err.message || 'Failed to dispatch verification code. Please verify email and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit code sent to your email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await authApi.verifyResetOTP(email.trim().toLowerCase(), cleanOtp);
      if (res.success && res.reset_token) {
        setResetToken(res.reset_token);
        setStep('NEW_PASSWORD');
      } else {
        setErrorMessage(res.message || 'Invalid verification code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.userMessage || err.message || 'Verification failed. Please check the code or request a fresh one.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (cooldown > 0 || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await authApi.resendResetOTP(email.trim().toLowerCase());
      setSuccessInfo(res.message || 'A fresh verification code has been dispatched.');
      setCooldown(res.retry_after || 60);
    } catch (err: any) {
      setErrorMessage(err.userMessage || err.message || 'Could not resend code. Please wait before retrying.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set and confirm new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('New password must contain at least 8 characters.');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('The passwords entered do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        reset_token: resetToken,
        new_password: password,
        new_password_confirm: passwordConfirm,
      });

      if (res.success) {
        setStep('SUCCESS');
      } else {
        setErrorMessage(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.userMessage || err.message || 'Failed to reset password. The recovery session may have expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-container py-16 sm:py-20 flex justify-center">
      <div className="max-w-md w-full bg-white border border-borderNeutral rounded-card p-6 sm:p-10 shadow-card space-y-6">
        
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
            {step === 'SUCCESS' ? (
              <CheckCircle2 className="w-7 h-7 text-primary" />
            ) : step === 'NEW_PASSWORD' ? (
              <Lock className="w-7 h-7 text-primary" />
            ) : (
              <KeyRound className="w-7 h-7 text-primary" />
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Password Recovery
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
            {step === 'EMAIL' && 'Forgot Password'}
            {step === 'OTP' && 'Verify Security Code'}
            {step === 'NEW_PASSWORD' && 'Establish New Password'}
            {step === 'SUCCESS' && 'Password Updated'}
          </h1>
          <p className="text-xs text-mutedGrey leading-relaxed">
            {step === 'EMAIL' && 'Enter your registered email address to receive a 6-digit recovery OTP.'}
            {step === 'OTP' && `Enter the 6-digit code sent to ${email}.`}
            {step === 'NEW_PASSWORD' && 'Choose a strong password with at least 8 characters.'}
            {step === 'SUCCESS' && 'Your password has been changed. You may now sign in.'}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-button text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Info/Success Banner */}
        {successInfo && step !== 'SUCCESS' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-button text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* ================= STEP 1: EMAIL ================= */}
        {step === 'EMAIL' && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Patron Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-10 text-xs"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-xs font-semibold tracking-wide h-12 mt-2 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Transmitting Code...' : 'Send Recovery OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-charcoal block">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setOtp('');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-primary hover:underline"
                >
                  Change email
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="input-field text-center font-mono text-lg tracking-[8px] font-bold text-primary"
                autoFocus
              />
              <p className="text-[11px] text-mutedGrey mt-1">
                The code expires in 10 minutes. Check your inbox and spam folders.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="btn-primary w-full text-xs font-semibold tracking-wide h-12"
            >
              {isLoading ? 'Verifying Code...' : 'Verify Code & Proceed'}
            </button>

            {/* Resend Cooldown Option */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={cooldown > 0 || isLoading}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline disabled:text-mutedGrey disabled:no-underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Verification Code'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: NEW PASSWORD ================= */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

            <div className="p-3 bg-warmIvory border border-borderNeutral rounded-button text-[11px] text-mutedGrey space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-charcoal">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Security Guidelines:</span>
              </div>
              <p>• Must be at least 8 characters</p>
              <p>• Should not match your previous passwords</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-xs font-semibold tracking-wide h-12 mt-2"
            >
              {isLoading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* ================= STEP 4: SUCCESS ================= */}
        {step === 'SUCCESS' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-button text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Password Reset Complete</span>
              </div>
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                Your account password has been updated securely. You can now use your new credentials to sign in.
              </p>
            </div>

            <Link
              to="/login"
              className="btn-primary w-full text-xs font-semibold tracking-wide h-12 flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Back to Sign In Link */}
        {step !== 'SUCCESS' && (
          <div className="text-center pt-2 border-t border-borderNeutral">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-mutedGrey hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
