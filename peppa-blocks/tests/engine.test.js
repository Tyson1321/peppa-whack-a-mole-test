const assert=require('node:assert/strict'),fs=require('node:fs'),E=require('../app/src/main/assets/engine.js');
const p=(id,x,y,r=0)=>({id,x,y,r});
const solutions=[
[p(0,2,5),p(1,5,5),p(6,8,5)],
[p(0,3,5),p(1,6,5),p(6,4,4),p(7,6,4),p(2,5,3),p(3,6,2)],
[p(0,1,5),p(8,4,5),p(1,7,5),p(9,10,5),p(2,3,4),p(3,6,4)],
[p(0,3,3,1),p(1,8,3,1),p(2,3,2),p(3,6,2)],
[p(0,1,5),p(6,4,5),p(1,6,5),p(2,6,4),p(3,7,3),p(7,8,2)]
];
const alternatives=[
[p(6,2,5),p(0,4,5),p(1,7,5)],
solutions[1].map(q=>q.id===3?{...q,x:7}:q),
[...solutions[2],p(6,4,3)],
[p(0,3,3,1),p(1,8,3,1),p(6,3,2),p(2,5,2),p(8,8,2)],
[...solutions[4],p(8,5,4)]
];
let count=0;function test(name,f){f();count++;console.log('PASS',name)}
for(let i=0;i<5;i++){
 test('level '+(i+1)+' solution A',()=>assert.equal(E.check(E.levels[i],solutions[i]).ok,true));
 test('level '+(i+1)+' solution B',()=>assert.equal(E.check(E.levels[i],alternatives[i]).ok,true));
 test('level '+(i+1)+' empty fails',()=>assert.equal(E.check(E.levels[i],[]).ok,false));
 test('level '+(i+1)+' floating fails',()=>assert.equal(E.check(E.levels[i],[p(0,0,0)]).ok,false));
 test('level '+(i+1)+' duplicate fails',()=>assert.equal(E.check(E.levels[i],[...solutions[i],solutions[i][0]]).ok,false));
}
test('bridge missing span fails',()=>assert.equal(E.check(E.levels[0],solutions[0].filter(p=>p.id!==1)).ok,false));
test('door collision rejected',()=>assert.equal(E.canPlace(E.levels[3],[],p(0,4,4)),false));
test('out of bounds rejected',()=>assert.equal(E.canPlace(E.levels[0],[],p(0,11,1)),false));
test('four rotations return same geometry',()=>assert.deepEqual(E.cells(p(4,0,0,4)),E.cells(p(4,0,0,0))));
test('overlap rejected',()=>assert.equal(E.canPlace(E.levels[0],[p(0,2,5)],p(1,3,5)),false));
fs.writeFileSync(__dirname+'/solutions.json',JSON.stringify(solutions,null,2));console.log(count+' rule checks passed');
