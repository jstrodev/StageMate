import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

export const LoadingPage = () => (
  <div className="container mx-auto p-4">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

export default LoadingSpinner;