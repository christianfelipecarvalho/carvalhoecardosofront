import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { projects } from '../../data/content';
export default function Projetos() {
  const [filter, setFilter] = useState('Todos');
  const [params, setParams] = useSearchParams();
  const selected = params.get('projeto');
  const details = useRef(null);
  useEffect(() => {
    if (selected !== null) details.current?.focus({
      preventScroll: true
    });
  }, [selected]);
  const project = selected !== null ? projects[Number(selected)] : null;
  return <div className="inner-page"><section className="page-intro section-wrap"><span className="eyebrow">Projetos e estudos</span><h1>Ideias com forma.<br />Espaços com propósito.</h1><p>Uma seleção de imagens do nosso acervo de arquitetura, engenharia e acompanhamento de obras.</p></section><section className="section-wrap portfolio"><div className="filter-bar" aria-label="Filtrar projetos">{['Todos', 'Residencial', 'Engenharia', 'Obras'].map(category => <button className={filter === category ? 'selected' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)} key={category}>{category}</button>)}</div>{project && <article ref={details} tabIndex={-1} className="project-expanded" aria-label="Detalhes do projeto"><button className="close-project" onClick={() => setParams({})} aria-label="Fechar detalhes"><X /></button><img src={project.image} alt={project.title} /><div><span className="eyebrow">{project.service}</span><h2>{project.title}</h2><p>{project.text}</p><Link to="/contato" className="text-link">Quero conversar sobre meu projeto <ArrowUpRight /></Link></div></article>}<div className="portfolio-grid">{projects.map((p, i) => ({
          ...p,
          index: i
        })).filter(p => filter === 'Todos' || p.category === filter).map(p => <button className="project-card" key={p.title} onClick={() => {
          setParams({
            projeto: p.index
          });
          window.scrollTo({
            top: 280,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
          });
        }}><div className="project-image"><img src={p.image} alt={p.title} loading="lazy" /><span className="round-arrow"><ArrowUpRight /></span><span className="image-tag">{p.category}</span></div><div className="project-caption"><h3>{p.title}</h3><span>{p.service}</span></div></button>)}</div></section></div>;
}
