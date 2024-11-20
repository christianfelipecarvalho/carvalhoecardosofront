
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagem3d1 from '../../assets/3d 1.jpg';
import imagem3d2 from '../../assets/3d 2.jpg';
import imagemDIEGO1 from '../../assets/DIEGO-1.jpg';
import imagemDUDA1 from '../../assets/DUDA-1.jpg';
import frente from '../../assets/primeiraeditada.jpeg';
import '../Home/Home.css';

function Home() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  function handleClickSobre() {
    navigate('/sobrenos'); // Redireciona para a página '/sobre'
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(prev => !prev); // Alterna entre fade-in e fade-out
    }, 6000); // Troca a cada 6 segundos
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div className='div-geral'>
      <div className='div-container1'>
        <div className='botao-e-nome'>
          <h1 className={`titulo-cec ${fade ? 'fade-in' : 'fade-out'}`}>Carvalho & Cardoso</h1>
          <p className={`subtitulo-cec ${fade ? 'fade-in' : 'fade-out'}`}>Criando espaços que contam historias</p>
          <button className={`botao ${fade ? 'fade-in' : 'fade-out'}`} onClick={handleClickSobre}>Sobre nós</button>
        </div>
        <img className='imagem1' src={frente} alt="Logo" />

      </div>
      <div className='div-container2'>
        <img className='imagem1' src={imagem3d1} alt="Logo" />

      </div>
      <div className='div-container3'>
        <img className='imagem1' src={imagem3d2} alt="Logo" />

      </div>
      <div className='div-container4'>
      <img className='imagem1' src={imagemDIEGO1} alt="Logo" />
      </div>
      <div className='div-container5'>
      <img className='imagem1' src={imagemDUDA1} alt="Logo" />

      </div>
      {/* <img  className='imagem4' src={frente} alt="Logo" />
      <img  className='imagem5' src={frente} alt="Logo" />
      <img  className='imagem6' src={frente} alt="Logo" /> */}
    </div>
  );
}

export default Home;