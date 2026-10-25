import residence from '../assets/optimized/residencia-madeira.webp';
import houses from '../assets/optimized/residencias.webp';
import contemporary from '../assets/optimized/residencia-contemporanea.webp';
import structure from '../assets/servicos/EST 7.jpeg';
import fire from '../assets/servicos/PPCI 1.jpeg';
import work from '../assets/servicos/Obra 1.jpeg';
export const projects = [{
  title: 'Arquitetura que acolhe',
  category: 'Residencial',
  image: residence,
  text: 'Madeira, luz natural e integração com o entorno em uma proposta residencial.',
  service: 'Arquitetura e modelagem 3D'
}, {
  title: 'Novas formas de morar',
  category: 'Residencial',
  image: houses,
  text: 'Volumes contemporâneos e espaços pensados para o dia a dia.',
  service: 'Projeto arquitetônico'
}, {
  title: 'Linhas que se encontram',
  category: 'Residencial',
  image: contemporary,
  text: 'Uma composição de materiais, proporções e espaços integrados.',
  service: 'Estudo de fachada e visualização 3D'
}, {
  title: 'Precisão em cada elemento',
  category: 'Engenharia',
  image: structure,
  text: 'Dimensionamento e detalhamento dos elementos que sustentam a edificação.',
  service: 'Projeto estrutural'
}, {
  title: 'Segurança desde o projeto',
  category: 'Engenharia',
  image: fire,
  text: 'Sistemas preventivos concebidos para as necessidades de cada empreendimento.',
  service: 'Prevenção contra incêndio'
}, {
  title: 'Do desenho ao canteiro',
  category: 'Obras',
  image: work,
  text: 'Acompanhamento técnico para aproximar a execução do que foi planejado.',
  service: 'Acompanhamento de obras'
}];
export const services = [{
  title: 'Arquitetura e modelagem 3D',
  text: 'Espaços funcionais, identidade e uma visão clara do seu projeto antes de construir.',
  details: 'Estudos de implantação, projeto arquitetônico, detalhamento e maquetes eletrônicas para visualizar volumes, materiais e ambientes.',
  icon: 'architecture'
}, {
  title: 'Engenharia estrutural',
  text: 'Soluções que conectam segurança, desempenho e uso inteligente dos materiais.',
  details: 'Dimensionamento e detalhamento de fundações, pilares, vigas e lajes, considerando o projeto arquitetônico e as características do solo.',
  icon: 'structure'
}, {
  title: 'Instalações prediais',
  text: 'Projetos de elétrica, água, esgoto e gás para que a edificação funcione com segurança e conforto.',
  details: 'Projetos elétricos, hidrossanitários e de drenagem pluvial, SPDA (para-raios), instalações de gás (GN, GLP e GNV) e tanques de diesel para edificações e empreendimentos.',
  icon: 'systems'
}, {
  title: 'Prevenção contra incêndio',
  text: 'Planejamento técnico para proteger pessoas e empreendimentos.',
  details: 'Projeto preventivo contra incêndio e pânico (PPCI), sprinklers e sistemas hidráulicos preventivos com hidrantes.',
  icon: 'fire'
}, {
  title: 'Acompanhamento de obras',
  text: 'Presença técnica em cada etapa, da preparação do terreno aos acabamentos.',
  details: 'Visitas técnicas, orientação da execução, conferência de medições e identificação de ajustes necessários no canteiro.',
  icon: 'work'
}, {
  title: 'Laudos e perícias',
  text: 'Análises fundamentadas para decisões mais seguras sobre o seu patrimônio.',
  details: 'Inspeções, registros fotográficos e análise das condições técnicas, de uso e de manutenção de obras e edificações.',
  icon: 'report'
}];
