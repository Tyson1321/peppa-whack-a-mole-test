(function(root){
'use strict';
const W=16,H=10,key=(x,y)=>x+','+y,row=(y,a=0,b=15)=>Array.from({length:b-a+1},(_,i)=>[a+i,y]);
const shapes=[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[2,0]],[[0,0],[1,0]],[[0,0],[0,1],[0,2],[1,2]],[[0,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[0,1]],[[0,0],[1,0]],[[0,0],[1,0]]];
const levels=[
{title:'河上的小小工程师',who:'佩奇和乔治',story:'桥要跨过宽宽的河，还要给小船留出空间。河中央的小岛可以放桥墩！',hint:'长桥的中间也需要支撑。看看小岛，再检查桥面有没有断开。',fixed:[...row(7,0,2),...row(8,0,2),...row(9,0,2),...row(9,7,8),...row(8,13,15),...row(9,13,15)],kind:'bridge',target:[15,8],startY:7,budget:10,par:5,boat:[5,7,2,2],goals:['两岸之间可以走通','桥底留出小船通道','桥面稳定，有中间支撑']},
{title:'乔治的恐龙阶梯',who:'乔治',story:'恐龙在高高的平台上！帮乔治搭台阶，每一步都不能太高，顶上还要能站稳。',hint:'先搭宽一点的底座，再逐渐升高。乔治每步最多爬一格。',fixed:row(9),kind:'stairs',target:[12,4],startY:9,budget:10,par:6,goals:['一步一步爬到恐龙旁','顶部至少有两格站台','积木连接地面并保持平衡']},
{title:'猪爸爸的运货路',who:'猪爸爸',story:'猪爸爸推着野餐小车，要跨过缺口、爬上高台，再从门洞下通过。小车需要平滑的坡道！',hint:'小车爬不上直角台阶。三角积木的斜面能连接高低两段路，旋转可以改变坡向。',fixed:[...row(9,0,1),...row(9,4,15),...row(8,0,1),...row(7,6,9),...row(8,6,9),...row(4,10,12)],kind:'road',target:[15,9],startY:8,budget:10,par:5,ramps:[4,5,8,9],goals:['小车连续驶过整条路','坡道朝向正确，没有台阶','车和货物不撞到门洞']},
{title:'一家人的雨天小屋',who:'佩奇一家',story:'快下雨啦！搭两边的墙和连续的屋顶，中间留下宽敞的房间，让一家人从正面的门进去。',hint:'屋顶下面至少留四格宽、三格高的空间。两侧墙要落地，门在房间正面。',fixed:row(9),kind:'house',budget:10,par:4,goals:['连续屋顶可以挡雨','房间至少四格宽、三格高','两侧有墙，中间能住下一家人']},
{title:'我们的野餐营地',who:'佩奇一家',story:'用同一盒积木搭小桥、两格宽的野餐台和遮雨棚。材料有限，想想怎样分配吧！',hint:'先留出屋顶和支柱，再安排桥与台阶。遮雨棚里面需要两格宽、两格高的空间。',fixed:[...row(9,0,1),...row(9,5,15)],kind:'picnic',target:[8,7],startY:9,budget:9,par:8,goals:['跨过左边的小沟','走到两格宽的野餐平台','右边搭一个有空位的遮雨棚']}
];
function isRamp(p,l){return (l?.ramps||[8,9]).includes(p.id)}
function base(p,l){return isRamp(p,l)?[[0,0],[1,0]]:shapes[p.id]}
function cells(p,l){if(isRamp(p,l))return (p.r>=2?[[0,0],[0,1]]:[[0,0],[1,0]]).map(([x,y])=>[x+p.x,y+p.y]);let s=base(p,l).map(c=>c.slice());for(let i=0;i<(p.r||0)%4;i++)s=s.map(([x,y])=>[-y,x]);let ax=Math.min(...s.map(c=>c[0])),ay=Math.min(...s.map(c=>c[1]));return s.map(([x,y])=>[x-ax+p.x,y-ay+p.y]);}
function polygon(p,l){if(!isRamp(p,l))return null;let w=p.r>=2?1:2,h=p.r>=2?2:1;return ((p.r||0)%2?[[0,0],[0,h],[w,h]]:[[0,h],[w,h],[w,0]]).map(([x,y])=>[x+p.x,y+p.y]);}
function solidAt(p,x,y,l){if(isRamp(p,l)){let v=polygon(p,l),sign=0;for(let i=0;i<3;i++){let a=v[i],b=v[(i+1)%3],cross=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);if(Math.abs(cross)<1e-7)continue;let s=Math.sign(cross);if(sign&&s!==sign)return false;sign=s}return true}return cells(p,l).some(([a,b])=>x>a+1e-5&&x<a+1-1e-5&&y>b+1e-5&&y<b+1-1e-5)}
function occupied(l,ps){return new Set([...l.fixed,...ps.flatMap(p=>cells(p,l))].map(c=>key(...c)))}
function canPlace(l,ps,p){if(!Number.isInteger(p.id)||p.id<0||p.id>=10||![p.x,p.y,p.r||0].every(Number.isInteger))return false;let o=occupied(l,ps.filter(a=>a.id!==p.id));return cells(p,l).every(([x,y])=>x>=0&&x<W&&y>=0&&y<H&&!o.has(key(x,y)))}
// Blocks have rigid click-connect faces. Whole connected assemblies carry load;
// their centre of mass must lie over ground contacts, with a maximum six-cell span.
function stability(l,ps){let terrain=new Set(l.fixed.map(c=>key(...c))),all=ps.flatMap(p=>cells(p,l)),remaining=new Map(all.map(c=>[key(...c),c])),groups=[];
while(remaining.size){let first=remaining.values().next().value,q=[first],group=[];remaining.delete(key(...first));while(q.length){let a=q.shift();group.push(a);for(let [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){let k=key(a[0]+dx,a[1]+dy);if(remaining.has(k)){q.push(remaining.get(k));remaining.delete(k)}}}let contacts=group.filter(([x,y])=>terrain.has(key(x,y+1))).map(c=>c[0]+.5).sort((a,b)=>a-b),cx=group.reduce((s,c)=>s+c[0]+.5,0)/group.length;
let floating=!contacts.length,tilt=!floating&&(cx<contacts[0]-.5||cx>contacts[contacts.length-1]+.5),span=contacts.some((x,i)=>i&&x-contacts[i-1]>6),overhang=!floating&&group.some(c=>c[0]+.5<contacts[0]-3||c[0]+.5>contacts[contacts.length-1]+3);
if(floating||tilt||span||overhang)return{ok:false,point:group[Math.floor(group.length/2)],reason:floating?'这些积木悬空了，搭一根连接地面的支柱吧。':tilt?'这一边太重，支撑要放在下面，或者把底座加宽。':'这段桥伸得太远，中间需要加一个桥墩。',cells:group};groups.push({cells:group,contacts,cx})}return{ok:true,groups}}
function solids(l,ps,x,y){return l.fixed.some(([a,b])=>x>a+1e-5&&x<a+1-1e-5&&y>b+1e-5&&y<b+1-1e-5)||ps.some(p=>solidAt(p,x,y,l))}
function surfaces(l,ps,x){let ys=[];for(let [a,b]of l.fixed)if(x>a&&x<a+1)ys.push(b);for(let p of ps){if(isRamp(p,l)){let v=polygon(p,l),hits=[];for(let i=0;i<3;i++){let a=v[i],b=v[(i+1)%3];if(x>=Math.min(a[0],b[0])&&x<=Math.max(a[0],b[0])&&a[0]!==b[0])hits.push(a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]))}if(hits.length)ys.push(Math.min(...hits))}else for(let[a,b]of cells(p,l))if(x>a&&x<a+1)ys.push(b)}return [...new Set(ys)].filter(y=>!solids(l,ps,x,y-.02)).sort((a,b)=>b-a)}
function trace(l,ps,target=l.target){let states=[{y:l.startY??9,path:[]}],cart=l.kind==='road',height=cart?1.35:.85;for(let x=.125;x<=target[0]+.875;x+=.25){let next=[];for(let y of surfaces(l,ps,x)){let prev=states.find(a=>Math.abs(a.y-y)<=(cart?.18:1.001));if(!prev)continue;let clear=true;for(let dy=.12;dy<height;dy+=.2)if(solids(l,ps,x,y-dy))clear=false;if(clear)next.push({y,path:[...prev.path,[x,y]]})}if(!next.length){let last=states[0];return{ok:false,path:last.path,point:[x,last.y],reason:cart?'小车在这里过不去：检查台阶、坡向或门洞高度。':'这里走不通：补上缺口，或把台阶变矮一点。'}}states=next;}let result=states.find(a=>a.y<=target[1]+.05);if(!result)return{ok:false,path:states[0].path,point:states[0].path[states[0].path.length-1],reason:'已经走到这里了，还需要把平台搭高一点。'};return{ok:true,path:result.path}}
function shelter(l,ps,minWidth,minHeight,minX=2){let o=occupied(l,ps);for(let y=2;y<=9-minHeight-1;y++)for(let left=minX;left<W-minWidth-1;left++)for(let right=left+minWidth+1;right<W;right++){
if(!Array.from({length:right-left+1},(_,i)=>left+i).every(x=>o.has(key(x,y))))continue;
if(![left,right].every(x=>Array.from({length:8-y},(_,i)=>y+1+i).every(z=>o.has(key(x,z)))))continue;
let clear=true;for(let x=left+1;x<right;x++)for(let z=9-minHeight;z<9;z++)if(o.has(key(x,z)))clear=false;
if(clear&&Array.from({length:right-left-1},(_,i)=>left+1+i).every(x=>o.has(key(x,9))))return{left,right,y,width:right-left-1,height:8-y};}return null}
function platform(l,ps,x,y){return [x-.75,x+.25].every(a=>surfaces(l,ps,a).some(b=>b<=y&&b>=y-.1))}
function check(l,ps){let bad=ps.find(p=>!canPlace(l,ps,p));if(!ps.length)return{ok:false,reason:'先选积木，搭出你的办法，再请大家试一试。',point:[3,8],path:[]};if(ps.length>l.budget||new Set(ps.map(p=>p.id)).size!==ps.length||bad)return{ok:false,reason:'积木不能重叠或超出场地。',point:bad?[bad.x,bad.y]:[3,8],path:[]};let s=stability(l,ps);if(!s.ok)return{...s,path:[]};let path=[];
if(l.target){let t=trace(l,ps);path=t.path;if(!t.ok)return t;if(['stairs','picnic'].includes(l.kind)&&!platform(l,ps,...l.target))return{ok:false,path,point:l.target,reason:'顶部要留出连续两格宽的平台，才能站稳。'}}
if(l.boat){let[x,y,w,h]=l.boat;if(ps.some(p=>cells(p,l).some(([a,b])=>a>=x&&a<x+w&&b>=y&&b<y+h)))return{ok:false,path,point:[x,y],reason:'小船被挡住啦！抬高桥面，给桥下留出通道。'}}
let room=null;if(l.kind==='house'||l.kind==='picnic'){room=shelter(l,ps,l.kind==='house'?4:2,l.kind==='house'?3:2,l.kind==='house'?2:9);if(!room)return{ok:false,path,point:[l.kind==='house'?8:12,7],reason:l.hint};if(!path.length)path=Array.from({length:20},(_,i)=>[room.left+1+(room.width-1)*i/19,9]);}
return{ok:true,path,room,reason:'大家通过啦！这就是你的搭建办法。',stars:ps.length<=l.par?3:2};}
function signature(l,ps){return ps.map(p=>cells(p,l).map(c=>key(...c)).sort().join(';')+(isRamp(p,l)?'r'+p.r:'')).sort().join('|')}
const api={W,H,shapes,levels,cells,polygon,isRamp,canPlace,occupied,stability,supported:(l,ps)=>stability(l,ps).ok,trace,route:(l,ps,t)=>trace(l,ps,t).ok,shelter,check,signature,solidAt,surfaces};if(typeof module!=='undefined')module.exports=api;root.GameEngine=api;
})(typeof window!=='undefined'?window:globalThis);
