/* Saved activity logic. Question snapshots and original answer indices are authoritative. */
(function(root){
  'use strict';
  // Node tests load the real legacy engine explicitly; browser builds load engine.js first.
  const legacy=typeof module==='object'&&module.exports?require('./engine.js'):root.DXE;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const range=n=>Array.from({length:n},(_,k)=>k);
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
  function shuffle(a,r){const b=a.slice();r=r||Math.random;for(let i=b.length-1;i>0;i--){const k=Math.floor(r()*(i+1));[b[k],b[i]]=[b[i],b[k]];}return b;}
  function answered(q,a){
    if(!a)return false;
    if(q.type==='list')return !!(a.text||'').trim();
    return !!(legacy&&legacy.isAnswered(q,a));
  }
  function maxPoints(q){
    if(Number.isFinite(q.points)&&q.points>=0)return q.points;
    if(q.type==='mc')return 3;
    if(q.type==='tf')return 2;
    if(q.type==='match')return q.pairs.length;
    if(q.type==='list')return q.rubric.length;
    if(q.type==='num')return q.fields.length;
    return q.type==='teach'?0:1;
  }
  function manualScore(q,ss){
    const marks=ss?.marks||[];
    // Old snapshots retain one point per checked component, even when a form
    // assigned a different maximum. Only new, explicitly versioned rubrics scale.
    if(q.type!=='list'||q.rubricScoring!=='weighted-v1')return marks.filter(Boolean).length;
    const count=q.rubric.length;
    return count?marks.slice(0,count).filter(Boolean).length*maxPoints(q)/count:0;
  }
  function grade(q,a){
    const g={answered:answered(q,a),ok:false,points:0,max:maxPoints(q)};
    if(!g.answered)return g;
    if(q.type==='list'){g.manual=true;g.points=null;return g;}
    const result=legacy.grade(q,a);
    g.ok=result.ok;g.parts=result.parts;
    if(q.type==='teach'){g.manual=true;g.ungraded=true;g.points=null;return g;}
    if(q.type==='match'||q.type==='num'){
      const parts=result.parts||[];
      g.points=parts.length?parts.filter(Boolean).length*g.max/parts.length:0;
    }else g.points=g.ok?g.max:0;
    return g;
  }
  function occurrence(q,n,rep,r){
    let view=null,rows=null;
    if(q.type==='mc'||q.type==='multi')view=shuffle(range(q.options.length),r);
    else if(q.type==='match'){rows=shuffle(range(q.pairs.length),r);view=shuffle(range(q.pairs.length),r);}
    else if(q.type==='order')view=legacy.makeView(q,r).opt;
    else if(q.type==='sort')view=shuffle(range(q.items.length),r);
    else if(q.type==='hotspot')view=legacy.makeView(q,r);
    return {key:'q'+n,id:q.id,rootId:q.rootId||q.id,snapshot:clone(q),rows,view,rep:rep||0};
  }
  function makeRun(type,items,at,id){return {id,type,status:'active',index:0,startedAt:at,updated:at,deadlineAt:type==='test'?at+14*60*1000:null,items:items.map((q,n)=>occurrence(q,n)),responses:{},drafts:{},selfScores:{},corrections:[]};}
  function requeue(run,occ,response){
    const focusPractice=run.type==='focus'&&run.adaptiveReviewVersion==='focus-v1'&&['priority','review'].includes(run.focusMode);
    if((run.type!=='practice'&&!focusPractice)||occ.rep>=2||occ.snapshot.type==='list'||occ.snapshot.type==='teach')return 0;
    const gap=!response.correct?2:response.confidence==='low'?4:0;if(!gap)return 0;
    if(run.strictReturnSpacing&&run.items.length-run.index-1<gap){response.reviewDeferred=true;return 0;}
    const copy=clone(occ);
    // Unique occurrence IDs also survive differently sized queues and tab merges.
    copy.key='repeat-'+response.checkedAt+'-'+occ.key;copy.rep=occ.rep+1;
    const insertion=Math.min(run.index+gap+1,run.items.length);
    run.items.splice(insertion,0,copy);
    if(focusPractice){const actualGap=insertion-run.index-1;if(actualGap===0)response.requeueAtEnd=true;return actualGap;}
    return gap;
  }
  function score(run){
    if(run.scoreMode==='confirmed-objective-written-v1'){
      const base=score({...run,scoreMode:null,items:run.items.filter(o=>o.snapshot.type!=='list')});
      const writing=run.items.filter(o=>!o.rep&&o.snapshot.type==='list');
      const reviewed=writing.filter(o=>grade(o.snapshot,run.responses[o.key]?.answer).answered&&object(run.selfScores)[o.key]);
      const written={total:writing.length,answered:writing.filter(o=>run.responses[o.key]).length,reviewed:reviewed.length,
        components:reviewed.reduce((n,o)=>n+(object(run.selfScores)[o.key].marks||[]).slice(0,o.snapshot.rubric.length).filter(Boolean).length,0),
        componentTotal:writing.reduce((n,o)=>n+o.snapshot.rubric.length,0),reservedPoints:run.examFormat.writtenPoints};
      return {...base,objectiveAnswered:base.answered,answered:base.answered+written.answered,total:base.total+writing.length,written,pending:writing.length-reviewed.length};
    }
    let points=0,max=0,answeredCount=0,pending=0;
    run.items.filter(o=>!o.rep).forEach(o=>{
      const g=grade(o.snapshot,run.responses[o.key]&&run.responses[o.key].answer);
      max+=g.max;if(!g.answered)return;answeredCount++;
      if(g.manual){const ss=object(run.selfScores)[o.key];if(ss)points+=manualScore(o.snapshot,ss);else if(!g.ungraded)pending++;}
      else points+=g.points;
    });
    return {points,max,answered:answeredCount,total:run.items.filter(o=>!o.rep).length,pending};
  }
  function time(value){if(typeof value==='number'&&Number.isFinite(value))return value;const n=Date.parse(value);return Number.isFinite(n)?n:0;}
  function entriesFromTopics(topics){
    const byKey=new Map();
    Object.values(object(topics)).forEach(topic=>Object.entries(object(topic.runs)).forEach(([rid,run])=>{
      (run.items||[]).forEach(occ=>{
        const v=object(run.responses)[occ.key],q=occ.snapshot;
        if(!v||!q||q.type==='list'||q.type==='teach')return;
        const runId=run.id||rid,key=runId+'\u0000'+occ.key,existing=byKey.get(key);
        // Aliased CAS/course ledgers represent the same run. Keep its first checked answer.
        if(!existing||time(v.checkedAt)<time(existing.v.checkedAt))byKey.set(key,{occ,v,runId});
      });
    }));
    return [...byKey.values()].sort((a,b)=>time(a.v.checkedAt)-time(b.v.checkedAt)||(a.runId+a.occ.key).localeCompare(b.runId+b.occ.key));
  }
  function emptyConcept(){return {attempts:0,correct:0,streak:0,roots:[],mastered:false,masteredAt:null,needsReview:false,misconception:false,lastConf:null,last:null,v1:false};}
  function applyEvidence(previous,occ,v){
    const c=Object.assign(emptyConcept(),previous||{});
    c.roots=Array.isArray(c.roots)?c.roots.slice():[];
    const conf=v.confidence||'medium',rootId=occ.rootId||occ.snapshot.rootId||occ.id;
    c.attempts++;c.lastConf=conf;c.last=v.checkedAt;
    if(v.correct===true){
      c.correct++;
      if(!v.assisted){c.streak++;if(!c.roots.includes(rootId))c.roots.push(rootId);}
      else{c.streak=0;c.roots=[];}
      const confirmed=c.v1&&conf!=='low'&&!v.assisted;
      if((c.streak>=2&&c.roots.length>=2&&conf!=='low'&&!v.assisted)||confirmed){
        if(!c.mastered)c.masteredAt=v.checkedAt;c.mastered=true;c.v1=false;c.misconception=false;c.needsReview=false;
      }else if(conf==='low'||v.assisted)c.needsReview=true;
    }else{
      c.streak=0;c.roots=[];c.v1=false;c.needsReview=true;if(conf==='high')c.misconception=true;
      // Previously earned mastery is retained; the new miss still requires repair.
    }
    return c;
  }
  function evidence(topic,conceptIds){
    const out={};conceptIds.forEach(c=>out[c]=emptyConcept());
    entriesFromTopics({topic}).forEach(({occ,v})=>{const c=occ.snapshot.concept;if(out[c])out[c]=applyEvidence(out[c],occ,v);});
    return out;
  }
  function deriveCourse(state,conceptIds,legacyConceptIds,legacyItemIds){
    state.concepts=object(state.concepts);state.items=object(state.items);
    if(!state.exam1Baseline){
      state.exam1Baseline={version:1,capturedAt:state.updated||state.created||null,concepts:{},items:{}};
      (legacyConceptIds||[]).forEach(c=>{if(state.concepts[c])state.exam1Baseline.concepts[c]=clone(state.concepts[c]);});
      (legacyItemIds||[]).forEach(i=>{if(state.items[i])state.exam1Baseline.items[i]=clone(state.items[i]);});
    }
    const baseline=state.exam1Baseline;
    baseline.concepts=object(baseline.concepts);baseline.items=object(baseline.items);
    const original=object(baseline.originConcepts||baseline.initialConcepts||baseline.concepts);
    const concepts={};
    // Unknown future records stay in the shared course state; only known competencies are derived.
    (conceptIds||[]).forEach(c=>{
      concepts[c]=Object.assign(emptyConcept(),clone(original[c]||{}));
      if(baseline.concepts[c]?.v1&&!concepts[c].attempts)concepts[c].v1=true;
    });
    const itemStats=clone(baseline.items);
    const newEntries=entriesFromTopics(state.topics),timeline=[],newCounts={},legacyLatest={};
    const itemConcepts=object(baseline.itemConcepts);
    newEntries.forEach(({occ})=>{if(occ.id&&occ.snapshot.concept&&!itemConcepts[occ.id])itemConcepts[occ.id]=occ.snapshot.concept;});
    // The immutable origin precedes the full-lab ledgers. Replaying all retained
    // legacy events (even those folded into an import checkpoint) preserves the
    // actual order of a new answer followed by a later legacy answer.
    (baseline.events||[]).forEach(e=>{
      const c=e.concept||itemConcepts[e.id];if(!c||!concepts[c])return;
      const at=time(e.t);
      timeline.push({kind:'answer',at,key:'legacy:'+e.key,occ:{id:e.id,rootId:e.rootId||e.id,snapshot:{concept:c}},v:{correct:!!e.ok,confidence:e.conf||'medium',assisted:!!e.assisted,checkedAt:at}});
      legacyLatest[c]=Math.max(legacyLatest[c]||0,at);
    });
    newEntries.forEach(({occ,v,runId})=>{
      const c=occ.snapshot.concept;
      timeline.push({kind:'answer',at:time(v.checkedAt),key:runId+'\u0000'+occ.key,occ,v});
      if(concepts[c]){const n=newCounts[c]||(newCounts[c]={attempts:0,correct:0});n.attempts++;if(v.correct===true)n.correct++;}
      const iid=occ.id||occ.snapshot.id;
      if(!iid)return;
      const h=itemStats[iid]=Object.assign({n:0,ok:0},itemStats[iid]||{});
      h.n++;if(v.correct===true)h.ok++;
      if(!h.at||time(v.checkedAt)>=time(h.at)){
        h.lastOk=v.correct===true;h.lastConf=v.confidence;
        h.at=typeof v.checkedAt==='number'?new Date(v.checkedAt).toISOString():v.checkedAt;
      }
    });
    // A legacy-only imported backup can contain aggregate history without its
    // individual events. Its latest temporal state is an anchor at its own time,
    // rather than an answer replayed after every newer course response.
    (conceptIds||[]).forEach(c=>{
      const saved=baseline.concepts[c],seed=original[c]||{};
      if(!saved)return;
      const at=time(saved.last);
      if(at&&at>=(time(seed.last)||0)&&at!==(legacyLatest[c]||0)&&(saved.attempts||0)>(seed.attempts||0))timeline.push({kind:'anchor',at,key:'aggregate:'+c,concept:c,value:saved});
    });
    timeline.sort((a,b)=>a.at-b.at||a.key.localeCompare(b.key)).forEach(entry=>{
      if(entry.kind==='answer'){
        const c=entry.occ.snapshot.concept;if(concepts[c])concepts[c]=applyEvidence(concepts[c],entry.occ,entry.v);
      }else{
        const c=entry.concept,earned=concepts[c],saved=entry.value;
        concepts[c]=Object.assign(emptyConcept(),clone(saved),{mastered:!!(earned.mastered||saved.mastered),masteredAt:earned.masteredAt||saved.masteredAt||null});
      }
    });
    (conceptIds||[]).forEach(c=>{
      const saved=baseline.concepts[c]||{},counts=newCounts[c]||{attempts:0,correct:0};
      concepts[c].attempts=(saved.attempts||0)+counts.attempts;
      concepts[c].correct=(saved.correct||0)+counts.correct;
      if(saved.mastered){concepts[c].mastered=true;concepts[c].masteredAt=concepts[c].masteredAt||saved.masteredAt||null;}
    });
    Object.assign(state.concepts,concepts);Object.assign(state.items,itemStats);
    return state;
  }
  root.DXTopicEngine={answered,maxPoints,manualScore,grade,occurrence,shuffle,makeRun,requeue,score,evidence,deriveCourse};
  if(typeof module==='object'&&module.exports)module.exports=root.DXTopicEngine;
})(typeof window==='object'?window:globalThis);
