import { Links, Meta, Scripts, ScrollRestoration } from 'react-router'
import { useTheme } from '../context/ThemeContext'
import Navbar from './Navbar'
import Footer from './Footer'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function HtmlShell({
  children,
  title = 'BooketList'
}) {
  const { theme } = useTheme()

  return (
    <html
      lang='en'
      data-bs-theme={theme}
    >
      <head>
        <meta charSet='UTF-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></link>
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  )
}
