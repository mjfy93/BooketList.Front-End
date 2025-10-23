import { Outlet, useLocation } from 'react-router'
import HtmlShell from './components/HtmlShell.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

export default function App() {

  const location = useLocation();
  const isHomePage = location.pathname === '/';



  return (
    <ThemeProvider>
      <HtmlShell>
        <main className= {isHomePage ? '' : 'container mt-4'}>
          <Outlet />
        </main>
      </HtmlShell>
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }) {
  return (
    <ThemeProvider>
      <HtmlShell>
        <div className='container'>
          <h2>Error!</h2>
          <h4>{error.message}</h4>
        </div>
      </HtmlShell>
    </ThemeProvider>
  )
}
