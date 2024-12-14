import { useEffect } from 'react';
import bianca from '../../assets/bianca2.jpg';
import equipe from '../../assets/equipe.jpg';
import henrique from '../../assets/henrique2.jpg';
import joao from '../../assets/joao2.jpg';
import laura from '../../assets/laura2.jpg';
import tiago from '../../assets/tiago2.jpg';
import wilian from '../../assets/wilian2.jpg';
import '../SobreNos/SobreNos.css';


function SobreNos() {
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
  return (
    <div className='div-geral'>
      <div className='div-sobrenos-principal hidden-card'>
        <div className='texto-titulo'>
          <h1 className='titulo-principal'>Carvalho & Cardoso</h1>
          <p className='paragrafo-sobrenos'>Nossa empresa possui um profundo know how e atua em diversos segmentos da construção civil, buscando entregar bons resultados e competência no desenvolvimento dos serviços, garantindo a satisfação total dos nossos clientes. Nossa equipe é multidisciplinar e atualizada e procura possibilitar a otimização de materiais, custo, tempo e trabalho na obra.
          A empresa possui corpo técnico e administrativo altamente qualificado, que visa a melhoria contínua de seus processos, gerando soluções diferenciadas aos clientes. Além disso, contamos com engenheiros e peritos especializados em diferentes áreas da engenharia.
          </p>
        </div>
          <div>
            <img className='imgequipe' src={equipe} alt="Logo" />
          </div>
      </div>
      <div className='div-sobrenos1 hidden-card'>
        <div>
          <img className='imgJoao' src={joao} alt="Logo" />
        </div>
        <div className='titulo'>
          <h3>Eng. Civil</h3>
          <h1>João Pedro Felipe Carvalho</h1>
          <p>Formado pela Escola Superior de Criciúma. Especializado em dimensionamento de sistema de chuveiros automáticos (SPK) e sistema hidráulico preventivo (SHP) pelo Instituto Brasileiro de Educação Continuada (INBEC). Eletrotécnico pelo Instituto Federal de Santa Catarina. Possui experiência em elaboração de projeto preventivo contra Incêndio e pânico (PPCI), bem como laudos para o Corpo de Bombeiros.</p>
        </div>

      </div>
      <div className='div-sobrenos2 hidden-card'>
        <div className='titulo-inverso'>
          <h3>Eng. Civil</h3>
          <h1>Henrique Ferreira</h1>
          <p>Formado pelo Centro Universitário Campo Real (Guarapuava/PR), com complementação educacional em Desenvolvimento de Programas para Análise de Sistema. Possui experiência em projetos e detalhamento de estrutura de concreto armado e estrutura metálica, atuante em gerenciamento de obras públicas, com experiência em produção de orçamentos estimativos, cronogramas físico-financeiro, Curva ABC e Composição de benefício e despesas indiretas,  totalizando mais de R$ 35 milhões em projetos gerenciados.</p>
        </div>
        <div className='div-inversa-imagem'>
          <img className='img-inversa' src={henrique} alt="Logo" />
        </div>
      </div>
      <div className='div-sobrenos3 hidden-card'>
        <div>
          <img className='imgJoao' src={wilian} alt="Logo" />
        </div>
        <div className='titulo'>
          <h3>Arquiteto e Urbanista</h3>
          <h1>Willian Martins</h1>
          <p>Formado pela Universidade do Extremo Sul Catarinense UNESC. Técnico em Design pela SATC, possui experiência com a criação e desenvolvimento de projetos arquitetônicos, detalhamento técnico e modelagem 3D. Profissional dedicado e apaixonado pela arquitetura, especializado em projetar espaços funcionais, esteticamente agradáveis.</p>
        </div>
      </div>
      <div className='div-sobrenos4 hidden-card'>
        <div className='titulo-inverso'>
          <h3>Eng. Civil</h3>
          <h1>Tiago Zeferino Borges</h1>
          <p>Formado pela universidade do sul catarinense (UNISUL), com experiência em execução de obras, hoje atua na elaboração projetos hidrossanitários, drenagem, dimensionamento pluvial, e projetos elétricos.</p>
        </div>
        <div className='div-inversa-imagem'>
          <img className='img-inversa' src={tiago} alt="Logo" />
        </div>
      </div>
      <div className='div-sobrenos5 hidden-card'>
        <div>
          <img className='imgJoao' src={bianca} alt="Logo" />
        </div>
        <div className='titulo'>
          <h3>Administração</h3>
          <h1>Bianca Carvalho</h1>
          <p>Formada pelo Senac e possui certificações em Gestão Financeira e Técnicas de Gestão pela Microlins. Atualmente, ocupa a posição de líder no setor financeiro da Carvalho e Cardoso, sendo também responsável pela gestão estratégica de contratos da empresa.</p>
        </div>
      </div>
      <div className='div-sobrenos6 hidden-card'>
        <div className='titulo-inverso'>
          <h3>Eng. Civil</h3>
          <h1>Laura</h1>
          <p>Mestre em Engenharia civil...</p>
        </div>
        <div className='div-inversa-imagem'>
          <img className='img-inversa' src={laura} alt="Logo" />
        </div>
      </div>
    </div>
  );
}

export default SobreNos;