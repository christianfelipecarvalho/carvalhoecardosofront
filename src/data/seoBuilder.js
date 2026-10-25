import { SITE_IMAGE, SITE_NAME, SITE_URL, business, pages } from './seo';

// Shared by the browser (live head updates) and by scripts/prerender.mjs (static HTML for crawlers).
export function buildMeta(pathname, serviceDetails) {
  const slug = pathname.startsWith('/servicos/') ? pathname.slice('/servicos/'.length) : null;
  const service = slug ? serviceDetails.find(item => item.slug === slug) : null;
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  const image = `${SITE_URL}${SITE_IMAGE}`;
  const graph = [business];
  let page = pages[pathname];

  if (service) {
    page = {
      title: `${service.title} em Içara, SC`,
      description: service.description,
      heading: service.title,
      text: service.intro,
    };
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: service.title,
      serviceType: service.category,
      description: service.intro,
      url,
      provider: { '@id': business['@id'] },
      areaServed: { '@type': 'State', name: 'Santa Catarina' },
    }, {
      '@type': 'FAQPage',
      mainEntity: service.faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [['Início', SITE_URL + '/'], ['Soluções', `${SITE_URL}/servicos`], [service.title, url]].map(([name, item], index) => ({ '@type': 'ListItem', position: index + 1, name, item })),
    });
  } else if (pathname === '/servicos') {
    graph.push({
      '@type': 'ItemList',
      name: 'Serviços de engenharia e arquitetura',
      itemListElement: serviceDetails.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.title, url: `${SITE_URL}/servicos/${item.slug}` })),
    });
  }

  const known = Boolean(page);
  page = page || { title: 'Página não encontrada', description: pages['/'].description, heading: 'Página não encontrada', text: '' };
  return {
    known,
    title: `${page.title} | Carvalho & Cardoso`,
    description: page.description,
    url,
    image,
    heading: page.heading,
    text: page.text,
    siteName: SITE_NAME,
    jsonLd: { '@context': 'https://schema.org', '@graph': graph },
  };
}
