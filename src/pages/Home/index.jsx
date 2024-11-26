
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemDIEGO1 from '../../assets/DIEGO-1.jpg';
import imagemDUDA1 from '../../assets/DUDA-1.jpg';
import imagem3d1 from '../../assets/imagem1.jpg';
import imagem3d2 from '../../assets/imagem22.jpg';
import frente from '../../assets/primeiraeditada.jpeg';
import '../Home/Home.css';

function Home() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  function handleClickSobre() {
    navigate('/sobrenos'); // Redireciona para a página '/sobre'
  }
  function handleClickProjetos() {
    navigate('/servicos'); // Redireciona para a página '/servicos'
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible-card');
            observer.unobserve(entry.target); // Para evitar animar novamente
          }
        });
      },
      { threshold: 0.1 } // Percentual de visibilidade do elemento para ativar a animação
    );

    const hiddenElements = document.querySelectorAll('.hidden-card');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect(); // Cleanup ao desmontar o componente
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(prev => !prev); // Alterna entre fade-in e fade-out
    }, 6000); // Troca a cada 6 segundos
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div className='div-geral'>
      <div className='div-container1 hidden-card'>
        <div className='botao-e-nome'>
          <h1 className={`titulo-cec ${fade ? 'fade-in' : 'fade-out'}`}>Carvalho & Cardoso</h1>
          <p className={`subtitulo-cec ${fade ? 'fade-in' : 'fade-out'}`}>Criando espaços que contam historias</p>
          <button className={`botao ${fade ? 'fade-in' : 'fade-out'}`} onClick={handleClickSobre}>Sobre nós</button>
        </div>
        <img className='imagem1' src={frente} alt="Logo" />

      </div>
      <div className='div-container2 hidden-card'>
        <h1 className='titulo2'>ARQUITETURA</h1>
        <p className='subtitulo2'>Contamos com uma equipe de arquitetos, engenheiros e designers para executar projetos com o máximo de detalhamento possivel.</p>
        <button className='botao2' onClick={handleClickProjetos}>Projetos</button>
        <img className='imagem1' src={imagem3d1} alt="Logo" />

      </div>
      <div className='div-container3 hidden-card'>
        <p className='subtitulo3'>Quebramos os limites</p>
        <h1 className='titulo3  '>PROJETE O FUTURO</h1>
        <button className='botao3' onClick={handleClickProjetos}>Ver mais</button>
        <img className='imagem1' src={imagem3d2} alt="Logo" />

      </div>
      <div className='div-container4 hidden-card'>
        <p className='subtitulo4'>LIBERTE A CRIATIVIDADE</p>
        <h1 className='titulo4'>DÊ VIDA ÀS SUAS IDEIAS</h1>
        <button className='botao4' onClick={handleClickProjetos}>Ver mais</button>
        <img className='imagem1' src={imagemDIEGO1} alt="Logo" />
      </div>
      <div className='div-container5 hidden-card'>
      <p className='subtitulo5'>LIDERE O CAMINHO</p>
        <h1 className='titulo5'>INOVE E INSPIRE</h1>
        <button className='botao5' onClick={handleClickProjetos}>Ver mais</button>
        <img className='ultimaImagem' src={imagemDUDA1} alt="Logo" />
      </div>
    </div>
  );
}

export default Home;