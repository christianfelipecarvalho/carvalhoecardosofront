
import d1 from '../../assets/servicos/3dservice.jpg';
import d2 from '../../assets/servicos/3dservice2.jpg';
import arq1 from '../../assets/servicos/arq1.png';
import arq2 from '../../assets/servicos/arq2.png';
import arq3 from '../../assets/servicos/arq3.png';
import arq4 from '../../assets/servicos/arq4.png';
import elet1 from '../../assets/servicos/Elet 1.jpeg';
import est2 from '../../assets/servicos/EST 2.jpeg';
import est4 from '../../assets/servicos/EST 4.jpeg';
import est3 from '../../assets/servicos/EST 5.jpeg';
import est1 from '../../assets/servicos/EST 7.jpeg';
import glp1 from '../../assets/servicos/GLP 1.jpeg';
import glp2 from '../../assets/servicos/GLP 2.jpeg';
import glp3 from '../../assets/servicos/GLP 3.jpeg';
import glp4 from '../../assets/servicos/GLP 4.jpeg';
import hidro1 from '../../assets/servicos/Hidro 2.jpg';
import hidro2 from '../../assets/servicos/Hidro 3.jpg';
import hidro3 from '../../assets/servicos/Hidro 4.jpg';
import hidro4 from '../../assets/servicos/Hidro 5.jpg';
import laudo1 from '../../assets/servicos/laudo.jpeg';
import laudo2 from '../../assets/servicos/laudo2.1.jpeg';
import laudo3 from '../../assets/servicos/laudo3.jpeg';
import laudo4 from '../../assets/servicos/laudo4.jpeg';
import obra1 from '../../assets/servicos/Obra 1.jpeg';
import obra2 from '../../assets/servicos/Obra 2.jpeg';
import ppci1 from '../../assets/servicos/PPCI 1.jpeg';
import ppci2 from '../../assets/servicos/PPCI 2.jpeg';
import ppci3 from '../../assets/servicos/PPCI 3.jpeg';
import ppci4 from '../../assets/servicos/PPCI 4.jpeg';
import shp2 from '../../assets/servicos/SHP 2.jpeg';
import shp3 from '../../assets/servicos/SHP 3.jpeg';
import shp4 from '../../assets/servicos/SHP 4.jpeg';
import shp1 from '../../assets/servicos/SHP 5.jpeg';
import spda from '../../assets/servicos/spda.jpg';
import spk1 from '../../assets/servicos/SPK 1.jpg';
import spk2 from '../../assets/servicos/SPK 2.png';
import spk3 from '../../assets/servicos/SPK 3.jpeg';
import spk4 from '../../assets/servicos/SPK 4.png';
import tanque1 from '../../assets/servicos/Tanque 1.jpeg';
// import ppci5 from '../../assets/servicos/PPCI 5.jpeg';
// import ppci6 from '../../assets/servicos/PPCI 6.jpeg';
import '../Servicos/Servicos.css';

function Servicos() {
  return (
    <div className='div-geral-servicos'>
      <div className='div-container-principal'>
        <div className='cabecalho'></div>
        <div className='tituloprincipal'>
          <h1 className='titulo-servicos2'>Serviços</h1>
        </div>
      </div>
      <div className='div-container-12'>
        <h1>PROJETO PREVENTIVO CONTRA INCÊNDIO (PPCI)</h1>
        <p className='paragrafo'>O projeto preventivo contra incêndio e pânico, comumente chamado de PPCI, detalha as ações e equipamentos adotados em uma edificação para garantir a segurança das pessoas e do empreendimento em caso de incêndios. Este projeto define e dimensiona os sistemas preventivos, necessários para evacuar as pessoas de forma rápida e eficiente e para iniciar o combate ao incêndio. O PPCI é obrigatório para edificações comerciais, industriais, locais com concentração de pessoas e residências multifamiliares.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={ppci1} alt="Logo" />
          <img className='imgs-ppci' src={ppci2} alt="Logo" />
          <img className='imgs-ppci' src={ppci3} alt="Logo" />
          <img className='imgs-ppci' src={ppci4} alt="Logo" />
          {/* <img className='imgs-ppci' src={ppci5} alt="Logo" />
         <img className='imgs-ppci' src={ppci6} alt="Logo" />  */}
        </div>
      </div>
      <div className='div-container-2'>
        <h1>PROJETO DE SPDA</h1>
        <p className='paragrafo'>O projeto de sistema de proteção contra descarga atmosférica, conhecido como projeto de SPDA, é desenvolvido com o intuito de garantir a segurança das edificações contra perturbações geradas no sistema elétrico por descargas atmosféricas (raios), sendo essas diretas ou indiretas. É um projeto essencial para que o imóvel fique livre dos efeitos nocivos das descargas atmosféricas, que podem comprometer seriamente as estruturas por conta de curtos-circuitos e possíveis incêndios.</p>
        <div className='div-ppci'>
          <img className='imgs-spda' src={spda} alt="Logo" />
        </div>
      </div>
      <div className='div-container-3'>
        <h1>PROJETO DE SPRINKLERS</h1>
        <p className='paragrafo'> O projeto e dimensionamento de chuveiros automáticos, também chamado de projeto de sprinklers, tem com finalidade, a partir da mudança de temperatura no ambiente, identificar o princípio de um incêndio e combatê-lo rapidamente. Os sprinklers são equipamentos que ficam posicionados ao teto e espalham uma quantidade de água necessária em caso de uma emergência.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={spk1} alt="Logo" />
          <img className='imgs-ppci' src={spk2} alt="Logo" />
          <img className='imgs-ppci' src={spk3} alt="Logo" />
          <img className='imgs-ppci' src={spk4} alt="Logo" />
        </div>
      </div>
      <div className='div-container-4'>
        <h1>PROJETO DE GN, GLP e GNV</h1>
        <p className='paragrafo'>O projeto e dimensionamento de gás natural (GN), gás liquefeito de petróleo (GLP) e gás natural veicular (GNV), compreende no levantamento das necessidades do cliente, na análise do local da instalação, na verificação dos pontos de consumo e no dimensionamento das tubulações. Além disso, este projeto engloba o detalhamento da central ou abrigo de gás, quantidade de recipientes e ventilações permanentes necessárias em cozinhas e outros ambientes que utilizam gás.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={glp1} alt="Logo" />
          <img className='imgs-ppci' src={glp2} alt="Logo" />
          <img className='imgs-ppci' src={glp3} alt="Logo" />
          <img className='imgs-ppci' src={glp4} alt="Logo" />
        </div>
      </div>
      <div className='div-container-5'>
        <h1>PROJETO DE TANQUES DE DIESEL</h1>
        <p className='paragrafo'> O projeto de tanques de diesel abrange as instalações de armazenamento e abastecimentos de combustíveis para uso privativo ou postos de combustíveis. Este projeto estabelece e padroniza critérios de concepção, dimensionamento e padrão mínimo de apresentação de projetos de segurança contra incêndios.</p>
        <div className='div-ppci'>
          <img className='imgs-spda' src={tanque1} alt="Logo" />

        </div>
      </div>
      <div className='div-container-6'>
        <h1>PROJETO DE HIDRANTES</h1>
        <p className='paragrafo'>O sistema hidráulico preventivo (SHP) tem por objetivo combater ou conter o incêndio até a chegada do Corpo de Bombeiros. Ele é composto por uma canalização resistente ao fogo, que desloca água de uma reserva técnica de incêndio (RTI), por meio da gravidade ou pela interposição de bombas, até pontos estrategicamente determinados, permitindo o combate ao princípio de incêndio através da abertura de hidrante com emprego de mangueiras e esguichos.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={shp1} alt="Logo" />
          <img className='imgs-ppci' src={shp2} alt="Logo" />
          <img className='imgs-ppci' src={shp3} alt="Logo" />
          <img className='imgs-ppci' src={shp4} alt="Logo" />
        </div>
      </div>
      <div className='div-container-7'>
        <h1>PROJETO ARQUITETÔNICO</h1>
        <p className='paragrafo'> O projeto arquitetônico é o ponto de partida para a concepção de uma edificação. Este projeto leva em consideração todas as necessidades e preferências do cliente, tendo como objetivo, a definição da melhor forma de construir, a organização dos espaços e o posicionamento no terreno. Além disso, o documento é necessário para aprovação e regularização nos órgãos competentes, bem como, serve para orientar o andamento da obra e solucionar qualquer dúvida que possa surgir durante a construção..</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={arq1} alt="Logo" />
          <img className='imgs-ppci' src={arq2} alt="Logo" />
          <img className='imgs-ppci' src={arq3} alt="Logo" />
          <img className='imgs-ppci' src={arq4} alt="Logo" />

        </div>
      </div>
      <div className='div-container-8'>
        <h1>PROJETO ESTRUTURAL</h1>
        <p className='paragrafo'>O projeto estrutural tem foco no dimensionamento e detalhamento dos elementos estruturais (fundação, pilares, vigas e lajes), que têm como objetivo sustentar a edificação, transmitindo as cargas acidentais e permanentes ao solo. A partir da análise do projeto arquitetônico e do estudo das características do solo, é dimensionado todos os elementos de sustentação do imóvel.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={est1} alt="Logo" />
          <img className='imgs-ppci' src={est2} alt="Logo" />
          <img className='imgs-ppci' src={est3} alt="Logo" />
          <img className='imgs-ppci' src={est4} alt="Logo" />
        </div>
      </div>
      <div className='div-container-9'>
        <h1>PROJETO HIDROSSANITÁRIO</h1>
        <p className='paragrafo'>O projeto hidrossanitário engloba um conjunto de projetos. O projeto hidráulico indica a localização das tubulações e componentes hidráulicos, desde o recebimento da água no hidrômetro até a chegada dessa água às peças como chuveiro, torneiras, entre outros. O sistema pluvial e o reaproveitamento de águas, estão ligados a captação de águas da chuva por meio de calhas. Já o projeto sanitário, compreende todo o sistema de coleta da rede de esgoto e água poluída de uma edificação.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={hidro1} alt="Logo" />
          <img className='imgs-ppci' src={hidro2} alt="Logo" />
          <img className='imgs-ppci' src={hidro3} alt="Logo" />
          <img className='imgs-ppci' src={hidro4} alt="Logo" />
          {/* <img className='imgs-ppci' src={hidro5} alt="Logo" /> */}
        </div>
      </div>
      <div className='div-container-10'>
        <h1>PROJETO ELÉTRICO</h1>
        <p className='paragrafo'>O projeto elétrico é composto por cálculos, desenhos e detalhes referentes à instalação elétrica e ao uso seguro dos equipamentos elétricos de uma edificação. Este projeto é pensado e dimensionado de acordo com as necessidades do cliente e com as normas vigentes, de forma a evitar acidentes e dores de cabeça aos seus usuários.</p>
        <div className='div-estrutural'>
          <img className='imgs-elet' src={elet1} alt="Logo" />
        </div>
      </div>
      <div className='div-container-11'>
        <h1>MODELAGEM 3D (MAQUETE ELETRÔNICA)</h1>
        <p className='paragrafo'>A modelagem 3D, também conhecida como maquete eletrônica ou maquete 3D, é uma simulação volumétrica de uma edificação, qual permite que o cliente entenda com mais clareza a proposta, concepção e estilo de vida do empreendimento. A modelagem 3D proporciona maior proximidade com a realidade e melhor visualização dos projetos.</p>
        <div className='div-estrutural'>
          <img className='imgs-3d' src={d1} alt="Logo" />
          <img className='imgs-3d' src={d2} alt="Logo" />
        </div>
      </div>
      {/* <div className='div-container-12'>
        <h1>PROJETO DE INTERIORES</h1>
        <p className='paragrafo'>Assim como a modelagem 3D, o projeto de interiores é uma simulação volumétrica, que possibilita a visualização interna da edificação, a disposição dos ambientes e a fluidez dos espaços. A partir dela é possível planejar o posicionamento dos móveis, gesso, iluminação, paginação e paisagismo, alinhando, assim, a praticidade, a funcionalidade e a estética.</p>
        <div>

        </div>
      </div> */}
      <div className='div-container-13'>
        <h1>ACOMPANHAMENTO DE OBRAS</h1>
        <p className='paragrafo'>O acompanhamento de obras é a verificação do correto andamento da construção. Esta etapa consiste em visitas do engenheiro ao canteiro de obras, para garantir que a execução esteja de acordo com os projetos, esclarecer dúvidas, orientar a mão de obra, conferir medições e indicar e corrigir as falhas. É imprescindível que um profissional acompanhe a construção, a fim de economizar recursos e minimizar desperdícios. Acompanhamos sua obra desde a terraplanagem até os últimos acabamentos.</p>
        <div className='div-estrutural'>
          <img className='imgs-3d' src={obra1} alt="Logo" />
          <img className='imgs-3d' src={obra2} alt="Logo" />
        </div>
      </div>
      <div className='div-container-14'>
        <h1>PERÍCIAS E LAUDOS</h1>
        <p className='paragrafo'>Este serviço é composto por um documento técnico, onde é relatado uma situação específica de uma obra ou edificação. Este documento é realizado com base em normas técnicas, fotos e visitas ao local analisado. O profissional analisa todas as condições técnicas, de uso e de manutenção do empreendimento, identificando e caracterizando anomalias e não conformidades existentes, deixando claro todas as responsabilidades de cada parte envolvida no projeto.</p>
        <div className='div-estrutural'>
          <img className='imgs-ppci' src={laudo1} alt="Logo" />
          <img className='imgs-ppci' src={laudo2} alt="Logo" />
          <img className='imgs-ppci' src={laudo3} alt="Logo" />
          <img className='imgs-ppci' src={laudo4} alt="Logo" />
          {/* <img className='imgs-ppci' src={laudo5} alt="Logo" /> */}
        </div>
      </div>
    </div>

  );
}

export default Servicos;