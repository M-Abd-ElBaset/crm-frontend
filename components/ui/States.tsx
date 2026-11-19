export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 p-6 text-gray-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg bg-red-950 p-4 text-sm text-red-300">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 underline hover:text-red-200">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="p-6 text-center text-gray-400">{message}</div>;
}