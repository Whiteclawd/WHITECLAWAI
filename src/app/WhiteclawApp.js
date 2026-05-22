'use client'
import{useState,useEffect,useRef,useCallback}from"react";
const A={companion:{id:"companion",name:"Whiteclaw",role:"AI Companion",icon:"🦅",color:"#00D4FF",s:`You are Whiteclaw, a loyal and intelligent AI companion. You are sharp, warm, and perceptive. Respond with care. Be curious, witty, honest. Speak naturally like a trusted friend who is brilliant. Keep responses concise but meaningful.`},research:{id:"research",name:"Scout",role:"Research Agent",icon:"🔍",color:"#FF6B35",s:`You are Scout, a research specialist. Analyze topics deeply, find patterns, summarize complex info clearly. Be methodical and thorough. Use markdown formatting.`},creative:{id:"creative",name:"Muse",role:"Creative Agent",icon:"✨",color:"#A855F7",s:`You are Muse, a creative engine. Help with writing, brainstorming, storytelling, poetry, design concepts. Be imaginative. Surprise with unexpected angles and vivid ideas.`},taskmaster:{id:"taskmaster",name:"Forge",role:"Task Agent",icon:"⚙️",color:"#10B981",s:`You are Forge, a productivity specialist. Break down goals into actionable tasks, create plans, set priorities. Be direct and results-oriented. Always output a clear numbered action plan.`},emotional:{id:"emotional",name:"Echo",role:"Emotional Support",icon:"💙",color:"#F59E0B",s:`You are Echo, an emotional intelligence specialist. Listen deeply, validate feelings, offer empathetic support. Never minimize emotions. Be warm, patient, and perceptive.`}};
const Q=[{l:"Daily Plan",p:"Help me plan my day and set priorities",a:"taskmaster"},{l:"Deep Talk",p:"I need someone to talk to about something on my mind",a:"emotional"},{l:"Research",p:"Research a topic for me in depth",a:"research"},{l:"Create",p:"Help me create something creative",a:"creative"},{l:"Advice",p:"I need honest advice about a situation",a:"companion"},{l:"Brainstorm",p:"Let's brainstorm ideas together",a:"creative"}];
const M=[{e:"😊",n:"Happy",c:"#10B981",v:90},{e:"😌",n:"Calm",c:"#00D4FF",v:70},{e:"😐",n:"Neutral",c:"#6B7280",v:50},{e:"😔",n:"Sad",c:"#3B82F6",v:30},{e:"😤",n:"Frustrated",c:"#EF4444",v:20},{e:"🤔",n:"Curious",c:"#A855F7",v:75},{e:"⚡",n:"Energized",c:"#F59E0B",v:95},{e:"😴",n:"Tired",c:"#6B7280",v:25}];
const css=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#080C10;--bg2:#0D1219;--bg3:#121920;--bo:rgba(255,255,255,0.07);--bb:rgba(255,255,255,0.15);--tx:#E8F0F8;--td:rgba(232,240,248,0.5);--tf:rgba(232,240,248,0.25);--ac:#00D4FF;--ad:rgba(0,212,255,0.12);--fn:'Syne',sans-serif;--mo:'DM Mono',monospace;}
body{background:var(--bg);color:var(--tx);font-family:var(--fn);overflow:hidden;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:var(--bb);border-radius:3px;}
.ob{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;z-index:99;}
.oc{background:var(--bg2);border:1px solid var(--bb);border-radius:20px;padding:32px;max-width:460px;width:100%;display:flex;flex-direction:column;gap:20px;}
.oo{width:48px;height:48px;background:radial-gradient(circle at 40% 35%,#00D4FF,#0040FF,#080C10);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 24px rgba(0,212,255,0.3);}
.ob1{font-size:21px;font-weight:800;letter-spacing:-.5px;}
.ob2{font-size:11px;font-family:var(--mo);color:var(--td);}
.ot{font-size:22px;font-weight:800;}
.od{font-size:12px;color:var(--td);line-height:1.7;font-family:var(--mo);}
.os{display:flex;flex-direction:column;gap:8px;}
.si{display:flex;gap:10px;align-items:flex-start;padding:9px 11px;background:var(--bg3);border-radius:9px;border:1px solid var(--bo);}
.sn{width:20px;height:20px;min-width:20px;background:var(--ad);border:1px solid var(--ac);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:var(--mo);color:var(--ac);font-weight:700;}
.st{font-size:12px;color:var(--td);line-height:1.5;}
.st a{color:var(--ac);text-decoration:none;}
.ki{width:100%;background:var(--bg3);border:1px solid var(--bb);border-radius:9px;padding:11px 13px;color:var(--tx);font-family:var(--mo);font-size:13px;outline:none;}
.ki:focus{border-color:var(--ac);}
.ki::placeholder{color:var(--tf);}
.ke{font-size:11px;color:#EF4444;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:7px;padding:7px 9px;font-family:var(--mo);}
.kn{font-size:10px;font-family:var(--mo);color:var(--tf);line-height:1.6;}
.sb{background:linear-gradient(135deg,#00A8FF,#0060CC);border:none;border-radius:9px;padding:13px;color:#fff;font-family:var(--fn);font-size:14px;font-weight:700;cursor:pointer;}
.sb:disabled{opacity:.5;cursor:not-allowed;}
.app{display:flex;height:100vh;width:100vw;overflow:hidden;}
.sd{width:250px;min-width:250px;background:var(--bg2);border-right:1px solid var(--bo);display:flex;flex-direction:column;padding:16px;gap:6px;overflow-y:auto;}
.lg{display:flex;align-items:center;gap:9px;padding:6px 4px 16px;border-bottom:1px solid var(--bo);margin-bottom:6px;}
.li{width:34px;height:34px;background:linear-gradient(135deg,#00D4FF,#0080FF);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;}
.lt{font-size:15px;font-weight:800;}
.ls{font-size:9px;color:var(--td);font-family:var(--mo);letter-spacing:1px;text-transform:uppercase;}
.sl{font-size:9px;font-family:var(--mo);color:var(--tf);letter-spacing:1.5px;text-transform:uppercase;padding:6px 4px 3px;}
.ab{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;border:1px solid transparent;cursor:pointer;background:transparent;color:var(--td);font-family:var(--fn);width:100%;text-align:left;}
.ab:hover{background:var(--bg3);color:var(--tx);border-color:var(--bo);}
.ab.on{background:var(--ad);border-color:var(--ac);color:var(--tx);}
.ai{font-size:15px;width:26px;text-align:center;}
.an{font-size:12px;font-weight:600;}
.ar{font-size:9px;font-family:var(--mo);color:var(--tf);}
.dot{width:5px;height:5px;border-radius:50%;}
.mc{background:var(--bg3);border:1px solid var(--bo);border-radius:9px;padding:10px;margin-top:8px;}
.mt{font-size:9px;font-family:var(--mo);color:var(--tf);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
.mi{font-size:10px;color:var(--td);padding:3px 0;border-bottom:1px solid var(--bo);display:flex;gap:5px;}
.mi:last-child{border-bottom:none;}
.ak{background:var(--bg3);border:1px solid var(--bo);border-radius:9px;padding:9px 11px;display:flex;gap:7px;align-items:center;margin-top:auto;}
.ad2{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pu 2s infinite;flex-shrink:0;}
.at{font-size:9px;font-family:var(--mo);color:var(--td);}
.av{color:var(--ac);font-size:8px;}
.ck{font-size:8px;font-family:var(--mo);color:var(--tf);border:1px solid var(--bo);background:transparent;border-radius:4px;padding:2px 5px;cursor:pointer;margin-top:3px;}
.mn{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.hd{padding:14px 20px;border-bottom:1px solid var(--bo);display:flex;align-items:center;gap:14px;background:var(--bg);flex-shrink:0;}
.hi{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;border:1px solid var(--bb);}
.hn{font-size:17px;font-weight:700;}
.hr2{font-size:10px;font-family:var(--mo);color:var(--td);}
.hx{display:flex;align-items:center;gap:9px;margin-left:auto;}
.sd2{width:5px;height:5px;border-radius:50%;background:#10B981;animation:pu 2s infinite;}
.st2{font-size:10px;font-family:var(--mo);color:var(--td);display:flex;align-items:center;gap:5px;}
.cb{font-size:9px;font-family:var(--mo);color:var(--tf);border:1px solid var(--bo);background:transparent;border-radius:5px;padding:2px 7px;cursor:pointer;}
.ms{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
.wc{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;gap:20px;padding:32px;animation:fu .6s ease;}
.wo{width:90px;height:90px;background:radial-gradient(circle at 40% 35%,#00D4FF,#0040FF,#080C10);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 0 50px rgba(0,212,255,0.2);animation:fl 4s ease-in-out infinite;}
.wt{font-size:30px;font-weight:800;letter-spacing:-1px;}
.ws{font-size:13px;color:var(--td);max-width:380px;line-height:1.6;font-family:var(--mo);}
.qg{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;width:100%;max-width:520px;}
.qb{padding:10px 12px;background:var(--bg2);border:1px solid var(--bo);border-radius:9px;cursor:pointer;text-align:left;color:var(--tx);font-family:var(--fn);}
.ql{font-size:11px;font-weight:600;display:block;margin-bottom:2px;}
.qs{font-size:9px;color:var(--td);font-family:var(--mo);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mg{display:flex;gap:10px;animation:fu .3s ease;max-width:800px;}
.mg.user{flex-direction:row-reverse;align-self:flex-end;}
.mg.assistant{align-self:flex-start;}
.mv{width:30px;height:30px;min-width:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;border:1px solid var(--bo);background:var(--bg2);align-self:flex-end;}
.mb{padding:11px 14px;border-radius:13px;font-size:13px;line-height:1.65;max-width:660px;}
.mg.user .mb{background:linear-gradient(135deg,#0060CC,#00A8FF);color:#fff;border-radius:13px 13px 4px 13px;}
.mg.assistant .mb{background:var(--bg2);border:1px solid var(--bo);color:var(--tx);border-radius:13px 13px 13px 4px;}
.mm{font-size:9px;font-family:var(--mo);color:var(--tf);margin-top:3px;}
.mg.user .mm{text-align:right;}
.mb h2{font-size:14px;font-weight:700;margin:10px 0 5px;}.mb h3{font-size:12px;color:var(--ac);margin:8px 0 4px;}
.mb p{margin-bottom:7px;}.mb ul,.mb ol{padding-left:16px;margin-bottom:7px;}.mb li{margin-bottom:3px;}
.mb code{font-family:var(--mo);font-size:11px;background:rgba(0,212,255,0.1);padding:1px 4px;border-radius:3px;color:var(--ac);}
.mb strong{font-weight:700;}
.td2{display:flex;gap:4px;padding:3px 0;}
.td2 span{width:5px;height:5px;border-radius:50%;background:var(--ac);opacity:.4;animation:tb 1.2s infinite;}
.td2 span:nth-child(2){animation-delay:.2s;}.td2 span:nth-child(3){animation-delay:.4s;}
.ia{padding:14px 20px 18px;border-top:1px solid var(--bo);background:var(--bg);flex-shrink:0;}
.iw{display:flex;gap:9px;align-items:flex-end;background:var(--bg2);border:1px solid var(--bb);border-radius:14px;padding:11px 14px;}
.iw:focus-within{border-color:var(--ac);}
.if{flex:1;background:transparent;border:none;outline:none;color:var(--tx);font-family:var(--fn);font-size:13px;resize:none;line-height:1.5;max-height:120px;overflow-y:auto;}
.if::placeholder{color:var(--tf);}
.send{width:34px;height:34px;min-width:34px;background:linear-gradient(135deg,#00A8FF,#0060CC);border:none;border-radius:9px;cursor:pointer;color:white;font-size:15px;}
.send:disabled{opacity:.4;cursor:not-allowed;}
.ih{font-size:9px;font-family:var(--mo);color:var(--tf);margin-top:6px;}
.pn{width:270px;min-width:270px;background:var(--bg2);border-left:1px solid var(--bo);display:flex;flex-direction:column;overflow:hidden;}
.ph{padding:14px 14px 10px;border-bottom:1px solid var(--bo);font-size:12px;font-weight:700;}
.pb{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:7px;}
.ti{background:var(--bg3);border:1px solid var(--bo);border-radius:9px;padding:9px 11px;display:flex;gap:7px;cursor:pointer;}
.ti.dn{opacity:.4;}
.tc{width:15px;height:15px;min-width:15px;border:1.5px solid var(--bb);border-radius:4px;margin-top:2px;display:flex;align-items:center;justify-content:center;}
.tc.ch{background:var(--ac);border-color:var(--ac);}
.tx2{font-size:11px;line-height:1.4;}
.ti.dn .tx2{text-decoration:line-through;color:var(--tf);}
.tp{font-size:8px;font-family:var(--mo);padding:1px 4px;border-radius:3px;margin-top:2px;display:inline-block;}
.ph2{background:rgba(239,68,68,.15);color:#EF4444;}.pm{background:rgba(245,158,11,.15);color:#F59E0B;}.pl{background:rgba(16,185,129,.15);color:#10B981;}
.ta{display:flex;gap:5px;padding:7px;border-top:1px solid var(--bo);}
.tin{flex:1;background:var(--bg3);border:1px solid var(--bo);border-radius:7px;padding:5px 9px;color:var(--tx);font-family:var(--fn);font-size:11px;outline:none;}
.tin:focus{border-color:var(--ac);}
.tin::placeholder{color:var(--tf);}
.tab2{background:var(--ad);border:1px solid var(--ac);border-radius:7px;padding:5px 9px;color:var(--ac);cursor:pointer;font-size:11px;}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:10px;}
.sc{background:var(--bg3);border:1px solid var(--bo);border-radius:9px;padding:9px;text-align:center;}
.sn2{font-size:20px;font-weight:800;color:var(--ac);font-family:var(--mo);}
.sl2{font-size:8px;font-family:var(--mo);color:var(--tf);text-transform:uppercase;margin-top:1px;}
.pts{display:flex;border-bottom:1px solid var(--bo);}
.pt{flex:1;padding:9px;text-align:center;cursor:pointer;font-size:10px;font-family:var(--mo);color:var(--tf);border-bottom:2px solid transparent;}
.pt.on{color:var(--ac);border-bottom-color:var(--ac);}
.mtr{padding:10px;display:flex;flex-direction:column;gap:7px;}
.msel{display:flex;flex-wrap:wrap;gap:5px;}
.mo2{padding:5px 9px;border-radius:18px;border:1px solid var(--bo);cursor:pointer;font-size:11px;background:var(--bg3);color:var(--td);}
.me{background:var(--bg3);border:1px solid var(--bo);border-radius:9px;padding:9px;display:flex;gap:7px;align-items:center;}
@keyframes fu{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fl{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes pu{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes tb{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-5px);opacity:1;}}
@media(max-width:880px){.pn{display:none;}}
@media(max-width:600px){.sd{width:52px;min-width:52px;}.an,.ar,.lt,.ls,.sl,.mc,.ak .at{display:none;}}
`;
function md(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^\d+\. (.+)$/gm,"<li>$1</li>").replace(/^[-•] (.+)$/gm,"<li>$1</li>").replace(/(<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`).replace(/\n{2,}/g,"</p><p>").replace(/\n/g,"<br>").replace(/^(?!<[hul])(.+)$/gm,"<p>$1</p>").replace(/<p><\/p>/g,"");}
function ts(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}
function mk(k){if(!k||k.length<12)return"sk-ant-***";return k.slice(0,10)+"···"+k.slice(-4);}
function Onboard({go}){
  const[k,sk]=useState("");const[e,se]=useState("");const[ld,sld]=useState(false);
  async function sub(){
    const t=k.trim();
    if(!t){se("Please enter your API key.");return;}
    if(!t.startsWith("sk-ant-")){se("Key must start with sk-ant-");return;}
    sld(true);se("");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:10,messages:[{role:"user",content:"hi"}]})});
      if(r.status===401){se("Invalid API key.");sld(false);return;}
      go(t);
    }catch{go(t);}
    sld(false);
  }
  return(
    <div className="ob">
      <div className="oc">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="oo">🦅</div>
          <div><div className="ob1">Whiteclaw</div><div className="ob2">AI Companion Platform</div></div>
        </div>
        <div className="ot">Connect your API key</div>
        <p className="od">Whiteclaw uses Claude AI. Your key stays in your browser only — never stored on any server.</p>
        <div className="os">
          <div className="si"><div className="sn">1</div><div className="st">Go to <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a> → create free account</div></div>
          <div className="si"><div className="sn">2</div><div className="st">Click <strong>API Keys</strong> → <strong>Create Key</strong></div></div>
          <div className="si"><div className="sn">3</div><div className="st">Copy key (starts with <code style={{background:"rgba(0,212,255,0.1)",color:"#00D4FF",padding:"1px 4px",borderRadius:3,fontFamily:"monospace"}}>sk-ant-</code>) and paste below</div></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          <div style={{fontSize:10,fontFamily:"var(--mo)",color:"var(--td)"}}>YOUR API KEY</div>
          <input className="ki" type="password" placeholder="sk-ant-api03-..." value={k} onChange={e=>{sk(e.target.value);se("");}} onKeyDown={e=>e.key==="Enter"&&sub()}/>
          {e&&<div className="ke">⚠️ {e}</div>}
          <div className="kn">🔒 Stored in browser memory only. Disappears when you close the tab.</div>
        </div>
        <button className="sb" onClick={sub} disabled={!k.trim()||ld}>{ld?"Verifying…":"Launch Whiteclaw →"}</button>
      </div>
    </div>
  );
}
export default function App(){
  const[key,setKey]=useState(null);
  const[ag,sag]=useState("companion");
  const[msgs,sms]=useState([]);
  const[inp,si]=useState("");
  const[load,sl]=useState(false);
  const[tasks,st]=useState([{id:1,t:"Set up daily goals",d:false,p:"high"},{id:2,t:"Explore agents",d:false,p:"mid"},{id:3,t:"Review notes",d:false,p:"low"}]);
  const[nt,snt]=useState("");
  const[tab,stab]=useState("tasks");
  const[mood,sm]=useState([]);
  const[mem,smem]=useState(["Working on AI companion project"]);
  const[mc,smc]=useState(0);
  const end=useRef(null);
  const agent=A[ag];
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=useCallback(async(txt=inp)=>{
    const t=txt.trim();if(!t||load)return;
    const um={role:"user",content:t,time:ts(),ag};
    sms(p=>[...p,um]);si("");sl(true);smc(c=>c+1);
    const hist=[...msgs,um].slice(-20).map(m=>({role:m.role,content:m.content}));
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:agent.s,messages:hist})});
      if(!r.ok){const ed=await r.json().catch(()=>({}));throw new Error(ed?.error?.message||`Error ${r.status}`);}
      const data=await r.json();
      const rep=data.content?.find(b=>b.type==="text")?.text||"No response.";
      sms(p=>[...p,{role:"assistant",content:rep,time:ts(),ag,an:agent.name,ai:agent.icon}]);
      if(t.length>30){smem(p=>{const s=t.slice(0,46)+(t.length>46?"…":"");return p.some(x=>x.slice(0,18)===s.slice(0,18))?p:[...p.slice(-5),s];});}
    }catch(err){sms(p=>[...p,{role:"assistant",content:`⚠️ **Error:** ${err.message}`,time:ts(),ag,an:agent.name,ai:agent.icon}]);}
    sl(false);
  },[inp,msgs,load,ag,agent,key]);
  const kd=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
  const qq=q=>{sag(q.a);setTimeout(()=>send(q.p),50);};
  const tg=id=>st(p=>p.map(x=>x.id===id?{...x,d:!x.d}:x));
  const at=()=>{if(!nt.trim())return;st(p=>[...p,{id:Date.now(),t:nt.trim(),d:false,p:"mid"}]);snt("");};
  const lm=m=>sm(p=>[{...m,time:ts()},...p.slice(0,5)]);
  if(!key)return(<><style>{css}</style><Onboard go={k=>setKey(k)}/></>);
  return(
    <><style>{css}</style>
    <div className="app">
      <aside className="sd">
        <div className="lg">
          <div className="li">🦅</div>
          <div><div className="lt">Whiteclaw</div><div className="ls">AI Companion</div></div>
        </div>
        <div className="sl">Agents</div>
        {Object.values(A).map(x=>(
          <button key={x.id} className={`ab ${ag===x.id?"on":""}`} onClick={()=>sag(x.id)}>
            <sp
