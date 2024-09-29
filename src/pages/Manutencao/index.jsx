
import manutencao from '../../assets/emmanutencao.png';
import logo from '../../assets/preta.png';


function  Manutencao () {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'left', left: '10%', marginBottom: '-50px', zIndex: '100' }}>
                <img src={logo} alt="Imagem manutencao" width={150} height={150} />
            </div>
            <img src={manutencao} alt="Imagem manutencao" width={500} height={500} />
            <p>
                Entre em contato pelo WhatsApp: {' '}
                <a href="https://api.whatsapp.com/send?phone=48996250883" target="_blank" rel="noopener noreferrer">
                    Clique aqui
                </a>
            </p>
        </div>

    )
}

export default Manutencao;