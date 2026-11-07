import { initialState, submitName, placePiece, openDoor, restart, safeLabel } from './engine.mjs';

const $ = (selector) => document.querySelector(selector);
const app = { state: initialState(), pending: false };
const acts = { form: $('#formAct'), fracture: $('#fractureAct'), verdict: $('#verdictAct'), escaped: $('#escapedAct') };

function render() {
  const { state } = app;
  document.body.dataset.act = state.act;
  for (const [id, section] of Object.entries(acts)) section.hidden = state.act !== id;
  $('#signal').textContent = {
    form: 'SYSTEM STABLE', fracture: 'REALITY COMPROMISED', verdict: 'VERDICT ISSUED', escaped: 'SYSTEM UNAVAILABLE'
  }[state.act];
  $('#statusText').textContent = state.message;
  $('#resetAnytime').hidden = state.act === 'form';
  $('#identityText').textContent = safeLabel(state.name);
  $('#verdictName').textContent = safeLabel(state.name);
  $('#escapeName').textContent = safeLabel(state.name);
  $('#progressNumber').textContent = String(state.collected.length);
  $('#progressFill').style.width = `${state.collected.length * 100 / 3}%`;
  for (const button of document.querySelectorAll('[data-piece]')) {
    const recovered = state.collected.includes(button.dataset.piece);
    button.disabled = recovered;
    button.classList.toggle('recovered', recovered);
    button.setAttribute('aria-pressed', String(recovered));
  }
  for (const socket of document.querySelectorAll('[data-socket]')) {
    socket.classList.toggle('filled', state.collected.includes(socket.dataset.socket));
  }
  const words = [
    'EVIDENCE IS OUTSIDE ITS APPROVED POSITION.',
    'THE BUREAU ACKNOWLEDGES YOUR EXISTENCE.',
    'YOUR CONSENT HAS BEEN RETROACTIVELY ACCEPTED.',
    'YOUR REALITY HAS BEEN REASSEMBLED.'
  ];
  $('#worldCaption').textContent = words[state.collected.length];
}

$('#applicationForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const next = submitName(app.state, $('#applicantName').value);
  if (next.act === 'form') {
    $('#nameError').textContent = next.message;
    $('#applicantName').focus();
    return;
  }
  $('#nameError').textContent = '';
  app.pending = true;
  $('#stage').classList.add('rupture');
  window.setTimeout(() => {
    app.pending = false;
    app.state = next;
    $('#stage').classList.remove('rupture');
    render();
    $('#fractureTitle').setAttribute('tabindex','-1');
    $('#fractureTitle').focus({ preventScroll: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 390);
});

function recover(id) {
  if (app.state.act !== 'fracture' || app.pending) return;
  const next = placePiece(app.state, id);
  if (next === app.state) return;
  const element = document.querySelector(`[data-piece="${id}"]`);
  if (element) { element.style.transform = ''; element.classList.add('just-recovered'); }
  app.state = next;
  render();
  if (next.act === 'verdict') {
    $('#verdictTitle').setAttribute('tabindex','-1');
    $('#verdictTitle').focus({preventScroll:true});
  }
}

for (const button of document.querySelectorAll('[data-piece]')) {
  // Pointer movement is optional; click, keyboard, and touch activation work independently.
  let point = null;
  button.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || button.disabled) return;
    point = { startX:e.clientX, startY:e.clientY, originalX:e.clientX, originalY:e.clientY, moved:false, id:e.pointerId };
    button.setPointerCapture?.(e.pointerId);
  });
  button.addEventListener('pointermove', (e) => {
    if (!point || point.id !== e.pointerId || button.disabled) return;
    const dx = e.clientX - point.startX, dy = e.clientY - point.startY;
    if (Math.hypot(dx,dy) > 8) point.moved = true;
    if (point.moved) button.style.transform = `translate(${dx}px,${dy}px) rotate(0deg) scale(1.04)`;
  });
  button.addEventListener('pointerup', (e) => {
    if (!point || point.id !== e.pointerId) return;
    const moved=point.moved;
    button.style.transform='';
    point=null;
    if (moved) {
      const socket=document.querySelector(`[data-socket="${button.dataset.piece}"]`);
      const r=socket?.getBoundingClientRect();
      const inside=r && e.clientX>=r.left-30 && e.clientX<=r.right+30 && e.clientY>=r.top-30 && e.clientY<=r.bottom+30;
      if (inside) recover(button.dataset.piece);
      else {
        $('#worldCaption').textContent = 'THAT FRAGMENT BELONGS IN ITS MATCHING OUTLINE. OR TAP TO PLACE.';
      }
      button.dataset.preventClick='true';
      window.setTimeout(() => { delete button.dataset.preventClick; }, 0);
    }
  });
  button.addEventListener('pointercancel', () => { point=null; button.style.transform=''; });
  button.addEventListener('click', () => {
    if (button.dataset.preventClick === 'true') { delete button.dataset.preventClick; return; }
    recover(button.dataset.piece);
  });
}

$('#openDoorButton').addEventListener('click', () => {
  app.state = openDoor(app.state);
  render();
  $('#escapedTitle').setAttribute('tabindex','-1');
  $('#escapedTitle').focus({preventScroll:true});
});
function resetAll() {
  app.state=restart(); app.pending=false;
  $('#applicantName').value=''; $('#nameError').textContent='';
  for (const button of document.querySelectorAll('[data-piece]')) { button.classList.remove('just-recovered'); button.style.transform=''; delete button.dataset.preventClick; }
  render(); $('#applicantName').focus({preventScroll:true});
}
$('#restartButton').addEventListener('click', resetAll);
$('#resetAnytime').addEventListener('click', resetAll);
render();
