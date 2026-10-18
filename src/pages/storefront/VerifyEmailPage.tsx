import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, AlertCircle, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus the first empty digit on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    if (value && !/^\d+$/.test(value)) return;

    // Handle full OTP paste into any cell
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setOtpDigits(newDigits);
        const nextFocus = Math.min(pasted.length, 5);
        inputRefs.current[nextFocus]?.focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await verifyEmail(email.trim(), fullOtp);
      setIsVerifiedSuccess(true);
      setSuccessMessage('Your email has been verified successfully!');
      setTimeout(() => {
        navigate('/account');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive a new code.');
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.resendOTP(email.trim());
      setSuccessMessage(res.message || 'A fresh verification code has been dispatched to your email.');
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      if (err.data?.retry_after) {
        setResendCooldown(err.data.retry_after);
      }
      setErrorMessage(err.message || 'Failed to resend code. Please try again in a few moments.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="section-container py-16 sm:py-20 flex justify-center">
      <div className="max-w-md w-full bg-white border border-borderNeutral rounded-card p-6 sm:p-10 shadow-card space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Security Verification
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
            Verify Your Email
          </h1>
          <p className="text-xs text-mutedGrey leading-relaxed">
            We have sent a time-limited 6-digit verification code to your registered email address.
          </p>
        </div>

        {/* Success Banner */}
        {isVerifiedSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-button text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold">Email verified successfully!</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Redirecting to your patron salon account...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Info or Message Badges */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-button text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-button text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-5">
              {/* Email Address Field */}
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Registered Email Address
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
                  />
                </div>
              </div>

              {/* 6-Digit OTP Entry */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-charcoal">
                    6-Digit One-Time Password (OTP)
                  </label>
                  <span className="text-[10px] text-mutedGrey font-medium">Valid for 10 minutes</span>
                </div>

                <div className="flex justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 sm:w-12 h-13 sm:h-14 text-center text-xl font-bold font-mono text-charcoal bg-warmIvory/60 border border-borderNeutral rounded-button focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-xs font-semibold tracking-wide h-12 mt-2"
              >
                {isLoading ? 'Verifying Code...' : 'Verify & Activate Account'}
              </button>
            </form>

            {/* Resend OTP Section */}
            <div className="pt-2 text-center text-xs text-mutedGrey border-t border-borderNeutral space-y-2">
              <p>Didn&apos;t receive the code or has it expired?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className={`inline-flex items-center gap-1.5 font-semibold text-xs transition-colors ${
                  resendCooldown > 0
                    ? 'text-mutedGrey cursor-not-allowed opacity-70'
                    : 'text-primary hover:underline hover:text-primary-hover'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend Code in ${resendCooldown}s`
                    : isResending
                    ? 'Sending...'
                    : 'Resend Verification Code'}
                </span>
              </button>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-mutedGrey hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmailPage;
