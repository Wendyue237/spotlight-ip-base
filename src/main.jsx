import React,{useRef,useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Compass,Map,ArrowRight,Play,X,GraduationCap,Clapperboard,Radio,TrendingUp,Camera,Package,Mic,MessagesSquare,Mouse,Move,ChevronUp,ChevronDown,ChevronLeft,ChevronRight,RotateCcw,Expand,Check,MapPin,Volume2} from 'lucide-react';
import Scene from './Scene';
import {StudioPhotoPreview,StudioPhotoDialog} from './StudioPhoto';
import {zones,journey,caseStudies} from './data';
import './style.css';
const icons={GraduationCap,Radio,Camera,Package,Mic,MessagesSquare};
function App(){const api=useRef(),[zone,setZone]=useState(null),[action,setAction]=useState(null),[ready,setReady]=useState(false),[overview,setOverview]=useState(false),[video,setVideo]=useState(false),[photo,setPhoto]=useState(false),[detail,setDetail]=useState(false),[toast,setToast]=useState(''),[collapsed,setCollapsed]=useState(false),[visited,setVisited]=useState([]);
 const notify=msg=>setToast(msg);useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(t)}},[toast]);useEffect(()=>{api.current?.setPaused(video||photo);const fn=e=>{if(e.code==='Escape'){setVideo(false);setDetail(false)}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[video,photo]);
 const receiveZone=z=>{setZone(z);setDetail(false);if(z)setCollapsed(false)};const receiveAction=a=>{setAction(a);if(a){const id=api.current?.getState().active;if(id)setVisited(v=>v.includes(id)?v:[...v,id])}};
 const goto=id=>{setOverview(false);setCollapsed(false);api.current?.goTo(id)};const Icon=zone?icons[zone.icon]:Compass;
 return <main className="app">
 <header><div className="brand"><span>聚<span className="brand-light">光</span>灯<i>IP</i></span><strong>孵化基地</strong></div><div className="tagline">从零起步，一站式IP陪跑</div><nav><button className={!overview?'selected':''} onClick={()=>{setOverview(false);api.current?.resetView()}}><Compass size={24}/>自由探索</button><button className={overview?'selected':''} onClick={()=>setOverview(v=>!v)}><Map size={24}/>基地全览</button></nav></header>
 <div className="stage"><Scene api={api} onZone={receiveZone} onAction={receiveAction} onReady={()=>setReady(true)} onMessage={notify}/>
 {!ready&&<div className="loading"><span className="loader"/>正在点亮聚光灯…</div>}
 <div className="view-tools"><button aria-label="重置视角" title="重置视角" onClick={()=>api.current?.resetView()}><RotateCcw size={18}/></button><button aria-label="全屏浏览" title="全屏浏览" onClick={()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()}><Expand size={18}/></button></div>
 {action&&<div className="action-state"><span className="live-dot"/><b>{zone?.name} · {action}中</b><button onClick={()=>api.current?.stopAction()}>结束互动 <X size={14}/></button></div>}
 {toast&&<div className="toast" role="status">{toast}</div>}
 </div>
 <aside className={'panel '+(collapsed?'collapsed':'')}>
 <div className="panel-heading"><Icon size={35} strokeWidth={1.5}/><div><h1>{overview?'基地全览':zone?.name||'欢迎来到聚光灯'}</h1><p>{overview?`已体验 ${visited.length} / ${zones.length} 个互动` : action?'正在体验场景互动':zone?'走近场景，开启互动':'走进基地，探索IP成长的每一步。'}</p></div><button aria-label={collapsed?'展开面板':'收起面板'} className="close" onClick={()=>setCollapsed(v=>!v)}>{collapsed?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button></div>
 <div className="panel-body">{overview?<div className="area-list">{zones.map(z=><button key={z.id} onClick={()=>goto(z.id)}><span>{z.name}<small>{z.subtitle}</small></span>{visited.includes(z.id)?<Check size={18}/>:<ArrowRight size={18}/>}</button>)}</div>:zone?<>
 {(['studio','class','window','plan'].includes(zone.id)||zone.id.startsWith('live'))&&<StudioPhotoPreview zoneId={zone.id} onOpen={()=>setPhoto(zone.id)}/>}<p className="description">{zone.description}</p><div className="service-grid">{zone.services.map((s,i)=><div key={s}>{[<Compass/>,<Clapperboard/>,<MessagesSquare/>,<TrendingUp/>][i]}<span>{s}</span></div>)}</div>
 <button className="primary" onClick={()=>action?api.current?.stopAction():api.current?.interact(zone.id)}>{action?'结束互动':zone.verb}<span className="key">E</span></button>
 <button className="secondary" onClick={()=>setDetail(v=>!v)}>{detail?'收起服务详情':'查看服务详情'}<ChevronDown size={16}/></button>{detail&&<section className="detail"><p>{zone.detail}</p>{zone.id==='plan'&&<div className="case-studies"><h2>从IP到业务的实践</h2>{caseStudies.map(c=><article className="case-card" key={c.name}><span className="case-tag">{c.tag}</span><h3>{c.name}</h3><small>{c.context}</small><p>{c.story}</p><strong>{c.result}</strong></article>)}<small className="case-source">案例及金额由基地提供，分别为门店股权投资与个人累计变现。</small></div>}</section>}
 <button className="video-link" onClick={()=>zone.id.startsWith('live')?setPhoto(zone.id):setVideo(true)}><Play size={17}/>{zone.id.startsWith('live')?'查看直播照片与视频':'观看基地实拍'}</button></>:<>
 <StudioPhotoPreview zoneId="entrance" onOpen={()=>setPhoto('entrance')}/><p className="description welcome-intro">让门店、品牌和个人被更多人看见。用短视频与个人IP连接线上曝光和线下生意。</p><div className="welcome-services">{[[GraduationCap,'IP孵化'],[Clapperboard,'内容制作'],[Radio,'直播陪跑'],[TrendingUp,'商业变现']].map(([I,t])=><button key={t} onClick={()=>goto({'IP孵化':'plan','内容制作':'studio','直播陪跑':'live1','商业变现':'products'}[t])}><I size={32} strokeWidth={1.6}/><strong>{t}</strong></button>)}</div>
 <button className="primary" onClick={()=>goto('class')}>开始探索<ArrowRight size={20}/></button>
 <button className="video-preview" onClick={()=>setVideo(true)}><img src={import.meta.env.BASE_URL+'assets/entrance.jpg'} alt="聚光灯IP孵化基地真实入口"/><span className="play"><Play size={24} fill="currentColor"/></span><span className="caption">观看基地实拍视频</span></button>
 </>}
 </div></aside>
 <footer><div className="controls-hint"><div><span className="keys">{['W','A','S','D'].map(x=><kbd key={x}>{x}</kbd>)}</span><span>/ 方向键 移动</span></div><div><kbd>E</kbd><span>互动</span><span className="divider"/><Mouse size={17}/><span>拖拽旋转 · 滚轮缩放</span></div></div><div className="journey">{journey.map((s,i)=><React.Fragment key={s}><button onClick={()=>goto(['class','plan','studio','studio','products'][i])}><span className="journey-dot"/>{s}</button>{i<4&&<ArrowRight size={15}/>}</React.Fragment>)}</div><button className="map-button" onClick={()=>setOverview(v=>!v)}><Map size={28}/><span>探索地图<small>{visited.length} / {zones.length}</small></span></button></footer>
 <div className="touch-pad">{[['KeyW',ChevronUp,'up'],['KeyA',ChevronLeft,'left'],['KeyS',ChevronDown,'down'],['KeyD',ChevronRight,'right']].map(([code,I,pos])=><button key={code} className={pos} aria-label={code} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);api.current?.setKey(code,true)}} onPointerUp={()=>api.current?.setKey(code,false)} onPointerCancel={()=>api.current?.setKey(code,false)}><I/></button>)}</div>
 {photo&&<StudioPhotoDialog zoneId={photo} onClose={()=>setPhoto(false)}/>}
 {video&&<div className="modal" onClick={()=>setVideo(false)}><section role="dialog" aria-modal="true" aria-label="基地实拍视频" onClick={e=>e.stopPropagation()}><div className="modal-head"><span><Volume2 size={18}/>聚光灯IP孵化基地 · 实地导览</span><button autoFocus onClick={()=>setVideo(false)} aria-label="关闭视频"><X/></button></div><video src={zone?.id.startsWith('live')?(import.meta.env.BASE_URL+'assets/live-room.mp4'):(import.meta.env.BASE_URL+'assets/base-tour.mp4')} controls autoPlay playsInline onLoadedMetadata={e=>{e.currentTarget.currentTime=({class:8,window:16,plan:24,studio:4,products:4}[zone?.id]||0)}}/><p>{zone?.id.startsWith('live')?'独立直播空间 · 基地实拍':'走进聚光灯 · 真实空间导览'}</p></section></div>}
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
