import { initialState, submitName, selectWord, rewriteRule, enterExit, restart, safeLabel } from './engine.mjs';
import { buildArchitecture } from './architecture.mjs';
import { animateFormToPuzzle } from './metamorphosis.mjs';

const $ = selector => document.querySelector(selector);
const app = { state: initialState(), pending: false, sequence: 0 };
const acts = { form: $('#formAct'), fracture: $('#fractureAct'), escaped: $('#escapedAct') };
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause = (ms) => new Promise(resolve => window.setTimeout(resolve, ms));
buildArchitecture($('#architecture'));

function render() {
  const { state } = app;
  document.body.dataset.act = state.act;
  document.body.dataset.rule = state.ruleRewritten ? 'rewritten' : 'locked';
  for (const [id, section] of Object.entries(acts)) section.hidden = state.act !== id;
  $('#signal').textContent = {form:'SYSTEM STABLE', fracture:state.ruleRewritten?'LAW REWRITTEN':'REALITY COMPROMISED', escaped:'SYSTEM UNAVAILABLE'}[state.act];
  $('#statusText').textContent = state.message;
  $('#resetAnytime').hidden = state.act === 'form';
  $('#escapeName').textContent = safeLabel(state.name);
  $('#notToken').hidden = state.ruleRewritten;
  $('#notToken').disabled = state.ruleRewritten;
  $('#notToken').classList.toggle('selected', state.wordSelected);
  $('#notToken').setAttribute('aria-pressed', String(state.wordSelected));
  $('#notSlot').disabled = state.ruleRewritten;
  $('#notSlot').classList.toggle('ready', state.wordSelected);
  $('#notSlot').classList.toggle('filled', state.ruleRewritten);
  $('#slotText').textContent = state.ruleRewritten ? 'NOT' : '_ _ _';
  $('#notSlot').setAttribute('aria-label', state.ruleRewritten ? 'NOT has been moved into the declaration' : 'Empty space in declaration');
  $('#enterExit').hidden = !state.ruleRewritten;
  $('#puzzleHeading').textContent = state.ruleRewritten ? 'You changed the law.' : 'Rewrite the law.';
  $('#puzzleHint').textContent = state.ruleRewritten ? 'The door obeys. Walk through the exit.' : 'Move the highlighted word into the empty space. The room will obey.';
  $('#fractureDescription').textContent = state.ruleRewritten ? 'The impossible decision has been undone. Even the walls must comply.' : 'The Bureau has made a decision. Its language is the lock.';
  $('#puzzleStatus').textContent = state.ruleRewritten ? 'ONE WORD MOVED. BOTH RULES CHANGED.' : 'ONE WORD. TWO RULES. ONE WAY OUT.';
  $('#worldCaption').textContent = state.ruleRewritten ? 'EXIT AUTHORISED · YOUR DECLARATION IS NOW VOID.' : 'THE DOOR RECOGNISES ONLY WRITTEN LAW.';
}

function focusAct(selector) {
  const title = $(selector);
  title.setAttribute('tabindex','-1');
  title.focus({preventScroll:true});
}

$('#applicationForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (app.pending || app.state.act !== 'form') return;
  const next = submitName(app.state, $('#applicantName').value);
  if (next.act === 'form') {
    $('#nameError').textContent = next.message;
    $('#applicantName').focus();
    return;
  }
  $('#nameError').textContent = '';
  const seq = ++app.sequence;
  app.pending = true;
  $('#submitApplication').disabled = true;
  try {
    if (!reducedMotion()) await animateFormToPuzzle({stage:$('#stage'),form:$('#formAct'),fracture:$('#fractureAct'),architecture:$('#architecture'),name:next.name});
  } catch (error) {
    console.warn('Cinematic transition unavailable. Entering the puzzle directly.', error);
    $('#fractureAct').inert = false;
    $('#fractureAct').removeAttribute('aria-hidden');
    $('#stage').classList.remove('transmuting','reveal-void');
  } finally {
    if (seq === app.sequence) {
      app.state = next;
      app.pending = false;
      $('#submitApplication').disabled = false;
      render();
      focusAct('#fractureTitle');
    }
  }
});

function chooseWord() {
  if (app.pending || app.state.act !== 'fracture' || app.state.ruleRewritten) return;
  app.state = selectWord(app.state);
  render();
  if (app.state.wordSelected) $('#notSlot').classList.add('attention');
  else $('#notSlot').classList.remove('attention');
}

async function commitRule(method) {
  if (app.pending) return;
  const next = rewriteRule(app.state, method);
  if (next === app.state) {
    if (!app.state.ruleRewritten) {
      $('#worldCaption').textContent = 'FIRST SELECT THE HIGHLIGHTED WORD: NOT.';
      $('#notToken').focus({preventScroll:true});
    }
    return;
  }
  app.state = next;
  $('#notSlot').classList.remove('attention');
  render();
  if (!reducedMotion()) await pause(1120);
  if (app.state.ruleRewritten && app.state.act === 'fracture') $('#enterExit').focus({preventScroll:true});
}

const token = $('#notToken');
const slot = $('#notSlot');
let drag = null;
token.addEventListener('pointerdown', event => {
  if (event.button !== 0 || token.disabled || app.pending) return;
  drag = {id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
  token.setPointerCapture?.(event.pointerId);
});
token.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if (Math.hypot(dx,dy)>9) drag.moved=true;
  if (drag.moved) {
    token.classList.add('dragging');
    token.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-8,Math.min(8,dx*.02))}deg)`;
    const r=slot.getBoundingClientRect();
    slot.classList.toggle('hover-drop',event.clientX>=r.left-24 && event.clientX<=r.right+24 && event.clientY>=r.top-24 && event.clientY<=r.bottom+24);
  }
});
token.addEventListener('pointerup', event => {
  if (!drag || drag.id !== event.pointerId) return;
  const moved=drag.moved;
  drag=null;
  token.classList.remove('dragging');
  token.style.transform='';
  slot.classList.remove('hover-drop');
  if (!moved) return;
  const r=slot.getBoundingClientRect();
  const inside=event.clientX>=r.left-24 && event.clientX<=r.right+24 && event.clientY>=r.top-24 && event.clientY<=r.bottom+24;
  token.dataset.suppressClick='true';
  window.setTimeout(()=>delete token.dataset.suppressClick,0);
  if (inside) void commitRule('drag');
  else $('#worldCaption').textContent='MOVE THE WORD INTO THE HIGHLIGHTED EMPTY SPACE.';
});
token.addEventListener('pointercancel',()=>{drag=null;token.style.transform='';token.classList.remove('dragging');slot.classList.remove('hover-drop');});
token.addEventListener('click',()=>{
  if (token.dataset.suppressClick==='true'){delete token.dataset.suppressClick;return;}
  chooseWord();
});
slot.addEventListener('click',()=>void commitRule('select'));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && app.state.act==='fracture' && app.state.wordSelected){
    event.preventDefault();chooseWord();token.focus({preventScroll:true});
  }
});

$('#enterExit').addEventListener('click', async () => {
  if(app.pending || !app.state.ruleRewritten || app.state.act!=='fracture')return;
  const next=enterExit(app.state);
  const seq=++app.sequence;
  app.pending=true;
  document.body.classList.add('crossing-portal');
  if (!reducedMotion()) await pause(850);
  if (seq!==app.sequence) return;
  app.state=next;
  app.pending=false;
  document.body.classList.remove('crossing-portal');
  render();focusAct('#escapedTitle');
});

function resetAll(){
  ++app.sequence;
  app.state=restart();app.pending=false;
  $('#fractureAct').inert=false;
  $('#fractureAct').removeAttribute('aria-hidden');
  $('#fractureAct').classList.remove('entered-from-form');
  $('#stage').classList.remove('transmuting','reveal-void');
  document.body.classList.remove('crossing-portal');
  $('#applicantName').value='';
  $('#nameError').textContent='';
  $('#submitApplication').disabled=false;
  $('#notSlot').classList.remove('attention','hover-drop');
  render();$('#applicantName').focus({preventScroll:true});
}
$('#restartButton').addEventListener('click',resetAll);
$('#resetAnytime').addEventListener('click',resetAll);
render();
