import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function scrollToId(id) { 
  const el = document.getElementById(id)
  if (!el) return false

  // Header is fixed; CSS already offsets body margin, but this helps on redirects 
  el.scrollIntoView({ behavior: 'smooth', block: 'start' }) 
  return true
}

export default function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    if (!id) return

    // Wait a tick so the page has rendered the target section
    const t = window.setTimeout(() => scrollToId(id), 0)
    return () => window.clearTimeout(t)
  }, [location.hash, location.key])

  return (
    <>
      <Navbar key={`${location.pathname}${location.hash}`} /> 
      <main className="l-main">
        <Outlet /> 
      </main>
      <Footer />
    </>
  )
}

