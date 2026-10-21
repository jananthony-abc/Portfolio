(() => {
  const portrait = document.querySelector('.canvas-portrait');
  if (!portrait) return;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let point = null;
  const properties = ['--portrait-x', '--portrait-y', '--portrait-rx', '--portrait-ry', '--portrait-light-x', '--portrait-light-y'];

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    point = null;
    portrait.classList.remove('is-portrait-active');
    properties.forEach(property => portrait.style.removeProperty(property));
  }

  function paint() {
    frame = 0;
    if (!point || !finePointer.matches || reducedMotion.matches) return;
    const bounds = portrait.querySelector('.portrait-scene').getBoundingClientRect();
    const x = Math.max(-.5, Math.min(.5, (point.x - bounds.left) / bounds.width - .5));
    const y = Math.max(-.5, Math.min(.5, (point.y - bounds.top) / bounds.height - .5));
    portrait.style.setProperty('--portrait-x', `${x * 8}px`);
    portrait.style.setProperty('--portrait-y', `${y * 5}px`);
    portrait.style.setProperty('--portrait-rx', `${-y * 5}deg`);
    portrait.style.setProperty('--portrait-ry', `${x * 6}deg`);
    portrait.style.setProperty('--portrait-light-x', `${(x + .5) * 100}%`);
    portrait.style.setProperty('--portrait-light-y', `${(y + .5) * 100}%`);
  }

  portrait.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || !finePointer.matches) return;
    portrait.classList.add('is-portrait-active');
  });
  portrait.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !finePointer.matches || reducedMotion.matches) return;
    point = {x: event.clientX, y: event.clientY};
    if (!frame) frame = requestAnimationFrame(paint);
  }, {passive: true});
  portrait.addEventListener('pointerleave', reset);
  portrait.addEventListener('pointercancel', reset);
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
})();
