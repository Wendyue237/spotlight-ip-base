import React,{useEffect,useRef,useState} from 'react';
import {Camera,Expand,X,ChevronLeft,ChevronRight,Play} from 'lucide-react';
const albums={
 plan:{name:'洽谈企划室',preview:'从面对面交流，找到IP方向',summary:'洽谈实拍 · 交流视频 · 主理人成就',topics:['一对一洽谈','IP方向梳理','主理人成就'],service:'结合个人经历、业务优势与目标客户，讨论IP定位、内容策划与商业转化路径。',photos:[
 {file:'plan-meeting.jpg',title:'会议室洽谈',alt:'两人围坐茶桌，在会议室面对面交流',description:'会议室里的面对面洽谈，记录真实交流现场。',position:'50% 50%'},
 {file:'plan-meeting.mp4',type:'video',poster:'plan-meeting-video.jpg',title:'洽谈现场视频',description:'会议室洽谈现场的短片记录。点击播放可观看完整片段。'},
 {file:'plan-achievement.jpg',title:'川无常视频号成就',alt:'川无常视频号成就截图，2026年7月16日累计播放1000万',description:'据所提供的成就截图，川无常视频号于2026年7月16日显示累计播放1000万。此处展示的是累计播放量。',position:'50% 25%'}]},
 entrance:{name:'品牌入口',preview:'在聚光灯门口，留下相聚瞬间',summary:'品牌入口 · 门口合影',topics:['品牌入口','合影留念'],service:'从这里开启基地探索，了解IP定位、内容制作、直播陪跑与线下活动。',photos:[
 {file:'entrance-group-1.jpg',title:'门口合影 01',alt:'两人在聚光灯IP孵化基地品牌墙前合影留念',description:'在基地入口的品牌墙前，记录相聚的瞬间。',position:'50% 30%'},
 {file:'entrance-group-2.jpg',title:'门口合影 02',alt:'两人在聚光灯IP孵化基地品牌墙前握手合影',description:'入口品牌墙前的合影留念。',position:'50% 38%'},
 {file:'entrance-group-3.jpg',title:'门口集体合影',alt:'多人在聚光灯IP孵化基地入口品牌墙前集体合影',description:'大家在基地门口一起留下合影。',position:'50% 35%'}]},
 window:{name:'窗景拍摄位',preview:'真实窗景里的个人表达',summary:'人物出镜 · 拍摄布光 · 现场监看',topics:['窗景拍摄','人物表达','内容录制'],service:'以真实窗景作为背景，结合灯光、摄影机与现场监看，支持个人口播、人物访谈与日常内容拍摄。',photos:[
 {file:'window-session-1.jpg',title:'窗边人物拍摄',alt:'一位出镜者坐在窗边，旁边布置灯具与遮光设备',description:'真实窗景配合现场布光，记录人物在镜头前的状态与表达。',position:'50% 60%'},
 {file:'window-session-2.jpg',title:'窗景拍摄现场',alt:'出镜者坐在窗前，摄影机、柔光灯与现场工作人员共同构成拍摄现场',description:'从摄影机后方看拍摄现场：出镜者、机位、灯光与工作人员配合完成内容录制。',position:'65% 55%'},
 {file:'window-session-3.jpg',title:'镜头与现场监看',alt:'窗边出镜者手持手机，前景摄影机与监看屏显示人物画面',description:'通过摄影机与监看屏查看人物构图，为窗景内容录制做好准备。',position:'50% 60%'},
 {file:'window-session-4.jpg',title:'窗景表达与录制',alt:'出镜者在窗边做手势表达，前方工作人员佩戴耳机，摄影机和灯光对准出镜者',description:'在窗边自然表达，工作人员配合拍摄与监听，记录人物讲述的过程。',position:'70% 55%'}]},
 live:{name:'直播间',preview:'走进真实直播现场',summary:'1张照片 · 2段视频',topics:['直播陪跑','现场指导','直播实拍'],service:'从设备布置、镜头表达到直播演练，在真实场景中练习直播流程。',photos:[
 {file:'live-coaching.jpg',title:'直播现场指导',alt:'直播现场，两位参与者在手机与补光灯前调整准备',description:'配合手机、平板、补光灯与背景布置，进行现场指导与直播准备。',position:'50% 60%'},
 {file:'live-session-1.mp4',type:'video',poster:'live-session-1.jpg',title:'直播现场视频 01',description:'观看基地提供的直播现场片段。点击播放，可调节音量或全屏观看。'},
 {file:'live-session-2.mp4',type:'video',poster:'live-session-2.jpg',title:'直播现场视频 02',description:'观看另一段直播现场记录，了解实际出镜和设备布置。点击播放，可拖动进度查看。'}]},
 studio:{name:'多功能摄影棚',preview:'镜头背后的拍摄现场',summary:'人物出镜 · 灯光布置 · 拍摄监看',topics:['人物口播','主题访谈','短视频拍摄'],service:'围绕个人经历、专业观点与品牌故事，开展脚本策划、拍摄与剪辑制作。',photos:[{file:'studio-session.jpg',title:'让人物故事走进镜头',alt:'摄影棚中的人物拍摄现场，布置摄影机、监看屏、柔光灯与黑色背景板',description:'人物、布景、灯光与摄影机配合，把表达转化为可以传播的内容。这张实拍记录了摄影棚中的人物拍摄现场。',position:'50% 66%'}]},
 class:{name:'线下活动区',preview:'从现场分享，到镜头表达',summary:'主理人演讲 · IP录制 · 线下交流',topics:['IP主题分享','内容录制','线下交流'],service:'通过课程分享、现场交流与内容录制，将IP认知和表达练习结合起来。',photos:[
 {file:'class-founder.jpg',title:'主理人川无常演讲',alt:'主理人川无常手持话筒，在显示屏前进行个人IP主题演讲',description:'主理人川无常在现场分享自媒体与个人IP话题，从内容表达聊到商业变现。',position:'50% 45%'},
 {file:'class-recording.jpg',title:'IP 内容录制',alt:'活动区内为IP录制内容，摄影机与监看屏前有讲述者，两侧布置柔光灯',description:'在活动区为IP录制内容，配合显示屏、柔光灯、摄影机与现场监看，记录讲述者的表达。',position:'50% 60%'},
 {file:'class-gathering.jpg',title:'线下交流现场',alt:'多位参与者围桌聆听，一位讲述者手持话筒分享，现场布置灯光与拍摄设备',description:'参与者围桌聆听现场分享，在同一个空间里交流与讨论。',position:'50% 50%'}]}
};
const source=p=>(import.meta.env.BASE_URL+'assets/')+(p.type==='video'?'videos/':'photos/')+p.file;
const thumbnail=p=>p.poster?(import.meta.env.BASE_URL+'assets/photos/')+p.poster:source(p);
const getAlbum=id=>albums[id.startsWith('live')?'live':id];
export function StudioPhotoPreview({onOpen,zoneId='studio'}){
 const album=getAlbum(zoneId),photo=album.photos[0];
 return <button className="studio-photo-card" onClick={onOpen} aria-label={'放大'+album.name+'实拍素材'}>
  <div className="studio-photo-image"><img src={source(photo)} alt={photo.alt} style={{objectPosition:photo.position}}/><span className="photo-badge"><Camera size={13}/>现场实拍 · {album.photos.some(p=>p.type==='video')?'照片 + 视频':album.photos.length+'张'}</span><span className="photo-expand"><Expand size={16}/></span></div>
  <span className="studio-photo-caption"><strong>{album.preview}</strong><small>{album.summary}<span>查看{album.photos.some(p=>p.type==='video')?'照片与视频':album.photos.length>1?'相册':'大图'} ↗</span></small></span>
 </button>
}
export function StudioPhotoDialog({onClose,zoneId='studio'}){
 const ref=useRef(),[index,setIndex]=useState(0),album=getAlbum(zoneId),photo=album.photos[index];
 const change=delta=>setIndex(i=>(i+delta+album.photos.length)%album.photos.length);
 useEffect(()=>{const el=ref.current;el.showModal();return()=>el.close()},[]);
 return <dialog ref={ref} className="studio-photo-dialog" aria-labelledby="studio-photo-title" onKeyDown={e=>{if(e.target.tagName!=='VIDEO'&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}}} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="studio-photo-shell"><header className="photo-dialog-header"><div><small>聚光灯IP孵化基地 / 现场实拍</small><h2 id="studio-photo-title">{album.name}</h2></div><button autoFocus aria-label="关闭实拍展示" onClick={onClose}><X size={23}/></button></header>
  <div className="photo-dialog-content"><div className="photo-original">{photo.type==='video'?<video key={photo.file} src={source(photo)} poster={thumbnail(photo)} controls playsInline preload="metadata" aria-label={photo.title}/>:<img src={source(photo)} alt={photo.alt}/>}</div><section className="photo-story"><span className="photo-eyebrow">{album.summary}</span><div aria-live="polite"><h3>{photo.title}</h3><p>{photo.description}</p></div>
  {album.photos.length>1&&<div className="album-controls"><div className="album-paging"><button aria-label="上一个素材" onClick={()=>change(-1)}><ChevronLeft size={19}/></button><span>{index+1} / {album.photos.length}</span><button aria-label="下一个素材" onClick={()=>change(1)}><ChevronRight size={19}/></button></div><div className="album-thumbnails">{album.photos.map((p,i)=><button key={p.file} aria-label={'查看'+p.title} aria-pressed={index===i} onClick={()=>setIndex(i)}><img src={thumbnail(p)} alt="" style={{objectPosition:p.position}}/>{p.type==='video'&&<Play className="thumbnail-play" size={18} fill="currentColor"/>}</button>)}</div></div>}
  <div className="photo-topics">{album.topics.map(t=><span key={t}>{t}</span>)}</div><dl><dt>在这里可以做什么</dt><dd>{album.service}</dd></dl><button className="primary" onClick={onClose}>返回{album.name}，继续探索</button><small className="photo-count">现场素材 {String(index+1).padStart(2,'0')} / {String(album.photos.length).padStart(2,'0')}</small></section></div></div>
 </dialog>
}
