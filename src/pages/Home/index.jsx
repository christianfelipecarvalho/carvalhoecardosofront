
import { useNavigate } from 'react-router-dom';
import imagem3d1 from '../../assets/3d 1.jpg';
import imagem3d2 from '../../assets/3d 2.jpg';
import frente from '../../assets/primeiraeditada.jpeg';
import '../Home/Home.css';

function Home() {
  const navigate = useNavigate();

 
  function handleClickSobre() {
    navigate('/sobrenos'); // Redireciona para a página '/sobre'
  }
  return (
    <>
      <h1 className='titulo-cec'>Carvalho & Cardoso</h1>
      <button className='botao' onClick={handleClickSobre}>Sobre nós</button>
      <img  className='imagem1' src={frente} alt="Logo" />
      <img  className='imagem1' src={imagem3d1} alt="Logo" />
      <img  className='imagem1' src={imagem3d2} alt="Logo" />
      {/* <img  className='imagem4' src={frente} alt="Logo" />
      <img  className='imagem5' src={frente} alt="Logo" />
      <img  className='imagem6' src={frente} alt="Logo" /> */}
    </>
  );
}

export default Home;