import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { ShieldAlert, Home, RefreshCw } from "lucide-react";

export function GlobalErrorBoundary() {
  const error = useRouteError();
  
  let title = "Unexpected Error";
  let message = "Something went wrong in the application. Please try again.";
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      is404 = true;
      title = "Page Not Found";
      message = "The feature or page you're looking for doesn't exist or has been moved.";
    } else {
      title = `${error.status} Error`;
      message = error.statusText;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 text-center shadow-xl animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--color-avoid-bg)] text-[var(--color-avoid)] mb-6">
          <ShieldAlert size={48} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-3">
          {title}
        </h1>
        
        <p className="text-[var(--color-muted)] text-lg mb-8">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          {is404 ? (
            <Link 
              to="/app" 
              className="gradient-primary flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Home size={20} />
              Return to Dashboard
            </Link>
          ) : (
            <button 
              onClick={() => window.location.reload()}
              className="gradient-primary flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <RefreshCw size={20} />
              Reload Application
            </button>
          )}
          
          <Link 
            to="/" 
            className="text-[var(--color-muted)] hover:text-[var(--color-text)] font-bold py-3 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
