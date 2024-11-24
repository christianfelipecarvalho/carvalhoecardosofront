import { Link } from 'react-router-dom';
import facebookIcon from '../../assets/facebook2.svg';
import instagramIcon from '../../assets/instagram2.svg';
import linkedinIcon from '../../assets/linkedin2.svg';
import whatsappIcon from '../../assets/whatsapp2.svg';
import './Footer.css';

function Header() {
    return (
        <footer className='footersite'>
            <div className='geral'>
                <div className='horario-endereco'>
                    <div className='div-horario'>
                        <h3 className='horariotitulo'>Horário de funcionamento:</h3>
                        <p className='horario'>Segunda a Sexta: 08:00 às 18:00h</p>
                    </div>
                    <div className='div-endereco'>
                        <h3 className='enderecotitulo'>Endereço:</h3>
                        <p className='endereco'> Rua Coronel Marcos Rovaris, 184, Centro / Sala 203, Edificio Cicollo Della Bruna</p>
                        <p className='endereco'>Içara - Santa Catarina</p>
                    </div>
                </div>
                <div className='div-footer'>
                    <h2 className='link-footer'>Acesse também</h2>
                    <Link className='link-footer' to="/sobrenos">Sobre nós</Link>
                    <Link className='link-footer' to="/servicos">Serviços</Link>
                    <Link className='link-footer' to="/clientes">Clientes</Link>
                    <Link className='link-footer' to="/contato">Contatos</Link>
                </div>
                <div className='rodape'>
                    <p className='desenvolvimento'>Desenvolvido por: <a className='no-style' href="https://www.linkedin.com/in/christian-felipe-carvalho-744b91150/" target="_blank"> Christian Felipe Carvalho - © {new Date().getFullYear()} Carvalho & Cardoso Engenheiros associados. Todos os direitos reservados.</a></p>
                    <div className="social-icons">
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
                        {/* <a href="https://api.whatsapp.com/send?1=pt_BR&phone=554896250883" target="_blank" rel="noopener noreferrer">
                            <img src={emailIcon} alt="email" className="social-icon-email" />
                        </a> */}
                    </div>
                </div>
            </div>

        </footer>
    );
}
export default Header;