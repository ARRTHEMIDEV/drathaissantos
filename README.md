# Site da Dra. Thaís Santos

Astro 7 (estático) + Keystatic (painel local) + Markdoc. Hospedagem prevista: Cloudflare Pages.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Site em http://localhost:4321 e painel de conteúdo em http://localhost:4321/keystatic |
| `npm run build` | Build de **preview**: mostra tudo, inclusive artigos em revisão e marcações `[pendente]`, com `noindex` |
| `npm run build:producao` | Build **público**: só artigos aprovados. Depois roda `scripts/verificar-publicacao.mjs`, que falha se houver pendência, fonte provisória, página sem CRM/RQE, falta de medição ou `noindex` |
| `npm run preview` | Serve a pasta `dist/` gerada pelo último build |
| `npm run check` | Verificação de tipos e templates |

## Movimento e efeitos

Tudo é ligado por atributos no HTML e controlado por `src/scripts/movimento.ts` (GSAP 3.15 + ScrollTrigger + SplitText, Lenis para a rolagem suave):

| Atributo | Efeito |
|---|---|
| `data-revelar="linhas"` | título revelado linha a linha |
| `data-revelar="palavras"` | palavras acendem com a rolagem (manifesto) |
| `data-revelar="subir"` | entra subindo (`data-revelar-filhos` = um por filho) |
| `data-revelar="imagem"` | foto abre como cortina |
| `data-parallax="8"` | foto desliza dentro da moldura |
| `data-deslizar="-38"` | elemento corre na horizontal (tipografia gigante) |
| `data-desenhar` / `data-acender` | linha que cresce / faísca que acende no centro da tela |
| `data-magnetico` | botão atraído pelo ponteiro |
| `data-marquee` | faixa rolante que acelera com a rolagem |
| `data-horizontal` | seção fixa com trilho horizontal (desktop) |

Componentes de efeito em `src/components/fx/`: intro de marca (primeira visita da sessão), faíscas em canvas, faixa rolante e selo giratório com CRM/RQE.

Com "reduzir movimento" ativado no sistema, nada disso roda e o conteúdo aparece estático. Se o script falhar, uma rede de segurança mostra tudo em até 4 segundos.

**Decisão registrada:** o briefing premium pedia poucos movimentos, sem intro e sem cursor. A pedido do Vinicius (13/10/2026), o site ganhou intro e efeitos de rolagem, mantendo acessibilidade e as regras do CFM. Depois da revisão dele, saíram o cursor personalizado, a foto que seguia o mouse em "O que você procura?" e a tipografia gigante. Em 27/10/2026 a intro foi acelerada (de ~3,1 s para ~1,9 s, `timeScale` em `Intro.astro`) e o grão de papel deixou de animar em telas de toque.

## Onde mexer

- **Nome, CRM, RQE, WhatsApp, endereço, formação:** `src/data/profissional.ts` (fonte única para páginas, rodapé e JSON-LD).
- **Fotos e pontos focais:** `src/data/fotos.ts`. NKZ_8890 e NKZ_8894 mostram outra pessoa e não podem ser usadas.
- **Etapas da primeira consulta:** `src/data/consulta.ts`.
- **Artigos e fontes:** pelo painel (`/keystatic`) ou em `src/content/artigos/*.mdoc` e `src/content/fontes/*.yaml`.
- **Cores, tipografia e tempos de animação:** `src/styles/tokens.css`.

## Fluxo editorial (rascunho → em revisão → aprovado → publicado)

1. Escreva ou edite o artigo no painel, em uma branch própria. Status: **Rascunho**.
2. Mude o status para **Em revisão médica**, rode `npm run build` e copie a **versão atual do texto** que aparece na faixa do artigo para o campo *Versão aprovada*. Abra o pull request: o preview protegido vai para a Dra. Thaís.
3. A Dra. Thaís revisa o preview e aprova o pull request com a conta dela. Só então preencha *Revisor*, *Data da revisão* e mude o status para **Aprovado**.
4. O merge em `main` publica. Se o texto clínico mudar depois disso, a versão deixa de bater e o build de produção tira o artigo do ar até nova revisão.

Um campo preenchido no painel não vale, sozinho, como aprovação médica: a aprovação é o review dela no pull request.

**Reverter:** `git revert <commit>` (ou rollback do deploy no painel do Cloudflare).

## Marcações de pendência

- **Em componentes:** `<Pendente motivo="...">texto</Pendente>`.
- **Em artigos:** `{% pendente motivo="..." %}texto{% /pendente %}`.

Aparecem destacadas nos previews. O build de produção lista todas e não publica enquanto houver alguma.

## Ainda depende de contas e decisões externas

- Repositório GitHub privado com proteção de branch (exige GitHub Pro): review obrigatório e *dismiss stale approvals*.
- Projeto no Cloudflare Pages, previews protegidos por Cloudflare Access, domínio no Registro.br.
- Token do Cloudflare Web Analytics em `src/data/site.ts`.
- Validar como contar os cliques em `/agendar` (visita à página antes do redirecionamento, ou analytics da zona se o redirecionamento for feito no Cloudflare).
- Licença web da Moxa Bestine: hoje o arquivo é provisório (`public/fonts/moxa-bestine-provisoria.otf`) e bloqueia o build de produção.
