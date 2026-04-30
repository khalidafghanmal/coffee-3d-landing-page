import { Navigate, Route, Routes } from 'react-router-dom' 
import SiteLayout from './components/SiteLayout.jsx'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  return ( 
    <Routes> 
      <Route element={<SiteLayout />}> 
        <Route path="/" element={<HomePage />} />

        {/* Optional section routes (all render the same one-page app) */}
        <Route path="/home" element={<Navigate to="/#home" replace />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} /> 
        <Route path="/menu" element={<Navigate to="/#menu" replace />} /> 
        <Route path="/portfolio" element={<Navigate to="/#portfolio" replace />} />
        <Route path="/gallery" element={<Navigate to="/#gallery" replace />} /> 
        <Route path="/faq" element={<Navigate to="/#faq" replace />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Route> 
    </Routes> 
  )
}
