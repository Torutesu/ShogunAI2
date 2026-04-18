/* global Icon, Kamon, React, ScreenHome, ScreenMemory, ScreenChat, ScreenAgents, ScreenWork, ScreenMeetings, ScreenCapture, ScreenIntegrations, ScreenSettings, SettingsModal */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "language": "en",
  "accentDensity": "standard",
  "dotGrid": false,
  "goldIntensity": "standard"
}/*EDITMODE-END*/;

const NAV = [
  {id:'home',      label:'Home',         jp:'起動',   icon:'dashboard', section:'main'},
  {id:'memory',    label:'Memory',       jp:'記憶',   icon:'memory',    section:'main', star:true, count:'12,408'},
  {id:'chat',      label:'Chat',         jp:'対話',   icon:'chat',      section:'main', count:'3'},
  {id:'agents',    label:'Agents',       jp:'家臣',   icon:'agents',    section:'main', star:true, count:'13'},
  {id:'work',      label:'Work',         jp:'任務',   icon:'work',      section:'workspace', count:'24'},
  {id:'meetings',  label:'Meetings',     jp:'会議',   icon:'calendar',  section:'workspace', count:'142'},
  {id:'capture',   label:'Capture',      jp:'捕捉',   icon:'capture',   section:'system'},
  {id:'integrations', label:'Integrations', jp:'接続', icon:'plug',   section:'system', count:'8/20'},
  {id:'settings',  label:'Settings',     jp:'設定',   icon:'settings',  section:'system'},
];

const CHAT_HISTORY = [
  {group:'TODAY', jp:'今日', items:[
    {id:'c1', title:'Revenue-cat pricing tiers', time:'14:02'},
    {id:'c2', title:'Speak · pronunciation angles', time:'10:49'},
    {id:'c3', title:'Morning brief summary', time:'07:12'},
  ]},
  {group:'YESTERDAY', jp:'昨日', items:[
    {id:'c4', title:'SHOGUN IA draft', time:''},
    {id:'c5', title:'Matt 1-on-1 prep', time:''},
    {id:'c6', title:'Rust error handling', time:''},
  ]},
];

function App() {
  const [active, setActive] = useState(() => localStorage.getItem('shogun-active') || 'home');
  const [activeChat, setActiveChat] = useState('c1');
  const [systemOpen, setSystemOpen] = useState(false);
  const [sysAnchor, setSysAnchor] = useState({left:0, bottom:0});
  const sysBtnRef = React.useRef(null);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMode, setShareMode] = useState('private');
  const [shareTip, setShareTip] = useState(null); // 'popout' | 'star' | 'share' | null
  const [userOpen, setUserOpen] = useState(false);
  const [userAnchor, setUserAnchor] = useState({left:0, bottom:0, width:220});
  const userBtnRef = React.useRef(null);
  const [settingsOpen, setSettingsOpen] = useState(null); // null | 'general' | 'system' | 'appearance' | 'privacy' | 'data' | 'hummingbird' | 'meetings' | 'chat' | 'integrations' | 'shortcuts' | 'subscription' | 'team' | 'support' | 'api' | 'upgrade' | 'changelog' | 'feedback'

  const openUser = () => {
    const r = userBtnRef.current?.getBoundingClientRect();
    if (r) setUserAnchor({left: r.left, bottom: window.innerHeight - r.top + 8, width: r.width});
    setUserOpen(v => !v);
  };

  const openSystem = () => {
    const r = sysBtnRef.current?.getBoundingClientRect();
    if (r) setSysAnchor({left: r.right + 8, bottom: window.innerHeight - r.bottom});
    setSystemOpen(v => !v);
  };

  useEffect(() => { localStorage.setItem('shogun-active', active); }, [active]);

  useEffect(() => {
    document.body.classList.toggle('dot-grid', tweaks.dotGrid);
    document.body.setAttribute('data-lang', tweaks.language);
    document.body.setAttribute('data-density', tweaks.accentDensity);
    document.body.setAttribute('data-gold', tweaks.goldIntensity);
  }, [tweaks]);

  const cycleLang = () => {
    const order = ['en','jp','bi'];
    const next = order[(order.indexOf(tweaks.language)+1) % order.length];
    update('language', next);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const update = (k,v) => {
    const next = {...tweaks, [k]: v};
    setTweaks(next);
    window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]: v}}, '*');
  };

  const sections = [
    {id:'main', label:'Core', jp:'核'},
    {id:'workspace', label:'Workspace', jp:'作業'},
  ];
  const systemItems = NAV.filter(n => n.section === 'system');

  const Screen = {
    home: ScreenHome,
    memory: ScreenMemory,
    chat: ScreenChat,
    agents: ScreenAgents,
    work: ScreenWork,
    meetings: ScreenMeetings,
    capture: ScreenCapture,
    integrations: ScreenIntegrations,
    settings: ScreenSettings,
  }[active] || ScreenHome;

  return (
    <div className="app" data-screen-label={active}>
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <Kamon size={24} color="var(--text)"/>
          <div>
            <div className="brand-title en-only">SHOGUN</div>
            <div className="brand-jp jp">将軍</div>
          </div>
        </div>
        <div className="cmdk">
          <Icon name="search" size={14}/>
          <span>Ask your memory or run a command…</span>
          <span className="kbd">⌘K</span>
        </div>
        <div className="right">
          {/* 3 page actions: Hummingbird · favorite · share */}
          <div className="page-actions">
            <button className="page-action" onMouseEnter={()=>setShareTip('popout')} onMouseLeave={()=>setShareTip(null)} onClick={()=>window.alert('Open in Hummingbird (native app)')}>
              <Icon name="popout" size={15}/>
              {shareTip==='popout' && <span className="tip">Open in Hummingbird</span>}
            </button>
            <button className={'page-action'+(favorited?' on':'')} onMouseEnter={()=>setShareTip('star')} onMouseLeave={()=>setShareTip(null)} onClick={()=>setFavorited(v=>!v)}>
              <Icon name="star" size={15}/>
              {shareTip==='star' && <span className="tip">{favorited?'Unfavorite':'Favorite chat'}</span>}
            </button>
            <button className={'page-action'+(shareOpen?' active':'')} onMouseEnter={()=>setShareTip('share')} onMouseLeave={()=>setShareTip(null)} onClick={()=>setShareOpen(v=>!v)}>
              <Icon name="upload" size={15}/>
              {shareTip==='share' && !shareOpen && <span className="tip">Share chat</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar" data-screen-label="sidebar">
        {sections.map(sec => (
          <div key={sec.id}>
            <div className="section-label"><span className="en-only">{sec.label}</span><span className="en-only"> · </span><span className="jp">{sec.jp}</span></div>
            {NAV.filter(n => n.section === sec.id).map(n => (
              <React.Fragment key={n.id}>
                <div className={'nav-item '+(active===n.id?'active':'')} onClick={() => setActive(n.id)}>
                  <Icon name={n.icon} size={16}/>
                  <span className="nav-label en-only">{n.label}</span>
                  {n.star && <span className="gold" style={{fontSize:8, marginLeft:-4}}>★</span>}
                  <span className="jp">{n.jp}</span>
                  {n.count && <span className="count">{n.count}</span>}
                </div>
                {/* Chat history sub-nav */}
                {n.id==='chat' && active==='chat' && (
                  <div className="chat-subnav">
                    <button className="btn btn-sm btn-secondary" style={{width:'calc(100% - 14px)', margin:'6px 7px 10px', justifyContent:'flex-start'}}><Icon name="plus" size={12}/>New conversation</button>
                    {CHAT_HISTORY.map(g => (
                      <React.Fragment key={g.group}>
                        <div className="chat-subgroup t-mono"><span className="en-only">{g.group}</span><span className="jp" style={{marginLeft:6}}>{g.jp}</span></div>
                        {g.items.map(it => (
                          <div key={it.id} className={'chat-sub-item '+(activeChat===it.id?'active':'')} onClick={()=>setActiveChat(it.id)} title={it.title}>
                            <span className="dot"/>
                            <span className="chat-sub-title">{it.title}</span>
                            {it.time && <span className="t-mono chat-sub-time">{it.time}</span>}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ))}

        {/* System section — collapsed to one button w/ floating menu */}
        <div style={{marginTop:12}}>
          <div ref={sysBtnRef} className={'nav-item '+(systemItems.some(s=>s.id===active)?'active':'')+(systemOpen?' open':'')} onClick={openSystem} style={{cursor:'pointer'}}>
            <Icon name="settings" size={16}/>
            <span className="nav-label en-only">System</span>
            <span className="jp">系統</span>
            <span className="count"><Icon name={systemOpen?'chevronDown':'chevronRight'} size={10}/></span>
          </div>
        </div>
        <div className="spacer" style={{flex:1}}/>

        {/* User cluster — capturing / avatar */}
        <div className="user-cluster">
          <div className="user-row">
            <span className="capturing-pill"><span className="pulse"/><span className="en-only">CAPTURING</span><span className="jp" style={{marginLeft:4}}>記録中</span></span>
          </div>
          <div ref={userBtnRef} className="user-row user-pill" onClick={openUser}>
            <div className="avatar" style={{width:26, height:26, fontSize:11}}>K</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:12, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>Kazu Tano</div>
              <div className="t-mono" style={{fontSize:9, color:'var(--text-dim)'}}>LOCAL · PRO</div>
            </div>
            <Icon name={userOpen?'chevronDown':'chevronRight'} size={11} className="dim"/>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <Screen/>
      </div>

      {/* Share modal — anchored to upload button in topbar */}
      {shareOpen && (
        <>
          <div style={{position:'fixed', inset:0, zIndex:80}} onClick={()=>setShareOpen(false)}/>
          <div className="share-modal">
            <div style={{fontSize:18, fontWeight:600, marginBottom:4}}>
              <span className="en-only">Share chat</span>
              <span className="jp" style={{marginLeft:8, fontSize:14, color:'var(--text-mute)'}}>共有</span>
            </div>
            <div style={{fontSize:13, color:'var(--text-mute)', marginBottom:18}}>Only messages up until now will be shared</div>
            <div className="share-choices">
              <div className={'share-choice '+(shareMode==='private'?'on':'')} onClick={()=>setShareMode('private')}>
                <Icon name="lock" size={18} className={shareMode==='private'?'gold':'dim'}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:500}}>
                    Private
                    <span className="jp" style={{marginLeft:8, fontSize:11, color:'var(--text-dim)'}}>非公開</span>
                  </div>
                  <div style={{fontSize:12, color:'var(--text-mute)', marginTop:2}}>Only you have access</div>
                </div>
                {shareMode==='private' && <Icon name="check" size={16} className="gold"/>}
              </div>
              <div className={'share-choice '+(shareMode==='public'?'on':'')} onClick={()=>setShareMode('public')}>
                <Icon name="globe" size={18} className={shareMode==='public'?'gold':'dim'}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:500}}>
                    Public access
                    <span className="jp" style={{marginLeft:8, fontSize:11, color:'var(--text-dim)'}}>公開</span>
                  </div>
                  <div style={{fontSize:12, color:'var(--text-mute)', marginTop:2}}>Anyone with the link can view</div>
                </div>
                {shareMode==='public' && <Icon name="check" size={16} className="gold"/>}
              </div>
            </div>
            <button className="btn" style={{width:'100%', marginTop:18, background:'var(--gold-bg, #EFE5D3)', color:'#151212', borderColor:'var(--gold-dim)', height:44, fontSize:14}}>
              <Icon name="link" size={14}/> Create share link
            </button>
          </div>
        </>
      )}

      {/* User floating menu — slides up above the user button, sized to sidebar */}
      {userOpen && (
        <>
          <div style={{position:'fixed', inset:0, zIndex:80}} onClick={()=>setUserOpen(false)}/>
          <div className="user-float" style={{left: userAnchor.left, bottom: userAnchor.bottom, width: userAnchor.width}}>
            <div className="user-float-head">
              <div style={{fontSize:12, color:'var(--text-dim)'}}>kazu@shogun.local</div>
            </div>
            <div className="user-float-section">
              <div className="user-float-row" onClick={()=>{setSettingsOpen('general'); setUserOpen(false);}}>
                <Icon name="settings" size={13}/><span className="en-only">Settings</span><span className="jp">設定</span>
                <span className="spacer"/><span className="kbd-mini">⌘,</span>
              </div>
              <div className="user-float-row" onClick={()=>{setSettingsOpen('subscription'); setUserOpen(false);}}>
                <Icon name="arrowUpRight" size={13}/><span className="en-only">Upgrade Plan</span><span className="jp">昇格</span>
              </div>
              <div className="user-float-row" onClick={()=>{setSettingsOpen('download'); setUserOpen(false);}}>
                <Icon name="download" size={13}/><span className="en-only">Download Mobile App</span><span className="jp">携帯</span>
              </div>
            </div>
            <div className="user-float-section" style={{borderTop:'1px solid var(--border)'}}>
              <div className="user-float-row" onClick={()=>{setSettingsOpen('feedback'); setUserOpen(false);}}>
                <Icon name="chat" size={13}/><span className="en-only">Give Feedback</span><span className="jp">意見</span>
              </div>
              <div className="user-float-row" onClick={()=>{setSettingsOpen('support'); setUserOpen(false);}}>
                <Icon name="info" size={13}/><span className="en-only">Help Center</span><span className="jp">案内</span>
              </div>
              <div className="user-float-row" onClick={()=>{setSettingsOpen('changelog'); setUserOpen(false);}}>
                <Icon name="clock" size={13}/><span className="en-only">Changelog</span><span className="jp">更新</span>
              </div>
              <div className="user-float-row gold" onClick={()=>{setSettingsOpen('referral'); setUserOpen(false);}}>
                <Icon name="gift" size={13}/><span className="en-only">Get 2 Months Free</span><span className="jp">贈</span>
              </div>
            </div>
            <div className="user-float-section" style={{borderTop:'1px solid var(--border)'}}>
              <div className="user-float-row" style={{color:'var(--text-mute)'}}>
                <Icon name="logout" size={13}/><span className="en-only">Logout</span><span className="jp">退出</span>
              </div>
            </div>
            {/* Profile chip at bottom, like reference */}
            <div className="user-float-profile">
              <div className="avatar">T</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:12, fontWeight:500}}>Toru Tano</div>
                <div style={{fontSize:10, color:'var(--text-dim)'}}>Pro · Local</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings modal — floating with semi-transparent backdrop */}
      {settingsOpen && (
        <SettingsModal
          pane={settingsOpen}
          setPane={setSettingsOpen}
          close={()=>setSettingsOpen(null)}
        />
      )}

      {/* System floating menu (portal-style, positioned via fixed) */}
      {systemOpen && (        <>
          <div style={{position:'fixed', inset:0, zIndex:80}} onClick={()=>setSystemOpen(false)}/>
          <div className="system-float" style={{left: sysAnchor.left, bottom: sysAnchor.bottom, zIndex:90}}>
            <div className="t-mono" style={{padding:'12px 14px 8px', color:'var(--text-dim)', borderBottom:'1px solid var(--border)', marginBottom:4}}>
              <span className="en-only">SYSTEM</span>
              <span className="en-only" style={{margin:'0 6px'}}>·</span>
              <span className="jp">系統</span>
            </div>
            {systemItems.map(n => (
              <div key={n.id} className={'nav-item '+(active===n.id?'active':'')} onClick={()=>{setActive(n.id); setSystemOpen(false);}} style={{margin:'0 6px'}}>
                <Icon name={n.icon} size={16}/>
                <span className="nav-label en-only">{n.label}</span>
                <span className="jp">{n.jp}</span>
                {n.count && <span className="count">{n.count}</span>}
              </div>
            ))}
            <div style={{borderTop:'1px solid var(--border)', padding:'10px 14px', display:'flex', alignItems:'center', gap:8, marginTop:4}}>
              <Kamon size={12} color="var(--gold)"/>
              <span className="t-mono" style={{fontSize:10, color:'var(--text-dim)'}}>v0.4.1 · LOCAL</span>
            </div>
          </div>
        </>
      )}

      {/* Tweaks */}
      <div id="tweaks-panel" className={editMode?'show':''}>
        <h6>TWEAKS · 調整 <Kamon size={12} color="var(--gold)"/></h6>
        <div className="tweak-row">
          <label>Language</label>
          <select value={tweaks.language} onChange={e=>update('language', e.target.value)}>
            <option value="en">English</option>
            <option value="jp">日本語</option>
            <option value="bi">Bilingual</option>
          </select>
        </div>
        <div className="tweak-row">
          <label>Accent density</label>
          <select value={tweaks.accentDensity} onChange={e=>update('accentDensity', e.target.value)}>
            <option value="minimal">Minimal</option>
            <option value="standard">Standard</option>
            <option value="rich">Rich</option>
          </select>
        </div>
        <div className="tweak-row">
          <label>Gold intensity</label>
          <select value={tweaks.goldIntensity} onChange={e=>update('goldIntensity', e.target.value)}>
            <option value="muted">Muted</option>
            <option value="standard">Standard</option>
            <option value="bright">Bright</option>
          </select>
        </div>
        <div className="tweak-row">
          <label>Dot-grid background</label>
          <div className={'switch '+(tweaks.dotGrid?'on':'')} onClick={()=>update('dotGrid', !tweaks.dotGrid)}/>
        </div>
      </div>

      <style>{`
        /* EN only: hide all JP flourishes */
        body[data-lang=en] .jp, body[data-lang=en] .brand-jp { display:none !important; }
        /* JP only: hide EN-marked elements, keep JP */
        body[data-lang=jp] .en-only { display:none !important; }
        body[data-gold=muted] { --gold:#A88F5F; --gold-hover:#B89C6A; }
        body[data-gold=bright] { --gold:#D9BC7F; --gold-hover:#E5C88C; }
        body[data-density=minimal] .sidebar .nav-item .nav-label { display:none; }
        body[data-density=rich] .nav-item { padding:10px 12px; }
        .lang-pill { min-width:44px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.08em; padding:0 10px; }

        /* Chat sub-nav under Chat */
        .chat-subnav { margin:2px 0 8px 8px; padding-left:10px; border-left:1px solid var(--border); }
        .chat-subgroup { padding:10px 0 4px 8px; font-size:9px; }
        .chat-sub-item { display:flex; align-items:center; gap:8px; padding:6px 8px; margin:1px 0; border-radius:var(--radius-sm); cursor:pointer; color:var(--text-mute); font-size:12px; }
        .chat-sub-item:hover { background:var(--surface-2); color:var(--text); }
        .chat-sub-item.active { background:var(--surface-2); color:var(--text); }
        .chat-sub-item.active .dot { background:var(--gold); box-shadow:0 0 0 2px color-mix(in srgb, var(--gold) 25%, transparent); }
        .chat-sub-item .dot { width:5px; height:5px; border-radius:50%; background:var(--border-hi); flex-shrink:0; }
        .chat-sub-title { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
        .chat-sub-time { font-size:9px; color:var(--text-dim); flex-shrink:0; }

        /* Floating system menu */
        .system-float {
          position:fixed;
          width:240px;
          background:var(--surface); border:1px solid var(--border-hi);
          border-radius:var(--radius-md);
          box-shadow:0 18px 40px -8px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3);
          padding:4px 0 4px;
          animation: sysFloatIn 140ms var(--ease-out);
        }
        @keyframes sysFloatIn {
          from { opacity:0; transform: translateX(-4px) translateY(2px); }
          to { opacity:1; transform: translateX(0) translateY(0); }
        }

        /* Topbar page actions */
        .page-actions { display:flex; align-items:center; gap:4px; padding:4px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); }
        .page-action {
          position:relative; width:30px; height:28px;
          display:flex; align-items:center; justify-content:center;
          background:transparent; border:0; color:var(--text-mute); cursor:pointer;
          border-radius:var(--radius-sm); transition:all 120ms;
        }
        .page-action:hover { background:var(--surface-2); color:var(--text); }
        .page-action.on, .page-action.active { color:var(--gold); background:var(--surface-2); }
        .page-action .tip {
          position:absolute; top:calc(100% + 8px); right:0;
          background:var(--surface); border:1px solid var(--border-hi);
          border-radius:var(--radius-sm); padding:5px 10px;
          font-size:11px; color:var(--text); white-space:nowrap;
          box-shadow:0 6px 16px rgba(0,0,0,0.4); z-index:60;
          pointer-events:none;
        }

        /* User cluster (bottom-left sidebar) */
        .user-cluster { padding:10px; border-top:1px solid var(--border); margin-top:8px; }
        .user-row { display:flex; align-items:center; gap:6px; padding:2px 0; }
        .user-row + .user-row { margin-top:8px; }
        .capturing-pill {
          display:inline-flex; align-items:center; gap:6px;
          font-family:var(--font-mono); font-size:9px; letter-spacing:0.12em;
          color:var(--text-mute); padding:3px 8px;
          border:1px solid var(--border); border-radius:999px;
          background:var(--surface);
        }
        .mini-btn {
          width:26px; height:26px; min-width:26px;
          display:flex; align-items:center; justify-content:center;
          background:var(--surface); border:1px solid var(--border);
          border-radius:var(--radius-sm); cursor:pointer;
          color:var(--text-mute); font-family:var(--font-mono); font-size:10px; letter-spacing:0.05em;
          padding:0 6px;
        }
        .mini-btn:hover { color:var(--text); border-color:var(--border-hi); background:var(--surface-2); }
        .user-pill {
          padding:8px 10px; background:var(--surface); border:1px solid var(--border);
          border-radius:var(--radius-md); cursor:pointer; transition:all 120ms;
        }
        .user-pill:hover { border-color:var(--border-hi); background:var(--surface-2); }

        /* User floating menu */
        .user-float {
          position:fixed; z-index:90;
          background:var(--surface); border:1px solid var(--border-hi);
          border-radius:var(--radius-lg);
          box-shadow:0 24px 48px -12px rgba(0,0,0,0.6), 0 2px 0 rgba(0,0,0,0.3);
          padding:4px 0;
          overflow:hidden;
          min-width:220px;
        }
        @keyframes userFloatIn {
          from { opacity:0; transform:translateY(8px) scale(0.98); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        .user-float-head { padding:10px 12px 8px; border-bottom:1px solid var(--border); }
        .user-float-section { padding:4px 4px; }
        .user-float-row {
          display:flex; align-items:center; gap:10px;
          padding:7px 10px; border-radius:var(--radius-sm);
          color:var(--text); font-size:12.5px; cursor:pointer;
        }
        .user-float-row:hover { background:var(--surface-2); }
        .user-float-row.gold { color:var(--gold); }
        .user-float-row .jp { font-family:var(--font-jp); font-weight:300; font-size:10.5px; color:var(--text-dim); margin-left:-4px; }
        .user-float-row .kbd-mini {
          font-family:var(--font-mono); font-size:10px;
          color:var(--text-dim); letter-spacing:0.05em;
        }
        .user-float-profile {
          display:flex; align-items:center; gap:10px;
          padding:10px 12px; border-top:1px solid var(--border);
          background:var(--bg);
        }
        .user-float-profile .avatar {
          width:26px; height:26px; border-radius:50%;
          background:var(--surface-2); border:1px solid var(--border);
          display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:500; color:var(--text);
        }
        /* Share modal */
        .share-modal {
          position:fixed; top:56px; right:16px;
          width:440px; z-index:90;
          background:var(--surface); border:1px solid var(--border-hi);
          border-radius:var(--radius-lg);
          box-shadow:0 30px 70px -12px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4);
          padding:20px 22px;
          animation: sysFloatIn 160ms var(--ease-out);
        }
        .share-choices {
          border:1px solid var(--border); border-radius:var(--radius-md);
          overflow:hidden;
        }
        .share-choice {
          display:flex; align-items:center; gap:14px;
          padding:16px 18px; cursor:pointer;
          transition:background 120ms;
        }
        .share-choice + .share-choice { border-top:1px solid var(--border); }
        .share-choice:hover { background:var(--surface-2); }
        .share-choice.on { background:color-mix(in srgb, var(--gold) 6%, var(--surface)); }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
