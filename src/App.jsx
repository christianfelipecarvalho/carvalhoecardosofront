import './App.css';
import manutencao from './assets/manutencao.jpg';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Carvalho e Cardoso</h1>
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

export default App;
