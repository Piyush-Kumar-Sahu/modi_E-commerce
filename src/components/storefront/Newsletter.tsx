import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-softNeutral border-b border-borderNeutral/60">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Privileged Access
        </span>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-charcoal">
          Join the Modiecommers Circle
        </h2>
        <p className="text-mutedGrey text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Receive exclusive invitations to private suite viewings, priority access to high-carat solitaire arrivals, and curated jewellery care insights.
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 border border-primary/20 text-primary rounded-button text-sm font-semibold max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Thank you for joining our private circle! Welcome email sent.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-mutedGrey absolute left-3.5 top-3.5 sm:top-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary sm:w-auto text-xs whitespace-nowrap">
              Request Invitation
            </button>
          </form>
        )}

        <p className="text-[11px] text-mutedGrey">
          We respect your privacy. No spam. You may unsubscribe from our communications at any time.
        </p>
      </div>
    </section>
  );
};
