# Coffee 3D — React Landing Page (Vite + React Router)

A clean and modern **coffee landing page** built with **React**.  
It includes **3D mouse parallax**, **smooth scroll animations**, and a **portfolio slider**.

## Features

- Responsive layout (mobile / tablet / desktop)
- 3D parallax hero images (moves with your mouse)
- Scroll reveal animations (GSAP + ScrollTrigger)
- Portfolio slider with filters (Swiper)
- React Router links (you can use `/about`, `/menu`, etc.)

## Tech stack

- React + Vite (JSX)
- React Router
- GSAP + ScrollTrigger
- Swiper

## How to run (easy)

Open a terminal inside the `coffee/` folder and run:

```bash
npm install
npm run dev
```

Then open the link shown in the terminal (example: `http://localhost:5173/`).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure (important)

- `src/pages/HomePage.jsx` — the landing page sections
- `src/components/Navbar.jsx` — header + menu
- `src/components/SiteLayout.jsx` — layout + hash scroll support
- `public/assets/` — images + CSS used by the site

## Customize

- **Text / sections**: edit `src/pages/HomePage.jsx`
- **Styles**: edit `public/assets/css/styles.css`
- **Footer links**: edit `src/components/Footer.jsx`
