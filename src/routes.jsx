import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import WhatsAppIcon from './components/WhatsAppIcon';
import Footer from './components/Footer';
import Header from './components/Header';
import Clientes from './pages/Clientes';
import Contato from './pages/Contato';
import Home from './pages/Home';
import Servicos from './pages/Servicos';
import SobreNos from './pages/SobreNos';
import Projetos from './pages/Projetos';
import DetalheServico from './pages/Servicos/DetalheServico';
import Seo from './components/Seo';
function PageTransition({ children }) {
  const { pathname } = useLocation();
  return <div key={pathname} className="page-transition">{children}</div>;
}
function NavigationEffects() {
  const {
    pathname,
    hash
  } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  useEffect(() => {
    const targets = [...document.querySelectorAll('#conteudo .section-wrap > *, #conteudo .contact-banner, #conteudo .service-preview, #conteudo .project-card, #conteudo .team-member, #conteudo .process-grid > div, #conteudo .service-detail, #conteudo .client-grid > div')];
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
export default function RoutesApp() {
  return <BrowserRouter><NavigationEffects /><Seo /><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header /><main id="conteudo"><PageTransition><Routes><Route path="/" element={<Home />} /><Route path="/home" element={<Home />} /><Route path="/sobrenos" element={<SobreNos />} /><Route path="/servicos" element={<Servicos />} /><Route path="/servicos/:slug" element={<DetalheServico />} /><Route path="/projetos" element={<Projetos />} /><Route path="/clientes" element={<Clientes />} /><Route path="/contato" element={<Contato />} /><Route path="*" element={<section className="page-intro section-wrap not-found"><span className="eyebrow">Página não encontrada</span><h1>Vamos voltar<br />ao ponto de partida.</h1><Link className="button" to="/">Voltar ao início</Link></section>} /></Routes></PageTransition></main><Footer /><a className="floating-contact" href="https://api.whatsapp.com/send?phone=554896250883" target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp"><WhatsAppIcon /><span>WhatsApp</span></a></BrowserRouter>;
}
