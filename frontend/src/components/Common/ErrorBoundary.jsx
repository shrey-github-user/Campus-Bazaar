import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="flex flex-col items-center justify-center h-screen px-4 
                     bg-gray-50 dark:bg-gray-900 transition-colors duration-300
                     animate-fadeIn"
        >
          <ExclamationTriangleIcon className="h-16 w-16 text-red-600 dark:text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center max-w-md">
            An unexpected error occurred. Don’t worry — you can try again or head back to the homepage.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Retry
            </button>
            <Link
              to="/"
              className="px-5 py-2 rounded border border-gray-400 dark:border-gray-600 
                         text-gray-700 dark:text-gray-300 
                         hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              Go Home
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-6 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 rounded max-w-lg overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
