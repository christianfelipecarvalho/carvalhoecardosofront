import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { services as engineeringServices } from '../../data/content';
import { ArrowUpRight, CheckCircle2, Mail, MapPin } from 'lucide-react';
import './Contato.css';
import WhatsAppIcon from '../../components/WhatsAppIcon';

const services = [...engineeringServices.map(service => service.title), 'Quero conversar sobre meu projeto'];

export default function Contato() {
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [params] = useSearchParams();
  const initialService = services.includes(params.get('servico')) ? params.get('servico') : '';

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get('message')).trim()) {
      event.currentTarget.elements.message.setCustomValidity('Conte um pouco sobre seu projeto.');
      event.currentTarget.reportValidity();
      return;
    }
    const message = `Olá, Carvalho & Cardoso! Meu nome é ${data.get('name').trim()}.\nE-mail: ${data.get('email').trim()}\nInteresse: ${data.get('service')}\n\n${data.get('message').trim()}`;
    setWhatsappUrl(`https://api.whatsapp.com/send?phone=554896250883&text=${encodeURIComponent(message)}`);
  }

  return (
    <div className="contact-page">
      <section className="contact-intro">
        <span className="contact-eyebrow"><span /> CONVERSAS QUE CONSTROEM</span>
        <h1>Vamos tirar seu<br />projeto <em>do papel.</em></h1>
        <p>Uma ideia, um terreno ou um novo desafio. Conte com a nossa equipe para pensar no próximo passo.</p>
      </section>

      <section className="contact-grid" aria-label="Fale com nossa equipe">
        <div className="contact-details">
          <span className="contact-number">01 / PRIMEIRO CONTATO</span>
          <h2>Todo bom projeto começa com uma conversa.</h2>
          <p>Conte um pouco sobre o que você precisa. Vamos entender seu momento e conversar sobre as soluções para o seu projeto.</p>
          <div className="contact-links">
            <a href="https://api.whatsapp.com/send?phone=554896250883" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /><span><small>VAMOS CONVERSAR</small>Fale pelo WhatsApp</span><ArrowUpRight size={19} /></a>
            <a href="mailto:adm@carvalhoecardoso.com"><Mail size={22} /><span><small>PREFERE ESCREVER?</small>adm@carvalhoecardoso.com</span><ArrowUpRight size={19} /></a>
            <a href="https://www.google.com/maps/search/?api=1&query=Carvalho+e+Cardoso+Engenheiros+Associados+I%C3%A7ara" target="_blank" rel="noopener noreferrer"><MapPin size={23} /><span><small>NOSSO ESCRITÓRIO</small>Rua Coronel Marcos Rovaris, 184<br />Sala 203, Edifício Cicollo Della Bruna<br />Centro · Içara, Santa Catarina</span><ArrowUpRight size={19} /></a>
          </div>
          <div className="contact-social"><a href="https://www.instagram.com/carvalhoecardoso/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/company/carvalho-e-cardoso/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="https://www.facebook.com/carvalhoecardoso" target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={14} /></a></div>
        </div>

        <div className="contact-form-panel">
          <span className="contact-number">02 / SOBRE O SEU PROJETO</span>
          <form onSubmit={handleSubmit} onChange={(event) => { setWhatsappUrl(''); event.target.setCustomValidity?.(''); }}>
            <div className="contact-fields-row">
              <label htmlFor="contact-name">Seu nome<input id="contact-name" name="name" autoComplete="name" placeholder="Como podemos chamar você?" required maxLength={100} pattern=".*\S.*" /></label>
              <label htmlFor="contact-email">Seu e-mail<input id="contact-email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" required maxLength={254} /></label>
            </div>
            <label htmlFor="contact-service">O que você tem em mente?<select id="contact-service" name="service" defaultValue={initialService} required><option value="" disabled>Selecione uma especialidade</option>{services.map(service => <option key={service}>{service}</option>)}</select></label>
            <label htmlFor="contact-message">Conte um pouco sobre seu projeto<textarea id="contact-message" name="message" placeholder="Onde será o projeto? Em que etapa você está? Quais são suas ideias?" rows={5} required maxLength={3000} /></label>
            <button className="contact-submit" type="submit">Preparar minha mensagem <ArrowUpRight size={20} /></button>
            <p className="contact-form-note">Você revisa e envia a mensagem no WhatsApp. Nada é enviado automaticamente.</p>
            {whatsappUrl && <div className="contact-success" role="status"><CheckCircle2 size={22} /><div><strong>Sua mensagem está pronta.</strong><p>Continue para revisar e enviar à nossa equipe.</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp <ArrowUpRight size={17} /></a></div></div>}
          </form>
        </div>
      </section>
      <div className="contact-closing"><span>IDEIAS ENCONTRAM ESTRUTURA.</span><span>CARVALHO & CARDOSO <span aria-hidden="true">↗</span></span></div>
    </div>
  );
}
