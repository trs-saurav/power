import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 p-8">
        {/* Main Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-primary/40"></div>
        </div>
        
        {/* Company Logo/Name */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">⚡ Power Electronics</h2>
          <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
        
        {/* Loading Progress Animation */}
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
