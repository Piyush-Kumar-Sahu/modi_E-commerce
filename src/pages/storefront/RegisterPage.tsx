import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    // Optional phone number validation if provided
    const trimmedPhone = phone.trim();
    if (trimmedPhone) {
      const cleaned = trimmedPhone.replace(/[\s\-()]/g, '');
      if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
        setErrorMessage('Please enter a valid phone number with 10-15 digits, or leave it blank.');
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await register({
        email: email.trim(),
        phone_number: trimmedPhone || undefined,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password,
        password_confirm: passwordConfirm,
      });

      // Redirect directly to the Email OTP Verification page
      navigate(`/verify-email?email=${encodeURIComponent(res.email || email.trim())}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-container py-16 sm:py-20 flex justify-center">
      <div className="max-w-md w-full bg-white border border-borderNeutral rounded-card p-6 sm:p-10 shadow-card space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            New Patron Membership
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
            Create Your Account
          </h1>
          <p className="text-xs text-mutedGrey">
            Enjoy personalized suite curation, order tracking, and private collection releases.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-button text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ananya"
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Singhania"
                className="input-field text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Email Address <span className="text-accent">*</span>
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
            <p className="text-[10px] text-mutedGrey mt-1">
              A 6-digit verification code will be dispatched to this email address.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal block">
                Mobile Phone
              </label>
              <span className="text-[11px] text-mutedGrey font-normal">Optional</span>
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345 (Optional)"
                className="input-field pl-10 text-xs"
              />
            </div>
            <p className="text-[10px] text-mutedGrey mt-1">
              Optional — used solely for real-time courier dispatch SMS notifications.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Password <span className="text-accent">*</span>
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
              Confirm Password <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Repeat password"
                className="input-field pl-10 text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-warmIvory/60 border border-borderNeutral/60 rounded-button text-[11px] text-mutedGrey flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Mandatory email verification is enforced upon account creation.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-xs font-semibold tracking-wide h-12 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Continue to Email Verification'}
          </button>
        </form>

        <div className="text-center text-xs text-mutedGrey pt-2 border-t border-borderNeutral">
          Already registered?{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
