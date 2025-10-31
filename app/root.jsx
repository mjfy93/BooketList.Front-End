import { Outlet, useLocation } from 'react-router'
import HtmlShell from './components/HtmlShell.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

export default function App() {






  return (
    <ThemeProvider>
      <AuthProvider>

        <HtmlShell>
          <main className='container mb-5'>
            <Outlet />
          </main>
        </HtmlShell>
      </AuthProvider>
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HtmlShell>
          <main className='container mb-5'>
            <Outlet />
          </main>
        </HtmlShell>
      </AuthProvider>
    </ThemeProvider>
  )
}
