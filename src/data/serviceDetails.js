import ppci from '../assets/servicos/PPCI 1.jpeg';
import spda from '../assets/servicos/spda.jpg';
import sprinklers from '../assets/servicos/SPK 1.jpg';
import gas from '../assets/servicos/GLP 1.jpeg';
import diesel from '../assets/servicos/Tanque 1.jpeg';
import hydrants from '../assets/servicos/SHP 5.jpeg';
import architecture from '../assets/servicos/arq1.png';
import structure from '../assets/servicos/EST 7.jpeg';
import water from '../assets/servicos/Hidro 2.jpg';
import electrical from '../assets/servicos/Elet 1.jpeg';
import modeling from '../assets/servicos/3dservice.jpg';
import construction from '../assets/servicos/Obra 1.jpeg';
import inspection from '../assets/servicos/laudo.jpeg';

export const serviceDetails = [
  {
    slug: 'projeto-preventivo-contra-incendio-ppci',
    title: 'Projeto preventivo contra incêndio e pânico (PPCI)',
    description: 'Entenda o PPCI, os sistemas de prevenção contra incêndio e as etapas do projeto com a Carvalho & Cardoso, em Içara, SC.',
    intro: 'O projeto preventivo contra incêndio e pânico (PPCI) define medidas e sistemas para a segurança das pessoas e da edificação em uma situação de incêndio. A partir da ocupação, das características construtivas e dos riscos identificados, o projeto estabelece as soluções necessárias para abandono do local e combate inicial ao fogo. A Carvalho & Cardoso reúne as disciplinas envolvidas para desenvolver o projeto conforme as exigências aplicáveis ao empreendimento.',
    deliverables: ['Levantamento das características, ocupação e necessidades da edificação.', 'Definição e dimensionamento dos sistemas preventivos pertinentes ao projeto.', 'Desenhos e detalhamentos para orientar a implantação das medidas de segurança.', 'Documentação técnica conforme o escopo contratado e as exigências aplicáveis.'],
    faq: [
      { question: 'Quais edificações precisam de PPCI?', answer: 'A necessidade e o enquadramento dependem da ocupação, da área, da altura, dos riscos e das regras vigentes. Empreendimentos comerciais, industriais, residenciais multifamiliares e locais de reunião de público podem exigir medidas e documentação específicas. A análise do imóvel define o que se aplica ao caso.' },
      { question: 'PPCI e instalação de equipamentos são a mesma coisa?', answer: 'Não. O PPCI é o planejamento técnico das medidas de prevenção. A execução instala os sistemas previstos e deve seguir o projeto. A necessidade de inspeções, documentação e procedimentos junto ao Corpo de Bombeiros depende do enquadramento da edificação.' },
      { question: 'O projeto garante a aprovação no Corpo de Bombeiros?', answer: 'A análise e a decisão cabem ao órgão competente. O projeto deve atender aos requisitos aplicáveis, e a regularização também pode depender de documentação, adequações físicas e da execução dos sistemas previstos.' },
    ],
    relatedSlugs: ['projeto-de-sprinklers', 'projeto-de-hidrantes', 'projeto-de-spda'], image: ppci, category: 'Prevenção contra incêndio',
  },
  {
    slug: 'projeto-de-spda', title: 'Projeto de SPDA',
    description: 'Projeto de proteção contra descargas atmosféricas: análise e detalhamento das soluções de SPDA com a Carvalho & Cardoso, em Içara, SC.',
    intro: 'O Sistema de Proteção contra Descargas Atmosféricas (SPDA) reúne medidas para reduzir os efeitos de raios sobre uma edificação. Seu projeto considera as características do imóvel e os riscos envolvidos para definir os componentes e sua disposição. A integração com aterramento e instalações elétricas é parte importante da análise técnica.',
    deliverables: ['Avaliação das características da edificação para definição das soluções.', 'Dimensionamento e disposição dos componentes do sistema aplicável.', 'Detalhamento de captação, descidas e aterramento conforme o projeto.', 'Orientações técnicas para integração com os demais sistemas.'],
    faq: [{ question: 'O SPDA impede a ocorrência de raios?', answer: 'Não. O sistema busca reduzir os efeitos das descargas atmosféricas sobre a edificação. Ele não elimina todos os riscos, e sua efetividade depende de projeto, execução, inspeção e manutenção adequados.' }, { question: 'SPDA substitui a proteção dos equipamentos elétricos?', answer: 'Não. A proteção da edificação e a proteção das instalações e equipamentos precisam ser avaliadas em conjunto. O projeto elétrico pode demandar medidas adicionais de proteção contra surtos.' }],
    relatedSlugs: ['projeto-eletrico', 'projeto-preventivo-contra-incendio-ppci'], image: spda, category: 'Instalações prediais',
  },
  {
    slug: 'projeto-de-sprinklers', title: 'Projeto de sprinklers',
    description: 'Dimensionamento de chuveiros automáticos para combate a incêndio. Conheça o projeto de sprinklers da Carvalho & Cardoso em Içara, SC.',
    intro: 'Sprinklers são chuveiros automáticos que liberam água quando a temperatura próxima ao dispositivo atinge sua condição de acionamento. O projeto dimensiona a rede de acordo com as características da ocupação, o risco e as necessidades de abastecimento. A distribuição dos dispositivos e o cálculo hidráulico orientam o desempenho esperado do sistema.',
    deliverables: ['Análise da ocupação e das condições de proteção.', 'Distribuição e especificação dos chuveiros automáticos.', 'Dimensionamento hidráulico de tubulações e alimentação.', 'Detalhamentos para implantação e integração com os sistemas preventivos.'],
    faq: [{ question: 'Todos os sprinklers são acionados ao mesmo tempo?', answer: 'Nos sistemas usuais com chuveiros fechados, cada dispositivo responde à temperatura em seu entorno. Existem sistemas com outras formas de acionamento; a solução adequada depende da aplicação e do projeto.' }, { question: 'O projeto considera a reserva de água?', answer: 'Sim. O dimensionamento considera as condições de vazão, pressão e alimentação necessárias ao sistema, incluindo a reserva e o bombeamento quando aplicáveis.' }],
    relatedSlugs: ['projeto-preventivo-contra-incendio-ppci', 'projeto-de-hidrantes'], image: sprinklers, category: 'Prevenção contra incêndio',
  },
  {
    slug: 'projeto-de-gas-gn-glp-gnv', title: 'Projeto de gás GN, GLP e GNV',
    description: 'Projetos de instalações de gás, tubulações e centrais de GN, GLP e GNV. Conheça a atuação da Carvalho & Cardoso, em Içara, SC.',
    intro: 'O projeto de instalações de gás parte do levantamento dos equipamentos, dos pontos de consumo e das condições do local. A análise orienta o dimensionamento das tubulações e os requisitos da central ou do abrigo de gás. Cada combustível e aplicação exige soluções específicas de instalação, ventilação e segurança.',
    deliverables: ['Levantamento dos pontos de consumo e da demanda prevista.', 'Dimensionamento e traçado das tubulações.', 'Detalhamento da central ou do abrigo, conforme a aplicação.', 'Definição de requisitos de ventilação e instalação pertinentes ao projeto.'],
    faq: [{ question: 'O mesmo projeto serve para GN, GLP e GNV?', answer: 'Não. Os combustíveis têm propriedades, condições de fornecimento e aplicações diferentes. O projeto precisa considerar o combustível utilizado e os requisitos da instalação.' }, { question: 'A troca de equipamentos pode exigir revisão do projeto?', answer: 'Sim. Alterações no consumo, no trajeto da rede ou na localização dos equipamentos podem mudar o dimensionamento e as condições de segurança. A instalação deve ser reavaliada antes da alteração.' }],
    relatedSlugs: ['projeto-preventivo-contra-incendio-ppci', 'projeto-de-tanques-de-diesel'], image: gas, category: 'Instalações prediais',
  },
  {
    slug: 'projeto-de-tanques-de-diesel', title: 'Projeto de tanques de diesel',
    description: 'Planejamento técnico de instalações para armazenamento e abastecimento de diesel com a Carvalho & Cardoso, em Içara, Santa Catarina.',
    intro: 'O projeto de tanques de diesel contempla instalações de armazenamento e abastecimento de combustível, conforme a finalidade do empreendimento. A concepção considera a implantação, as condições de operação e as medidas de segurança contra incêndio pertinentes. O escopo e os documentos necessários dependem das características da instalação e das exigências aplicáveis.',
    deliverables: ['Levantamento da finalidade, capacidade e condições da instalação.', 'Estudo da implantação e dos componentes previstos no sistema.', 'Detalhamento das soluções de segurança pertinentes ao armazenamento.', 'Documentação técnica definida conforme o escopo e os requisitos aplicáveis.'],
    faq: [{ question: 'O projeto atende apenas postos de combustíveis?', answer: 'Não. Instalações de uso privativo também podem demandar planejamento técnico para armazenamento e abastecimento. As exigências variam conforme a finalidade, a capacidade e as características do local.' }, { question: 'O projeto substitui autorizações e licenças?', answer: 'Não. Documentos de projeto e autorizações de funcionamento têm funções diferentes. A necessidade de licenciamento e os órgãos envolvidos devem ser verificados para cada empreendimento.' }],
    relatedSlugs: ['projeto-preventivo-contra-incendio-ppci', 'projeto-de-gas-gn-glp-gnv'], image: diesel, category: 'Instalações prediais',
  },
  {
    slug: 'projeto-de-hidrantes', title: 'Projeto de hidrantes e sistema hidráulico preventivo',
    description: 'Dimensionamento de hidrantes, tubulações e reserva técnica de incêndio. Conheça o projeto de SHP da Carvalho & Cardoso em Içara, SC.',
    intro: 'O sistema hidráulico preventivo (SHP) disponibiliza água em pontos de combate a incêndio definidos no projeto. Ele reúne tubulações, hidrantes, mangueiras e alimentação por reserva técnica, com bombeamento quando necessário. O dimensionamento considera as vazões e pressões requeridas para a aplicação.',
    deliverables: ['Definição dos pontos de hidrantes e do traçado da rede.', 'Dimensionamento hidráulico das tubulações.', 'Análise da reserva técnica de incêndio e do bombeamento aplicável.', 'Desenhos e detalhamentos para orientar a instalação do sistema.'],
    faq: [{ question: 'Qual é a diferença entre hidrantes e sprinklers?', answer: 'Hidrantes disponibilizam água para o combate por meio de mangueiras e esguichos, com operação por pessoas capacitadas. Sprinklers são dispositivos de atuação automática. A necessidade de cada sistema depende da edificação e das exigências aplicáveis.' }, { question: 'Todo sistema de hidrantes precisa de bomba?', answer: 'A solução depende das condições de vazão e pressão. A alimentação pode envolver gravidade ou bombeamento, conforme a análise hidráulica e os requisitos do projeto.' }],
    relatedSlugs: ['projeto-preventivo-contra-incendio-ppci', 'projeto-de-sprinklers'], image: hydrants, category: 'Prevenção contra incêndio',
  },
  {
    slug: 'projeto-arquitetonico', title: 'Projeto arquitetônico',
    description: 'Concepção de espaços, implantação e detalhamento arquitetônico. Conheça o trabalho da Carvalho & Cardoso, em Içara, Santa Catarina.',
    intro: 'O projeto arquitetônico organiza as necessidades do cliente em espaços, volumes e relações com o terreno. A definição de implantação, circulação e ambientes orienta a concepção da edificação e a integração dos projetos complementares. Os desenhos também dão suporte à execução e aos processos de análise nos órgãos competentes, conforme o escopo contratado.',
    deliverables: ['Levantamento das necessidades e estudo de implantação.', 'Definição dos ambientes, circulação e organização dos espaços.', 'Plantas, cortes e fachadas conforme as etapas contratadas.', 'Detalhamento e integração com as disciplinas complementares.'],
    faq: [{ question: 'O que informar para começar um projeto arquitetônico?', answer: 'Localização e informações disponíveis do terreno, necessidades de uso, referências, orçamento previsto e expectativas ajudam no início. A equipe identifica os levantamentos e documentos adicionais necessários ao desenvolvimento.' }, { question: 'Projeto arquitetônico inclui todos os projetos complementares?', answer: 'Não necessariamente. Estruturas, instalações e prevenção contra incêndio são disciplinas próprias. O conjunto de serviços e sua compatibilização devem ser definidos na proposta.' }],
    relatedSlugs: ['modelagem-3d', 'projeto-estrutural', 'projeto-hidrossanitario'], image: architecture, category: 'Arquitetura e modelagem 3D',
  },
  {
    slug: 'projeto-estrutural', title: 'Projeto estrutural',
    description: 'Dimensionamento de fundações, pilares, vigas e lajes com a Carvalho & Cardoso. Conheça as etapas do projeto estrutural em Içara, SC.',
    intro: 'O projeto estrutural dimensiona os elementos responsáveis por receber as cargas da edificação e transmiti-las ao solo. Fundações, pilares, vigas e lajes são definidos a partir da arquitetura, das características do terreno e das condições de uso. O detalhamento orienta a execução e permite integrar a estrutura às demais disciplinas.',
    deliverables: ['Análise da arquitetura e dos dados técnicos disponíveis do terreno.', 'Definição da concepção estrutural adequada ao projeto.', 'Dimensionamento de fundações e elementos de sustentação.', 'Desenhos e detalhamentos para execução da estrutura.'],
    faq: [{ question: 'Por que as informações do solo são importantes?', answer: 'As características do solo influenciam a escolha e o dimensionamento das fundações. A necessidade de investigação geotécnica e os dados requeridos devem ser definidos pelos profissionais responsáveis.' }, { question: 'Posso alterar uma parede ou abrir um vão durante a obra?', answer: 'Alterações que afetem a estrutura precisam de avaliação técnica prévia. A posição de elementos, as cargas e as interferências devem ser verificadas antes de executar a mudança.' }],
    relatedSlugs: ['projeto-arquitetonico', 'acompanhamento-de-obras', 'pericias-e-laudos'], image: structure, category: 'Engenharia estrutural',
  },
  {
    slug: 'projeto-hidrossanitario', title: 'Projeto hidrossanitário',
    description: 'Projetos de água, esgoto e águas pluviais para edificações. Conheça as soluções hidrossanitárias da Carvalho & Cardoso, em Içara, SC.',
    intro: 'O projeto hidrossanitário organiza as redes de abastecimento de água, coleta de esgoto e condução de águas pluviais de uma edificação. O dimensionamento e a disposição das tubulações consideram os pontos de utilização, as condições de alimentação e os destinos previstos para cada sistema. Soluções de aproveitamento de água da chuva podem ser estudadas conforme as necessidades do projeto.',
    deliverables: ['Definição dos pontos de utilização e dos percursos das redes.', 'Dimensionamento das instalações hidráulicas e sanitárias.', 'Estudo de captação e condução das águas pluviais.', 'Detalhamentos e integração com arquitetura e estrutura.'],
    faq: [{ question: 'Água pluvial e esgoto usam a mesma tubulação?', answer: 'São sistemas com funções e destinos distintos, que devem ser projetados de acordo com os requisitos locais e técnicos aplicáveis. A solução de ligação e destinação precisa ser verificada para o empreendimento.' }, { question: 'É possível prever aproveitamento de água da chuva?', answer: 'Sim, quando a solução for adequada ao uso pretendido. O estudo considera captação, armazenamento, tratamento necessário e separação das redes, conforme os requisitos aplicáveis.' }],
    relatedSlugs: ['projeto-arquitetonico', 'projeto-eletrico', 'acompanhamento-de-obras'], image: water, category: 'Instalações prediais',
  },
  {
    slug: 'projeto-eletrico', title: 'Projeto elétrico',
    description: 'Planejamento e dimensionamento de instalações elétricas com a Carvalho & Cardoso, em Içara, SC. Circuitos, cargas e proteção da edificação.',
    intro: 'O projeto elétrico define como a energia será distribuída e utilizada nos ambientes da edificação. A análise das cargas e das necessidades de uso orienta a organização dos circuitos, os condutores e os dispositivos de proteção. Desenhos e detalhes permitem planejar a instalação e reduzir improvisações durante a execução.',
    deliverables: ['Levantamento de cargas e necessidades dos ambientes.', 'Distribuição dos pontos e organização dos circuitos.', 'Dimensionamento de condutores e dispositivos de proteção.', 'Desenhos e detalhamentos das instalações previstas.'],
    faq: [{ question: 'É importante informar os equipamentos antes do projeto?', answer: 'Sim. Equipamentos com maior demanda, como chuveiros, climatização e máquinas, influenciam as cargas e os circuitos. Informar usos atuais e expansões previstas ajuda no dimensionamento.' }, { question: 'Uma reforma pode exigir revisão elétrica?', answer: 'Sim. Mudanças de uso, acréscimo de cargas ou alterações de layout podem exigir adequações. A condição da instalação existente deve ser avaliada antes de definir a intervenção.' }],
    relatedSlugs: ['projeto-de-spda', 'projeto-hidrossanitario', 'projeto-arquitetonico'], image: electrical, category: 'Instalações prediais',
  },
  {
    slug: 'modelagem-3d', title: 'Modelagem 3D e maquete eletrônica',
    description: 'Visualização de volumes, materiais e ambientes antes da obra. Conheça a modelagem 3D da Carvalho & Cardoso, em Içara, Santa Catarina.',
    intro: 'A modelagem 3D transforma os desenhos do projeto em uma representação volumétrica da edificação. A maquete eletrônica ajuda a compreender proporções, materiais e a relação dos espaços com o entorno. Essa visualização apoia a conversa com o cliente e as decisões ainda na fase de projeto.',
    deliverables: ['Representação tridimensional dos volumes previstos no escopo.', 'Estudo visual de materiais e composição de fachadas ou ambientes.', 'Imagens para apoiar a compreensão e discussão da proposta.', 'Ajustes da representação conforme as etapas de desenvolvimento contratadas.'],
    faq: [{ question: 'Uma maquete eletrônica substitui o projeto executivo?', answer: 'Não. A visualização facilita o entendimento da proposta, mas a execução depende de desenhos, dimensões, especificações e detalhamentos técnicos próprios.' }, { question: 'A imagem representa exatamente o resultado da obra?', answer: 'A imagem é uma representação da proposta. Materiais escolhidos, iluminação, execução e alterações posteriores podem modificar o resultado construído.' }],
    relatedSlugs: ['projeto-arquitetonico', 'acompanhamento-de-obras'], image: modeling, category: 'Arquitetura e modelagem 3D',
  },
  {
    slug: 'acompanhamento-de-obras', title: 'Acompanhamento de obras',
    description: 'Visitas técnicas, orientação da execução e conferência de serviços com a Carvalho & Cardoso, em Içara, Santa Catarina.',
    intro: 'O acompanhamento de obras aproxima a execução das soluções definidas nos projetos. Por meio de visitas técnicas e orientação, o profissional verifica os serviços em andamento, esclarece dúvidas e identifica situações que precisam de ajuste. A frequência de acompanhamento e as responsabilidades de cada parte são estabelecidas de acordo com o escopo da contratação.',
    deliverables: ['Visitas técnicas nas etapas previstas para acompanhamento.', 'Verificação dos serviços em relação aos projetos disponíveis.', 'Orientação técnica e esclarecimento de dúvidas de execução.', 'Conferência de medições e registro de ajustes, conforme o escopo contratado.'],
    faq: [{ question: 'O acompanhamento significa presença diária na obra?', answer: 'Não necessariamente. A frequência de visitas e a disponibilidade do profissional são definidas na contratação, considerando as etapas e as necessidades da obra.' }, { question: 'É possível iniciar o acompanhamento com a obra em andamento?', answer: 'O caso pode ser avaliado a partir dos projetos disponíveis e das condições encontradas no local. A equipe identifica as necessidades e as limitações para definir o escopo adequado.' }],
    relatedSlugs: ['projeto-estrutural', 'projeto-arquitetonico', 'pericias-e-laudos'], image: construction, category: 'Acompanhamento de obras',
  },
  {
    slug: 'pericias-e-laudos', title: 'Perícias e laudos de engenharia',
    description: 'Inspeção e análise técnica de obras e edificações. Conheça o serviço de perícias e laudos da Carvalho & Cardoso, em Içara, SC.',
    intro: 'Perícias e laudos de engenharia documentam a análise de uma situação específica em uma obra ou edificação. A investigação pode envolver inspeções, registros fotográficos, documentos e avaliação das condições de uso e manutenção. O trabalho identifica e caracteriza as ocorrências observadas para apoiar decisões técnicas dentro dos limites da análise realizada.',
    deliverables: ['Definição do objeto e do escopo da análise técnica.', 'Inspeção do local e levantamento de informações disponíveis.', 'Registros das condições e ocorrências identificadas.', 'Documento técnico com análise, conclusões e recomendações pertinentes.'],
    faq: [{ question: 'Quando buscar um laudo de engenharia?', answer: 'Situações como fissuras, infiltrações, dúvidas sobre conservação ou divergências relacionadas à execução podem justificar uma avaliação. A análise inicial ajuda a definir o tipo e a extensão do trabalho necessário.' }, { question: 'Todo laudo exige ensaios?', answer: 'Não. A necessidade de ensaios, medições ou investigações complementares depende do objeto e dos indícios encontrados. Quando necessários, esses procedimentos devem ser definidos no escopo ou indicados durante a análise.' }],
    relatedSlugs: ['acompanhamento-de-obras', 'projeto-estrutural'], image: inspection, category: 'Laudos e perícias',
  },
];
