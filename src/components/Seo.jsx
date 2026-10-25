import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { serviceDetails } from '../data/serviceDetails';
import { buildMeta } from '../data/seoBuilder';

function setTag(selector, create, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(create.tag);
    Object.entries(create.attrs).forEach(([key, val]) => element.setAttribute(key, val));
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const normalized = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    const meta = buildMeta(normalized === '/home' ? '/' : normalized, serviceDetails);
    document.title = meta.title;
    setTag('meta[name="description"]', { tag: 'meta', attrs: { name: 'description' } }, 'content', meta.description);
    setTag('link[rel="canonical"]', { tag: 'link', attrs: { rel: 'canonical' } }, 'href', meta.url);
    setTag('meta[name="robots"]', { tag: 'meta', attrs: { name: 'robots' } }, 'content', meta.known ? 'index,follow,max-image-preview:large' : 'noindex');
    [['og:title', meta.title], ['og:description', meta.description], ['og:url', meta.url], ['og:image', meta.image]].forEach(([property, value]) => setTag(`meta[property="${property}"]`, { tag: 'meta', attrs: { property } }, 'content', value));
    setTag('meta[name="twitter:title"]', { tag: 'meta', attrs: { name: 'twitter:title' } }, 'content', meta.title);
    setTag('meta[name="twitter:description"]', { tag: 'meta', attrs: { name: 'twitter:description' } }, 'content', meta.description);
    let script = document.head.querySelector('script[data-seo="jsonld"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = 'jsonld';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(meta.jsonLd);
  }, [pathname]);
  return null;
}
