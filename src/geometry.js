import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const cache=new Map();
export function box(g,m,x,y,z,w,h,d,r=.025){const k=[w,h,d,r].join(',');if(!cache.has(k))cache.set(k,r?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)):new THREE.BoxGeometry(w,h,d));const o=new THREE.Mesh(cache.get(k),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
export function sphere(g,m,x,y,z,sx,sy,sz){const k='sphere';if(!cache.has(k))cache.set(k,new THREE.SphereGeometry(1,20,14));const o=new THREE.Mesh(cache.get(k),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
export function cyl(g,m,x,y,z,rt,rb,h,segments=20){const k=['c',rt,rb,h,segments].join(',');if(!cache.has(k))cache.set(k,new THREE.CylinderGeometry(rt,rb,h,segments));const o=new THREE.Mesh(cache.get(k),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
export function rod(g,m,a,b,r=.025){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),o=cyl(g,m,0,0,0,r,r,av.distanceTo(bv),10);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize());return o;}
export function group(parent,x=0,y=0,z=0,rot=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;parent.add(g);return g;}
export function torus(g,m,x,y,z,r,t=.025){const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,40),m);o.position.set(x,y,z);g.add(o);return o;}
