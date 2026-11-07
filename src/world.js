import * as THREE from 'three';
import {box,cyl,sphere,rod,group} from './geometry';
import {makeMaterials,canvasTexture} from './materials';
import {chair,desk,laptop,plant,cameraProp,softbox,ringlight,bottle,labelPlane,frameArt} from './props';
export function buildWorld(scene){
 const m=makeMaterials(),root=group(scene),colliders=[];
 const obstacle=(x,z,w,d)=>colliders.push({x,z,w,d});
 const wall=(x,z,w,d,h=2.5)=>{box(root,m.wall,x,h/2,z,w,h,d,.025);box(root,m.trim,x,h+.035,z,w+.035,.09,d+.035,.012);box(root,m.oak,x,.09,z,w+.02,.16,d+.02,.008);obstacle(x,z,w,d)};
 // Grounded architectural display with a continuous daylight floor and contact shadows.
 const groundMaterial=new THREE.MeshStandardMaterial({color:'#dce2df',roughness:1});
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,240),groundMaterial);
 ground.rotation.x=-Math.PI/2;ground.position.y=-.64;ground.receiveShadow=true;scene.add(ground);
 box(root,m.cream,.5,-.52,0,20.5,.22,19,.14);
 // L-shaped office footprint: three livestream rooms extend towards the entrance.
 box(root,m.trim,.5,-.25,0,20,.48,18.5,.15);
 box(root,m.floor,.5,.005,0,19.8,.05,18.3,.01);
 box(root,m.cream,7,.05,-1.5,5.8,.055,14.8,.01);
 wall(-9.5,0,.18,18.2);wall(-6.3,-9,6.4,.18,2.7);wall(.5,-9,7.1,.18,1);wall(7.25,-9,6.4,.18,2.7);
 wall(10.4,-1.7,.2,14.6,2.8);wall(7.2,5.6,6.5,.2,.35);
 wall(-6.3,9.1,6.5,.18,.45);
 // A single flush facade shared by consultation and livestream rooms. Real door openings.
 const doorZ=[-5.4,-.1,3.9,7.6],bounds=[-9,...doorZ.flatMap(z=>[z-.64,z+.64]),9.1];
 for(let i=0;i<bounds.length-1;i+=2){const a=bounds[i],b=bounds[i+1];wall(-3.1,(a+b)/2,.18,b-a,2.45)}
 for(const z of doorZ){box(root,m.wall,-3.1,2.25,z,.18,.42,1.28);for(const s of [-1,1])box(root,m.wood,-3.1,1.05,z+s*.64,.25,2.1,.075);box(root,m.wood,-3.1,2.09,z,.25,.08,1.36);const hinge=group(root,-3.22,0,z+.59,Math.PI/2);hinge.name=`inward-door-${z}`;box(hinge,m.wood,0,1,-.58,.08,2,1.16,.02);sphere(hinge,m.gold,.07,1,-.99,.035,.035,.035);obstacle(-3.8,z+.59,1.16,.08)}
 for(const z of [-3,1.1,5.1])wall(-6.3,z,6.3,.16,2.15);
 // Right studio partition with access at the front side.
 wall(4.1,-2.85,.16,12.3,2.3);wall(4.1,5.25,.16,.7,2.3);
 for(const z of [3.3,4.9])box(root,m.wood,4.1,1.05,z,.23,2.1,.075);
 box(root,m.wood,4.1,2.09,4.1,.23,.08,1.68);
 box(root,m.wall,4.1,2.24,4.1,.16,.25,1.6);
 const productDoor=group(root,4.22,0,4.85,-Math.PI/2);productDoor.name='product-room-door';
 box(productDoor,m.wood,0,1,-.73,.08,2,1.46,.02);sphere(productDoor,m.gold,-.07,1,-1.27,.035,.035,.035);
 obstacle(4.95,4.85,1.46,.08);
 // Brand wall: shifted right to connect the entrance to the left livestream passage.
 box(root,m.marble,.52,1.05,7.6,4.85,2.1,.2,.035);obstacle(.52,7.6,4.85,.2);box(root,m.trim,.52,2.15,7.6,4.95,.12,.24);
 labelPlane(root,'聚光灯IP',2.7,.65,.55,1.38,7.713,{color:'#171a1b',bg:'#e9e0cc',font:150});labelPlane(root,'孵化基地',1.6,.25,.55,.97,7.717,{color:'#27231d',bg:'#e9e0cc',font:104});
 for(const x of [-1.1,.5,2.1]){box(root,m.gold,x,2.12,7.75,.15,.06,.12);const l=new THREE.PointLight('#ffd59b',7,3,2);l.position.set(x,1.95,8.0);root.add(l)}
 // Wide rear windows with mullions and city beyond.
 for(let x=-2.9;x<4;x+=1.15){box(root,m.trim,x,2.1,-8.96,.055,2.25,.08);box(root,m.glass,x+.54,2,-8.94,1.05,2.1,.02,0)}
 box(root,m.trim,.5,3.18,-8.96,7.15,.08,.09);box(root,m.trim,.5,1.27,-8.95,7.15,.055,.08);
 // Conference table with upholstered chairs and tabletop details.
 const outline=new THREE.Shape();outline.moveTo(-1.225,-1.85);outline.absarc(0,-1.85,1.225,Math.PI,Math.PI*2,false);outline.lineTo(1.225,1.85);outline.absarc(0,1.85,1.225,0,Math.PI,false);outline.closePath();const table=new THREE.Mesh(new THREE.ExtrudeGeometry(outline,{depth:.13,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.035,curveSegments:32}),m.cream);table.rotation.x=-Math.PI/2;table.position.set(.25,.84,-1.1);table.castShadow=true;table.receiveShadow=true;root.add(table);obstacle(.25,-1.1,2.6,6.3);
 for(const z of [-3.2,1])cyl(root,m.wood,.25,.4,z,.32,.5,.8);
 for(let i=0;i<4;i++)for(const s of [-1,1]){const x=.25+s*1.78,z=-3.25+i*1.4;chair(root,m,x,z,-s*Math.PI/2);obstacle(x,z,.7,.7)}
 chair(root,m,.25,2.5,Math.PI);obstacle(.25,2.5,.8,.8);
 laptop(root,m,-.25,.96,-2,.2);laptop(root,m,.6,.96,.7,-.2);
 for(const z of [-2.9,-.5,1.1]){cyl(root,m.white,.5,1.04,z,.09,.07,.16);box(root,m.red,-.3,.96,z,.25,.04,.36)}
 const flowers=group(root,.3,.96,-.6);cyl(flowers,m.cream,0,.1,0,.12,.085,.2);for(let i=0;i<7;i++){const a=i*2.4;rod(flowers,m.green,[0,.16,0],[Math.sin(a)*.16,.5,Math.cos(a)*.16],.009);sphere(flowers,m.white,Math.sin(a)*.16,.5,Math.cos(a)*.16,.08,.07,.08)}
 // Freestanding PPT display inside the entrance wall, facing the conference seats.
 const tv=group(root,.52,0,5.97,Math.PI);tv.name='conference-ppt-display';
 for(const x of [-.6,.6]){
  box(tv,m.trim,x,.17,0,.09,.1,.8);
  box(tv,m.trim,x,.83,-.065,.065,1.3,.07);
  for(const z of [-.31,.31]){const wheel=cyl(tv,m.black,x,.085,z,.065,.065,.065,12);wheel.rotation.z=Math.PI/2;}
 }
 box(tv,m.trim,0,.35,-.065,1.25,.065,.07);
 box(tv,m.black,0,.84,.09,1.05,.05,.32);
 box(tv,m.black,0,1.76,0,2.32,1.36,.12,.035);
 box(tv,m.trim,0,1.66,-.09,.7,.5,.08);
 const ppt=canvasTexture(1280,720,(c,w,h)=>{
  c.fillStyle='#102535';c.fillRect(0,0,w,h);
  c.fillStyle='#edba67';c.fillRect(64,62,8,42);
  c.font='bold 32px sans-serif';c.fillText('聚光灯IP  /  成长课堂',96,96);
  c.fillStyle='#fff4de';c.font='bold 68px sans-serif';c.fillText('从定位到商业变现',64,232);
  c.fillStyle='#aebfcc';c.font='28px sans-serif';c.fillText('把你的经验，变成有价值的个人 IP',68,298);
  ['IP定位','内容策划','拍摄表达','数据复盘','商业变现'].forEach((title,i)=>{
   const x=64+i*234;c.fillStyle='#203c4e';c.fillRect(x,376,216,170);
   c.fillStyle='#edba67';c.font='bold 38px sans-serif';c.fillText(`0${i+1}`,x+24,432);
   c.fillStyle='#fff4de';c.font='32px sans-serif';c.fillText(title,x+24,503);
  });
  c.fillStyle='#aebfcc';c.font='24px sans-serif';c.fillText('线下课程 · 沙龙 · 小班训练营',64,650);
  c.textAlign='right';c.fillText('示例课件  /  01',1216,650);
 });
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.2375),new THREE.MeshBasicMaterial({map:ppt,toneMapped:false}));
 screen.position.set(0,1.77,.061);tv.add(screen);
 sphere(tv,m.glow,.99,1.105,.065,.012,.012,.008);
 rod(tv,m.black,[.56,.8,-.13],[.56,.2,-.13],.012);
 obstacle(.52,5.97,2.32,.8);
 for(let i=0;i<3;i++)frameArt(root,m,-2.98,1.65,-7.8+i*.85,Math.PI/2,i);
 // Window scenery.
 box(root,m.red,-1.8,.65,-8,1.5,1.25,.52);for(let i=0;i<3;i++){box(root,i%2?m.screen:m.red,-2.28+i*.48,.66,-7.72,.43,1.13,.02);sphere(root,m.gold,-2.23+i*.48,.7,-7.68,.02,.02,.02)}
 plant(root,m,-1.8,-8,.6);const stool=(x,z)=>{cyl(root,m.black,x,.75,z,.24,.24,.12);for(let i=0;i<3;i++){const a=i*2.1;rod(root,m.black,[x+Math.sin(a)*.15,.7,z+Math.cos(a)*.15],[x+Math.sin(a)*.25,.04,z+Math.cos(a)*.25],.025)}};stool(.3,-7.7);cameraProp(root,m,1.7,-6,Math.PI);softbox(root,m,3.1,-7,Math.PI*.7);
 // Consultation room.
 const consult=desk(root,m,-6.4,-5.4);laptop(consult,m,0,.94,0,Math.PI/2);chair(root,m,-6.4,-7.9,0);obstacle(-6.4,-7.9,.85,.85);chair(root,m,-4.75,-5.2,-Math.PI/2);obstacle(-6.4,-5.4,2.4,1.1);
 box(root,m.black,-8.65,.42,-7.1,1.2,.62,2.4,.12);box(root,m.black,-9.1,.88,-7.1,.25,.95,2.45,.1);for(const z of [-8.2,-6])box(root,m.black,-8.6,.8,z,1.2,.28,.22,.1);obstacle(-8.6,-7.1,1.3,2.5);
 box(root,m.cream,-5.7,1.7,-8.86,1.7,1.1,.05);labelPlane(root,'定位 → 表达 → 商业化',1.6,.7,-5.7,1.72,-8.82,{color:'#4d5854',bg:'#e9e7d9',font:70});
 // Three small studios. Exact count and placement.
 for(let n=1;n<=3;n++){const z=7-(n-1)*4;const g=desk(root,m,-6.2,z-.9);laptop(g,m,-.45,.94,0);bottle(g,m,.65,.94,.1,n);chair(root,m,-7.5,z+.35,Math.PI-.25);ringlight(root,m,-6.1,z-1.5);softbox(root,m,-8.2,z-1.2,.7);frameArt(root,m,-7,1.6,z-1.88,0,n);obstacle(-6.2,z-.9,2.4,1.1);labelPlane(root,'LIVE 0'+n,.65,.18,-6.2,1.38,z-1.85,{bg:'#142233',color:'#e8c184',font:110})}
 // Professional studio: continuous backdrop, dedicated camera and softboxes.
 box(root,m.black,7.1,1.65,-8.3,4.7,3.2,.12);box(root,m.white,6.7,1.35,-7.95,2.6,2.65,.04);box(root,m.white,6.7,.1,-6.6,2.6,.04,2.8);
 for(const x of [5,8.5]){rod(root,m.black,[x,.03,-8],[x,3,-8],.025)}rod(root,m.black,[5,3,-8],[8.5,3,-8],.025);
 cameraProp(root,m,6.6,-4.3,Math.PI);softbox(root,m,5.1,-5.5,Math.atan2(1.6,-1));softbox(root,m,8.2,-5.6,Math.atan2(-1.5,-.9));stool(6.7,-6.5);
 // One shallow, full-wall product cabinet. No product islands.
 box(root,m.wood,9.91,1.5,-1.5,.65,3,12.6);obstacle(9.9,-1.5,.7,12.6);
 for(let bay=0;bay<7;bay++){const z=-7+bay*1.8;box(root,m.oak,9.55,1.5,z-.85,.08,3,.06);for(let row=0;row<4;row++){const y=.2+row*.68;box(root,m.oak,9.52,y,z,.79,.055,1.75);box(root,m.glow,9.2,y+.04,z,.025,.015,1.6,.003);for(let k=0;k<4;k++){const zz=z-.57+k*.37;if((bay+row+k)%3){bottle(root,m,9.36,y+.04,zz,bay+k)}else {box(root,[m.red,m.cream,m.screen][bay%3],9.38,y+.25,zz,.28,.42,.25,.012);box(root,m.gold,9.22,y+.26,zz,.008,.04,.2,.002)}}}}
 // Lamps, greenery, and grounded contact shadows.
 for(const [x,z,s] of [[-2.7,-8,.85],[3.5,-8,.9],[-8.7,-8.6,.8],[-8.7,-3.5,.7],[-8.7,4.5,.65],[6.2,4.9,.8],[-1.2,8.2,.8],[2.5,8.1,.8],[8.8,-8.3,.6]])plant(root,m,x,z,s);
 for(let z=-7;z<6;z+=3){for(const x of [-2.94,3.96]){if(x===3.96&&z===5)continue;box(root,m.gold,x,2.2,z,.1,.13,.2);const light=new THREE.PointLight('#ffd7a0',5,4,2);light.position.set(x===-2.94?x+.25:x-.25,2.1,z);root.add(light)}}
 return {root,m,colliders};
}
