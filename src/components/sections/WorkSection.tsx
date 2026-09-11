import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LINKS } from "@site";

/**
 * The two axes of the business, and the line that runs from one to the other.
 *
 * The entrance is React state rather than a class toggled straight onto the
 * node: `go` lives in state so a re-render can never drop it. Everything the
 * animation mutates imperatively (`--len`, `--mx`, `--my`, the SVG geometry)
 * is on attributes React does not control here — no `style` or `d` prop is
 * passed — so React leaves those alone between renders.
 */
export default function WorkSection() {
  const { t } = useTranslation();
  const [go, setGo] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPolygonElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const tropsRef = useRef<HTMLLIElement>(null);

  const support = t('work.support.items', { returnObjects: true }) as string[];
  const software = t('work.software.items', { returnObjects: true }) as string[];

  useEffect(() => {
    const stage = stageRef.current;
    const bridge = bridgeRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const head = headRef.current;
    const tag = tagRef.current;
    const trops = tropsRef.current;
    if (!stage || !bridge || !svg || !path || !head || !tag || !trops) return;

    const axes = stage.querySelectorAll<HTMLElement>('.axis');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 861px)');

    function layout() {
      if (!wide.matches) return false;
      const w = bridge!.clientWidth;
      const h = bridge!.clientHeight;
      const lx = axes[0].offsetLeft + axes[0].offsetWidth / 2 - bridge!.offsetLeft;
      const rx = axes[1].offsetLeft + axes[1].offsetWidth / 2 - bridge!.offsetLeft;
      svg!.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      path!.setAttribute('d', 'M' + lx + ' 0 V' + (h - 1) + ' H' + rx + ' V12');
      head!.setAttribute('points', (rx - 6) + ',12 ' + (rx + 6) + ',12 ' + rx + ',1');
      const len = Math.ceil(path!.getTotalLength());
      path!.style.transition = 'none';
      path!.style.strokeDasharray = len + ' ' + len;
      stage!.style.setProperty('--len', String(len));
      path!.getBoundingClientRect();
      path!.style.transition = '';
      return true;
    }

    function travel() {
      const len = path!.getTotalLength();
      const frames: Keyframe[] = [];
      for (let i = 0; i <= 48; i++) {
        const pt = path!.getPointAtLength((len * i) / 48);
        frames.push({ transform: 'translate(' + pt.x + 'px,' + pt.y + 'px) translate(-50%,-50%)' });
      }
      tag!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' });
      tag!
        .animate(frames, { duration: 1200, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'forwards' })
        .finished.then(() => {
          tag!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: 'forwards' });
          trops!.animate(
            [{ color: 'var(--ink)' }, { color: '#1F4A96', offset: 0.25 }, { color: 'var(--ink)' }],
            { duration: 1600, easing: 'ease-out' }
          );
        })
        .catch(() => {});
    }

    let played = false;
    let travelTimer: number | undefined;
    function play() {
      if (played) return;
      played = true;
      const hasBridge = layout();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setGo(true);
          if (!reduce && hasBridge) travelTimer = window.setTimeout(travel, 1800);
        })
      );
    }

    let io: IntersectionObserver | undefined;
    function init() {
      layout();
      if (reduce || !('IntersectionObserver' in window)) {
        play();
        return;
      }
      io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            play();
            io?.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(stage!);
    }

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
    else init();

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onPointerMove = (e: PointerEvent) => {
      const ax = e.currentTarget as HTMLElement;
      const r = ax.getBoundingClientRect();
      ax.style.setProperty('--mx', e.clientX - r.left + 'px');
      ax.style.setProperty('--my', e.clientY - r.top + 'px');
    };
    if (fine) axes.forEach((ax) => ax.addEventListener('pointermove', onPointerMove));

    return () => {
      window.removeEventListener('resize', onResize);
      io?.disconnect();
      if (travelTimer) window.clearTimeout(travelTimer);
      if (fine) axes.forEach((ax) => ax.removeEventListener('pointermove', onPointerMove));
    };
  }, []);

  return (
    <section id="work" className="work" aria-labelledby="work-h">
      <h2 id="work-h" className="sr-only">{t('work.heading')}</h2>
      <div className={go ? 'stage go' : 'stage'} ref={stageRef}>
        <div className="axes">
          <div className="axis axis-l">
            <div className="axis-head">
              <p className="axis-name">{t('work.support.name')}</p>
            </div>
            <ul className="items">
              {support.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="axis-act">
              <a href="#contact">{t('work.support.cta')}</a>
            </p>
          </div>
          <div className="axis axis-r">
            <div className="axis-head">
              <p className="axis-name">{t('work.software.name')}</p>
              <span className="mini-plate" title="Teheranro AI Studio">
                <span>
                  <b>테헤란로 AI 스튜디오</b>
                  <i>Teheranro AI Studio</i>
                </span>
              </span>
            </div>
            <ul className="items">
              {software.map((item) =>
                item === 'TROPS' ? (
                  <li key={item} id="row-trops" ref={tropsRef}>
                    <a href={LINKS.trops}>{item}</a>
                  </li>
                ) : (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
            <p className="axis-act">
              <a href={LINKS.teheranroai}>{t('work.software.cta')}</a>
            </p>
          </div>
        </div>
        <div className="bridge" id="bridge" aria-hidden="true" ref={bridgeRef}>
          <svg id="bridge-svg" ref={svgRef}>
            <path id="bridge-path" d="" ref={pathRef} />
            <polygon id="bridge-head" points="" ref={headRef} />
          </svg>
          <span className="tag" id="bridge-tag" ref={tagRef}>
            {t('work.bridgeTag')}
          </span>
        </div>
        <p className="bridge-label">{t('work.bridgeLabel')}</p>
      </div>
    </section>
  );
}
