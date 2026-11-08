import { SHARD_COLUMNS, SHARD_ROWS, SHARD_COUNT } from './architecture.mjs';

export const FLIGHT_DURATION_MS = 1450;

export function planShardFlight(formRect, targetRect, index) {
  for (const rect of [formRect, targetRect]) {
    if (!rect || !['left', 'top', 'width', 'height'].every(key => Number.isFinite(rect[key]))) throw new TypeError('Invalid shard rectangle.');
    if (rect.width <= 0 || rect.height <= 0) throw new RangeError('Non-positive shard rectangle.');
  }
  if (!Number.isInteger(index) || index < 0 || index >= SHARD_COUNT) throw new RangeError('Invalid shard index.');
  const col = index % SHARD_COLUMNS, row = Math.floor(index / SHARD_COLUMNS);
  const width = formRect.width / SHARD_COLUMNS, height = formRect.height / SHARD_ROWS;
  const sourceX = formRect.left + col * width, sourceY = formRect.top + row * height;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const dx = targetX - (sourceX + width / 2);
  const dy = targetY - (sourceY + height / 2);
  const tilt = (index % 2 ? 1 : -1) * (16 + index % 5 * 5);
  return { col, row, width, height, sourceX, sourceY, dx, dy, tilt, scaleX: targetRect.width / width, scaleY: targetRect.height / height };
}

function inertClone(form, name, rect) {
  const clone = form.cloneNode(true);
  clone.removeAttribute('id');
  for (const el of clone.querySelectorAll('[id],[for],[name],[required],[aria-describedby]')) {
    for (const attr of ['id','for','name','required','aria-describedby']) el.removeAttribute(attr);
  }
  for (const input of clone.querySelectorAll('input')) {
    input.value = name; input.disabled = true; input.tabIndex = -1;
  }
  for (const button of clone.querySelectorAll('button')) {
    button.disabled = true; button.tabIndex = -1;
  }
  clone.setAttribute('aria-hidden','true');
  clone.inert = true;
  clone.classList.add('paper-copy');
  clone.style.cssText = `width:${rect.width}px;height:${rect.height}px;margin:0;position:absolute;top:0;left:0;animation:none;transform:none;`;
  return clone;
}

/** 32 slices of the real form fly into 32 visible structural pieces in the chamber. */
export async function animateFormToPuzzle({stage, form, fracture, architecture, name}) {
  const formRect = form.getBoundingClientRect();
  const targets = [...architecture.querySelectorAll('[data-shard]')];
  if (targets.length !== SHARD_COUNT || formRect.width <= 0 || formRect.height <= 0) return;
  // Target elements are hidden before we reveal the chamber. Measuring them early
  // produces zero-area rectangles, making the transition silently fall back.
  fracture.hidden = false;
  fracture.inert = true;
  fracture.setAttribute('aria-hidden','true');
  stage.classList.add('transmuting');
  fracture.getBoundingClientRect();
  const originals = targets.map((target, i) => planShardFlight(formRect, target.getBoundingClientRect(), i));
  const overlay = document.createElement('div');
  overlay.className = 'metamorph-layer metamorph-layer-v3';
  overlay.inert = true;
  overlay.setAttribute('aria-hidden','true');
  const shards = originals.map((p, i) => {
    const tile = document.createElement('div');
    tile.className = 'paper-shard-flight';
    Object.assign(tile.style,{left:`${p.sourceX}px`,top:`${p.sourceY}px`,width:`${p.width + .7}px`,height:`${p.height + .7}px`});
    const copy = inertClone(form, name, formRect);
    copy.style.left = `${-p.col * p.width}px`;
    copy.style.top = `${-p.row * p.height}px`;
    tile.append(copy);
    overlay.append(tile);
    return tile;
  });
  document.body.append(overlay);
  const animations=[];
  try {
    fracture.getBoundingClientRect();
    stage.classList.add('reveal-void');
    for (let i=0;i<shards.length;i++) {
      const p=originals[i];
      animations.push(shards[i].animate([
        {offset:0,opacity:1,transform:'translate(0px, 0px) rotate(0deg) scale(1)'},
        {offset:.24,opacity:1,transform:`translate(${p.dx*.08}px,${-28-(i%4)*13}px) rotate(${p.tilt*.45}deg) scale(.96)`},
        {offset:.68,opacity:.95,transform:`translate(${p.dx*.72}px,${p.dy*.72-24}px) rotate(${p.tilt}deg) scale(.75)`},
        {offset:1,opacity:0,transform:`translate(${p.dx}px,${p.dy}px) rotate(0deg) scale(${Math.min(p.scaleX,p.scaleY)})`}
      ],{duration:FLIGHT_DURATION_MS,delay:(i%8)*28 + Math.floor(i/8)*46,easing:'cubic-bezier(.18,.82,.18,1)',fill:'forwards'}));
    }
    await Promise.all(animations.map(a=>a.finished));
  } finally {
    animations.forEach(a=>a.cancel());
    overlay.remove();
    fracture.inert = false;
    fracture.removeAttribute('aria-hidden');
    fracture.classList.add('entered-from-form');
    stage.classList.remove('transmuting','reveal-void');
  }
}
