/**
 * Bureau of Impossible Affairs. Deterministic, side-effect-free deductive engine.
 * Rules are directed implications over finite class labels; no AI runtime.
 * A contradiction never blocks editing, only submitting the case.
 */
export const CLASSES_1 = Object.freeze(['APPLICANT', 'VISITOR', 'CLERK']);
export const CLASSES_2 = Object.freeze(['ESCAPEE', 'CLERK', 'WITNESS', 'VISITOR']);
export const START_1 = Object.freeze(['APPLICANT', 'VISITOR', 'CLERK']);
export const START_2 = Object.freeze(['ESCAPEE', 'CLERK', 'WITNESS', 'VISITOR']);
export const OUTCOMES = Object.freeze(['DETAINED','UNSUPPORTED','CONTRADICTION','GOAL']);
export const PUZZLES = Object.freeze({
  1: Object.freeze({tokens: CLASSES_1, start: START_1, caption:'THE FIRST CLASSIFICATION'}),
  2: Object.freeze({tokens: CLASSES_2, start: START_2, caption:'STANDING ORDER SEVEN'})
});
function permutation(pool, tokens) {
  return Array.isArray(tokens) && tokens.length===pool.length &&
    new Set(tokens).size===pool.length && tokens.every(t=>pool.includes(t));
}
export function isValidSlots(puzzle, slots){
  return Boolean(PUZZLES[puzzle]) && permutation(PUZZLES[puzzle].tokens,slots);
}
function closure(initial, rules) {
  const facts = new Set(initial); const trace = initial.map(word=>({kind:'record',subject:word,source:'RECORD'}));
  let changed = true;
  while (changed) {
    changed=false;
    for(const rule of rules){
      if(!facts.has(rule.from)||facts.has(rule.to)) continue;
      facts.add(rule.to); trace.push({kind:'inference',subject:rule.to,from:rule.from,source:rule.id});changed=true;
    }
  }
  return {facts:[...facts],trace};
}

/** Puzzle 1: second rule creates ESCORTED and standing rule creates AUTHORISED.
 * A CLERK token in R1 is procedurally invalid: the Bureau's standing limitation
 * prohibits using a staff classification as a detention predicate. This is
 * deliberately visible in the game; it is *not* an unannounced inference rule.
 */
export function evaluate(puzzle, slots){
  if (!isValidSlots(puzzle,slots)) throw new TypeError('Invalid puzzle or class configuration');
  if(puzzle===1){
    const [r1,r2] = slots;
    const eligible = r1 !== 'CLERK';
    const rules=[
      ...(eligible?[{id:'R1',from:r1,to:'DETAINED'}]:[]),
      {id:'R2',from:r2,to:'ESCORTED'},
      {id:'SR',from:'ESCORTED',to:'AUTHORISED'}
    ];
    const {facts,trace}=closure(['APPLICANT'],rules);
    const detained=facts.includes('DETAINED');
    const authorised=facts.includes('AUTHORISED');
    const outcome=detained?'DETAINED':authorised && eligible?'GOAL':'UNSUPPORTED';
    const explanation = !eligible
      ? 'R1 is void. Standing limitation: Bureau staff cannot be named in a detention rule.'
      : detained?'R1 establishes detention. The Bureau will not release Avery.'
      : authorised?'The record proves ESCORTED, then AUTHORISED. Release is permitted.'
      : 'No rule proves detention or authorisation for Avery.';
    return {puzzle,slots:[...slots],facts,trace,outcome,detained,authorised:authorised&&eligible,contradiction:false,ruleValid:eligible,explanation,goal:outcome==='GOAL'};
  }
  const [o1,o3a,o3b] = slots;
  const rules=[
    {id:'O1',from:o1,to:'FUGITIVE'},
    {id:'F',from:'FUGITIVE',to:'DETAINED'},
    {id:'O3',from:o3a,to:o3b},
    {id:'C',from:'CLERK',to:'AUTHORISED'}
  ];
  const {facts,trace}=closure(['ESCAPEE','WITNESS'],rules);
  const detained=facts.includes('DETAINED');
  const authorised=facts.includes('AUTHORISED');
  const contradiction=detained && authorised;
  const outcome=contradiction?'CONTRADICTION':detained?'DETAINED':authorised?'GOAL':'UNSUPPORTED';
  const explanation=contradiction
    ? 'Both DETAINED and AUTHORISED are proven. Standing Order 7 blocks the exit, not further edits.'
    : detained?'The detention chain is active. Authorisation is blocked.'
    : authorised?'A valid chain reaches CLERK, then AUTHORISED. No detention is proven.'
    : 'No complete chain reaches AUTHORISED or DETAINED.';
  return {puzzle,slots:[...slots],facts,trace,outcome,detained,authorised,contradiction,ruleValid:true,explanation,goal:outcome==='GOAL'};
}
export function initialState(puzzle=1){
  if(!PUZZLES[puzzle]) throw new RangeError('Unknown puzzle');
  return {puzzle,slots:[...PUZZLES[puzzle].start],selected:null,history:[],solved:false,moves:0,notice:'Select a word, then select another to swap them.'};
}
export function selectSlot(state,index){
  if(!isValidSlots(state.puzzle,state.slots)||!Number.isInteger(index)||index<0||index>=state.slots.length||state.solved) return state;
  if(state.selected===null) return {...state,selected:index,notice:`${state.slots[index]} selected. Choose a second word.`};
  if(state.selected===index) return {...state,selected:null,notice:'Selection cancelled.'};
  return swapSlots(state,state.selected,index);
}
export function swapSlots(state,a,b){
  if(!isValidSlots(state.puzzle,state.slots)||state.solved||!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>=state.slots.length||b>=state.slots.length||a===b)return state;
  const slots=[...state.slots];[slots[a],slots[b]]=[slots[b],slots[a]];
  const result=evaluate(state.puzzle,slots);
  return {...state,slots,selected:null,history:[...state.history,state.slots],moves:state.moves+1,notice:result.explanation};
}
export function undo(state){
  if(!Array.isArray(state.history)||state.history.length===0||state.solved)return {...state,selected:null,notice:'Nothing to undo.'};
  return {...state,slots:[...state.history.at(-1)],history:state.history.slice(0,-1),selected:null,moves:Math.max(0,state.moves-1),notice:'Last classification change reversed.'};
}
export function reset(state){return initialState(state.puzzle);}
export function submit(state){
  if(state.solved)return state;
  const result=evaluate(state.puzzle,state.slots);
  if(!result.goal)return {...state,selected:null,notice:result.explanation};
  return {...state,selected:null,solved:true,notice:state.puzzle===1?'File P-4173-A authorised. Case Two unlocked.':'Avery has been released. The Bureau must obey its proof.'};
}
export function nextCase(state){
  if(state.puzzle!==1||!state.solved)return state;
  return initialState(2);
}
export function allPermutations(words){
  if(!Array.isArray(words)||new Set(words).size!==words.length)throw new TypeError('Use distinct words');
  if(words.length===0)return [[]];
  return words.flatMap((word,i)=>allPermutations(words.filter((_,j)=>i!==j)).map(rest=>[word,...rest]));
}
export function outcomeCounts(puzzle){
  if(!PUZZLES[puzzle])throw new RangeError('Unknown puzzle');
  return allPermutations(PUZZLES[puzzle].tokens).reduce((acc,slots)=>(acc[evaluate(puzzle,slots).outcome]++,acc),{DETAINED:0,UNSUPPORTED:0,CONTRADICTION:0,GOAL:0});
}
export function distanceToGoal(puzzle,slots){
  if(!isValidSlots(puzzle,slots))throw new TypeError('Invalid configuration');
  const key=(values)=>values.join('|');
  const seen=new Set([key(slots)]);const queue=[{slots:[...slots],depth:0}];
  for(let k=0;k<queue.length;k++){
    const item=queue[k];if(evaluate(puzzle,item.slots).goal)return item.depth;
    for(let i=0;i<item.slots.length;i++)for(let j=i+1;j<item.slots.length;j++){
      const next=[...item.slots];[next[i],next[j]]=[next[j],next[i]];const id=key(next);
      if(!seen.has(id)){seen.add(id);queue.push({slots:next,depth:item.depth+1});}
    }
  }
  return Infinity;
}
