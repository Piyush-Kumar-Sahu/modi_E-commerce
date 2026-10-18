import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bespoke Bridal Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="section-container py-12 sm:py-16 max-w-4xl space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Client Care & Bespoke Inquiries
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-charcoal">
          Connect With Our Atelier
        </h1>
        <p className="text-mutedGrey text-xs sm:text-sm max-w-lg mx-auto">
          Whether you seek assistance with diamond certifications, custom ring sizing, or scheduling a private viewing, our jewellery advisors are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column: Direct Contact Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-borderNeutral rounded-card p-6 space-y-5 shadow-sm">
            <h3 className="font-serif-luxury text-lg font-bold text-charcoal pb-3 border-b border-borderNeutral">
              Flagship Atelier
            </h3>

            <div className="space-y-4 text-xs text-charcoal">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Modiecommers Fine Jewellery</span>
                  <p className="text-mutedGrey leading-relaxed">
                    102, Heritage Diamond Tower, Zaveri Bazaar, Mumbai, Maharashtra 400002
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Telephone Assistance</span>
                  <p className="text-mutedGrey">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Concierge Email</span>
                  <p className="text-mutedGrey">care@modiecommers.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Advisory Hours</span>
                  <p className="text-mutedGrey">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                  <p className="text-mutedGrey">Sunday: Closed for Atelier Maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form (7 cols) */}
        <div className="md:col-span-7 bg-white border border-borderNeutral rounded-card p-6 sm:p-8 shadow-sm">
          <h3 className="font-serif-luxury text-lg font-bold text-charcoal pb-3 border-b border-borderNeutral mb-4">
            Send an Inquiry
          </h3>

          {isSent ? (
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-card text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
              <h4 className="font-serif-luxury text-lg font-bold text-charcoal">Inquiry Received</h4>
              <p className="text-xs text-mutedGrey max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. A dedicated fine jewellery specialist will respond to your inquiry within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Merchant"
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="radhika@example.com"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Topic / Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field text-xs"
                >
                  <option>Bespoke Bridal Inquiry</option>
                  <option>Solitaire Diamond Customization</option>
                  <option>Ring Sizing & Fit Assistance</option>
                  <option>Order Tracking & Logistics</option>
                  <option>Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the design, preferred metal karatage, diamond carat weight, or occasion..."
                  className="w-full p-3 bg-white border border-borderNeutral rounded-button text-xs text-charcoal focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full text-xs font-semibold h-11">
                Submit Inquiry to Concierge
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
