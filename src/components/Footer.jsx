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
        <p className="footer__copy">© {year} Khalid Afghanmal. Made by me.</p>
        <div className="footer__social"> 
          <a 
            className="footer__link"
            href="https://github.com/khalidafghanmal"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <i className="bx bxl-github" /> 
          </a>
          <a
            className="footer__link"
            href="https://af.linkedin.com/in/khalid-afghanmal-660a83382" 
            target="_blank" 
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <i className="bx bxl-linkedin" /> 
          </a>
          <a 
            className="footer__link"
            href="http://khalidafghanmal.netlify.app/"
            target="_blank"
            rel="noreferrer"
            aria-label="Website" 
          > 
            <i className="bx bx-globe" />
          </a>
        </div>
      </div>
    </footer> 
  ) 
}

