import { Link } from 'react-router-dom';
import './Footer.css';

function Header() {
    return (
        <footer className='footersite'>
            <div className='div-footer'>
                <h2 className='link-footer'>Acesse também</h2>
                <Link className='link-footer' to="/sobrenos">Sobre nós</Link>
                <Link className='link-footer' to="/servicos">Serviços</Link>
                <Link className='link-footer' to="/clientes">Clientes</Link>
                <Link className='link-footer' to="/contato">Contatos</Link>
            </div>
            <p className='desenvolvimento'>Desenvolvido por: <a className='no-style' href="https://www.linkedin.com/in/christian-felipe-carvalho-744b91150/" target="_blank"> Christian Felipe Carvalho</a></p>
            <p className='desenvolvimento'>© {new Date().getFullYear()} Carvalho & Cardoso Engenheiros associados. Todos os direitos reservados.</p>
        </footer>
    );
}
export default Header;