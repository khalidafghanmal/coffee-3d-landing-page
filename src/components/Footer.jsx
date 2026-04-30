import { useEffect, useState } from 'react'

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    // keep year correct in long-lived sessions
    const t = window.setInterval(() => setYear(new Date().getFullYear()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  return (
    <footer className="footer">
      <div className="footer__container bd-grid">
        <p className="footer__copy">© {year} Coffee. All rights reserved.</p>
        <div className="footer__social">
          <a className="footer__link" href="https://github.com/" target="_blank" rel="noreferrer">
            <i className="bx bxl-github" />
          </a>
          <a className="footer__link" href="https://linkedin.com/" target="_blank" rel="noreferrer">
            <i className="bx bxl-linkedin" />
          </a>
          <a className="footer__link" href="https://example.com/" target="_blank" rel="noreferrer">
            <i className="bx bx-globe" />
          </a>
        </div>
      </div>
    </footer>
  )
}

