
export default function ProgressIndicator({ label }: { label: string }) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></span>
        <span className="text-gray-700">{label}</span>
      </div>
    );
  }
  