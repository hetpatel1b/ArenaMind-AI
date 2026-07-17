import React from 'react';
import { Skeleton } from './Skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface StateRendererProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function StateRenderer({
  isLoading,
  isError,
  error,
  onRetry,
  loadingFallback,
  children,
  className = '',
}: StateRendererProps) {
  if (isLoading) {
    return (
      <div className={`w-full h-full flex flex-col ${className}`}>
        {loadingFallback || <Skeleton className="w-full h-full min-h-[150px] rounded-xl" />}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`w-full h-full min-h-[150px] flex flex-col items-center justify-center p-6 rounded-xl border border-red-500/20 bg-red-500/5 ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <h3 className="text-sm font-medium text-red-300 mb-1">Failed to load data</h3>
        <p className="text-xs text-red-400/60 text-center mb-4 max-w-[250px]">
          {error?.message || 'A network error occurred. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
