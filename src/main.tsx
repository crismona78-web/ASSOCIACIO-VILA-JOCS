import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5] p-6 text-[#1C1917]">
          <div className="max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-bold text-[#DC2626]">
              Error en carregar la pàgina
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              {this.state.error.message || 'S’ha produït un error inesperat.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#1C1917] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
