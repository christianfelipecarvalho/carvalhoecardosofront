import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css';

function Header() {
  return (
    <header className='headersite'>
      <Link className='link1' to="/home"><img src={logo} alt="Logo" width={170} /></Link>
      <Link className='link' to="/sobrenos">SOBRE NÓS</Link>
      <Link className='link' to="/servicos">SERVIÇOS</Link>
      <Link className='link' to="/clientes">CLIENTES</Link>
      <Link className='link' to="/contato">CONTATOS</Link>
    </header>
  );
}
export default Header;