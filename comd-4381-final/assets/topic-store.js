/* Append-preserving extension of comd4381-final-v1; no new course identity.
   Recovery helpers are pure. The app owns localStorage reads and writes. */
(function(root){
  'use strict';
  const COURSE_KEY='comd4381-final-v1';
  const MIRROR_KEY=COURSE_KEY+'-exam1-recovery';
  const MIRROR_SCHEMA='comd4381-final-recovery-v1';
  const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
  const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const own=(o,k)=>!!o&&Object.prototype.hasOwnProperty.call(o,k);
  const stamp=x=>typeof x==='number'&&Number.isFinite(x)?x:typeof x==='string'?(Date.parse(x)||0):0;
  const set=(o,k,v)=>Object.defineProperty(o,k,{value:v,enumerable:true,writable:true,configurable:true});
  const topicPath=p=>/^topics\.[^.]+$/.test(p);
  const itemPath=p=>/^(?:exam1Baseline\.)?items\.[^.]+$/.test(p);
  const conceptPath=p=>/^(?:exam1Baseline\.)?concepts\.[^.]+$/.test(p);
  const COURSE_FIELDS=new Set(['schema','version','created','updated','dataRev','items','concepts','modules','topics','exams','practice','settings','legacy','log']);

  function union(a,b,byId){
    const m=new Map();
    [...(a||[]),...(b||[])].forEach(x=>{
      const k=byId!==false&&x&&x.id?'id:'+x.id:'json:'+JSON.stringify(x);
      if(!m.has(k))m.set(k,clone(x));
    });
    return [...m.values()];
  }
  // Unknown fields are retained too, including fields from newer app versions.
  function fillMissing(preferred,fallback){
    if(preferred===undefined)return clone(fallback);
    if(!object(preferred)||!object(fallback))return clone(preferred);
    const out=clone(preferred);
    Object.keys(fallback).forEach(k=>set(out,k,fillMissing(own(preferred,k)?preferred[k]:undefined,fallback[k])));
    return out;
  }
  function mergeTimed(a,b){
    const out=clone(a||{});
    Object.entries(b||{}).forEach(([k,v])=>{
      if(!own(out,k)||stamp(v.at)>=stamp(out[k].at))set(out,k,clone(v));
    });
    return out;
  }
  function mergeTopic(a,b){
    if(!a)return clone(b);if(!b)return clone(a);
    const newer=stamp(a.updated)>stamp(b.updated)?a:b,older=newer===a?b:a;
    const out=fillMissing(newer,older);out.runs={};
    new Set([...Object.keys(a.runs||{}),...Object.keys(b.runs||{})]).forEach(id=>{
      const x=a.runs&&a.runs[id],y=b.runs&&b.runs[id];
      if(!x||!y){set(out.runs,id,clone(x||y));return;}
      const latest=stamp(x.updated)>stamp(y.updated)?x:y;
      const r=fillMissing(latest,latest===x?y:x),firstByKey={};
      r.responses={};
      new Set([...Object.keys(x.responses||{}),...Object.keys(y.responses||{})]).forEach(k=>{
        const p=x.responses&&x.responses[k],q=y.responses&&y.responses[k];
        const first=!p?q:!q?p:p.checkedAt<=q.checkedAt?p:q;
        set(r.responses,k,clone(first));set(firstByKey,k,first===p?x:y);
      });
      // A response and the snapshot/order that it answered remain one unit.
      // Different parallel spaced returns are appended, never dropped.
      const occurrenceMap=new Map();
      [...(latest.items||[]),...(x.items||[]),...(y.items||[])].forEach(o=>{
        if(!occurrenceMap.has(o.key))occurrenceMap.set(o.key,clone(o));
      });
      Object.entries(firstByKey).forEach(([k,run])=>{
        const o=(run.items||[]).find(i=>i.key===k);if(o)occurrenceMap.set(k,clone(o));
      });
      r.items=[...occurrenceMap.values()];
      r.drafts=mergeTimed(x.drafts,y.drafts);
      r.selfScores=mergeTimed(x.selfScores,y.selfScores);
      r.corrections=union(x.corrections,y.corrections);
      // A stale active tab cannot reopen an activity another tab has ended.
      const terminals=[x,y].filter(v=>v.status==='completed'||v.status==='ended').sort((p,q)=>stamp(q.updated)-stamp(p.updated));
      if(terminals.length){r.status=terminals[0].status;if(terminals[0].endedAt!==undefined)r.endedAt=terminals[0].endedAt;}
      r.updated=Math.max(stamp(x.updated),stamp(y.updated));
      if(r.items.length)r.index=Math.max(0,Math.min(r.items.length-1,Number.isInteger(r.index)?r.index:0));
      set(out.runs,id,r);
    });
    out.notes=mergeTimed(a.notes,b.notes);
    const n1=a.note||{},n2=b.note||{};
    out.note=clone(stamp(n1.at)>stamp(n2.at)?n1:n2);
    out.updated=Math.max(stamp(a.updated),stamp(b.updated));
    if(out.activeId&&(!out.runs[out.activeId]||out.runs[out.activeId].status!=='active'))out.activeId=null;
    return out;
  }
  function mergeTopics(a,b){
    const out={};
    new Set([...Object.keys(a||{}),...Object.keys(b||{})]).forEach(k=>set(out,k,mergeTopic(a&&a[k],b&&b[k])));
    return out;
  }
  function mergeBaseline(a,b){
    if(!a)return clone(b);if(!b)return clone(a);
    const checkpointA=stamp(a.checkpointAt),checkpointB=stamp(b.checkpointAt);
    const seed=checkpointA!==checkpointB?(checkpointA>checkpointB?a:b):stamp(a.capturedAt)<=stamp(b.capturedAt)?a:b;
    const origin=stamp(a.capturedAt)<=stamp(b.capturedAt)?a:b;
    const latest=stamp(a.updated)>stamp(b.updated)?a:b;
    const out=fillMissing(latest,latest===a?b:a);
    const events=new Map();
    [...(a.events||[]),...(b.events||[])].forEach(e=>{const key=e.key||JSON.stringify(e);if(!events.has(key))events.set(key,clone(e));});
    out.events=[...events.values()];
    out.seenLegacyLog=[...new Set([...(a.seenLegacyLog||[]),...(b.seenLegacyLog||[])])];
    out.foldedEventKeys=[...new Set([...(a.foldedEventKeys||[]),...(b.foldedEventKeys||[])])];
    out.initialConcepts=clone(seed.initialConcepts||seed.concepts||{});
    out.initialItems=clone(seed.initialItems||seed.items||{});
    out.originConcepts=clone(origin.originConcepts||origin.initialConcepts||origin.concepts||{});
    out.originItems=clone(origin.originItems||origin.initialItems||origin.items||{});
    out.capturedAt=seed.capturedAt;out.checkpointAt=seed.checkpointAt||null;
    out.concepts={};out.items={};
    new Set([...Object.keys(a.concepts||{}),...Object.keys(b.concepts||{})]).forEach(k=>{
      const x=a.concepts&&a.concepts[k],y=b.concepts&&b.concepts[k];
      if(!x||!y){set(out.concepts,k,clone(x||y));return;}
      const c=fillMissing(stamp(x.last)>stamp(y.last)?x:y,stamp(x.last)>stamp(y.last)?y:x);
      c.attempts=Math.max(x.attempts||0,y.attempts||0);c.correct=Math.max(x.correct||0,y.correct||0);
      c.mastered=!!(x.mastered||y.mastered);c.masteredAt=x.masteredAt||y.masteredAt||null;
      set(out.concepts,k,c);
    });
    new Set([...Object.keys(a.items||{}),...Object.keys(b.items||{})]).forEach(k=>{
      const x=a.items&&a.items[k],y=b.items&&b.items[k];
      set(out.items,k,!x?clone(y):!y?clone(x):fillMissing((x.n||0)>=(y.n||0)?x:y,(x.n||0)>=(y.n||0)?y:x));
    });
    return out;
  }
  function three(base,disk,ours,path){
    if(topicPath(path))return mergeTopic(disk,ours);
    if(path==='exam1Baseline')return mergeBaseline(disk,ours);
    if(eq(ours,base))return clone(disk);
    if(eq(disk,base)||eq(ours,disk))return clone(ours);
    if(object(disk)&&object(ours)){
      const out={};
      new Set([...Object.keys(disk),...Object.keys(ours)]).forEach(k=>set(out,k,three(base&&base[k],disk[k],ours[k],path?path+'.'+k:k)));
      return out;
    }
    if(Array.isArray(disk)&&Array.isArray(ours)&&(path==='log'||/\.attempts$/.test(path)))return union(disk,ours,path!=='log');
    return clone(ours===undefined?disk:ours);
  }
  function mergeCourse(base,disk,ours){
    if(!disk||disk.schema!==ours.schema)return clone(ours);
    const out=three(base||{},disk,ours,'');
    // Even a legacy tab's wholesale primary overwrite cannot delete known topics.
    if(disk.topics||ours.topics)out.topics=mergeTopics(disk.topics,ours.topics);
    Object.keys(ours).filter(k=>!COURSE_FIELDS.has(k)).forEach(k=>{
      if(!own(out,k)||out[k]===undefined)set(out,k,clone(ours[k]));
    });
    return out;
  }
  function mergeBackup(a,b){
    if(!a||a.schema!==COURSE_KEY||!b||b.schema!==COURSE_KEY)throw Error('Wrong-course backup.');
    validateTopics(b.topics);
    function merge(x,y,path){
      if(y===undefined)return clone(x);if(x===undefined)return clone(y);
      if(topicPath(path))return mergeTopic(x,y);
      if(path==='exam1Baseline')return mergeBaseline(x,y);
      if(Array.isArray(x)&&Array.isArray(y))return path==='log'||/\.attempts$/.test(path)?union(x,y,path!=='log'):clone(x);
      if(object(x)&&object(y)){
        if(itemPath(path))return fillMissing((y.n||0)>(x.n||0)?y:x,(y.n||0)>(x.n||0)?x:y);
        const out={};
        new Set([...Object.keys(x),...Object.keys(y)]).forEach(k=>set(out,k,merge(x[k],y[k],path?path+'.'+k:k)));
        if(conceptPath(path)){
          out.mastered=!!(x.mastered||y.mastered);
          out.attempts=Math.max(x.attempts||0,y.attempts||0);
          out.correct=Math.max(x.correct||0,y.correct||0);
          out.masteredAt=x.masteredAt||y.masteredAt||null;
        }
        return out;
      }
      return clone(x);
    }
    return merge(a,b,'');
  }
  function validateTopic(t){
    if(t===undefined)return;
    if(!object(t)||!object(t.runs))throw Error('Malformed topic record.');
    const formats=new Set(['mc','tf','match','list','num','multi','order','sort','hotspot','teach']);
    Object.entries(t.runs).forEach(([id,r])=>{
      if(!object(r)||r.id!==id||!Array.isArray(r.items)||!object(r.responses)||!object(r.drafts)||!Array.isArray(r.corrections)||!object(r.selfScores)||!['active','completed','ended'].includes(r.status)||!Number.isInteger(r.index)||r.index<0||r.index>=r.items.length)throw Error('Malformed activity record.');
      const keys=new Set();
      r.items.forEach(o=>{
        if(!object(o)||typeof o.key!=='string'||keys.has(o.key)||!object(o.snapshot)||!formats.has(o.snapshot.type)||typeof o.snapshot.stem!=='string'||(!Array.isArray(o.snapshot.evidence)&&!Array.isArray(o.snapshot.src)))throw Error('Malformed question snapshot.');
        keys.add(o.key);
      });
      Object.entries(r.responses).forEach(([k,v])=>{
        if(!keys.has(k)||!object(v)||!object(v.answer)||!Number.isFinite(v.checkedAt)||!['low','medium','high'].includes(v.confidence))throw Error('Malformed first response.');
      });
    });
  }
  function validateTopics(topics){
    if(topics===undefined)return;
    if(!object(topics))throw Error('Malformed topic collection.');
    Object.values(topics).forEach(validateTopic);
  }
  function topic(s,id){
    id=id||'cas';s.topics=s.topics||{};
    if(!own(s.topics,id))set(s.topics,id,{updated:0,runs:{},activeId:null,note:{value:'',at:0}});
    return s.topics[id];
  }
  function validateMirror(m){
    if(!object(m)||m.schema!==MIRROR_SCHEMA||m.courseSchema!==COURSE_KEY||m.version!==1||!object(m.metadata))throw Error('Invalid COMD4381 recovery record.');
    validateTopics(m.topics);
  }
  // Mirror only extension ledgers/metadata, never the primary legacy exam state.
  // Passing the previous mirror keeps an old primary writer from shrinking it.
  function makeMirror(state,previous){
    if(!state||state.schema!==COURSE_KEY)throw Error('Wrong-course recovery record.');
    validateTopics(state.topics);
    if(previous!=null)validateMirror(previous);
    const metadata={};
    Object.keys(state).filter(k=>!COURSE_FIELDS.has(k)).forEach(k=>set(metadata,k,clone(state[k])));
    if(state.exam1Baseline||previous?.metadata?.exam1Baseline)metadata.exam1Baseline=mergeBaseline(previous&&previous.metadata.exam1Baseline,state.exam1Baseline);
    return {schema:MIRROR_SCHEMA,courseSchema:COURSE_KEY,version:1,updated:state.updated||null,
      topics:mergeTopics(previous&&previous.topics,state.topics),metadata:fillMissing(metadata,previous&&previous.metadata)};
  }
  function recoverCourse(primary,mirror){
    if(!primary||primary.schema!==COURSE_KEY)throw Error('Wrong-course recovery record.');
    if(mirror==null)return clone(primary);
    validateMirror(mirror);
    const recovered=clone(primary);
    recovered.topics=mergeTopics(mirror.topics,primary.topics);
    Object.entries(mirror.metadata).forEach(([k,v])=>{
      if(COURSE_FIELDS.has(k))throw Error('Invalid COMD4381 recovery metadata.');
      set(recovered,k,k==='exam1Baseline'?mergeBaseline(v,primary[k]):fillMissing(own(primary,k)?primary[k]:undefined,v));
    });
    return recovered;
  }
  root.DXTopicStore={COURSE_KEY,MIRROR_KEY,MIRROR_SCHEMA,clone,mergeTopic,mergeTopics,mergeBaseline,mergeCourse,mergeBackup,validateTopic,validateTopics,topic,union,makeMirror,recoverCourse,validateMirror};
  if(typeof module==='object')module.exports=root.DXTopicStore;
})(typeof window==='object'?window:globalThis);
