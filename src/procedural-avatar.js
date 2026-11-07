import * as THREE from 'three';
import {box,sphere,cyl,group,torus} from './geometry';
export function createAvatar(parent,m){
 const root=group(parent,3.55,0,8.4),body=group(root),upper=group(body,0,1.03,0);
 const shirt=new THREE.MeshStandardMaterial({color:'#191d22',roughness:.96}),pants=new THREE.MeshStandardMaterial({color:'#22252a',roughness:.9}),eyeWhite=new THREE.MeshStandardMaterial({color:'#e2d8c9',roughness:.4});
 sphere(upper,shirt,0,.29,0,.27,.36,.155);sphere(upper,shirt,0,.5,0,.33,.14,.17);box(upper,shirt,0,.06,0,.45,.15,.28,.05);
 cyl(upper,m.skin,0,.69,0,.095,.11,.18);torus(upper,shirt,0,.61,.005,.105,.023).rotation.x=Math.PI/2;
 const head=group(upper,0,.92,0);sphere(head,m.skin,0,0,0,.205,.255,.19);sphere(head,m.skin,0,-.125,.045,.157,.14,.135);
 for(const s of [-1,1]){sphere(head,m.skin,s*.2,-.015,0,.04,.065,.033);sphere(head,eyeWhite,s*.078,.02,.162,.049,.025,.02);sphere(head,m.hair,s*.079,.021,.179,.019,.021,.01);sphere(head,m.white,s*.073,.028,.187,.005,.006,.003);const brow=box(head,m.hair,s*.078,.075,.166,.09,.018,.02,.006);brow.rotation.z=-s*.07;}
 sphere(head,m.skin,0,-.025,.18,.033,.059,.041);box(head,new THREE.MeshStandardMaterial({color:'#825340',roughness:.8}),0,-.115,.161,.092,.012,.018,.005);
 sphere(head,m.hair,0,.16,-.027,.211,.13,.185);
 for(let i=0;i<36;i++){const a=i*2.4,r=.08+.1*((i*7)%11)/11;const x=Math.sin(a)*r,z=Math.cos(a)*r-.015;const tuft=cyl(head,m.hair,x,.235+(i%3)*.012,z,.003,.046,.16+(i%4)*.017,6);tuft.rotation.set(-.3+(i%4)*.15,.2,-.5+(i%5)*.2)}
 const arms=[];for(const s of [-1,1]){const shoulder=group(upper,s*.29,.48,0);sphere(shoulder,shirt,s*.01,-.08,0,.13,.17,.135);sphere(shoulder,m.skin,0,-.2,0,.075,.17,.075);const elbow=group(shoulder,0,-.34,0);sphere(elbow,m.skin,0,-.13,0,.063,.16,.065);sphere(elbow,m.skin,0,-.29,.01,.062,.09,.034);for(let j=0;j<4;j++)sphere(elbow,m.skin,-.035+j*.022,-.345,.015,.012,.045,.014);arms.push({shoulder,elbow})}
 const legs=[];for(const s of [-1,1]){const thigh=group(body,s*.135,1.04,0);sphere(thigh,pants,0,-.22,0,.13,.28,.13);const knee=group(thigh,0,-.45,0);sphere(knee,pants,0,-.22,0,.1,.25,.1);box(knee,m.black,0,-.48,.075,.2,.13,.36,.065);box(knee,m.trim,0,-.53,.07,.2,.025,.36,.012);for(let j=0;j<3;j++)box(knee,m.trim,0,-.414,.1+j*.035,.12,.008,.012,.002);legs.push({thigh,knee})}
 const prop=group(arms[1].elbow,0,-.32,.055);box(prop,m.red,0,.07,0,.15,.27,.1,.014);box(prop,m.gold,0,.08,.055,.12,.09,.004,.001);prop.visible=false;
 const halo=torus(root,new THREE.MeshBasicMaterial({color:'#ffc76a',transparent:true,opacity:.85}),0,.035,0,.49,.022);halo.rotation.x=-Math.PI/2;
 const reset=()=>{body.position.y=0;upper.rotation.set(0,0,0);head.rotation.set(0,0,0);arms.forEach(({shoulder,elbow})=>{shoulder.rotation.set(0,0,0);elbow.rotation.set(-.09,0,0)});legs.forEach(({thigh,knee})=>{thigh.rotation.set(0,0,0);knee.rotation.set(0,0,0)});prop.visible=false;};
 function animate(t,moving,action){reset();const wave=Math.sin(t*3),a=arms;halo.material.opacity=.55+.25*Math.sin(t*2);
 if(moving){const s=Math.sin(t*9);legs[0].thigh.rotation.x=s*.5;legs[1].thigh.rotation.x=-s*.5;legs[0].knee.rotation.x=Math.max(0,-s)*.45;legs[1].knee.rotation.x=Math.max(0,s)*.45;a[0].shoulder.rotation.x=-s*.45;a[1].shoulder.rotation.x=s*.45;body.position.y=Math.abs(Math.sin(t*9))*.035;return;}
 body.position.y=Math.sin(t*2)*.007;
 if(action==='讲课'){a[1].shoulder.rotation.z=-.55;a[1].shoulder.rotation.x=-.65+wave*.18;a[1].elbow.rotation.x=-.7;a[0].shoulder.rotation.x=-.3;a[0].elbow.rotation.x=-.8;head.rotation.y=wave*.16;}
 else if(action==='口播'){a[0].shoulder.rotation.x=-.4+wave*.1;a[1].shoulder.rotation.x=-.4-wave*.1;a[0].elbow.rotation.x=-.7;a[1].elbow.rotation.x=-.65;head.rotation.x=Math.sin(t*4)*.045;}
 else if(action==='洽谈'){body.position.y=-.47;legs.forEach(({thigh,knee})=>{thigh.rotation.x=-Math.PI/2;knee.rotation.x=Math.PI/2});upper.rotation.x=.08;a.forEach(({shoulder,elbow})=>{shoulder.rotation.x=-.25;elbow.rotation.x=-1});a[1].elbow.rotation.x=-1+wave*.2;head.rotation.x=.04+wave*.04;}
 else if(action==='直播'){prop.visible=true;a[1].shoulder.rotation.x=-.8;a[1].elbow.rotation.x=-1.25; a[0].shoulder.rotation.z=.7;a[0].shoulder.rotation.x=-.5;a[0].elbow.rotation.x=-1.5+Math.sin(t*6)*.2;head.rotation.y=Math.sin(t*2)*.1;}
 else if(action==='拍摄'){upper.rotation.x=.14;a.forEach(({shoulder,elbow},i)=>{shoulder.rotation.x=-1.1;shoulder.rotation.z=i?-.12:.12;elbow.rotation.x=-.65+Math.sin(t*2)*.05});head.rotation.x=.1;}
 else if(action==='选品'){prop.visible=true;const q=(Math.sin(t*1.6)+1)/2;a[1].shoulder.rotation.x=-.6-q*.7;a[1].elbow.rotation.x=-.4-(1-q)*.8;head.rotation.y=.1;}
 }
 return {root,animate};
}
