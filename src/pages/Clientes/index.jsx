import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
const assets = import.meta.glob('../../assets/clientes/*', {
  eager: true,
  query: '?url',
  import: 'default'
});
const clients = [['librelato.png', 'Librelato'], ['copaza.png', 'Copaza'], ['budny.png', 'Budny'], ['nacoesshopping.png', 'Nações Shopping'], ['poligres.png', 'Poligres'], ['sicoob.jpg', 'Sicoob'], ['atacadao.jpg', 'Atacadão'], ['moniari.png', 'Moniari'], ['racli.png', 'Racli'], ['bombeiros.jpg', 'Corpo de Bombeiros'], ['prefeituracriciuma.png', 'Prefeitura de Criciúma'], ['abimar.jpg', 'Abimar'], ['baldissera (2).jpg', 'Baldissera'], ['cromo.jpg', 'Cromo'], ['darabas.png', 'Darabas'], ['floorenca.png', 'Floorença'], ['goulart.png', 'Goulart'], ['hidramaco.png', 'Hidramaço'], ['ideal.jpg', 'Ideal'], ['imbraforte.jpg', 'Imbraforte'], ['jj.jpg', 'JJ'], ['mep.jpg', 'MEP'], ['mury.jpg', 'Mury'], ['negoautomoveis.png', 'Nego Automóveis'], ['pficara.jpg', 'PF Içara'], ['pop.jpg', 'POP'], ['sulpiso.png', 'Sulpiso'], ['suprema.jpg', 'Suprema'], ['tca.png', 'TCA'], ['volpan.jpg', 'Volpan']];
export default function Clientes() {
  return <div className="inner-page"><section className="page-intro section-wrap"><span className="eyebrow">Clientes e parceiros</span><h1>Confiança também<br />é uma construção.</h1><p>Empresas e instituições que fazem parte da trajetória da Carvalho & Cardoso.</p></section><section className="client-grid section-wrap" aria-label="Clientes e parceiros">{clients.map(([file, name]) => <div key={file}><img src={assets[`../../assets/clientes/${file}`]} alt={name} loading="lazy" /><span>{name}</span></div>)}</section><section className="contact-banner"><h2>Vamos construir<br />a próxima parceria?</h2><Link to="/contato" className="button">Fale com a gente <ArrowUpRight /></Link></section></div>;
}
