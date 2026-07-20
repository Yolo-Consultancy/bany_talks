import React from 'react';

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-[16/10] bg-stone-900 border border-white/5" />
      <div className="h-3 w-20 bg-stone-900" />
      <div className="h-5 w-4/5 bg-stone-900" />
      <div className="h-3 w-full bg-stone-900" />
      <div className="h-3 w-2/3 bg-stone-900" />
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
