import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { serviceDetails } from '../../data/serviceDetails';
import './ServiceDetails.css';

export default function DetalheServico() {
  const { slug } = useParams();
  const service = serviceDetails.find(item => item.slug === slug);
  if (!service) return <section className="section-wrap page-intro"><span className="eyebrow">Serviço não encontrado</span><h1>Encontre a solução<br />para seu projeto.</h1><Link className="text-link" to="/servicos"><ArrowLeft size={18} /> Conheça nossos serviços</Link></section>;
  const contactUrl = `/contato?servico=${encodeURIComponent(service.category)}&mensagem=${encodeURIComponent(`Olá! Gostaria de conversar sobre ${service.title.toLowerCase()} para meu projeto.`)}`;
  const related = service.relatedSlugs.map(relatedSlug => serviceDetails.find(item => item.slug === relatedSlug)).filter(Boolean);

  return <div className="service-page">
    <section className="section-wrap service-page-intro">
      <nav className="service-breadcrumbs" aria-label="Caminho de navegação"><Link to="/">Início</Link><ChevronRight size={13} aria-hidden="true" /><Link to="/servicos">Soluções</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">{service.title}</span></nav>
      <span className="eyebrow">{service.category} · Içara / SC</span>
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <Link className="button" to={contactUrl}>Conversar sobre este serviço <ArrowUpRight size={18} /></Link>
    </section>
    <section className="section-wrap service-overview" aria-labelledby="service-understand">
      <div><span className="eyebrow">Entenda a solução</span><h2 id="service-understand">O que é e como<br />podemos ajudar.</h2><p>{service.intro}</p><p>A Carvalho & Cardoso é um escritório de engenharia e arquitetura em Içara, Santa Catarina. O primeiro contato ajuda a entender as características do seu empreendimento e a definir o escopo técnico adequado.</p></div>
      <figure><img src={service.image} alt={`Registro do acervo técnico: ${service.title}`} loading="lazy" /><figcaption>Imagem do acervo Carvalho & Cardoso.</figcaption></figure>
    </section>
    <section className="section-wrap service-deliverables" aria-labelledby="service-scope"><div><span className="eyebrow">Do estudo ao detalhamento</span><h2 id="service-scope">O que o trabalho<br />pode contemplar.</h2><p>Os documentos, etapas e responsabilidades são definidos na proposta, conforme as necessidades do seu projeto.</p></div><ul>{service.deliverables.map(item => <li key={item}><Check size={19} aria-hidden="true" /><span>{item}</span></li>)}</ul></section>
    <section className="section-wrap service-faq" aria-labelledby="service-questions"><span className="eyebrow">Informação para decidir</span><h2 id="service-questions">Perguntas frequentes.</h2><div>{service.faq.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div></section>
    <section className="section-wrap service-related" aria-labelledby="service-related"><div className="section-heading"><div><span className="eyebrow">Disciplinas que se conectam</span><h2 id="service-related">Soluções relacionadas.</h2></div><Link className="text-link" to="/servicos">Todos os serviços <ArrowUpRight size={18} /></Link></div><div className="service-related-grid">{related.map(item => <Link key={item.slug} to={`/servicos/${item.slug}`}><span>{item.category}</span><h3>{item.title}</h3><ArrowUpRight size={23} /></Link>)}</div></section>
    <section className="contact-banner"><div><span className="eyebrow">Vamos entender seu projeto</span><h2>Clareza técnica.<br />Desde a primeira conversa.</h2></div><Link className="button" to={contactUrl}>Fale com nossa equipe <ArrowUpRight size={18} /></Link></section>
  </div>;
}
