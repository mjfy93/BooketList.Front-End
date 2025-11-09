// app/root.jsx
import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import HtmlShell from './components/HtmlShell.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
          <HtmlShell>
            <main className='container mb-5'>
              <ScrollToTop />
              <Outlet />
            </main>
          </HtmlShell>
      </AuthProvider>
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }) {
  console.error('Error caught by boundary:', error);
  return (
    <ThemeProvider>
      <AuthProvider>
          <HtmlShell>
            <main className='container mb-5'>
              <div className="alert alert-danger">
                <h2>Error</h2>
                <p>{error?.message || 'Algo salió mal'}</p>
                <pre>{error?.stack}</pre>
              </div>
            </main>
          </HtmlShell>
      </AuthProvider>
    </ThemeProvider>
  )
}