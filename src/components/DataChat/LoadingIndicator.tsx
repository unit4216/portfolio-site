/**
 * Loading indicator component with animated dots
 */
export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-[#e5e6e4] px-4 py-3 rounded-2xl shadow-sm border border-[#cfd2cd] flex items-center gap-1">
        <span className="w-2 h-2 bg-[#a6a2a2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-[#a6a2a2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-[#a6a2a2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}; 