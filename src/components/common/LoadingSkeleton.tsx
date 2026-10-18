import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card-jewellery animate-pulse">
      {/* 4:5 image skeleton */}
      <div className="w-full aspect-[4/5] bg-softNeutral/70" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-1/3 bg-softNeutral rounded" />
        <div className="h-4 w-4/5 bg-softNeutral rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-1/4 bg-softNeutral rounded" />
          <div className="h-3 w-1/5 bg-softNeutral rounded" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="section-container py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 aspect-[4/5] bg-softNeutral/70 rounded-card" />
        <div className="lg:col-span-5 space-y-6">
          <div className="h-4 w-1/4 bg-softNeutral rounded" />
          <div className="h-8 w-3/4 bg-softNeutral rounded" />
          <div className="h-6 w-1/3 bg-softNeutral rounded" />
          <div className="h-20 w-full bg-softNeutral rounded" />
          <div className="h-12 w-full bg-softNeutral rounded-button" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-white border border-borderNeutral rounded-card p-4 space-y-3">
            <div className="h-3 w-1/2 bg-softNeutral rounded" />
            <div className="h-6 w-1/3 bg-softNeutral rounded" />
          </div>
        ))}
      </div>
      <div className="h-64 bg-white border border-borderNeutral rounded-card p-6" />
    </div>
  );
};
