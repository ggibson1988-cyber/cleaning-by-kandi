import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
      <title>Page Not Found | Cleaning By Kandi</title>
      <meta name="robots" content="noindex" />
      <p className="text-8xl font-bold text-slate-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer">
        Back to Home
      </Link>
    </div>
  );
}
