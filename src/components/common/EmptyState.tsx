import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText = 'Explore Jewellery',
  actionLink = '/shop',
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white border border-borderNeutral rounded-card my-6">
      <div className="w-16 h-16 rounded-full bg-softNeutral flex items-center justify-center text-mutedGrey mb-4">
        {icon || <ShoppingBag className="w-8 h-8 text-primary/70" />}
      </div>
      <h3 className="font-serif-luxury text-xl sm:text-2xl font-medium text-charcoal mb-2">
        {title}
      </h3>
      <p className="text-mutedGrey text-sm max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn-primary">
            {actionText}
          </Link>
        ) : (
          <button onClick={onActionClick} className="btn-primary">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
