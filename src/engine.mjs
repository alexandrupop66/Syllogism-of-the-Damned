export const PIECE_IDS = Object.freeze(['identity', 'consent', 'authority']);
export const MAX_NAME_LENGTH = 32;

export function cleanName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
}

export function validateName(value) {
  const name = cleanName(value);
  if (name.length < 2) return { ok: false, error: 'Please enter at least two characters.' };
  return { ok: true, name };
}

export function initialState() {
  return { act: 'form', name: '', collected: [], message: 'Awaiting applicant.' };
}

export function submitName(state, rawName) {
  if (state.act !== 'form') return state;
  const result = validateName(rawName);
  if (!result.ok) return { ...state, message: result.error };
  return { act: 'fracture', name: result.name, collected: [], message: 'Application rejected. Reassemble the evidence.' };
}

export function placePiece(state, pieceId) {
  if (state.act !== 'fracture' || !PIECE_IDS.includes(pieceId) || state.collected.includes(pieceId)) return state;
  const collected = [...state.collected, pieceId];
  if (collected.length === PIECE_IDS.length) {
    return { ...state, collected, act: 'verdict', message: 'All evidence recovered. The verdict is ready.' };
  }
  return { ...state, collected, message: `${collected.length} of ${PIECE_IDS.length} fragments recovered.` };
}

export function openDoor(state) {
  if (state.act !== 'verdict') return state;
  return { ...state, act: 'escaped', message: 'You have escaped the application.' };
}

export function restart() { return initialState(); }

export function safeLabel(name) {
  const s = cleanName(name);
  return s || 'APPLICANT';
}
