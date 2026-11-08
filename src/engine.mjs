/** Pure, deterministic game state. The animated world never grants authority. */
export const MAX_NAME_LENGTH = 32;
export const RULE_WORD = 'NOT';

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
  return { act: 'form', name: '', wordSelected: false, ruleRewritten: false, message: 'Awaiting applicant.' };
}
export function submitName(state, rawName) {
  if (state.act !== 'form') return state;
  const result = validateName(rawName);
  if (!result.ok) return { ...state, message: result.error };
  return { act: 'fracture', name: result.name, wordSelected: false, ruleRewritten: false, message: 'The impossible rule awaits rewriting.' };
}
export function selectWord(state) {
  if (state.act !== 'fracture' || state.ruleRewritten) return state;
  return { ...state, wordSelected: !state.wordSelected, message: state.wordSelected ? 'Word returned to the first rule.' : 'NOT selected. Place it in the empty space.' };
}
export function rewriteRule(state, method = 'select') {
  if (state.act !== 'fracture' || state.ruleRewritten) return state;
  if (method !== 'drag' && !state.wordSelected) return state;
  if (!['select', 'drag'].includes(method)) return state;
  return { ...state, wordSelected: false, ruleRewritten: true, message: 'The law is rewritten. The exit is now open.' };
}
export function enterExit(state) {
  if (state.act !== 'fracture' || !state.ruleRewritten) return state;
  return { ...state, act: 'escaped', message: 'You have escaped the application.' };
}
export function restart() { return initialState(); }
export function safeLabel(name) { return cleanName(name) || 'APPLICANT'; }
