import { ArrowUpRight, Compass, Layers3, Cable, Flame, HardHat, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../data/content';
import { serviceDetails } from '../../data/serviceDetails';
import './ServiceDetails.css';

export default function Servicos() {
  const icons = [Compass, Layers3, Cable, Flame, HardHat, ClipboardCheck];
  const ppci = serviceDetails[0];
  return <div className="inner-page"><section className="page-intro section-wrap"><span className="eyebrow">Soluções integradas</span><h1>Engenharia em cada detalhe.<br />Visão do todo.</h1><p>Da concepção à execução, conectamos as especialidades necessárias para dar ao seu projeto uma base sólida. Conheça os serviços de engenharia e arquitetura da Carvalho & Cardoso, em Içara, Santa Catarina.</p></section>
    <section className="section-wrap services-spotlight"><div><span className="eyebrow">Segurança desde o projeto</span><h2>Prevenção contra incêndio.<br />Um olhar para cada risco.</h2><p>O PPCI reúne as medidas e os sistemas preventivos necessários à edificação, de acordo com seu uso e suas características. Entenda o projeto, o dimensionamento e a integração das soluções.</p><Link className="button" to={`/servicos/${ppci.slug}`}>Conheça o projeto PPCI <ArrowUpRight size={18} /></Link></div><img src={ppci.image} alt="Imagem de projeto preventivo contra incêndio do acervo Carvalho & Cardoso" loading="lazy" /></section>
    <section className="services-list section-wrap" aria-label="Todas as especialidades">{services.map((service, i) => {
      const Icon = icons[i];
      const details = serviceDetails.filter(item => item.category === service.title);
      return <article id={`servico-${i}`} className="service-detail" key={service.title}><Icon size={36} strokeWidth={1.2} /><div><h2>{service.title}</h2><p>{service.text}</p><p>{service.details}</p><ul className="service-directory">{details.map(item => <li key={item.slug}><Link to={`/servicos/${item.slug}`}>{item.title}<ArrowUpRight size={16} /></Link></li>)}</ul></div><Link to={`/contato?servico=${encodeURIComponent(service.title)}`} className="text-link">Conversar sobre esta solução <ArrowUpRight size={18} /></Link></article>;
    })}</section><section className="contact-banner"><h2>Não sabe por<br />onde começar?</h2><Link to="/contato" className="button">Conte sua ideia <ArrowUpRight /></Link></section></div>;
}
