import React from 'react';

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse bg-stone-900 border border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className="w-10 h-10 rounded-full bg-stone-850" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-28 bg-stone-850" />
          <div className="h-2.5 w-40 bg-stone-850" />
        </div>
      </div>
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3 w-full bg-stone-850" />
        <div className="h-3 w-4/5 bg-stone-850" />
      </div>
      <div className="aspect-[16/9] bg-stone-850" />
      <div className="h-16 bg-[#161616] border-t border-white/5" />
      <div className="h-11 border-t border-white/5 mx-2" />
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
