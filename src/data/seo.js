export const SITE_URL = 'https://www.carvalhoecardoso.com';
export const SITE_NAME = 'Carvalho & Cardoso Engenheiros Associados';
export const SITE_IMAGE = '/og-image.jpg';

export const business = {
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'Carvalho & Cardoso',
  url: SITE_URL,
  email: 'adm@carvalhoecardoso.com',
  telephone: '+55 48 9625-0883',
  image: `${SITE_URL}${SITE_IMAGE}`,
  logo: `${SITE_URL}/logo.png`,
  description: 'Escritório de engenharia e arquitetura em Içara, SC: projetos preventivos contra incêndio (PPCI), sprinklers, hidrantes, SPDA, estrutural, elétrico, hidrossanitário, arquitetura, modelagem 3D, acompanhamento de obras e laudos.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Coronel Marcos Rovaris, 184, Sala 203, Centro',
    addressLocality: 'Içara',
    addressRegion: 'SC',
    addressCountry: 'BR',
  },
  areaServed: [{ '@type': 'State', name: 'Santa Catarina' }, { '@type': 'Country', name: 'Brasil' }],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' }],
  sameAs: ['https://www.instagram.com/carvalhoecardoso/', 'https://www.linkedin.com/company/carvalho-e-cardoso/'],
};

export const pages = {
  '/': {
    title: 'Engenharia e arquitetura em Içara, SC | PPCI, projetos e obras',
    description: 'Carvalho & Cardoso: projetos de engenharia e arquitetura em Içara, SC. PPCI, sprinklers, hidrantes, SPDA, estrutural, elétrico, hidrossanitário, modelagem 3D e acompanhamento de obras.',
    heading: 'Engenharia e arquitetura em Içara, Santa Catarina',
    text: 'Escritório de engenharia e arquitetura que integra projeto, prevenção contra incêndio (PPCI), instalações, estruturas e acompanhamento de obras, da primeira ideia à execução.',
  },
  '/sobrenos': {
    title: 'O escritório | Equipe de engenheiros e arquitetos',
    description: 'Conheça a equipe da Carvalho & Cardoso: engenheiros civis, arquiteto e gestão trabalhando de forma integrada em projetos em Içara e região.',
    heading: 'Diferentes especialidades. O mesmo compromisso.',
    text: 'A Carvalho & Cardoso reúne profissionais de engenharia, arquitetura e gestão para pensar cada projeto de forma integrada.',
  },
  '/servicos': {
    title: 'Serviços de engenharia: PPCI, sprinklers, estrutural e mais',
    description: 'Projeto preventivo contra incêndio (PPCI), sprinklers, hidrantes, SPDA, gás, estrutural, elétrico, hidrossanitário, arquitetura, modelagem 3D, acompanhamento de obras e laudos em Içara, SC.',
    heading: 'Engenharia em cada detalhe. Visão do todo.',
    text: 'Da concepção à execução, conectamos as especialidades necessárias para dar ao seu projeto uma base sólida.',
  },
  '/projetos': {
    title: 'Projetos de arquitetura e engenharia',
    description: 'Veja projetos residenciais, de engenharia e de acompanhamento de obras desenvolvidos pela Carvalho & Cardoso em Içara, SC.',
    heading: 'Projetos que dão forma a novas histórias',
    text: 'Residências, estruturas, sistemas de prevenção contra incêndio e acompanhamento técnico de obras.',
  },
  '/clientes': {
    title: 'Clientes e parceiros',
    description: 'Empresas e instituições que confiam na Carvalho & Cardoso para projetos de engenharia, arquitetura e prevenção contra incêndio.',
    heading: 'Relações construídas com confiança',
    text: 'Conheça empresas e instituições atendidas pela Carvalho & Cardoso.',
  },
  '/contato': {
    title: 'Contato e orçamento | Içara, SC',
    description: 'Fale com a Carvalho & Cardoso pelo WhatsApp (48) 9625-0883 ou e-mail e conte sobre seu projeto de engenharia, arquitetura ou PPCI. Rua Coronel Marcos Rovaris, 184, Içara/SC.',
    heading: 'Vamos conversar sobre o seu projeto',
    text: 'WhatsApp (48) 9625-0883 · adm@carvalhoecardoso.com · Rua Coronel Marcos Rovaris, 184, Sala 203, Centro, Içara, SC. Segunda a sexta, das 08h às 18h.',
  },
};
