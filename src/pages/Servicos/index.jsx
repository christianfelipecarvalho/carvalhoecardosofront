

import manutencao from '../../assets/em-manutencao.png';

function Servicos() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  marginBottom: '200px', paddingTop: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'left', left: '10%', marginBottom: '-50px', zIndex: '100' }}>
      </div>
      <img src={manutencao} alt="Imagem manutencao" width={500} height={500} />
      <p>
          Entre em contato pelo WhatsApp: {' '}
          <a href="https://api.whatsapp.com/send?phone=48996250883" target="_blank" rel="noopener noreferrer">
              Clique aqui
          </a>
      </p>
  </div>
    );
  }
  
  export default Servicos;