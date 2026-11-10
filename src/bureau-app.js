import {initialState,selectSlot,swapSlots,undo,reset,submit,nextCase,evaluate} from './bureau-engine.mjs';

const el=id=>document.getElementById(id);
let state=initialState(1);
let dragSource=null;
const cues={
  DETAINED:{door:'REFUSED',small:'DETENTION HOLD',caption:'THE DOOR OBEYS THE LEDGER, NOT YOU.'},
  UNSUPPORTED:{door:'UNPROVEN',small:'NO AUTHORITY',caption:'NO PROOF. NO RELEASE.'},
  CONTRADICTION:{door:'CONTRADICTION',small:'ORDER 7',caption:'THE RECORD DISAGREES WITH ITSELF.'},
  GOAL:{door:'PROVEN',small:'AUTHORISED',caption:'THE DOOR HAS NO CHOICE.'}
};
function node(tag,className,text){
  const item=document.createElement(tag);
  if(className)item.className=className;
  if(text!==undefined)item.textContent=text;
  return item;
}
function classToken(word, index) {
  const btn=node('button','class-token',word);
  btn.type='button';btn.draggable=!state.solved;btn.dataset.slot=String(index);
  btn.setAttribute('aria-label',`${word}. Select to exchange with another stamp.`);
  btn.setAttribute('aria-pressed',String(state.selected===index));
  if(state.selected===index)btn.classList.add('selected');
  if(state.solved)btn.disabled=true;
  btn.addEventListener('click',()=>{state=selectSlot(state,index);render();});
  btn.addEventListener('dragstart',event=>{
    if(state.solved){event.preventDefault();return;}
    dragSource=index;
    event.dataTransfer.effectAllowed='move';
    event.dataTransfer.setData('text/plain',String(index));
  });
  btn.addEventListener('dragover',event=>{
    if(dragSource===null||dragSource===index||state.solved)return;
    event.preventDefault();event.dataTransfer.dropEffect='move';btn.classList.add('drop-target');
  });
  btn.addEventListener('dragleave',()=>btn.classList.remove('drop-target'));
  btn.addEventListener('drop',event=>{
    event.preventDefault();btn.classList.remove('drop-target');
    const src=Number(event.dataTransfer.getData('text/plain'));
    if(!Number.isInteger(src)||src===index||dragSource!==src)return;
    dragSource=null;state=swapSlots(state,src,index);render();
  });
  btn.addEventListener('dragend',()=>{dragSource=null;document.querySelectorAll('.drop-target').forEach(e=>e.classList.remove('drop-target'));});
  return btn;
}
function rule(id,from,to,slotIndex,consequentSlotIndex){
  const wrap=node('div','rule-row');wrap.dataset.rule=id;
  wrap.append(node('span','rule-id',id));
  const content=node('p','rule-sentence');
  content.append('EVERY PERSON CLASSED ');
  if(Number.isInteger(slotIndex))content.append(classToken(from,slotIndex));
  else content.append(node('strong','fixed-class',from));
  content.append(' IS CLASSED ');
  if(Number.isInteger(consequentSlotIndex))content.append(classToken(to,consequentSlotIndex));
  else content.append(node('strong','fixed-class',to));
  content.append('.');wrap.append(content);return wrap;
}
function renderRules(){
  const rows=el('ruleRows');rows.replaceChildren();
  if(state.puzzle===1){
    rows.append(rule('R1',state.slots[0],'DETAINED',0));
    rows.append(rule('R2',state.slots[1],'ESCORTED',1));
    el('standingId').textContent='SR';
    el('standingText').textContent='EVERY PERSON CLASSED ESCORTED IS CLASSED AUTHORISED.';
    el('ruleNote').textContent='STAFF LIMITATION: R1 MAY NOT TARGET CLERK.';
    el('rulesHeading').textContent='CLASSIFICATION RULES';
    el('rulesRef').textContent='FORM L-12';
    el('standingOrder').classList.remove('danger');
  }else{
    rows.append(rule('O1',state.slots[0],'FUGITIVE',0));
    rows.append(rule('F','FUGITIVE','DETAINED'));
    rows.append(rule('O3',state.slots[1],state.slots[2],1,2));
    rows.append(rule('C','CLERK','AUTHORISED'));
    el('standingId').textContent='ORDER 7';
    el('standingText').textContent='NO PERSON CLASSED DETAINED IS CLASSED AUTHORISED.';
    el('ruleNote').textContent='A CONTRADICTION PREVENTS RELEASE, NEVER REVISION.';
    el('rulesHeading').textContent='ORDERS & RULES';
    el('rulesRef').textContent='FORM R-27';
    el('standingOrder').classList.add('danger');
  }
  const tray=el('traySlot');tray.replaceChildren(classToken(state.slots.at(-1),state.slots.length-1));
}
function renderRecord(){
  el('recordTypeLabel').textContent=state.puzzle===1?'CLASS':'DECLARED';
  el('recordType').textContent=state.puzzle===1?'APPLICANT':'TWO CLASSES';
  const d=el('declarations');d.replaceChildren(node('p','','CASE DECLARATIONS'));
  const terms=state.puzzle===1?['APPLICANT']:['ESCAPEE','WITNESS'];
  for(const term of terms){
    const line=node('div','declaration');line.append('AVERY IS CLASSED ');line.append(node('strong','',term));line.append('.');d.append(line);
  }
}
function renderLedger(result){
  const target=el('ledgerSteps');target.replaceChildren();
  const chain=result.trace.map((item,i)=>{
    const line=node('div','ledger-line');line.append(node('span','line-number',`(${i+1})`));
    const phrase=item.kind==='record'?`AVERY IS CLASSED ${item.subject}.`:`THEREFORE AVERY IS CLASSED ${item.subject}.`;
    line.append(node('span','line-text',phrase));line.append(node('small','line-source',item.source));return line;
  });
  target.append(...chain);
  const verdict={DETAINED:'AVERY IS CLASSED DETAINED.',UNSUPPORTED:'RELEASE IS NOT PROVEN.',CONTRADICTION:'THE BUREAU PROVES BOTH.',GOAL:'AVERY IS CLASSED AUTHORISED.'};
  el('ledgerVerdict').textContent=verdict[result.outcome];
  el('ledgerExplanation').textContent=result.explanation;
  el('ledgerTrace').textContent=`TRACE NO. T-00${state.puzzle}`;
}
function render(){
  const result=evaluate(state.puzzle,state.slots);
  document.body.dataset.outcome=result.outcome;
  document.body.dataset.puzzle=String(state.puzzle);
  document.body.dataset.solved=String(state.solved);
  const cue=cues[result.outcome];
  el('caseIndex').textContent=`CASE 0${state.puzzle} / 02`;
  el('caseDot2').classList.toggle('active',state.puzzle===2);
  renderRecord();renderRules();renderLedger(result);
  el('doorResult').textContent=state.solved?'RELEASED':cue.door;
  el('submitSmall').textContent=state.solved?'APPROVED':cue.small;
  el('doorCaption').textContent=state.solved?'THE BUREAU HAS BEEN OVERRULED BY ITS OWN PROOF.':cue.caption;
  el('feedback').textContent=state.notice;
  el('moves').textContent=`${state.moves} ${state.moves===1?'MOVE':'MOVES'}`;
  el('undoButton').disabled=state.history.length===0||state.solved;
  el('submitCase').disabled=state.solved;
  el('submitLabel').textContent=state.solved?'APPROVED':'SUBMIT';
  el('nextButton').hidden=!(state.solved&&state.puzzle===1);
  el('replayButton').hidden=!(state.solved&&state.puzzle===2);
  el('door').classList.toggle('released',state.solved);
}
el('undoButton').addEventListener('click',()=>{state=undo(state);render();});
el('resetButton').addEventListener('click',()=>{state=reset(state);render();});
el('submitCase').addEventListener('click',()=>{state=submit(state);render();});
el('nextButton').addEventListener('click',()=>{state=nextCase(state);render();});
el('replayButton').addEventListener('click',()=>{state=initialState(1);render();});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && state.selected!==null){state={...state,selected:null,notice:'Selection cancelled.'};render();}
});
render();
