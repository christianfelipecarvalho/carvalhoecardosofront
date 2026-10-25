import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import logo from '../../assets/LOGO.png';
export default function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const close = event => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header"><Link className="brand" to="/" aria-label="Carvalho e Cardoso, início"><span className="brand-symbol"><img src={logo} alt="" /></span><span>CARVALHO & CARDOSO<small>ENGENHEIROS ASSOCIADOS</small></span></Link><button ref={button} className="menu-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav onClick={event => {
      if (event.target.closest('a')) setOpen(false);
    }} id="main-navigation" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navegação principal">{[['/', 'Início'], ['/sobrenos', 'O escritório'], ['/servicos', 'Soluções'], ['/projetos', 'Projetos'], ['/clientes', 'Clientes']].map(([path, label]) => <NavLink key={path} to={path} end>{label}</NavLink>)}<Link to="/contato" className="button button-small">Vamos conversar <ArrowUpRight size={16} /></Link></nav></header>;
}
