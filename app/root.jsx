// app/root.jsx
import { Outlet } from 'react-router'
import HtmlShell from './components/HtmlShell.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <HtmlShell>
            <main className='container mb-5'>
              <Outlet />
            </main>
          </HtmlShell>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }) {
  console.error('Error caught by boundary:', error);

  return (
    <ThemeProvider>
      <HtmlShell>
        <main className='container mb-5'>
          <div className="alert alert-danger">
            <h2>Error</h2>
            <p>{error?.message || 'Algo salió mal'}</p>
            <pre>{error?.stack}</pre>
          </div>
        </main>
      </HtmlShell>
    </ThemeProvider>
  )
}