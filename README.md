# Pedro Filiphi · Site Institucional

Site estático em HTML, CSS e JavaScript puros. Pronto para publicação no Vercel ou Netlify.

---

## Estrutura

```
pedrofiliphi-site/
├── index.html              ← página única, bilíngue (PT/EN)
├── style.css
├── script.js
├── img/                    8 fotos do carrossel + Open Graph
└── logo/                   SVG vetorial + PNGs em 256/512/1024
```

---

## Como publicar (3 passos)

### 1. Configure o Formspree (formulário de contato)

1. Crie conta gratuita em [formspree.io](https://formspree.io)
2. Crie um formulário com destino `contato@pedrofiliphi.com`
3. Copie o ID que aparece (8 caracteres, ex.: `xnnkqvbz`)
4. Em `index.html`, busque por `REPLACE_WITH_YOUR_FORMSPREE_ID` e substitua pelo ID

### 2. Suba para o Vercel (recomendado)

**Opção A — Drag & drop:**
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Arraste a **pasta inteira** `pedrofiliphi-site` (com `img/` e `logo/` dentro)
3. Confirme o deploy

**Opção B — Vercel CLI (mais confiável):**
```bash
cd pedrofiliphi-site
npx vercel
```

### 3. Configure o domínio `pedrofiliphi.com`

1. Painel Vercel → projeto → **Settings → Domains**
2. Adicione `pedrofiliphi.com` e `www.pedrofiliphi.com`
3. No registrador onde comprou o domínio:
   - Aponte registro **A** do apex para o IP que Vercel mostrar (geralmente `76.76.21.21`)
   - Aponte **CNAME** do `www` para `cname.vercel-dns.com`
4. HTTPS automático em até 24h

---

## Mensagem inicial do WhatsApp

Quando alguém clica em qualquer botão de WhatsApp, abre a conversa preenchida:
- **PT:** *"Olá, gostaria de conversar sobre uma demanda jurídica."*
- **EN:** *"Hello, I would like to request an initial consultation."*

A linguagem é detectada automaticamente pelo seletor PT/EN do site.

---

## Editar textos no futuro

Cada texto tem versão PT e EN, em atributos `data-pt` e `data-en`:

```html
<p data-pt="Texto em português" data-en="Text in English">Texto em português</p>
```

Para alterar: edite `data-pt`, `data-en`, **e** o texto interno.

---

## Trocar imagens do carrossel

Substitua o arquivo correspondente em `img/` mantendo o **mesmo nome de arquivo**.

Ordem atual: `1-contract` → `2-realestate` → `7-atlantis` → `4-medical` → `3-nyc` → `8-usa` → `5-bridge` → `6-visa`. Cada imagem rotaciona a cada 4,5 segundos.
