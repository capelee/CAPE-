import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TutorialProvider } from './context/TutorialContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RootErrorBoundary]: Uncaught error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">畫面載入出現異常</h2>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              應用程式在執行時遭遇非預期錯誤，已自動啟動保護機制。
            </p>
            {this.state.error && (
              <div className="mb-4 p-3 bg-slate-950/80 rounded-lg text-xs font-mono text-red-300 overflow-x-auto border border-red-900/40 max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors text-sm shadow-md cursor-pointer"
            >
              重新整理頁面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error logger for unhandled errors/rejections
window.addEventListener('error', (event) => {
  console.error('[Global Window Error]:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global Unhandled Rejection]:', event.reason);
});

const rootElement = document.getElementById('root');

console.log('[App Boot Step 1]: Document state =', document.readyState, '| root element exists =', !!rootElement);

if (!rootElement) {
  console.error('[App Root Error]: #root container element was not found in the DOM.');
} else {
  try {
    const root = createRoot(rootElement);
    console.log('[App Boot Step 2]: Initializing React root rendering...');
    root.render(
      <StrictMode>
        <RootErrorBoundary>
          <TutorialProvider>
            <App />
          </TutorialProvider>
        </RootErrorBoundary>
      </StrictMode>,
    );
    console.log('[App Boot Step 3]: Successfully called root.render().');
  } catch (error) {
    console.error('[App Boot Error]: Failed to render React root component:', error);
    rootElement.innerHTML = `<div style="padding: 24px; color: #ef4444; font-family: sans-serif; background: #0f172a; min-height: 100vh;">
      <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 12px;">應用程式載入遭遇問題</h1>
      <p style="font-size: 14px; opacity: 0.8;">請嘗試重新整理頁面。若問題持續發生，請與開發團隊聯繫。</p>
    </div>`;
  }
}

