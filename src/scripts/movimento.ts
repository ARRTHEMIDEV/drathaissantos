// Sistema de movimento do site. Liga os efeitos por atributo:
//   data-revelar="linhas"    títulos revelados linha a linha (máscara)
//   data-revelar="palavras"  palavras acendem conforme a rolagem
//   data-revelar="subir"     entra subindo (data-revelar-filhos: um por filho)
//   data-revelar="imagem"    imagem abre como cortina, de baixo para cima
//   data-parallax="12"       imagem desliza dentro da moldura (% de deslocamento)
//   data-deslizar="-40"      elemento corre na horizontal com a rolagem
//   data-desenhar            linha cresce com a rolagem
//   data-acender             recebe .aceso ao passar pelo centro da tela
//   data-magnetico           botão atraído pelo ponteiro
//   data-marquee             faixa rolante que acelera com a rolagem
//   data-horizontal          seção fixa com trilho horizontal (desktop)
//   data-intro               espera o fim da intro de marca para entrar
//
// Com "reduzir movimento" ou sem JavaScript, nada disso roda: o conteúdo fica
// visível e estático (as classes .movimento / .movimento-pronto controlam isso).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const html = document.documentElement;
const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const curva = 'expo.out';

declare global {
  interface Window {
    __lenis?: Lenis;
    __introFim?: Promise<void>;
  }
}

/** Resolve quando a intro de marca termina (ou na hora, se não houver intro). */
const introFim: Promise<void> = window.__introFim ?? Promise.resolve();

function rolagemSuave() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: { offset: -90 },
    autoRaf: false,
  });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('menu', (e) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start()));
  return lenis;
}

function gatilho(el: Element, inicio = 'top 86%') {
  return { trigger: el, start: inicio, once: true } satisfies ScrollTrigger.Vars;
}

function revelarLinhas() {
  document.querySelectorAll<HTMLElement>('[data-revelar="linhas"]').forEach((el) => {
    const naIntro = el.hasAttribute('data-intro');
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'linha-revelada',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        const anim = gsap.from(self.lines, {
          yPercent: 115,
          rotate: 2,
          duration: 1.25,
          ease: curva,
          stagger: 0.09,
          paused: naIntro,
          scrollTrigger: naIntro ? undefined : gatilho(el, 'top 88%'),
        });
        if (naIntro) introFim.then(() => anim.play());
        return anim;
      },
    });
  });
}

function revelarPalavras() {
  document.querySelectorAll<HTMLElement>('[data-revelar="palavras"]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'palavra' });
    gsap.set(el, { visibility: 'visible' });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: 0.6 },
      },
    );
  });
}

function revelarSubir() {
  document.querySelectorAll<HTMLElement>('[data-revelar="subir"]').forEach((el) => {
    const alvos = el.hasAttribute('data-revelar-filhos') ? [...el.children] : [el];
    const naIntro = el.hasAttribute('data-intro');
    gsap.set(el, { visibility: 'visible' });
    const anim = gsap.from(alvos, {
      y: 48,
      autoAlpha: 0,
      duration: 1.1,
      ease: curva,
      stagger: 0.1,
      delay: Number(el.dataset.atraso ?? 0),
      paused: naIntro,
      scrollTrigger: naIntro ? undefined : gatilho(el),
    });
    if (naIntro) introFim.then(() => anim.play());
  });
}

function revelarImagens() {
  document.querySelectorAll<HTMLElement>('[data-revelar="imagem"]').forEach((el) => {
    const img = el.querySelector('img');
    gsap.set(el, { visibility: 'visible' });
    const tl = gsap.timeline({ scrollTrigger: gatilho(el, 'top 85%') });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
    if (img) tl.from(img, { scale: 1.35, duration: 1.8, ease: curva }, 0);
  });
}

function parallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const forca = Number(el.dataset.parallax || 10);
    const alvo = el.querySelector('img') ?? el;
    gsap.set(alvo, { scale: 1 + (forca * 2.2) / 100 });
    gsap.fromTo(
      alvo,
      { yPercent: -forca },
      { yPercent: forca, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

function deslizar() {
  document.querySelectorAll<HTMLElement>('[data-deslizar]').forEach((el) => {
    const fim = Number(el.dataset.deslizar || -30);
    gsap.fromTo(
      el,
      { xPercent: 0 },
      { xPercent: fim, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

function desenhar() {
  document.querySelectorAll<HTMLElement>('[data-desenhar]').forEach((el) => {
    const alvo = el.dataset.desenhar ? document.querySelector(el.dataset.desenhar) ?? el.parentElement : el.parentElement;
    const horizontal = el.hasAttribute('data-desenhar-horizontal');
    gsap.fromTo(
      el,
      horizontal ? { scaleX: 0 } : { scaleY: 0 },
      {
        ...(horizontal ? { scaleX: 1 } : { scaleY: 1 }),
        transformOrigin: horizontal ? 'left center' : 'center top',
        ease: 'none',
        scrollTrigger: { trigger: alvo, start: 'top 70%', end: 'bottom 60%', scrub: true },
      },
    );
  });
}

function acender() {
  document.querySelectorAll<HTMLElement>('[data-acender]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 38%', toggleClass: { targets: el, className: 'aceso' } });
  });
}

function magneticos() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((el) => {
    const forca = Number(el.dataset.magnetico || 0.35);
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * forca);
      y((e.clientY - r.top - r.height / 2) * forca);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

function marquees(lenis: Lenis | null) {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const trilho = el.querySelector<HTMLElement>('[data-marquee-trilho]');
    if (!trilho) return;
    const segundos = Number(el.dataset.marquee || 28);
    const loop = gsap.to(trilho, { xPercent: -50, ease: 'none', duration: segundos, repeat: -1 });
    // A faixa acelera com a velocidade da rolagem e inverte quando a pessoa sobe.
    let direcao = 1;
    let espera: number | undefined;
    lenis?.on('scroll', ({ velocity }: { velocity: number }) => {
      if (velocity) direcao = velocity < 0 ? -1 : 1;
      const extra = Math.min(Math.abs(velocity) / 5, 6);
      gsap.to(loop, { timeScale: direcao * (1 + extra), duration: 0.25, overwrite: true });
      window.clearTimeout(espera);
      espera = window.setTimeout(() => gsap.to(loop, { timeScale: direcao, duration: 1.4, overwrite: true }), 160);
    });
  });
}

function horizontais() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 64rem)', () => {
    document.querySelectorAll<HTMLElement>('[data-horizontal]').forEach((secao) => {
      const trilho = secao.querySelector<HTMLElement>('[data-horizontal-trilho]');
      const progresso = secao.querySelectorAll<HTMLElement>('[data-horizontal-passo]');
      if (!trilho) return;
      const distancia = () => trilho.scrollWidth - window.innerWidth;
      // A rolagem empurra os cartões pela lateral mais rápido do que o lazy
      // do navegador costuma reagir. Uma tela antes da seção, as fotos do
      // trilho começam a carregar, para nenhum cartão passar vazio.
      ScrollTrigger.create({
        trigger: secao,
        start: 'top bottom+=100%',
        once: true,
        onEnter: () => secao.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager')),
      });
      gsap.to(trilho, {
        x: () => -distancia(),
        ease: 'none',
        scrollTrigger: {
          trigger: secao,
          pin: true,
          scrub: 0.8,
          end: () => `+=${distancia()}`,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const ativo = Math.min(progresso.length - 1, Math.floor(self.progress * progresso.length));
            progresso.forEach((p, i) => p.classList.toggle('aceso', i <= ativo));
          },
        },
      });
    });
  });
}

function cabecalho(lenis: Lenis | null) {
  const cab = document.querySelector<HTMLElement>('[data-cabecalho]');
  if (!cab) return;
  let ultimo = 0;
  // Some ao descer e volta ao subir. Só muda de estado com deslocamento real,
  // para os passos pequenos da rolagem suave não piscarem o cabeçalho.
  const atualizar = (y: number) => {
    cab.classList.toggle('cabecalho--rolado', y > 40);
    const delta = y - ultimo;
    if (y < 220 || document.querySelector('dialog[open]')) cab.classList.remove('cabecalho--oculto');
    else if (delta > 6) cab.classList.add('cabecalho--oculto');
    else if (delta < -6) cab.classList.remove('cabecalho--oculto');
    if (Math.abs(delta) > 6 || y < 220) ultimo = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }: { scroll: number }) => atualizar(scroll));
  else window.addEventListener('scroll', () => atualizar(window.scrollY), { passive: true });
  atualizar(window.scrollY);
}

function iniciar() {
  const lenis = reduzido ? null : rolagemSuave();
  cabecalho(lenis);
  if (reduzido) {
    html.classList.add('movimento-pronto');
    return;
  }
  revelarLinhas();
  revelarPalavras();
  revelarSubir();
  // O parallax define a escala da imagem antes; a revelação termina nessa escala.
  parallax();
  revelarImagens();
  deslizar();
  desenhar();
  acender();
  magneticos();
  marquees(lenis);
  horizontais();
  html.classList.add('movimento-pronto');
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.fonts.ready.then(iniciar);

export { gsap, ScrollTrigger, introFim, reduzido };
