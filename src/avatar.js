import * as THREE from 'three';
import {refineCharacter} from './character-refinement';
import {box,group} from './geometry';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createAvatar as createPlaceholder} from './procedural-avatar';

export function createAvatar(parent,m){
 const placeholder=createPlaceholder(parent,m),root=placeholder.root;
 const state={status:'loading',source:'host.glb',error:null};
 let walkPhase=0,walkBlend=0;
 let model,mixer,point,heldProduct,poses=[],bones={},lastTime=null,native=false,disposed=false;
 const axes={x:new THREE.Vector3(1,0,0),y:new THREE.Vector3(0,1,0),z:new THREE.Vector3(0,0,1)};
 const ready=new GLTFLoader().loadAsync((import.meta.env.BASE_URL+'assets/characters/host.glb')).then(gltf=>{
  if(disposed)return;
  model=gltf.scene;model.name='reference-character';
  model.updateMatrixWorld(true);
  refineCharacter(model);
  model.traverse(o=>{
   if(o.isSkinnedMesh){o.normalizeSkinWeights();o.frustumCulled=false;}
   if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}
   if(o.isBone){
    const inverse=o.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    const pose={bone:o,q:o.quaternion.clone(),p:o.position.clone(),shownQ:o.quaternion.clone(),shownP:o.position.clone(),axes:Object.fromEntries(Object.entries(axes).map(([k,v])=>[k,v.clone().applyQuaternion(inverse)]))};
    poses.push(pose);bones[o.name]=pose;
   }
  });
  const bounds=new THREE.Box3().setFromObject(model),height=bounds.max.y-bounds.min.y;
  const scale=1.9/height;model.scale.setScalar(scale);model.position.y=-bounds.min.y*scale;
  // Keep the selection halo while replacing all placeholder body geometry.
  for(const child of [...root.children])if(child.geometry?.type!=='TorusGeometry')root.remove(child);
  root.add(model);mixer=new THREE.AnimationMixer(model);
  if(gltf.animations[0])point=mixer.clipAction(gltf.animations[0]);
  if(bones.RightHand){heldProduct=group(bones.RightHand.bone,0,.1,.025);box(heldProduct,m.red,0,0,0,.12,.2,.08,.01);box(heldProduct,m.gold,0,0,.042,.09,.07,.004,.001);heldProduct.visible=false;}
  state.refinement='hair, skinning, smooth transitions';state.status='ready';state.bones=poses.length;state.animations=gltf.animations.map(a=>a.name);
 }).catch(error=>{state.status='error';state.error=error.message;console.error('人物模型加载失败，保留备用人物',error)});
 const dq=new THREE.Quaternion();
 function blendPose(dt){const alpha=1-Math.exp(-dt*12);for(const p of poses){p.shownQ.slerp(p.bone.quaternion,alpha);p.shownP.lerp(p.bone.position,alpha);p.bone.quaternion.copy(p.shownQ);p.bone.position.copy(p.shownP);}}
 function turn(name,axis,angle){const p=bones[name];if(p)p.bone.quaternion.premultiply(dq.setFromAxisAngle(p.axes[axis],angle));}
 function animate(t,moving,action){
  if(!model){placeholder.animate(t,moving,action);return;}
  const dt=lastTime===null?0:Math.min(.05,t-lastTime);lastTime=t;
  if(heldProduct)heldProduct.visible=!moving&&(action==='直播'||action==='选品');
  const useNative=!moving&&action==='讲课'&&point;
  if(useNative){if(!native){point.reset().play();native=true;}mixer.update(dt);blendPose(dt);return;}
  if(native){point.stop();native=false;}
  for(const p of poses){p.bone.quaternion.copy(p.q);p.bone.position.copy(p.p);}
  const wave=Math.sin(t*2.1);
  walkBlend=THREE.MathUtils.damp(walkBlend,moving?1:0,9,dt);walkPhase+=dt*8.2*walkBlend;
  if(moving||walkBlend>.03){
   const stride=Math.sin(walkPhase)*walkBlend;
   turn('LeftUpLeg','x',stride*.38);turn('RightUpLeg','x',-stride*.38);
   turn('LeftLeg','x',Math.max(0,-stride)*.5);turn('RightLeg','x',Math.max(0,stride)*.5);
   turn('LeftArm','x',-stride*.3);turn('RightArm','x',stride*.3);
   turn('LeftForeArm','x',-.16);turn('RightForeArm','x',-.16);
   turn('Spine2','y',-stride*.035);
   if(bones.Hips)bones.Hips.bone.position.y+=Math.abs(Math.sin(walkPhase))*.009*walkBlend;
  }else if(action==='洽谈'){
   if(bones.Hips)bones.Hips.bone.position.y-=.39/model.scale.y;
   for(const s of ['Left','Right']){turn(s+'UpLeg','x',-1.45);turn(s+'Leg','x',1.45);turn(s+'Arm','x',-.25);turn(s+'ForeArm','x',-.65);}
   turn('Head','y',wave*.07);
  }else if(action==='拍摄'){
   for(const s of ['Left','Right']){turn(s+'Arm','x',-.65);turn(s+'ForeArm','x',-.65);}
   turn('Spine2','x',.1);
  }else if(action==='选品'||action==='直播'){
   turn('RightArm','x',-.45-wave*.09);turn('RightForeArm','x',-.65);
   turn('LeftArm','x',-.35);turn('LeftForeArm','x',-.65+wave*.1);turn('Head','y',wave*.1);
  }else if(action==='口播'){
   for(const s of ['Left','Right']){turn(s+'Arm','x',-.25);turn(s+'ForeArm','x',-.5+wave*.12);}
   turn('Head','x',wave*.025);
  }else{turn('Spine2','x',Math.sin(t*1.8)*.008);}
  blendPose(dt);
 }
 return {root,animate,ready,state,dispose(){disposed=true;if(mixer){mixer.stopAllAction();mixer.uncacheRoot(model);}}};
}
