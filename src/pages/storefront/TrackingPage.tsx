import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { ordersApi } from '../../api/orders';
import { ShipmentRecord } from '../../types';

export const TrackingPage: React.FC = () => {
  const { orderNumber: urlOrderNumber } = useParams<{ orderNumber?: string }>();
  
  const [orderQuery, setOrderQuery] = useState(urlOrderNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<{
    order_number: string;
    status: string;
    customer_name: string;
    shipping_city: string;
    shipment: ShipmentRecord;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performLookup = (orderNum: string) => {
    if (!orderNum.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    ordersApi
      .trackOrder(orderNum.trim())
      .then((data) => {
        setTrackingData(data);
      })
      .catch((err: any) => {
        setErrorMessage(err.message || 'We could not locate shipment records for this order number.');
        setTrackingData(null);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (urlOrderNumber) {
      performLookup(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderQuery);
  };

  return (
    <div className="section-container py-12 sm:py-16 max-w-3xl">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Logistics Telemetry
        </span>
        <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">
          Track Your Jewellery Shipment
        </h1>
        <p className="text-xs text-mutedGrey">
          Enter your order reference number to view simulated Shiprocket partner delivery milestones.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="bg-white border border-borderNeutral rounded-card p-4 shadow-sm flex gap-2 mb-8">
        <input
          type="text"
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
          placeholder="Enter Order Number (e.g. MOD-20261017-83921)"
          required
          className="input-field uppercase text-xs flex-1"
        />
        <button
          type="submit"
          disabled={isLoading || !orderQuery.trim()}
          className="btn-primary text-xs px-6 gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'Locating...' : 'Track'}</span>
        </button>
      </form>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-button flex items-center gap-2 mb-8">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tracking Results Card */}
      {trackingData && (
        <div className="bg-white border border-borderNeutral rounded-card p-6 sm:p-8 space-y-8 shadow-card">
          
          {/* Top Carrier Overview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-borderNeutral gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-mutedGrey block">
                Order Reference
              </span>
              <h2 className="text-xl font-bold text-charcoal">
                #{trackingData.order_number}
              </h2>
              <p className="text-xs text-mutedGrey mt-0.5">
                Consignee: <strong className="text-charcoal font-semibold">{trackingData.customer_name}</strong> • Destination: <strong className="text-charcoal font-semibold">{trackingData.shipping_city}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mutedGrey block">
                Carrier Partner (Shiprocket Demo)
              </span>
              <p className="text-xs font-bold text-primary">
                {trackingData.shipment.carrier_name}
              </p>
              <p className="text-[11px] text-mutedGrey">
                AWB / Tracking ID: <strong className="text-charcoal">{trackingData.shipment.tracking_number}</strong>
              </p>
            </div>
          </div>

          {/* Demo Mode Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-button text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Shiprocket Simulation:</strong> Tracking milestones below are generated for demonstration.
            </span>
          </div>

          {/* Current Status Badge */}
          <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-card">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary block">
                Current Status
              </span>
              <h3 className="text-sm font-bold text-charcoal">
                {trackingData.shipment.current_status}
              </h3>
            </div>
          </div>

          {/* Interactive Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Milestone Activity History
            </h3>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-borderNeutral">
              {trackingData.shipment.timeline_events.map((evt, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  {/* Content */}
                  <div className="bg-softNeutral/60 p-3.5 rounded-card border border-borderNeutral space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-charcoal">{evt.status}</span>
                      <span className="text-[11px] text-mutedGrey">{evt.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-mutedGrey">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{evt.location}</span>
                    </div>

                    {evt.note && (
                      <p className="text-xs text-charcoal/80 pt-1 border-t border-borderNeutral/50">
                        {evt.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-borderNeutral flex items-center justify-between text-xs text-mutedGrey">
            <span>Security Seal: Intact tamper-proof armour packing</span>
            <Link to="/contact" className="text-primary hover:underline font-semibold">
              Need assistance? Contact Client Care
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
