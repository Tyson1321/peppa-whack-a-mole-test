const test=require('node:test'),assert=require('node:assert/strict'),E=require('../app/src/main/assets/engine'),solutions=require('./solutions.json');
const copy=x=>JSON.parse(JSON.stringify(x));
const alternatives=copy(solutions);
alternatives[0].find(p=>p.id===7).x=8;
alternatives[1].find(p=>p.id===0).x=5;
alternatives[2][0].id=2;
alternatives[3].forEach(p=>p.x++);
alternatives[4].find(p=>p.id===0).x=0;alternatives[4].find(p=>p.id===3).x=4;
for(let i=0;i<5;i++){
 test('chapter '+(i+1)+' has two geometrically different usable solutions',()=>{for(const ps of [solutions[i],alternatives[i]]){const r=E.check(E.levels[i],ps);assert.equal(r.ok,true,r.reason);assert.ok(r.path.length>0)}assert.notEqual(E.signature(E.levels[i],solutions[i]),E.signature(E.levels[i],alternatives[i]))});
 test('chapter '+(i+1)+' rejects empty, duplicate, overlap, outside and unsupported assemblies',()=>{let l=E.levels[i],s=solutions[i];assert.equal(E.check(l,[]).ok,false);assert.equal(E.check(l,[...s,s[0]]).ok,false);assert.equal(E.check(l,[{id:0,x:-1,y:1,r:0}]).ok,false);assert.equal(E.check(l,[{id:0,x:2,y:0,r:0}]).ok,false);assert.equal(E.check(l,[{id:0,x:4,y:0,r:0},{id:1,x:4,y:0,r:0}]).ok,false)});
 test('chapter '+(i+1)+' every block respects all four rotations',()=>{for(let id=0;id<10;id++)for(let r=0;r<4;r++){let c=E.cells({id,x:0,y:0,r},E.levels[i]);assert.ok(c.length>=2);assert.ok(c.every(([x,y])=>x>=0&&y>=0));assert.equal(new Set(c.map(String)).size,c.length)}});
}
test('wide bridge needs a central pier even if both banks support it',()=>{const ps=solutions[0].filter(p=>p.id!==7);assert.equal(E.check(E.levels[0],ps).ok,false);assert.match(E.check(E.levels[0],ps).reason,/桥墩/)});
test('boat clearance cannot be filled',()=>{let ps=[...solutions[0],{id:5,x:5,y:7,r:0}];assert.equal(E.check(E.levels[0],ps).ok,false)});
test('stairs cannot pass by stacking a tall vertical tower at the target',()=>{let l=E.levels[1],ps=[{id:0,x:12,y:5,r:1},{id:3,x:11,y:4,r:0}];assert.equal(E.check(l,ps).ok,false)});
test('cart requires correct ramp orientation and real sloping surface',()=>{let ps=copy(solutions[2]);ps.find(p=>p.id===9).r=0;assert.equal(E.check(E.levels[2],ps).ok,false);let q=copy(solutions[2]);q.find(p=>p.id===8).id=2;assert.equal(E.check(E.levels[2],q).ok,false)});
test('cart rejects low overhead clearance',()=>{let l={...E.levels[2],fixed:[...E.levels[2].fixed,[8,6]]};assert.equal(E.check(l,solutions[2]).ok,false)});
test('house needs clear room, continuous roof and both walls',()=>{let l=E.levels[3];assert.equal(E.check(l,[...solutions[3],{id:6,x:6,y:7,r:0}]).ok,false);for(let id of [0,1,2,4])assert.equal(E.check(l,solutions[3].filter(p=>p.id!==id)).ok,false)});
test('picnic needs both route and shelter, not one of them',()=>{for(let id of [0,1,4])assert.equal(E.check(E.levels[4],solutions[4].filter(p=>p.id!==id)).ok,false)});
test('ramp surface rises or descends smoothly',()=>{let l=E.levels[2];for(let r of [0,1]){let p={id:8,x:2,y:7,r},a=E.surfaces({...l,fixed:[]},[p],2.25)[0],b=E.surfaces({...l,fixed:[]},[p],3.75)[0];assert.equal(Math.sign(b-a),r===0?-1:1)}});
test('budget and malformed placement are rejected',()=>{let l={...E.levels[0],budget:4};assert.equal(E.check(l,solutions[0]).ok,false);assert.equal(E.canPlace(l,[],{id:99,x:0,y:0,r:0}),false);assert.equal(E.canPlace(l,[],{id:1,x:.5,y:1,r:0}),false)});
