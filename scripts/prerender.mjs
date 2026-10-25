// Generates one static HTML file per route (plus sitemap.xml and llms.txt) after `vite build`,
// so search engines and AI crawlers that do not run JavaScript still receive real content.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' });
try {
  const { serviceDetails } = await server.ssrLoadModule('/src/data/serviceDetails.js');
  const { buildMeta } = await server.ssrLoadModule('/src/data/seoBuilder.js');
  const { pages, SITE_URL, SITE_NAME, business } = await server.ssrLoadModule('/src/data/seo.js');
  const template = await readFile(path.join(dist, 'index.html'), 'utf8');
  const routes = [...Object.keys(pages), ...serviceDetails.map(item => `/servicos/${item.slug}`)];

  const navigation = `<nav><a href="/">Início</a> <a href="/sobrenos">O escritório</a> <a href="/servicos">Serviços</a> <a href="/projetos">Projetos</a> <a href="/clientes">Clientes</a> <a href="/contato">Contato</a></nav>`;

  for (const route of routes) {
    const meta = buildMeta(route, serviceDetails);
    const service = serviceDetails.find(item => `/servicos/${item.slug}` === route);
    let body = `<h1>${escape(meta.heading)}</h1><p>${escape(meta.text)}</p>`;
    if (service) {
      body += `<h2>O que o trabalho pode contemplar</h2><ul>${service.deliverables.map(item => `<li>${escape(item)}</li>`).join('')}</ul><h2>Perguntas frequentes</h2>${service.faq.map(item => `<h3>${escape(item.question)}</h3><p>${escape(item.answer)}</p>`).join('')}`;
    }
    if (route === '/servicos' || route === '/') {
      body += `<h2>Serviços</h2><ul>${serviceDetails.map(item => `<li><a href="/servicos/${item.slug}">${escape(item.title)}</a></li>`).join('')}</ul>`;
    }
    const head = [
      `<link rel="canonical" href="${meta.url}" />`,
      `<meta name="robots" content="index,follow,max-image-preview:large" />`,
      `<meta property="og:type" content="${service ? 'article' : 'website'}" />`,
      `<meta property="og:locale" content="pt_BR" />`,
      `<meta property="og:site_name" content="${escape(SITE_NAME)}" />`,
      `<meta property="og:title" content="${escape(meta.title)}" />`,
      `<meta property="og:description" content="${escape(meta.description)}" />`,
      `<meta property="og:url" content="${meta.url}" />`,
      `<meta property="og:image" content="${meta.image}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escape(meta.title)}" />`,
      `<meta name="twitter:description" content="${escape(meta.description)}" />`,
      `<script type="application/ld+json" data-seo="jsonld">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`,
    ].join('\n    ');
    const html = template
      .replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(meta.description)}" />`)
      .replace('<!--seo-->', head)
      .replace('<div id="root"></div>', `<div id="root">${navigation}<main>${body}</main></div>`);
    const target = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
  }

  const today = new Date().toISOString().slice(0, 10);
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${SITE_URL}${route === '/' ? '/' : route}</loc><lastmod>${today}</lastmod><priority>${route === '/' ? '1.0' : route.startsWith('/servicos/') ? '0.8' : '0.6'}</priority></url>`).join('\n')}\n</urlset>\n`);

  const llms = `# ${SITE_NAME}\n\n> ${business.description}\n\nEndereço: Rua Coronel Marcos Rovaris, 184, Sala 203, Centro, Içara, SC. WhatsApp: (48) 9625-0883. E-mail: ${business.email}. Atendimento de segunda a sexta, das 08h às 18h.\n\n## Páginas\n${Object.entries(pages).map(([route, page]) => `- [${page.heading}](${SITE_URL}${route}): ${page.description}`).join('\n')}\n\n## Serviços\n${serviceDetails.map(item => `- [${item.title}](${SITE_URL}/servicos/${item.slug}): ${item.description}`).join('\n')}\n`;
  await writeFile(path.join(dist, 'llms.txt'), llms);
  console.log(`Prerendered ${routes.length} routes, sitemap.xml and llms.txt`);
} finally {
  await server.close();
}
