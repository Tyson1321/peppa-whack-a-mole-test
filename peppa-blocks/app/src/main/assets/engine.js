(function(root){
const shapes=[[[0,0],[1,0],[2,0]],[[0,0],[1,0],[2,0]],[[0,0],[1,0],[2,0]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,1]],[[0,0],[0,1],[1,1]],[[0,0],[1,0]],[[0,0],[1,0]],[[0,0]],[[0,0]]];
const row=(y,a=0,b=11)=>Array.from({length:b-a+1},(_,i)=>[a+i,y]);
const levels=[
{title:'小河上的桥',who:'佩奇和乔治',story:'我们想去河对岸玩！请搭一座连着两岸的桥，让我们安全过去。',hint:'桥面要连到两岸，河面上的空隙还需要补齐。',fixed:[...row(6,0,2),...row(6,9,11)],required:row(5,2,9),kind:'bridge',budget:10},
{title:'够到玩具龙',who:'乔治',story:'恐龙在高处！请给我搭一条逐渐升高的台阶，不要让我一下跳太高。',hint:'从左边的地面开始，每次只升高一格，搭到星星下面。',fixed:row(6),kind:'stairs',target:[7,2],budget:10},
{title:'猪爸爸回家',who:'猪爸爸',story:'回家的路又高又低！请接好两段路，经过门洞，走到右边的家。',hint:'中间台地比两边高一格，门洞下方要保留通行空间。',fixed:[...row(6,0,1),...row(6,5,6),...row(5,5,6),...row(6,10,11)],required:[...row(5,1,4),...row(5,7,10)],forbidden:[[8,3],[9,3]],kind:'road',budget:10},
{title:'佩奇的小房子',who:'佩奇',story:'给我们搭一座小房子吧！两边有墙，上面有屋顶，中间留一个大门。',hint:'两面墙要从地面连到屋顶，中间的门洞不能被堵住。',fixed:row(6),required:[...[3,8].flatMap(x=>[3,4,5].map(y=>[x,y])),...row(2,3,8)],forbidden:[...row(3,4,7),...row(4,4,7),...row(5,4,7)],kind:'house',budget:10},
{title:'一家人的野餐',who:'佩奇一家',story:'一起去野餐！先跨过小沟，再爬上野餐台，还要为篮子留出门洞。',hint:'先修左侧的小桥，再搭右侧的高台。黄色虚线是篮子的通道。',fixed:[...row(6,0,1),...row(6,5,11)],required:row(5,1,5),forbidden:[[9,4],[10,4]],kind:'picnic',target:[8,2],budget:8}
];
function cells(p){let s=shapes[p.id].map(c=>c.slice());for(let i=0;i<(p.r||0)%4;i++)s=s.map(([x,y])=>[-y,x]);let ax=Math.min(...s.map(c=>c[0])),ay=Math.min(...s.map(c=>c[1]));return s.map(([x,y])=>[x-ax+p.x,y-ay+p.y]);}
const key=(x,y)=>x+','+y;
function occupied(l,ps){return new Set([...l.fixed,...ps.flatMap(cells)].map(c=>key(...c)));}
function canPlace(l,ps,p){const used=occupied(l,ps.filter(a=>a.id!==p.id));return cells(p).every(([x,y])=>x>=0&&x<12&&y>=0&&y<6&&!used.has(key(x,y))&&!(l.forbidden||[]).some(c=>c[0]===x&&c[1]===y));}
function supported(l,ps){ // snap-joined blocks form rigid connected structures; check support polygon and overhang
const terrain=new Set(l.fixed.map(c=>key(...c))),all=ps.flatMap(cells),remain=new Map(all.map(c=>[key(...c),c]));
while(remain.size){let first=remain.values().next().value,queue=[first],component=[];remain.delete(key(...first));while(queue.length){let [x,y]=queue.shift();component.push([x,y]);for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let k=key(x+dx,y+dy);if(remain.has(k)){queue.push(remain.get(k));remain.delete(k)}}}let supports=component.filter(([x,y])=>terrain.has(key(x,y+1))).map(c=>c[0]);if(!supports.length)return false;let min=Math.min(...supports),max=Math.max(...supports),cx=component.reduce((s,c)=>s+c[0],0)/component.length;if(cx<min-.5||cx>max+.5)return false; // center of mass must stay above the support footprint
}return true;}
function route(l,ps,target){let o=occupied(l,ps),tops=[];for(let x=0;x<12;x++)for(let y=0;y<7;y++)if(o.has(key(x,y))&&!o.has(key(x,y-1)))tops.push([x,y]);let start=tops.filter(c=>c[0]===0);let queue=start.slice(),seen=new Set(start.map(c=>key(...c)));while(queue.length){let a=queue.shift();if(a[0]===target[0]&&a[1]<=target[1])return true;for(let b of tops){if(Math.abs(a[0]-b[0])!==1||Math.abs(a[1]-b[1])>1||seen.has(key(...b)))continue; // clear headroom while stepping
let high=Math.min(a[1],b[1])-1;if(o.has(key(a[0],high))||o.has(key(b[0],high)))continue;seen.add(key(...b));queue.push(b);}}return false;}
function check(l,ps){if(!ps.length)return {ok:false,reason:'先选一块积木，拖到搭建区吧。'};if(ps.length>l.budget||new Set(ps.map(p=>p.id)).size!==ps.length||ps.some(p=>!canPlace(l,ps,p)))return {ok:false,reason:'积木不能重叠，也不能挡住黄色通道。'};if(!supported(l,ps))return {ok:false,reason:'有积木悬在空中，给它加一个支撑吧。'};let o=occupied(l,ps);if((l.required||[]).some(c=>!o.has(key(...c))))return {ok:false,reason:l.hint};if(l.target&&!route(l,ps,l.target))return {ok:false,reason:l.hint};if(l.kind==='road'&&!route(l,ps,[11,6]))return {ok:false,reason:l.hint};return {ok:true,reason:'成功啦！你搭得真棒！'};}
const api={shapes,levels,cells,canPlace,supported,route,check};if(typeof module!=='undefined')module.exports=api;root.GameEngine=api;
})(typeof window!=='undefined'?window:globalThis);
