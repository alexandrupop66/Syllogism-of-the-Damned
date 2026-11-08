/** 32 decorative panels become walls, ceiling and floor of the chamber. */
export const SHARD_COLUMNS = 8;
export const SHARD_ROWS = 4;
export const SHARD_COUNT = SHARD_COLUMNS * SHARD_ROWS;

export function panelPosition(index) {
  if (!Number.isInteger(index) || index < 0 || index >= SHARD_COUNT) throw new RangeError('Invalid panel index.');
  const side = Math.floor(index / 8);
  const step = index % 8;
  if (side === 0) return { x: 9 + step * 11.7, y: 7 + (step % 2) * 2.5, rotation: (step % 2 ? -6 : 5) };
  if (side === 1) return { x: 3 + (step % 2) * 5, y: 17 + step * 9.2, rotation: -13 + step * .5 };
  if (side === 2) return { x: 86 + (step % 2) * 5, y: 17 + step * 9.2, rotation: 13 - step * .5 };
  return { x: 9 + step * 11.7, y: 91 - (step % 2) * 2.5, rotation: (step % 2 ? 6 : -5) };
}

export function buildArchitecture(host) {
  const fragments = [];
  if (!host) throw new TypeError('Missing architecture host.');
  host.replaceChildren();
  for (let i = 0; i < SHARD_COUNT; i++) {
    const p = panelPosition(i);
    const node = document.createElement('span');
    node.className = `architecture-shard architecture-shard--${Math.floor(i / 8)}`;
    node.style.cssText = `--x:${p.x}%;--y:${p.y}%;--angle:${p.rotation}deg;--i:${i};`;
    node.dataset.shard = String(i);
    node.setAttribute('aria-hidden', 'true');
    host.append(node);
    fragments.push(node);
  }
  return fragments;
}
