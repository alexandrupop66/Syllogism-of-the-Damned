/**
 * The form doesn't cut to another screen: its own controls travel into the new room.
 * No timers, browser globals or DOM are needed to test the flight plan.
 */
export const SOURCES_TO_FRAGMENTS = Object.freeze([
  Object.freeze({ id: 'identity', source: '.input-wrap', target: '[data-piece="identity"]' }),
  Object.freeze({ id: 'consent', source: '.form-footnote', target: '[data-piece="consent"]' }),
  Object.freeze({ id: 'authority', source: '#submitApplication', target: '[data-piece="authority"]' })
]);

export const FLIGHT_DURATION_MS = 1050;

export function planFlight(source, target, index = 0) {
  if (![source, target].every(r => r && [r.left, r.top, r.width, r.height].every(Number.isFinite))) {
    throw new TypeError('Flight rectangles must be finite.');
  }
  if (source.width <= 0 || source.height <= 0 || target.width <= 0 || target.height <= 0) {
    throw new RangeError('Flight rectangles must have positive area.');
  }
  const deltaX = target.left + target.width / 2 - (source.left + source.width / 2);
  const deltaY = target.top + target.height / 2 - (source.top + source.height / 2);
  const scaleX = target.width / source.width;
  const scaleY = target.height / source.height;
  const sign = index === 1 ? 1 : -1;
  return [
    { transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)', opacity: 0.94, offset: 0 },
    { transform: `translate(${deltaX * .12}px, ${-38 - index * 9}px) rotate(${sign * 8}deg) scale(.95, .95)`, opacity: 1, offset: .22 },
    { transform: `translate(${deltaX * .74}px, ${deltaY * .68 - 38}px) rotate(${-sign * 7}deg) scale(${Math.max(.38, scaleX * 1.18)}, ${Math.max(.42, scaleY * 1.18)})`, opacity: 1, offset: .72 },
    { transform: `translate(${deltaX}px, ${deltaY}px) rotate(0deg) scale(${scaleX}, ${scaleY})`, opacity: 0, offset: 1 }
  ];
}

function makeGhost(source, id, name) {
  const ghost = document.createElement('div');
  ghost.className = `metamorph-shard metamorph-shard--${id}`;
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  const clone = source.cloneNode(true);
  clone.removeAttribute('id');
  clone.removeAttribute('for');
  for (const item of clone.querySelectorAll('[id], [for], [name], [required], [aria-describedby]')) {
    item.removeAttribute('id'); item.removeAttribute('for'); item.removeAttribute('name');
    item.removeAttribute('required'); item.removeAttribute('aria-describedby');
  }
  for (const input of clone.querySelectorAll('input')) {
    input.value = name;
    input.disabled = true;
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');
  }
  for (const button of clone.querySelectorAll('button')) {
    button.disabled = true; button.tabIndex = -1;
  }
  ghost.append(clone);
  return ghost;
}

/**
 *  One-scene, no-dependency transition. The return value is a cleanup function.
 *  The calling state machine owns state changes and focus, never the animation.
 */
export async function animateFormToPuzzle({ stage, form, fracture, name }) {
  const origin = SOURCES_TO_FRAGMENTS.map(({ id, source, target }) => ({
    id, source: form.querySelector(source), target: fracture.querySelector(target)
  }));
  if (origin.some(entry => !entry.source || !entry.target)) return;
  const before = origin.map(entry => entry.source.getBoundingClientRect());
  const layer = document.createElement('div');
  layer.className = 'metamorph-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  const ghosts = origin.map(({ id, source }, index) => {
    const rect = before[index];
    const ghost = makeGhost(source, id, name);
    Object.assign(ghost.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    layer.append(ghost);
    return ghost;
  });
  document.body.append(layer);
  fracture.hidden = false;
  fracture.inert = true;
  fracture.setAttribute('aria-hidden', 'true');
  stage.classList.add('transmuting');
  const after = origin.map(entry => entry.target.getBoundingClientRect());
  let animations = [];
  try {
    // Force style flush before revealing the hidden under-scene.
    fracture.getBoundingClientRect();
    stage.classList.add('reveal-void');
    animations = ghosts.map((ghost, index) => ghost.animate(planFlight(before[index], after[index], index), {
      duration: FLIGHT_DURATION_MS,
      delay: index * 65,
      easing: 'cubic-bezier(.19, .79, .24, 1)',
      fill: 'forwards'
    }));
    await Promise.all(animations.map(animation => animation.finished));
  } finally {
    animations.forEach(animation => animation.cancel());
    layer.remove();
    fracture.inert = false;
    fracture.removeAttribute('aria-hidden');
    fracture.classList.add('entered-from-form');
    stage.classList.remove('transmuting', 'reveal-void');
  }
}
