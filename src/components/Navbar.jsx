import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'menu', label: 'Menu' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const activeHash = useMemo(() => (location.hash || '#home').replace('#', ''), [location.hash])

  return (
    <header className="l-header">
      <nav className="nav bd-grid">
        <div>
          <NavLink to="/#home" className="nav__logo">
            Coffee
          </NavLink>
        </div>

        <div className="nav__toggle" id="nav-toggle" onClick={() => setOpen((v) => !v)}>
          <i className="bx bx-menu" />
        </div>

        <div className={`nav__menu ${open ? 'show' : ''}`} id="nav-menu">
          <div className="nav__close" id="nav-close" onClick={() => setOpen(false)}>
            <i className="bx bx-x" />
          </div>

          <ul className="nav__list">
            {navItems.map((item) => (
              <li key={item.id} className="nav__item">
                <NavLink
                  to={`/#${item.id}`}
                  className={`nav__link ${activeHash === item.id ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header> 
  )
}

