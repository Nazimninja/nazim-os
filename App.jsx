import { useState, useEffect, useCallback } from "react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  navy:"#0F1932", navyMid:"#162040", navyLight:"#1E2D50",
  steel:"#37649B", blue:"#8CB4DC", blueLight:"#B8D4EE",
  white:"#F0F4FA", muted:"#6B82A8",
  green:"#2ECC8A", red:"#E05454", amber:"#F5A623",
  pink:"#ff3d9a", purple:"#c830ff", teal:"#00C9B1",
};

const PROFILES = [
  {id:"socialninja",  label:"Social Ninjas", color:C.steel},
  {id:"nazim_ninja",  label:"Nazim Ninja",   color:C.blue},
  {id:"9thgear_",     label:"9th Gear",       color:C.amber},
  {id:"vicevault.gg", label:"Vice Vault",     color:C.pink},
];

const PLATFORMS = [
  {id:"instagram", label:"Instagram", icon:"📸", ready:true},
  {id:"youtube",   label:"YouTube",   icon:"▶️",  ready:true},
  {id:"linkedin",  label:"LinkedIn",  icon:"💼",  ready:false}, // coming soon
  {id:"both",      label:"IG + YT",   icon:"📡",  ready:true},
];

const NAV = ["Tasks","Publisher","Scripts","Queue","Leads","Monitor","Calendar"];
const NAV_ICONS = ["✅","📡","📝","🎬","💼","👁","📅"];

// ── Task system ───────────────────────────────────────────────
const TASK_TEMPLATE = [
  {id:"sn_ig",    block:"morning",  label:"Post Reel — Social Ninjas",    sub:"Drop file in Drive → Publisher tab",         brand:"socialninja",  type:"post"},
  {id:"nn_ig",    block:"morning",  label:"Post Reel — Nazim Ninja",      sub:"Drop file in Drive → Publisher tab",         brand:"nazim_ninja",  type:"post"},
  {id:"9g_ig",    block:"morning",  label:"Post Reel — 9th Gear",         sub:"Drop file in Drive → Publisher tab",         brand:"9thgear_",     type:"post"},
  {id:"vv_ig",    block:"morning",  label:"Post Reel — Vice Vault",       sub:"Drop file in Drive → Publisher tab",         brand:"vicevault.gg", type:"post"},
  {id:"li_post",  block:"morning",  label:"Post on LinkedIn",             sub:"Personal brand — value post, no fluff",      brand:"nazim_ninja",  type:"post"},
  {id:"dms",      block:"morning",  label:"Reply all DMs",                sub:"All 4 IG accounts + LinkedIn",               brand:null,           type:"engage"},
  {id:"li_cmts",  block:"engage",   label:"5 LinkedIn comments",          sub:"Target: CMOs, brand founders, agency owners",brand:null,           type:"engage"},
  {id:"ig_cmts",  block:"engage",   label:"5 Instagram comments",         sub:"Target: luxury brands, car accounts, fitness founders",brand:null, type:"engage"},
  {id:"comp_cmts",block:"engage",   label:"3 competitor comments",        sub:"Social Ninjas niche — add genuine value",    brand:null,           type:"engage"},
  {id:"cold_dms", block:"outreach", label:"3 cold DMs — Social Ninjas",   sub:"Luxury/premium brand founders, India + UAE", brand:"socialninja",  type:"outreach"},
  {id:"followup", block:"outreach", label:"Follow up open leads",         sub:"Leads tab — anyone pending > 2 days",        brand:null,           type:"outreach"},
  {id:"film",     block:"content",  label:"Film 1 video",                 sub:"Batch on Wednesdays — all 4 brands",         brand:null,           type:"content"},
  {id:"drive",    block:"content",  label:"Drop filmed video in Drive",   sub:"Correct brand folder → ready for Queue",     brand:null,           type:"content"},
];

const XPROMO = [
  {id:"xp1",label:"SN → Nazim Ninja",      sub:"'Our founder @nazim_ninja built this system'",          color:C.steel},
  {id:"xp2",label:"Nazim Ninja → SN",      sub:"'My agency @socialninja.s does this for brands'",       color:C.blue},
  {id:"xp3",label:"9th Gear → Vice Vault", sub:"'Real life version of this GTA 6 car 👀 @vicevault.gg'",color:C.amber},
  {id:"xp4",label:"Vice Vault → 9th Gear", sub:"'GTA fans — this is real. @9thgear_ Bangalore'",        color:C.pink},
];

const WEEKLY = [
  {id:"w1",day:"Sunday",    label:"Review all 4 scripts from Flow 3",   sub:"Scripts tab → read, approve, schedule filming"},
  {id:"w2",day:"Sunday",    label:"Film batch for the week",            sub:"All 4 brands in one session — 2-3 videos each"},
  {id:"w3",day:"Monday",    label:"Plan cross-promotion posts",         sub:"Which brand promotes which this week"},
  {id:"w4",day:"Wednesday", label:"2x YT Shorts queued per channel",    sub:"Queue tab → confirm all 4 channels have 2 videos ready"},
  {id:"w5",day:"Friday",    label:"Review lead pipeline",              sub:"Leads tab — follow up anything stuck > 3 days"},
  {id:"w6",day:"Friday",    label:"Weekly content performance check",   sub:"Check views, reach, DMs received — adjust topics"},
];

const BLOCK_META = {
  morning: {label:"Morning Block",    time:"30 min", color:C.blue},
  engage:  {label:"Engagement Block", time:"20 min", color:C.green},
  outreach:{label:"Outreach Block",   time:"15 min", color:C.amber},
  content: {label:"Content Block",    time:"varies", color:C.purple},
};

// ── Seed data ─────────────────────────────────────────────────
const SEED_SCRIPTS = [
  {id:1,profile:"socialninja",status:"ready",topic:"How luxury brands in UAE are cutting agency costs using AI",ytTitle:"Why UAE Brands Are Ditching Agencies 🤖",hook:"Most luxury brands in the UAE are still paying ₹2L/month for work AI does in 5 minutes.",section1:"Big agencies charge for headcount, not results. A 10-person team managing your Instagram is mostly project management overhead.",section2:"AI automation handles scheduling, captions, hashtag research, and analytics at a fraction of the cost. We've built this for our clients.",section3:"One Dubai luxury brand cut content ops cost by 70% in 90 days. Same output. Smaller team. Faster execution.",cta:"Follow Social Ninja's for the exact framework. Next — how to price your fitness offer for UAE and Gulf markets.",caption:"Your competitors are already using AI. Your brand isn't — and it shows.\n\nAI automation isn't a future investment. It's the operational edge separating 7-figure brands.\n\nWe break down exactly how premium brands are building AI into their stacks.\n\n#AIMarketing #DigitalGrowthStrategy #MarketingAutomation #PremiumBrandGrowth #LuxuryBrandMarketing",created:"2026-08-18"},
  {id:2,profile:"nazim_ninja",status:"filmed",topic:"How I built my content system in one weekend using n8n",ytTitle:"I Automated My Entire Content Pipeline 🔧",hook:"I was spending 4 hours a day on content. Now it's 20 minutes.",section1:"The problem wasn't effort — it was system. Filming, editing, captioning, scheduling manually. Every single day.",section2:"One weekend, one tool: n8n. Google Drive + Claude API + Instagram + YouTube. Drop a file, the system handles the rest.",section3:"Automation writes the caption, generates the YT title, uploads to both platforms, sends confirmation. Total: 20 minutes of my time.",cta:"Follow Nazim Ninja for the full build breakdown. Next — the fitness system I use while running a business.",caption:"I built an app while running a business and training daily.\n\nMost people think automation is for big companies. Wrong.\n\nI used AI to handle repetitive work so I could focus on what actually moves the needle.\n\n#FitNinjaApp #PersonalBrandBuilder #DigitalEntrepreneur #FitnessAppFounder #SelfMadeCreator",created:"2026-08-18"},
];

const SEED_QUEUE = [
  {id:1,profile:"socialninja",fileName:"SN_AI_Marketing_Tips.mp4",platform:"instagram",status:"Ready",added:"2026-08-18",scheduled:null},
  {id:2,profile:"nazim_ninja",fileName:"NN_Fit_Ninja_App_Build.mp4",platform:"youtube",status:"Ready",added:"2026-08-18",scheduled:null},
  {id:3,profile:"9thgear_",fileName:"9G_BMW_M3_Walkaround.mp4",platform:"instagram",status:"Posted",added:"2026-08-17",scheduled:null},
];

const SEED_LEADS = [
  {id:1,name:"Arjun Mehta",brand:"Social Ninjas",email:"arjun@luxelabel.in",interest:"Instagram management + AI automation",source:"Instagram DM",status:"New",draft:"",created:"2026-08-18"},
  {id:2,name:"Fatima Al Rashid",brand:"Social Ninjas",email:"fatima@mode.ae",interest:"Full social media retainer — UAE brand",source:"LinkedIn",status:"Draft Ready",draft:"Hi Fatima, saw your message about Mode's social presence. Brands like yours are exactly who we built Social Ninja's for — premium positioning, UAE audience, AI-powered execution. I'd love to show you what we've built for similar clients. 15 mins this week?",created:"2026-08-17"},
  {id:3,name:"Rohan Shetty",brand:"9th Gear",email:"rohan@9thgear.in",interest:"YouTube content for showroom",source:"Referral",status:"Sent",draft:"",created:"2026-08-16"},
];

const SEED_MONITOR = [
  {id:1,platform:"Reddit",keyword:"social ninjas",title:"Anyone used Social Ninja's for their brand?",url:"#",body:"Looking for reviews on Social Ninja's agency in Bangalore. Worth it for a mid-size D2C?",suggestedReply:"Hey! Social Ninja's here. We work primarily with premium and luxury brands — happy to share some case studies. What's your brand category?",time:"2h ago"},
  {id:2,platform:"Reddit",keyword:"9th gear bangalore",title:"Best place to buy pre-owned BMW in Bangalore?",url:"#",body:"Looking for trusted dealers. Heard 9th Gear is good but haven't visited.",suggestedReply:"9th Gear is solid — certified pre-owned, full service history verification, and a clean showroom experience. Worth a visit before you decide.",time:"5h ago"},
];

// ── Helpers ───────────────────────────────────────────────────
const profileColor = id => PROFILES.find(p=>p.id===id)?.color||C.steel;
const profileLabel = id => PROFILES.find(p=>p.id===id)?.label||id;
const todayStr = () => new Date().toDateString();
const dayName = () => new Date().toLocaleDateString("en",{weekday:"long"});
const doy = () => Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/86400000);

const ls = {
  get:(k,fb=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb));}catch{return fb;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

// ── UI primitives ─────────────────────────────────────────────
const Card = ({children,style={}}) => (
  <div style={{background:C.navyMid,border:`1px solid ${C.navyLight}`,borderRadius:14,padding:20,...style}}>
    {children}
  </div>
);

const Btn = ({children,onClick,color=C.steel,small,full,disabled,style={}}) => (
  <button onClick={onClick} disabled={disabled} style={{
    background:disabled?C.navyLight:color,color:disabled?C.muted:"#fff",
    border:"none",borderRadius:8,padding:small?"6px 14px":"10px 20px",
    fontSize:small?12:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",
    transition:"opacity .15s",width:full?"100%":"auto",opacity:disabled?0.6:1,...style
  }}
    onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity=0.82;}}
    onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity=1;}}
  >{children}</button>
);

const Badge = ({children,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,letterSpacing:0.5}}>
    {children}
  </span>
);

const Input = ({value,onChange,placeholder,multiline,rows=3,style={}}) => {
  const base = {background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"10px 14px",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none",resize:"vertical",fontFamily:"inherit",...style};
  return multiline ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={base}/> : <input value={value} onChange={onChange} placeholder={placeholder} style={base}/>;
};

const Select = ({value,onChange,children,style={}}) => (
  <select value={value} onChange={onChange} style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"10px 14px",fontSize:14,outline:"none",cursor:"pointer",...style}}>
    {children}
  </select>
);

const SectionTitle = ({children}) => (
  <div style={{fontSize:13,color:C.muted,fontWeight:700,letterSpacing:1,marginBottom:16}}>{children}</div>
);

// ── Schedule Modal ────────────────────────────────────────────
function ScheduleModal({item, onSave, onClose}) {
  const [date, setDate] = useState(item?.scheduled?.date || "");
  const [time, setTime] = useState(item?.scheduled?.time || "09:00");

  return (
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <Card style={{width:380,borderColor:C.steel}} onClick={e=>e.stopPropagation()}>
        <SectionTitle>SCHEDULE POST</SectionTitle>
        <div style={{fontSize:14,color:C.white,fontWeight:600,marginBottom:16}}>{item?.fileName}</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:6}}>DATE</div>
          <Input value={date} onChange={e=>setDate(e.target.value)} style={{colorScheme:"dark"}}
            placeholder="YYYY-MM-DD"
          />
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"10px 14px",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none",colorScheme:"dark",marginTop:6}}
          />
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:6}}>TIME</div>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)}
            style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"10px 14px",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none",colorScheme:"dark"}}
          />
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn color={C.green} full onClick={()=>onSave({date,time})}>Schedule</Btn>
          <Btn color={C.muted} onClick={onClose}>Cancel</Btn>
        </div>
      </Card>
    </div>
  );
}

// ── TASKS TAB ─────────────────────────────────────────────────
function Tasks({setTab}) {
  const key = `tasks_${todayStr()}`;
  const [done, setDone] = useState(()=>ls.get(key,[]));
  const [weeklyDone, setWeeklyDone] = useState(()=>ls.get("weekly_tasks",[]));

  const toggle = id => {
    const next = done.includes(id)?done.filter(x=>x!==id):[...done,id];
    setDone(next); ls.set(key,next);
  };
  const toggleW = id => {
    const next = weeklyDone.includes(id)?weeklyDone.filter(x=>x!==id):[...weeklyDone,id];
    setWeeklyDone(next); ls.set("weekly_tasks",next);
  };

  const total = TASK_TEMPLATE.length;
  const completed = done.filter(id=>TASK_TEMPLATE.find(t=>t.id===id)).length;
  const pct = Math.round((completed/total)*100);
  const todayXP = XPROMO[doy()%4];
  const todayWeekly = WEEKLY.filter(w=>w.day===dayName());

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
      <div>
        {/* Progress */}
        <Card style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:24,fontWeight:800,color:C.white}}>{completed}/{total} done</div>
              <div style={{fontSize:13,color:C.muted}}>{dayName()} · {new Date().toLocaleDateString("en",{month:"long",day:"numeric",year:"numeric"})}</div>
            </div>
            <div style={{fontSize:36,fontWeight:900,color:pct===100?C.green:pct>60?C.blue:C.amber}}>{pct}%</div>
          </div>
          <div style={{background:C.navyLight,borderRadius:99,height:8,overflow:"hidden"}}>
            <div style={{background:`linear-gradient(90deg,${C.steel},${C.blue})`,width:`${pct}%`,height:"100%",borderRadius:99,transition:"width .4s"}}/>
          </div>
          {pct===100&&<div style={{marginTop:12,fontSize:13,color:C.green,fontWeight:700}}>🎉 All tasks done for today. Go get that bag.</div>}
        </Card>

        {/* Blocks */}
        {["morning","engage","outreach","content"].map(block=>{
          const meta = BLOCK_META[block];
          const tasks = TASK_TEMPLATE.filter(t=>t.block===block);
          const blockDone = tasks.filter(t=>done.includes(t.id)).length;
          return (
            <div key={block} style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:3,height:20,background:meta.color,borderRadius:99}}/>
                <div style={{fontSize:13,fontWeight:700,color:meta.color,letterSpacing:0.5}}>{meta.label.toUpperCase()}</div>
                <div style={{fontSize:11,color:C.muted}}>· {meta.time}</div>
                <div style={{marginLeft:"auto",fontSize:12,color:blockDone===tasks.length?C.green:C.muted,fontWeight:700}}>{blockDone}/{tasks.length}</div>
              </div>
              <div style={{display:"grid",gap:8}}>
                {tasks.map(task=>{
                  const isDone = done.includes(task.id);
                  return (
                    <div key={task.id} onClick={()=>toggle(task.id)} style={{
                      background:isDone?C.navyLight:C.navyMid,
                      border:`1px solid ${isDone?C.green+"44":C.navyLight}`,
                      borderRadius:12,padding:"12px 16px",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:14,
                      transition:"all .15s",opacity:isDone?0.65:1,
                    }}>
                      <div style={{width:22,height:22,borderRadius:6,flexShrink:0,background:isDone?C.green:C.navyLight,border:`2px solid ${isDone?C.green:C.steel+"66"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",transition:"all .15s"}}>
                        {isDone?"✓":""}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:700,color:isDone?C.muted:C.white,textDecoration:isDone?"line-through":"none",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          {task.label}
                          {task.brand&&<Badge color={profileColor(task.brand)}>{profileLabel(task.brand)}</Badge>}
                          {task.id==="li_post"&&<Badge color={C.teal}>LinkedIn</Badge>}
                        </div>
                        <div style={{fontSize:12,color:C.muted,marginTop:2}}>{task.sub}</div>
                      </div>
                      {task.type==="post"&&!isDone&&(
                        <Btn small color={C.steel} onClick={e=>{e.stopPropagation();setTab(1);}}>Publish →</Btn>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Today's cross-promo */}
        <Card style={{border:`1px solid ${todayXP.color}44`}}>
          <div style={{fontSize:11,fontWeight:700,color:todayXP.color,letterSpacing:1,marginBottom:8}}>TODAY'S CROSS-PROMO</div>
          <div style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:4}}>{todayXP.label}</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:10}}>{todayXP.sub}</div>
          <div style={{background:C.navyLight,borderRadius:8,padding:"8px 12px",fontSize:11,color:C.blue}}>Add to every 4th post for cross-audience growth</div>
        </Card>

        {/* Weekly tasks */}
        {todayWeekly.length>0&&(
          <Card>
            <div style={{fontSize:11,fontWeight:700,color:C.amber,letterSpacing:1,marginBottom:10}}>THIS {dayName().toUpperCase()}</div>
            {todayWeekly.map(w=>(
              <div key={w.id} onClick={()=>toggleW(w.id)} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12,cursor:"pointer"}}>
                <div style={{width:18,height:18,borderRadius:4,flexShrink:0,marginTop:2,background:weeklyDone.includes(w.id)?C.green:C.navyLight,border:`2px solid ${weeklyDone.includes(w.id)?C.green:C.steel+"66"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>
                  {weeklyDone.includes(w.id)?"✓":""}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:weeklyDone.includes(w.id)?C.muted:C.white,textDecoration:weeklyDone.includes(w.id)?"line-through":"none"}}>{w.label}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{w.sub}</div>
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* Cross-promo rotation */}
        <Card>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,marginBottom:10}}>CROSS-PROMO ROTATION</div>
          {XPROMO.map((x,i)=>(
            <div key={x.id} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:x.color,marginTop:5,flexShrink:0}}/>
              <div style={{fontSize:12,color:i===doy()%4?C.white:C.muted,fontWeight:i===doy()%4?700:400}}>{x.label}</div>
            </div>
          ))}
          <div style={{fontSize:11,color:C.muted,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.navyLight}`}}>Rotates daily · every 4th post</div>
        </Card>

        {/* Algorithm tips */}
        <Card>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,marginBottom:10}}>ALGORITHM NOTES</div>
          {[
            {icon:"📸",text:"Post IG Reel in first 2 hours of waking — peak reach window"},
            {icon:"💬",text:"Comment within 60 min of posting — signals engagement"},
            {icon:"🔗",text:"LinkedIn: comment before you post — warms your account"},
            {icon:"▶️",text:"YT Shorts: 3–5/week per channel for recommendation loop"},
            {icon:"💼",text:"LinkedIn post cadence: daily for fastest B2B lead growth"},
          ].map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,fontSize:12,color:C.muted,lineHeight:1.5}}>
              <span style={{flexShrink:0}}>{tip.icon}</span><span>{tip.text}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── PUBLISHER TAB ─────────────────────────────────────────────
function Publisher() {
  const [profile, setProfile] = useState("socialninja");
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [scheduleMode, setScheduleMode] = useState(false);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("09:00");
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState([
    {time:"3:27 PM",profile:"socialninja",platform:"YouTube",file:"SN_AI_Marketing_Tips.mp4",ok:true,scheduled:false},
    {time:"3:25 PM",profile:"socialninja",platform:"Instagram",file:"SN_AI_Marketing_Tips.mp4",ok:true,scheduled:false},
    {time:"3:14 PM",profile:"nazim_ninja",platform:"Instagram",file:"NN_Fit_Ninja_App.mp4",ok:true,scheduled:false},
  ]);

  const fire = () => {
    if(!topic.trim()){setStatus("error");return;}
    setStatus("posting");
    setTimeout(()=>{
      const entry = {
        time:scheduleMode?`${schedDate} ${schedTime}`:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
        profile,platform,file:"pending...",ok:true,scheduled:scheduleMode
      };
      setStatus("done");
      setLog(prev=>[entry,...prev]);
      setTopic(""); setSchedDate(""); setSchedTime("09:00"); setScheduleMode(false);
      setTimeout(()=>setStatus(null),3000);
    },2000);
  };

  const p = PROFILES.find(x=>x.id===profile);
  const selectedPlatform = PLATFORMS.find(x=>x.id===platform);

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <Card>
          <SectionTitle>PROFILE</SectionTitle>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {PROFILES.map(pr=>(
              <button key={pr.id} onClick={()=>setProfile(pr.id)} style={{
                background:profile===pr.id?pr.color:C.navyLight,
                border:`1px solid ${pr.color}55`,borderRadius:8,
                color:profile===pr.id?"#fff":C.muted,
                padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .15s"
              }}>{pr.label}</button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>PLATFORM</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {PLATFORMS.map(pl=>(
              <button key={pl.id} onClick={()=>pl.ready&&setPlatform(pl.id)} style={{
                background:platform===pl.id?C.steel:C.navyLight,
                border:`1px solid ${platform===pl.id?C.steel:C.navyLight}`,
                borderRadius:10,padding:"10px 12px",
                color:platform===pl.id?"#fff":pl.ready?C.muted:C.navyLight,
                fontSize:13,fontWeight:700,cursor:pl.ready?"pointer":"not-allowed",
                transition:"all .15s",textAlign:"left",position:"relative"
              }}>
                <div style={{fontSize:16,marginBottom:2}}>{pl.icon}</div>
                <div>{pl.label}</div>
                {!pl.ready&&<div style={{position:"absolute",top:6,right:8,fontSize:9,color:C.amber,fontWeight:700,background:C.amber+"22",borderRadius:4,padding:"1px 5px"}}>SOON</div>}
                {pl.id==="linkedin"&&<div style={{fontSize:10,color:C.teal,marginTop:2}}>Connecting next</div>}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>TOPIC</SectionTitle>
          <Input value={topic} onChange={e=>setTopic(e.target.value)}
            placeholder="e.g. how luxury brands in UAE are cutting agency costs using AI automation"
            multiline rows={3} style={{marginBottom:12}}
          />
          <div style={{background:C.navyLight,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.muted}}>
            <span style={{color:C.blue}}>Command: </span>
            <span style={{color:C.white}}>post on {profileLabel(profile).toLowerCase()} {platform==="both"?"instagram and youtube":platform}{topic?` about ${topic}`:""}</span>
          </div>
        </Card>

        {/* Schedule toggle */}
        <Card style={{border:`1px solid ${scheduleMode?C.purple+"66":C.navyLight}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:scheduleMode?16:0}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.white}}>📅 Schedule for later</div>
              <div style={{fontSize:12,color:C.muted}}>Post at a specific date and time</div>
            </div>
            <button onClick={()=>setScheduleMode(!scheduleMode)} style={{
              width:44,height:24,borderRadius:99,background:scheduleMode?C.purple:C.navyLight,
              border:"none",cursor:"pointer",position:"relative",transition:"background .2s"
            }}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:scheduleMode?23:3,transition:"left .2s"}}/>
            </button>
          </div>
          {scheduleMode&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:11,color:C.muted,marginBottom:6}}>DATE</div>
                <input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)}
                  style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"10px 12px",fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",colorScheme:"dark"}}
                />
              </div>
              <div>
                <div style={{fontSize:11,color:C.muted,marginBottom:6}}>TIME</div>
                <input type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)}
                  style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"10px 12px",fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",colorScheme:"dark"}}
                />
              </div>
              {schedDate&&<div style={{gridColumn:"1/-1",fontSize:12,color:C.purple}}>
                Will post on {new Date(schedDate).toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"})} at {schedTime}
              </div>}
            </div>
          )}
        </Card>

        <Btn onClick={fire} full
          color={status==="posting"?C.muted:status==="done"?C.green:status==="error"?C.red:scheduleMode?C.purple:p?.color||C.steel}
        >
          {status==="posting"?"⏳ Publishing..."
            :status==="done"?scheduleMode?"📅 Scheduled!":"✅ Published!"
            :status==="error"?"⚠️ Add a topic"
            :scheduleMode?`📅 Schedule — ${schedDate||"pick a date"} ${schedTime}`
            :"📡 Publish Now"}
        </Btn>
      </div>

      {/* Log */}
      <Card>
        <SectionTitle>PUBLISH LOG</SectionTitle>
        {log.map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<log.length-1?`1px solid ${C.navyLight}`:"none"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:l.ok?C.green:C.red,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:C.white,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                {profileLabel(l.profile)} → {l.platform}
                {l.scheduled&&<Badge color={C.purple}>Scheduled</Badge>}
              </div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l.file}</div>
            </div>
            <div style={{fontSize:11,color:C.muted,textAlign:"right"}}>{l.time}</div>
          </div>
        ))}
        {log.length===0&&<div style={{color:C.muted,fontSize:14}}>No posts yet today.</div>}

        {/* LinkedIn coming soon banner */}
        <div style={{marginTop:20,background:C.teal+"11",border:`1px solid ${C.teal}33`,borderRadius:10,padding:"12px 16px"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.teal,marginBottom:4}}>💼 LinkedIn Publishing — Coming Next</div>
          <div style={{fontSize:12,color:C.muted}}>Being added to the n8n workflow. Once connected, posts will appear here alongside IG and YT.</div>
        </div>
      </Card>
    </div>
  );
}

// ── SCRIPTS TAB ───────────────────────────────────────────────
function Scripts() {
  const [scripts,setScripts]=useState(SEED_SCRIPTS);
  const [open,setOpen]=useState(null);
  const [copied,setCopied]=useState(null);
  const mark=(id,s)=>setScripts(arr=>arr.map(x=>x.id===id?{...x,status:s}:x));
  const copy=(text,id)=>{navigator.clipboard.writeText(text).catch(()=>{});setCopied(id);setTimeout(()=>setCopied(null),2000);};

  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>
      {scripts.map(s=>(
        <Card key={s.id}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <Badge color={profileColor(s.profile)}>{profileLabel(s.profile)}</Badge>
            <Badge color={s.status==="ready"?C.green:s.status==="filmed"?C.amber:C.muted}>{s.status}</Badge>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:4}}>{s.topic}</div>
          <div style={{fontSize:12,color:C.blue,marginBottom:10}}>🎬 {s.ytTitle}</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.5}}><span style={{color:C.blueLight}}>🪝 </span>{s.hook}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn small color={C.steel} onClick={()=>setOpen(open===s.id?null:s.id)}>{open===s.id?"Hide":"View Script"}</Btn>
            <Btn small color={C.muted} onClick={()=>copy(s.caption,`c-${s.id}`)}>{copied===`c-${s.id}`?"✅ Copied!":"Copy Caption"}</Btn>
            {s.status==="ready"&&<Btn small color={C.amber} onClick={()=>mark(s.id,"filmed")}>Mark Filmed</Btn>}
            {s.status==="filmed"&&<Btn small color={C.green} onClick={()=>mark(s.id,"posted")}>Mark Posted</Btn>}
          </div>
          {open===s.id&&(
            <div style={{marginTop:16,borderTop:`1px solid ${C.navyLight}`,paddingTop:16}}>
              {[["🪝 Hook",s.hook],["📖 Section 1",s.section1],["💡 Section 2",s.section2],["🔥 Section 3",s.section3],["📣 CTA",s.cta]].map(([l,t])=>(
                <div key={l} style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:13,color:C.white,lineHeight:1.6}}>{t}</div>
                </div>
              ))}
              <div style={{marginTop:4}}>
                <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6}}>📸 INSTAGRAM CAPTION</div>
                <div style={{background:C.navyLight,borderRadius:8,padding:12,fontSize:12,color:C.blueLight,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{s.caption}</div>
                <Btn small color={C.steel} style={{marginTop:8}} onClick={()=>copy(s.caption,`c2-${s.id}`)}>{copied===`c2-${s.id}`?"✅ Copied!":"Copy Caption"}</Btn>
              </div>
            </div>
          )}
        </Card>
      ))}
      {scripts.length===0&&<div style={{color:C.muted,padding:60,textAlign:"center"}}>No scripts yet. Flow 3 runs every Sunday at 8AM.</div>}
    </div>
  );
}

// ── QUEUE TAB ─────────────────────────────────────────────────
function Queue() {
  const [queue,setQueue]=useState(SEED_QUEUE);
  const [posting,setPosting]=useState(null);
  const [schedItem,setSchedItem]=useState(null);

  const post=(id)=>{
    setPosting(id);
    setTimeout(()=>{setQueue(q=>q.map(x=>x.id===id?{...x,status:"Posted"}:x));setPosting(null);},2000);
  };
  const saveSchedule=(item,{date,time})=>{
    setQueue(q=>q.map(x=>x.id===item.id?{...x,scheduled:{date,time},status:"Scheduled"}:x));
    setSchedItem(null);
  };

  return (
    <div>
      {schedItem&&<ScheduleModal item={schedItem} onSave={(s)=>saveSchedule(schedItem,s)} onClose={()=>setSchedItem(null)}/>}
      <div style={{display:"grid",gap:12}}>
        {queue.map(item=>(
          <Card key={item.id} style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:44,height:44,borderRadius:10,background:profileColor(item.profile)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
              {item.platform==="youtube"?"▶️":"📸"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:C.white}}>{item.fileName}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <Badge color={profileColor(item.profile)}>{profileLabel(item.profile)}</Badge>
                <span style={{textTransform:"capitalize"}}>{item.platform}</span>
                <span>· Added {item.added}</span>
                {item.scheduled&&<Badge color={C.purple}>📅 {item.scheduled.date} {item.scheduled.time}</Badge>}
              </div>
            </div>
            <Badge color={item.status==="Ready"?C.green:item.status==="Scheduled"?C.purple:C.muted}>{item.status}</Badge>
            <div style={{display:"flex",gap:8}}>
              {item.status==="Ready"&&<>
                <Btn small color={C.steel} onClick={()=>post(item.id)}>{posting===item.id?"Posting...":"Post Now"}</Btn>
                <Btn small color={C.purple} onClick={()=>setSchedItem(item)}>Schedule</Btn>
              </>}
              {item.status==="Scheduled"&&<Btn small color={C.muted} onClick={()=>setSchedItem(item)}>Edit</Btn>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── LEADS TAB ─────────────────────────────────────────────────
function Leads() {
  const [leads,setLeads]=useState(SEED_LEADS);
  const [modal,setModal]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [newLead,setNewLead]=useState({name:"",brand:"Social Ninjas",email:"",interest:"",source:""});

  const approve=id=>setLeads(l=>l.map(x=>x.id===id?{...x,status:"Sent"}:x));
  const addLead=()=>{
    if(!newLead.name||!newLead.email)return;
    setLeads(l=>[...l,{...newLead,id:Date.now(),status:"New",draft:"",created:new Date().toISOString().split("T")[0]}]);
    setNewLead({name:"",brand:"Social Ninjas",email:"",interest:"",source:""});
    setShowForm(false);
  };

  const statuses=["New","Draft Ready","Sent","Replied"];
  const statusColor={New:C.blue,"Draft Ready":C.amber,Sent:C.green,Replied:C.muted};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:24}}>
          {statuses.map(s=>(
            <div key={s} style={{textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:800,color:statusColor[s]}}>{leads.filter(l=>l.status===s).length}</div>
              <div style={{fontSize:11,color:C.muted}}>{s}</div>
            </div>
          ))}
        </div>
        <Btn color={C.steel} onClick={()=>setShowForm(!showForm)}>+ Add Lead</Btn>
      </div>

      {showForm&&(
        <Card style={{marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Input value={newLead.name} onChange={e=>setNewLead(p=>({...p,name:e.target.value}))} placeholder="Full name"/>
            <Input value={newLead.email} onChange={e=>setNewLead(p=>({...p,email:e.target.value}))} placeholder="Email"/>
            <Input value={newLead.source} onChange={e=>setNewLead(p=>({...p,source:e.target.value}))} placeholder="Source (DM, LinkedIn, Referral...)"/>
            <Select value={newLead.brand} onChange={e=>setNewLead(p=>({...p,brand:e.target.value}))}>
              {["Social Ninjas","9th Gear","Vice Vault","Nazim Ninja"].map(b=><option key={b}>{b}</option>)}
            </Select>
          </div>
          <Input value={newLead.interest} onChange={e=>setNewLead(p=>({...p,interest:e.target.value}))} placeholder="Interest / what they need" style={{marginBottom:12}}/>
          <Btn color={C.green} onClick={addLead}>Save Lead</Btn>
        </Card>
      )}

      <div style={{display:"grid",gap:12}}>
        {leads.map(lead=>(
          <Card key={lead.id} style={{cursor:"pointer"}} onClick={()=>setModal(modal===lead.id?null:lead.id)}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.steel,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:16,flexShrink:0}}>{lead.name.charAt(0)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:C.white}}>{lead.name}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>{lead.brand} · {lead.source} · {lead.created}</div>
              </div>
              <Badge color={statusColor[lead.status]||C.muted}>{lead.status}</Badge>
            </div>
            {modal===lead.id&&(
              <div style={{marginTop:16,borderTop:`1px solid ${C.navyLight}`,paddingTop:16}} onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:13,color:C.muted,marginBottom:6}}>📧 {lead.email}</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:14}}>💬 {lead.interest}</div>
                {lead.draft&&(
                  <>
                    <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6}}>CLAUDE DRAFT</div>
                    <div style={{background:C.navyLight,borderRadius:8,padding:12,fontSize:13,color:C.white,lineHeight:1.6,marginBottom:12}}>{lead.draft}</div>
                    {lead.status!=="Sent"&&<div style={{display:"flex",gap:8}}><Btn small color={C.green} onClick={()=>approve(lead.id)}>✅ Approve & Send</Btn><Btn small color={C.muted}>✏️ Edit</Btn></div>}
                  </>
                )}
                {!lead.draft&&lead.status==="New"&&<Btn small color={C.steel}>🤖 Generate Draft</Btn>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── MONITOR TAB ───────────────────────────────────────────────
function Monitor() {
  const [mentions,setMentions]=useState(SEED_MONITOR);
  const [copied,setCopied]=useState(null);
  const copy=(text,id)=>{navigator.clipboard.writeText(text).catch(()=>{});setCopied(id);setTimeout(()=>setCopied(null),2000);};
  const dismiss=id=>setMentions(m=>m.filter(x=>x.id!==id));

  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        {["Reddit","Twitter","Google"].map(p=>(
          <div key={p} style={{background:C.navyMid,border:`1px solid ${C.navyLight}`,borderRadius:10,padding:"10px 20px",fontSize:13,color:C.muted}}>
            {p} <span style={{color:C.white,fontWeight:700}}>{mentions.filter(m=>m.platform===p).length}</span>
          </div>
        ))}
        <div style={{marginLeft:"auto",fontSize:12,color:C.muted,display:"flex",alignItems:"center"}}>Flow 5 checks every 4 hours</div>
      </div>
      <div style={{display:"grid",gap:12}}>
        {mentions.map(m=>(
          <Card key={m.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",gap:8}}><Badge color={C.steel}>{m.platform}</Badge><Badge color={C.muted}>{m.keyword}</Badge></div>
              <span style={{fontSize:12,color:C.muted}}>{m.time}</span>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:6}}>{m.title}</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.5}}>{m.body}</div>
            <div style={{background:C.navyLight,borderRadius:8,padding:12,marginBottom:12}}>
              <div style={{fontSize:11,color:C.blue,fontWeight:700,marginBottom:4}}>SUGGESTED REPLY</div>
              <div style={{fontSize:13,color:C.white,lineHeight:1.6}}>{m.suggestedReply}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn small color={C.steel} onClick={()=>copy(m.suggestedReply,m.id)}>{copied===m.id?"✅ Copied!":"Copy Reply"}</Btn>
              <Btn small color={C.muted}>View Post</Btn>
              <Btn small color={C.red} onClick={()=>dismiss(m.id)}>Dismiss</Btn>
            </div>
          </Card>
        ))}
        {mentions.length===0&&<div style={{textAlign:"center",padding:60,color:C.muted}}>No new mentions. All clear.</div>}
      </div>
    </div>
  );
}

// ── CALENDAR TAB ──────────────────────────────────────────────
function Calendar() {
  const todayD = new Date();
  const [month,setMonth]=useState(todayD.getMonth());
  const [year,setYear]=useState(todayD.getFullYear());
  const [schedQueue,setSchedQueue]=useState([
    {id:"cal1",profile:"socialninja",platform:"instagram",topic:"AI automation for luxury brands",date:"2026-08-20",time:"09:00",status:"scheduled"},
    {id:"cal2",profile:"nazim_ninja",platform:"youtube",topic:"n8n automation tutorial",date:"2026-08-21",time:"10:00",status:"scheduled"},
    {id:"cal3",profile:"9thgear_",platform:"instagram",topic:"BMW M3 walkaround",date:"2026-08-22",time:"11:00",status:"scheduled"},
  ]);
  const [showAdd,setShowAdd]=useState(false);
  const [newPost,setNewPost]=useState({profile:"socialninja",platform:"instagram",topic:"",date:"",time:"09:00"});

  const EVENTS = [
    {date:"2026-08-18",label:"SN IG",color:C.steel},
    {date:"2026-08-18",label:"NN YT",color:C.blue},
    {date:"2026-08-18",label:"XP: SN→NN",color:C.purple},
    {date:"2026-08-20",label:"SN IG",color:C.steel},
    {date:"2026-08-21",label:"NN YT",color:C.blue},
    {date:"2026-08-22",label:"9G IG",color:C.amber},
    {date:"2026-08-24",label:"Scripts 🤖",color:C.green},
    {date:"2026-08-27",label:"XP: 9G→VV",color:C.pink},
    {date:"2026-08-31",label:"Scripts 🤖",color:C.green},
    ...schedQueue.map(s=>({date:s.date,label:`${profileLabel(s.profile).split(" ")[0]} ${s.platform==="youtube"?"YT":"IG"}`,color:profileColor(s.profile)}))
  ];

  const daysInMonth=new Date(year,month+1,0).getDate();
  const firstDay=new Date(year,month,1).getDay();
  const monthStr=new Date(year,month).toLocaleString("default",{month:"long",year:"numeric"});
  const eventsOn=d=>{
    const key=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return EVENTS.filter(e=>e.date===key);
  };
  const days=[...Array(firstDay).fill(null),...Array(daysInMonth).fill(0).map((_,i)=>i+1)];

  const addScheduled=()=>{
    if(!newPost.topic||!newPost.date)return;
    setSchedQueue(q=>[...q,{...newPost,id:`cal${Date.now()}`,status:"scheduled"}]);
    setNewPost({profile:"socialninja",platform:"instagram",topic:"",date:"",time:"09:00"});
    setShowAdd(false);
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:20}}>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <Btn small color={C.navyLight} onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}}>← Prev</Btn>
          <div style={{fontSize:18,fontWeight:800,color:C.white}}>{monthStr}</div>
          <Btn small color={C.navyLight} onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}}>Next →</Btn>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:14,flexWrap:"wrap"}}>
          {[["Posts",C.steel],["Nazim Ninja",C.blue],["9th Gear",C.amber],["Vice Vault",C.pink],["Cross-promo",C.purple],["Auto Scripts",C.green]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:11,color:C.muted,fontWeight:700,padding:"4px 0"}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {days.map((d,i)=>{
            const isToday=d===todayD.getDate()&&month===todayD.getMonth()&&year===todayD.getFullYear();
            const events=d?eventsOn(d):[];
            return (
              <div key={i} style={{
                background:d?(isToday?C.steel+"33":C.navyMid):"transparent",
                border:isToday?`1px solid ${C.steel}`:d?`1px solid ${C.navyLight}`:"none",
                borderRadius:10,padding:"6px",minHeight:68
              }}>
                {d&&<>
                  <div style={{fontSize:12,fontWeight:isToday?800:600,color:isToday?C.blue:C.muted,marginBottom:3}}>{d}</div>
                  {events.slice(0,3).map((e,j)=>(
                    <div key={j} style={{background:e.color+"33",borderRadius:4,padding:"1px 5px",fontSize:10,color:e.color,marginBottom:2,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.label}</div>
                  ))}
                  {events.length>3&&<div style={{fontSize:9,color:C.muted}}>+{events.length-3} more</div>}
                </>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled posts sidebar */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.muted,letterSpacing:0.5}}>SCHEDULED</div>
          <Btn small color={C.steel} onClick={()=>setShowAdd(!showAdd)}>+ Add</Btn>
        </div>

        {showAdd&&(
          <Card style={{marginBottom:12}}>
            <Select value={newPost.profile} onChange={e=>setNewPost(p=>({...p,profile:e.target.value}))} style={{marginBottom:8,width:"100%"}}>
              {PROFILES.map(pr=><option key={pr.id} value={pr.id}>{pr.label}</option>)}
            </Select>
            <Select value={newPost.platform} onChange={e=>setNewPost(p=>({...p,platform:e.target.value}))} style={{marginBottom:8,width:"100%"}}>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </Select>
            <Input value={newPost.topic} onChange={e=>setNewPost(p=>({...p,topic:e.target.value}))} placeholder="Topic" style={{marginBottom:8}}/>
            <input type="date" value={newPost.date} onChange={e=>setNewPost(p=>({...p,date:e.target.value}))}
              style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"8px 12px",fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",colorScheme:"dark",marginBottom:8}}
            />
            <input type="time" value={newPost.time} onChange={e=>setNewPost(p=>({...p,time:e.target.value}))}
              style={{background:C.navyLight,border:`1px solid ${C.steel}44`,borderRadius:8,color:C.white,padding:"8px 12px",fontSize:13,width:"100%",boxSizing:"border-box",outline:"none",colorScheme:"dark",marginBottom:10}}
            />
            <Btn small color={C.green} full onClick={addScheduled}>Schedule</Btn>
          </Card>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {schedQueue.sort((a,b)=>a.date.localeCompare(b.date)).map(s=>(
            <div key={s.id} style={{background:C.navyMid,border:`1px solid ${profileColor(s.profile)}33`,borderRadius:10,padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <Badge color={profileColor(s.profile)}>{profileLabel(s.profile).split(" ")[0]}</Badge>
                <span style={{fontSize:11,color:C.muted}}>{s.date}</span>
              </div>
              <div style={{fontSize:12,color:C.white,fontWeight:600,marginBottom:2}}>{s.topic}</div>
              <div style={{fontSize:11,color:C.muted,textTransform:"capitalize"}}>{s.platform} · {s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────
export default function NazimOS() {
  const [tab,setTab]=useState(0);
  const key=`tasks_${todayStr()}`;
  const done=ls.get(key,[]);
  const total=TASK_TEMPLATE.length;
  const completed=done.filter(id=>TASK_TEMPLATE.find(t=>t.id===id)).length;
  const pct=Math.round((completed/total)*100);

  return (
    <div style={{minHeight:"100vh",background:C.navy,fontFamily:"'Inter',-apple-system,sans-serif",color:C.white}}>
      {/* Header */}
      <div style={{background:C.navyMid,borderBottom:`1px solid ${C.navyLight}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:20}}>🥷</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:C.white,letterSpacing:-0.3}}>Nazim OS</div>
            <div style={{fontSize:9,color:C.muted,letterSpacing:1.5}}>COMMAND CENTER</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:12,color:C.muted}}>{completed}/{total}</div>
            <div style={{width:80,height:5,background:C.navyLight,borderRadius:99,overflow:"hidden"}}>
              <div style={{background:`linear-gradient(90deg,${C.steel},${C.blue})`,width:`${pct}%`,height:"100%",borderRadius:99,transition:"width .4s"}}/>
            </div>
            <div style={{fontSize:12,color:pct===100?C.green:C.muted,fontWeight:700}}>{pct}%</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {PROFILES.map(p=><div key={p.id} style={{width:7,height:7,borderRadius:"50%",background:p.color}} title={p.label}/>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
            <div style={{fontSize:11,color:C.green,fontWeight:700}}>Live</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{background:C.navyMid,borderBottom:`1px solid ${C.navyLight}`,padding:"0 24px",display:"flex",gap:2,overflowX:"auto"}}>
        {NAV.map((n,i)=>(
          <button key={n} onClick={()=>setTab(i)} style={{
            background:"none",border:"none",
            borderBottom:tab===i?`2px solid ${C.blue}`:"2px solid transparent",
            color:tab===i?C.white:C.muted,
            padding:"13px 16px",fontSize:13,fontWeight:700,cursor:"pointer",
            transition:"color .15s",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"
          }}>
            <span>{NAV_ICONS[i]}</span>{n}
            {i===0&&completed>0&&completed<total&&(
              <span style={{background:C.steel,color:"#fff",borderRadius:99,fontSize:10,padding:"1px 6px",fontWeight:700}}>{completed}</span>
            )}
            {i===0&&completed===total&&<span style={{fontSize:12}}>✅</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{padding:"24px",maxWidth:1240,margin:"0 auto"}}>
        {tab===0&&<Tasks setTab={setTab}/>}
        {tab===1&&<Publisher/>}
        {tab===2&&<Scripts/>}
        {tab===3&&<Queue/>}
        {tab===4&&<Leads/>}
        {tab===5&&<Monitor/>}
        {tab===6&&<Calendar/>}
      </div>
    </div>
  );
}
