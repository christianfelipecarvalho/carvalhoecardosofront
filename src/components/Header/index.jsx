import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="headersite">
      {/* Logo */}
      <Link className="logo-container" to="/home">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      {/* Menu */}
      <nav className={`menu ${menuOpen ? 'open' : ''}`}>
        <Link className="link" to="/sobrenos">SOBRE NÓS</Link>
        <Link className="link" to="/servicos">SERVIÇOS</Link>
        <Link className="link" to="/clientes">CLIENTES</Link>
        <Link className="link" to="/contato">CONTATOS</Link>
      </nav>

      {/* Botão toggle do menu para telas menores */}
      <button className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </button>
    </header>
  );
}

export default Header;
