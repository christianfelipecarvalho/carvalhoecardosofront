import { Mail, Phone } from 'lucide-react';
import React, { useState } from 'react';
import facebookIcon from '../../assets/facebook2.svg';
import instagramIcon from '../../assets/instagram2.svg';
import linkedinIcon from '../../assets/linkedin2.svg';
import whatsappIcon from '../../assets/whatsapp2.svg';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import './Contato.css';

function Contato() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se o campo de email e mensagem não estão vazios
    if (!email.trim()) {
      setStatusMessage('Por favor, preencha seu e-mail.');
      return;
    }

    if (!message.trim()) {
      setStatusMessage('Por favor, digite uma mensagem.');
      return;
    }

    // URL do WhatsApp com a mensagem e o e-mail
    const whatsappMessage = `O email ${email} deseja entrar em contato.\nMensagem: ${message}`;
    const whatsappURL = `https://api.whatsapp.com/send?phone=554896250883&text=${encodeURIComponent(whatsappMessage)}`;

    // Abre o WhatsApp com a mensagem
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className='div-geral-contato'>
      <div className='conteudo-contato'>

        <h1 className="text-3xl font-bold mb-6">Entre em Contato</h1>
        <br />
        <div className="contato-grid">
          <div className="contato-info">
            <form className='forms-email' onSubmit={handleSubmit}>
              <Label className='email-label' htmlFor="email">Email</Label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-email"
                required
              />
              <Label className='email-label' htmlFor="message">Sua Mensagem</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                className="input-email"
                required
              />
              <Button type="submit">Enviar</Button>
            </form>

            {/* Mensagem de status */}
            {statusMessage && <p className="status-message">{statusMessage}</p>}

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Redes Sociais</h2>
              <br />
              <div className="social-icons2">
                <a href="https://www.facebook.com/carvalhoecardoso" target="_blank" rel="noopener noreferrer">
                  <img src={facebookIcon} alt="Facebook" className="social-icon" />
                </a>
                <a href="https://www.instagram.com/carvalhoecardoso/" target="_blank" rel="noopener noreferrer">
                  <img src={instagramIcon} alt="Instagram" className="social-icon" />
                </a>
                <a href="https://www.linkedin.com/company/carvalho-e-cardoso/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
                  <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
                </a>
                <a href="https://api.whatsapp.com/send?1=pt_BR&phone=554896250883" target="_blank" rel="noopener noreferrer">
                  <img src={whatsappIcon} alt="WhatsApp" className="social-icon" />
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Contato Direto</h2>
              <br />
              <p><Mail className="inline mr-2" /> adm@carvalhoecardoso.com</p>
              <br />
              <p><Phone className="inline mr-2" /> <a href="https://api.whatsapp.com/send?1=pt_BR&phone=554896250883" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Nosso Endereço</h2>
            <p className="mb-2">Rua Coronel Marcos Rovaris, 184, Centro / Sala 203, Edificio Cicollo Della Bruna - Içara - Santa Catarina</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.3154881720648!2d-49.301958124707916!3d-28.710116175622428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95217fe4fa10b923%3A0xc880a88fb2e6a902!2sCarvalho%20e%20Cardoso%20Engenheiros%20Associados!5e0!3m2!1spt-BR!2sbr!4v1734207880114!5m2!1spt-BR!2sbr"
              className="map-container"
              allowFullScreen
              loading="lazy"
              title="Mapa do endereço"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato;
