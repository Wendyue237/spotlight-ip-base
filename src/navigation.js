export function makeNavigator(colliders){
 const radius=.23,step=.35;
 function walkable(x,z){if(x< -9.25||x>10.1||z< -8.7||z>8.9)return false;if(x>4.25&&z>5.42)return false;return !colliders.some(c=>Math.abs(x-c.x)<c.w/2+radius&&Math.abs(z-c.z)<c.d/2+radius)}
 function path(sx,sz,ex,ez){const snap=n=>Math.round(n/step),key=(x,z)=>x+','+z,start=[snap(sx),snap(sz)],end=[snap(ex),snap(ez)];const open=[{x:start[0],z:start[1],g:0,f:0}],seen=new Map(),closed=new Set();seen.set(key(...start),open[0]);let last=null;
 for(let n=0;open.length&&n<9000;n++){open.sort((a,b)=>a.f-b.f);const c=open.shift(),k=key(c.x,c.z);if(closed.has(k))continue;closed.add(k);if(Math.hypot(c.x-end[0],c.z-end[1])<1.5){last=c;break}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=c.x+dx,z=c.z+dz,nk=key(x,z);if(closed.has(nk)||!walkable(x*step,z*step))continue;if(dx&&dz&&(!walkable(c.x*step,z*step)||!walkable(x*step,c.z*step)))continue;const g=c.g+Math.hypot(dx,dz);if(seen.has(nk)&&seen.get(nk).g<=g)continue;const next={x,z,g,f:g+Math.hypot(x-end[0],z-end[1]),parent:c};seen.set(nk,next);open.push(next)}}
 if(!last)return [];const result=[];while(last.parent){result.push({x:last.x*step,z:last.z*step});last=last.parent}return result.reverse();}
 return {walkable,path};
}
