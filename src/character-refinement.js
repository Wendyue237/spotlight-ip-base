import * as THREE from 'three';

// Preserve the supplied UVs and face shape. Smooth only duplicate seam normals.
export function refineCharacter(model){
 model.updateMatrixWorld(true);
 const hairRoots=[];
 model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal;
  const joints=[g.attributes.skinIndex,g.attributes.joints_1,g.attributes.joints_2];
  const weights=[g.attributes.skinWeight,g.attributes.weights_1,g.attributes.weights_2];
  // WebGL skinning supports four influences: select the strongest across ALL sets.
  if(weights[1])for(let i=0;i<p.count;i++){
   const values=[];
   for(let set=0;set<3;set++)if(weights[set])for(let k=0;k<4;k++)values.push([joints[set].array[i*4+k],weights[set].array[i*4+k]]);
   values.sort((a,b)=>b[1]-a[1]);const sum=values.slice(0,4).reduce((s,v)=>s+v[1],0)||1;
   for(let k=0;k<4;k++){joints[0].array[i*4+k]=values[k][0];weights[0].array[i*4+k]=values[k][1]/sum;}
  }
  g.attributes.skinIndex.needsUpdate=true;g.attributes.skinWeight.needsUpdate=true;
  // Recompute smooth head normals without changing facial landmarks or texture coordinates.
  const sums=new Map();const keys=[];
  for(let i=0;i<p.count;i++)if(p.getY(i)>1.53){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*10000)).join(',');keys[i]=key;const sum=sums.get(key)||new THREE.Vector3();sum.add(new THREE.Vector3(n.getX(i),n.getY(i),n.getZ(i)));sums.set(key,sum);}
  for(let i=0;i<p.count;i++)if(keys[i]){const v=sums.get(keys[i]).normalize();n.setXYZ(i,v.x,v.y,v.z);}
  n.needsUpdate=true;
  for(let i=0;i<p.count;i+=7)if(p.getY(i)>1.785&&n.getY(i)>.12)hairRoots.push(new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)));
  const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
  for(const mat of materials){if(mat.normalScale)mat.normalScale.setScalar(.55);mat.roughness=Math.max(mat.roughness,.7);}
 });
 const head=model.getObjectByName('Head');if(!head||!hairRoots.length)return;
 const inverse=head.matrixWorld.clone().invert(),positions=[],indices=[];
 let seed=67;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 const up=new THREE.Vector3(0,1,0);
 // Fine tapered tufts break the smooth coiffed outline, following the reference's short messy hair.
 for(let i=0;i<340;i++){
  const root=hairRoots[Math.floor(random()*hairRoots.length)].clone();
  const outward=new THREE.Vector3(root.x*4+(random()-.5)*.5,.6+random()*.3,(root.z+.02)*2).normalize();
  const length=.012+random()*.019;
  const bend=new THREE.Vector3((random()-.5)*.028,0,(random()-.5)*.024);
  const side=new THREE.Vector3().crossVectors(outward,new THREE.Vector3(0,0,1)).normalize();
  const cross=new THREE.Vector3().crossVectors(outward,side).normalize();
  const radius=.0005+random()*.00065,offset=positions.length/3;
  for(let ring=0;ring<=4;ring++){
   const t=ring/4,center=root.clone().addScaledVector(outward,length*t).addScaledVector(bend,t*t).addScaledVector(up,-.006);
   for(let k=0;k<5;k++){const a=k*Math.PI*2/5;const v=center.clone().addScaledVector(side,Math.cos(a)*radius*(1-t)+.00003).addScaledVector(cross,Math.sin(a)*radius*(1-t)).applyMatrix4(inverse);positions.push(v.x,v.y,v.z);}
  }
  for(let ring=0;ring<4;ring++)for(let k=0;k<5;k++){const a=offset+ring*5+k,b=offset+ring*5+(k+1)%5;indices.push(a,b,a+5,b,b+5,a+5);}
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const hair=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:'#191511',roughness:.86}));hair.name='reference-hair-detail';hair.castShadow=true;head.add(hair);
}
