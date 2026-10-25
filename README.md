# Carvalho & Cardoso

Site institucional responsivo em React, com arquitetura, engenharia, projetos, equipe, clientes e contato.

## Desenvolvimento

Use Node.js 22.12 ou superior (a versão está indicada em `.nvmrc`) e npm. Não é necessário instalar pnpm.

```bash
nvm use
npm install
npm run dev
```

```bash
npm run lint
npm run build
npm run preview
```

## Funcionalidades

- Rotas `/`, `/home`, `/sobrenos`, `/servicos`, `/projetos`, `/clientes` e `/contato`.
- Cena 3D (three.js + React Three Fiber) da casa em três etapas, planta, estrutura e casa pronta, com câmera orbitando como um drone, pausa, seleção de etapa e repetição. Carrega sob demanda; até lá (ou sem WebGL) aparece uma imagem estática.
- Preferência de movimento reduzido respeitada; navegação por teclado e menu móvel.
- Portfólio com filtros e detalhes; links de serviços preenchem a especialidade no contato.
- Formulário prepara uma mensagem para revisão e envio manual no WhatsApp. Não existe backend de envio ou armazenamento.
- Tipografia Manrope instalada localmente e imagens do acervo original.

## Cena 3D

O código fica em `src/components/house3d/` (geometria procedural, materiais com os efeitos de construção, planta técnica e câmera). Para ajustar com `npm run dev` aberto:

- `http://localhost:5173/lab.html?stage=2&t=99&angle=205` mostra um estado fixo (`stage` 0–2, `t` segundos dentro da etapa, `angle` em graus); `?play=1` roda a animação.
- `node scripts/lab-shot.mjs "<url do lab>" saida.png 1400 713` tira uma captura (Chrome headless). É assim que `src/assets/optimized/house-poster.webp` é gerado: refaça a imagem quando mudar a casa.

## Publicação

O build gera `dist/` com uma página HTML pré-renderizada por rota, `sitemap.xml`, `robots.txt` e `llms.txt`. A hospedagem prevista é a Vercel (`vercel.json`). Antes de publicar, confirme com a empresa o número do WhatsApp, endereço, composição atual da equipe e autorização de uso dos logos de clientes: são dados preservados do site antigo.
