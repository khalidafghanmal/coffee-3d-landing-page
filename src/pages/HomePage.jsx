import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const ISO_DATA = [
  {
    cat: 'espresso',
    img: '/assets/img/img1.png',
    title: 'Espresso Shot',
    desc: 'Rich crema, bold flavor, and a clean finish.',
    tags: ['Single', 'Crema', 'Bold'],
    color: '#A83E51',
    url: '/#menu',
  },
  {
    cat: 'latte',
    img: '/assets/img/img2.png',
    title: 'Rose Latte',
    desc: 'Creamy texture with soft floral notes.',
    tags: ['Milk', 'Smooth', 'Floral'],
    color: '#C1576A',
    url: '/#menu',
  },
  {
    cat: 'coldbrew',
    img: '/assets/img/img3.png',
    title: 'Cold Brew',
    desc: 'Slow-steeped, bright, and extra smooth.',
    tags: ['Iced', 'Smooth', 'Bright'],
    color: '#FCA4A6',
    url: '/#menu',
  },
  {
    cat: 'beans',
    img: '/assets/img/img4.png',
    title: 'House Beans',
    desc: 'Freshly roasted beans for daily brews.',
    tags: ['Roast', 'Fresh', 'Aroma'],
    color: '#A83E51',
    url: '/#pricing',
  },
  {
    cat: 'latte',
    img: '/assets/img/img5.png',
    title: 'Mocha Drift', 
    desc: 'Chocolate + espresso with a silky finish.',
    tags: ['Choco', 'Silky', 'Sweet'],
    color: '#C1576A',
    url: '/#menu',
  },
  {
    cat: 'espresso',
    img: '/assets/img/img6.png',
    title: 'Signature Blend',
    desc: 'Balanced body designed for espresso and milk drinks.',
    tags: ['Blend', 'Balanced', 'Daily'],
    color: '#A83E51',
    url: '/#about',
  },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'espresso', label: 'Espresso' },
  { id: 'latte', label: 'Latte' },
  { id: 'coldbrew', label: 'Cold Brew' },
  { id: 'beans', label: 'Beans' },
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const update = () => setReduced(Boolean(mq.matches))
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

export default function HomePage() {
  const reducedMotion = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const heroImgRef = useRef(null)
  const rafRef = useRef(0)

  const [portfolioFilter, setPortfolioFilter] = useState('all')
  const filteredPortfolio = useMemo(() => {
    if (portfolioFilter === 'all') return ISO_DATA
    return ISO_DATA.filter((x) => x.cat === portfolioFilter)
  }, [portfolioFilter])

  // Parallax hero (smooth inertia)
  useEffect(() => {
    if (reducedMotion) return
    const root = rootRef.current
    if (!root) return

    const layers = Array.from(root.querySelectorAll('.move'))
    if (!layers.length) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const lerp = (a, b, t) => a + (b - a) * t

    const updateTarget = () => {
      tx = (window.innerWidth - mouseX) / 120
      ty = (window.innerHeight - mouseY) / 120
    }

    const onMouseMove = (e) => {
      mouseX = e.pageX
      mouseY = e.pageY
      updateTarget()
    }

    const onResize = () => {
      mouseX = window.innerWidth / 2
      mouseY = window.innerHeight / 2
      updateTarget()
    }

    const animate = () => {
      cx = lerp(cx, tx, 0.08)
      cy = lerp(cy, ty, 0.08)

      layers.forEach((layer) => {
        const speed = Number(layer.getAttribute('data-speed') || 1)
        layer.style.transform = `translateX(${cx * speed}px) translateY(${cy * speed}px)`
      })
      rafRef.current = window.requestAnimationFrame(animate)
    }

    updateTarget()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize)
    rafRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion])

  // GSAP reveals + entry animation
  useEffect(() => {
    if (reducedMotion) return
    const root = rootRef.current
    if (!root) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.home__title', { opacity: 0, duration: 1, delay: 0.15, y: 26 })
      gsap.from('.home__description', { opacity: 0, duration: 1, delay: 0.25, y: 26 })
      gsap.from('.home__button', { opacity: 0, duration: 1, delay: 0.35, y: 26, stagger: 0.06 })
      if (heroImgRef.current) {
        gsap.from(heroImgRef.current, { opacity: 0, duration: 1, delay: 0.1, y: 26 })
      }

      const revealItems = gsap.utils.toArray('.reveal')
      if (revealItems.length) {
        gsap.set(revealItems, { opacity: 0, y: 18 })
        revealItems.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        })
      }
    }, root) 

    return () => ctx.revert()
  }, [reducedMotion])

  const onContactSubmit = (e) => {
    e.preventDefault()
    e.currentTarget.reset()
  }

  return (
    <div ref={rootRef}>
      <section className="home" id="home">
        <div className="home__container bd-grid">
          <div className="home__img" ref={heroImgRef}> 
            <img src="/assets/img/img1.png" alt="" data-speed="-2" className="move" />
            <img src="/assets/img/img2.png" alt="" data-speed="2" className="move" />
            <img src="/assets/img/img3.png" alt="" data-speed="2" className="move" />
            <img src="/assets/img/img4.png" alt="" data-speed="-2" className="move" />
            <img src="/assets/img/img5.png" alt="" data-speed="-2" className="move" />
            <img src="/assets/img/img6.png" alt="" data-speed="2" className="move" />
          </div>

          <div className="home__data">
            <h1 className="home__title">
              Coffee <br /> Drink 3D
            </h1>
            <p className="home__description">
              Let&apos;s help discover the best coffee drink <br /> of the week.
            </p>
            <div className="home__actions">
              <a href="/#menu" className="home__button">
                Explore Menu
              </a>
              <a href="/#services" className="home__button home__button--ghost">
                Get Services
              </a>
            </div>
          </div> 
        </div>
      </section>

      <section className="section about" id="about">
        <div className="about__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">About</h2>
            <p className="section__subtitle reveal">
              Simple ingredients. Clean taste. Beautiful presentation.
            </p>
          </div>

          <div className="about__grid">
            <div className="about__card reveal">
              <i className="bx bx-leaf about__icon" />
              <h3 className="about__card-title">Fresh notes</h3>
              <p className="about__card-text">Balanced sweetness with a smooth finish.</p>
            </div>
            <div className="about__card reveal">
              <i className="bx bx-timer about__icon" />
              <h3 className="about__card-title">Fast brew</h3>
              <p className="about__card-text">Dialed recipes that stay consistent every time.</p>
            </div>
            <div className="about__card reveal">
              <i className="bx bx-diamond about__icon" />
              <h3 className="about__card-title">Premium feel</h3>
              <p className="about__card-text">Minimal design, modern details, best UX.</p>
            </div> 
          </div>
        </div>
      </section>

      <section className="section menu" id="menu">
        <div className="menu__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Popular picks</h2>
            <p className="section__subtitle reveal">A slim menu that covers the essentials.</p>
          </div>

          <div className="menu__grid">
            <article className="menu__card reveal">
              <div className="menu__card-top">
                <h3 className="menu__card-title">Rose Latte</h3>
                <span className="menu__card-price">$4.90</span>
              </div>
              <p className="menu__card-text">Soft floral notes, creamy body.</p>
            </article>
            <article className="menu__card reveal">
              <div className="menu__card-top">
                <h3 className="menu__card-title">Mocha Drift</h3>
                <span className="menu__card-price">$5.40</span>
              </div>
              <p className="menu__card-text">Chocolate + espresso, silky finish.</p>
            </article>
            <article className="menu__card reveal">
              <div className="menu__card-top">
                <h3 className="menu__card-title">Cold Brew</h3>
                <span className="menu__card-price">$4.50</span>
              </div>
              <p className="menu__card-text">Clean, bright, extra smooth.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="services__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Services</h2>
            <p className="section__subtitle reveal">
              Built for business — subscriptions, events, and wholesale.
            </p>
          </div>

          <div className="services__grid">
            <article className="services__card reveal">
              <i className="bx bx-package services__icon" />
              <h3 className="services__title">Weekly Subscription</h3>
              <p className="services__text">Fresh picks delivered on schedule with flexible pauses.</p>
            </article>
            <article className="services__card reveal">
              <i className="bx bx-party services__icon" />
              <h3 className="services__title">Events &amp; Catering</h3>
              <p className="services__text">Pop-up coffee bar with premium presentation and speed.</p>
            </article>
            <article className="services__card reveal">
              <i className="bx bx-store services__icon" />
              <h3 className="services__title">Wholesale Beans</h3>
              <p className="services__text">Consistent roasting for cafés, offices, and shops.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="pricing__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Pricing</h2>
            <p className="section__subtitle reveal">Simple plans. Clear value.</p>
          </div> 

          <div className="pricing__grid">
            <article className="pricing__card reveal">
              <h3 className="pricing__title">Starter</h3>
              <p className="pricing__price">
                <span>$</span>19<span className="pricing__per">/mo</span>
              </p>
              <ul className="pricing__list">
                <li>
                  <i className="bx bx-check" /> Weekly pick newsletter
                </li>
                <li>
                  <i className="bx bx-check" /> 1 signature drink
                </li>
                <li>
                  <i className="bx bx-check" /> Basic support
                </li>
              </ul>
              <a href="/#contact" className="pricing__button">
                Choose Starter
              </a> 
            </article>

            <article className="pricing__card pricing__card--featured reveal">
              <div className="pricing__badge">Best</div>
              <h3 className="pricing__title">Pro</h3>
              <p className="pricing__price">
                <span>$</span>49<span className="pricing__per">/mo</span>
              </p>
              <ul className="pricing__list">
                <li>
                  <i className="bx bx-check" /> Weekly subscription box
                </li>
                <li>
                  <i className="bx bx-check" /> 3 drinks + beans
                </li>
                <li>
                  <i className="bx bx-check" /> Priority support
                </li>
              </ul>
              <a href="/#contact" className="pricing__button">
                Choose Pro
              </a>
            </article>

            <article className="pricing__card reveal">
              <h3 className="pricing__title">Business</h3>
              <p className="pricing__price">
                <span>$</span>99<span className="pricing__per">/mo</span>
              </p>
              <ul className="pricing__list">
                <li>
                  <i className="bx bx-check" /> Wholesale rates
                </li>
                <li>
                  <i className="bx bx-check" /> Office delivery
                </li>
                <li>
                  <i className="bx bx-check" /> Dedicated manager
                </li>
              </ul>
              <a href="/#contact" className="pricing__button">
                Talk to Sales 
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="section portfolio" id="portfolio">
        <div className="portfolio__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Portfolio</h2>
            <p className="section__subtitle reveal">
              Projects We’re Proud Of. Take a look at some of our successful projects — each one is a
              success story.
            </p> 
          </div> 

          <div className="iso-filters reveal" aria-label="Portfolio filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                data-filter={f.id}
                type="button"
                className={`iso-filter-btn ${portfolioFilter === f.id ? 'iso-filter-active' : ''}`}
                onClick={() => setPortfolioFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="iso-slider-outer reveal">
          <Swiper
            className="iso-swiper"
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop={false}
            speed={700}
            autoplay={{
              delay: 3800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 28,
              stretch: 0,
              depth: 180,
              modifier: 1.3,
              slideShadows: true,
            }}
            pagination={{ el: '.iso-pagi', clickable: true }}
            navigation={{ nextEl: '.iso-btn-next', prevEl: '.iso-btn-prev' }}
          >
            {filteredPortfolio.map((p) => (
              <SwiperSlide key={`${portfolioFilter}-${p.title}`} className="iso-slide" data-cat={p.cat}>
                <div className="iso-card">
                  <div className="iso-stripe" style={{ background: p.color }} />
                  <div className="iso-screen">
                    <img src={p.img} alt={p.title} loading="lazy" className="iso-img" />
                    <div className="iso-glare" />
                  </div>
                  <div className="iso-body">
                    <div className="iso-tags">
                      {p.tags.map((t) => (
                        <span key={t} className="iso-tag" style={{ background: `${p.color}cc` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="iso-title">{p.title}</h3>
                    <p className="iso-desc">{p.desc}</p>
                    <a href={p.url} className="iso-link">
                      View Project <i className="bx bx-right-arrow-alt" />
                    </a>
                  </div>
                  <div className="iso-glow" style={{ background: p.color }} />
                </div>
              </SwiperSlide>
            ))}

            {/* external pagination is in the markup below */}
          </Swiper>

          <div className="iso-pagi swiper-pagination" />

          <button className="iso-btn-prev" type="button" aria-label="Previous slide">
            <i className="bx bx-chevron-right" />
          </button>
          <button className="iso-btn-next" type="button" aria-label="Next slide">
            <i className="bx bx-chevron-left" />
          </button>
        </div>
      </section>

      <section className="section testimonials" id="testimonials">
        <div className="testimonials__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Testimonials</h2>
            <p className="section__subtitle reveal">Short words. Strong proof.</p>
          </div>

          <div className="testimonials__grid">
            <article className="testimonials__card reveal">
              <p className="testimonials__quote">
                “Looks premium, tastes even better. The smoothest latte.”
              </p>
              <span className="testimonials__name">— Amina</span> 
            </article>
            <article className="testimonials__card reveal">
              <p className="testimonials__quote">“Perfect balance. I love the clean design and animations.”</p>
              <span className="testimonials__name">— Hamza</span>
            </article>
            <article className="testimonials__card reveal">
              <p className="testimonials__quote">“Weekly pick is always a win. Simple and beautiful.”</p>
              <span className="testimonials__name">— Sana</span>
            </article>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__container bd-grid">
          <div className="cta__card reveal">
            <div className="cta__text">
              <h2 className="cta__title">Ready to serve better coffee?</h2>
              <p className="cta__subtitle">Get a weekly plan or a business quote in minutes.</p>
            </div>
            <a href="/#contact" className="cta__button">
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats__container bd-grid">
          <div className="stats__grid">
            <div className="stats__item reveal">
              <span className="stats__number">12+</span>
              <span className="stats__label">Origins</span>
            </div>
            <div className="stats__item reveal">
              <span className="stats__number">4.9</span>
              <span className="stats__label">Rating</span>
            </div>
            <div className="stats__item reveal">
              <span className="stats__number">30m</span>
              <span className="stats__label">Roast time</span>
            </div>
            <div className="stats__item reveal">
              <span className="stats__number">7</span>
              <span className="stats__label">Days fresh</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section how" id="how">
        <div className="how__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">How it works</h2>
            <p className="section__subtitle reveal">Three simple steps — order, brew, enjoy.</p>
          </div>

          <div className="how__grid"> 
            <article className="how__card reveal">
              <span className="how__step">01</span>
              <h3 className="how__title">Pick a drink</h3>
              <p className="how__text">Choose your style from a slim curated menu.</p>
            </article>
            <article className="how__card reveal">
              <span className="how__step">02</span>
              <h3 className="how__title">We brew fresh</h3>
              <p className="how__text">Balanced recipes, consistent taste, every time.</p>
            </article>
            <article className="how__card reveal">
              <span className="how__step">03</span>
              <h3 className="how__title">Enjoy in minutes</h3>
              <p className="how__text">Serve is fast — quality stays premium.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section gallery" id="gallery">
        <div className="gallery__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Gallery</h2>
            <p className="section__subtitle reveal">A quick look at the vibe.</p>
          </div>

          <div className="gallery__grid">
            {['img1', 'img2', 'img3', 'img4', 'img5', 'img6'].map((x) => (
              <div key={x} className="gallery__item reveal">
                <img src={`/assets/img/${x}.png`} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="faq__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">FAQ</h2>
            <p className="section__subtitle reveal">Quick answers, no clutter.</p>
          </div>

          <div className="faq__grid">
            <details className="faq__item reveal">
              <summary className="faq__question">Do you have dairy-free options?</summary>
              <p className="faq__answer">Yes — oat and almond are available for most drinks.</p>
            </details>
            <details className="faq__item reveal">
              <summary className="faq__question">What’s the “weekly pick”?</summary>
              <p className="faq__answer">A highlighted drink based on the roast and season.</p>
            </details>
            <details className="faq__item reveal">
              <summary className="faq__question">How fast is delivery?</summary>
              <p className="faq__answer">Usually within 20–35 minutes depending on your area.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="section location" id="location">
        <div className="location__container bd-grid">
          <div className="section__head">
            <h2 className="section__title reveal">Visit us</h2>
            <p className="section__subtitle reveal">Good coffee, calm space.</p>
          </div>

          <div className="location__grid">
            <div className="location__card reveal">
              <h3 className="location__title">Hours</h3>
              <p className="location__text">Mon–Fri: 8:00–20:00</p>
              <p className="location__text">Sat–Sun: 9:00–22:00</p>
            </div>
            <div className="location__card reveal">
              <h3 className="location__title">Address</h3>
              <p className="location__text">Coffee Street 12, Downtown</p>
              <p className="location__text">Open for pickup &amp; delivery</p>
            </div>
            <div className="location__card reveal">
              <h3 className="location__title">Contact</h3>
              <p className="location__text">+93 793237732</p> 
              <p className="location__text">khalidafghanmal2003@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="contact__container bd-grid">
          <div className="contact__data">
            <h2 className="contact__title reveal">Get weekly picks</h2>
            <p className="contact__description reveal">One email per week. No spam.</p>

            <form className="contact__form reveal" action="#" autoComplete="on" onSubmit={onContactSubmit}>
              <input className="contact__input" type="text" name="name" placeholder="Your name" required />
              <input
                className="contact__input"
                type="email"
                name="email"
                placeholder="Email address"
                required
              />
              <select className="contact__input" name="topic" required defaultValue="">
                <option value="" disabled>
                  What do you need? 
                </option>
                <option value="subscription">Subscription</option>
                <option value="events">Events &amp; Catering</option>
                <option value="wholesale">Wholesale</option>
              </select>
              <button className="contact__button" type="submit">
                Notify me 
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
} 

