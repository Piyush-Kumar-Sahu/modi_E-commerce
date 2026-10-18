import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => {
            let bg = 'bg-white border-borderNeutral text-charcoal';
            let icon = <Info className="w-5 h-5 text-primary flex-shrink-0" />;

            if (toast.type === 'success') {
              bg = 'bg-white border-primary/30 text-charcoal shadow-float';
              icon = <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />;
            } else if (toast.type === 'error') {
              bg = 'bg-white border-red-200 text-charcoal shadow-float';
              icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
            }

            return (
              <div
                key={toast.id}
                role="alert"
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-card border shadow-card transition-all duration-fast ${bg}`}
              >
                {icon}
                <div className="flex-1 text-sm leading-snug">{toast.message}</div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-mutedGrey hover:text-charcoal transition-colors p-1"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const Toast: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-white border-borderNeutral text-charcoal';
        let icon = <Info className="w-5 h-5 text-primary flex-shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-white border-primary/30 text-charcoal shadow-float';
          icon = <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-white border-red-200 text-charcoal shadow-float';
          icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-card border shadow-card transition-all duration-fast ${bg}`}
          >
            {icon}
            <div className="flex-1 text-sm leading-snug">{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-mutedGrey hover:text-charcoal transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
