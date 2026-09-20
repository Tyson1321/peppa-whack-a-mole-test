const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../app/src/main/assets');
(async()=>{const server=http.createServer((q,r)=>{let file=path.join(root,q.url==='/'?'index.html':q.url.split('?')[0]);try{r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.jpg')?'image/jpeg':'text/html');r.end(fs.readFileSync(file))}catch(e){r.statusCode=404;r.end()}}).listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));let browser;try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1000,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);fs.mkdirSync(__dirname+'/screenshots',{recursive:true});await page.screenshot({path:__dirname+'/screenshots/menu.png'});await page.locator('#levels button').first().click();await page.locator('#sound').click();
const solutions=require('./solutions.json');
async function at(x,y){return page.evaluate(({x,y})=>{let r=canvas.getBoundingClientRect();return{x:r.left+geom.ox+(x+.45)*geom.s,y:r.top+geom.oy+(y+.45)*geom.s}},{x,y})}
for(let i=0;i<5;i++){
if(i)await page.evaluate(i=>start(i),i);
await page.locator('#check').click();assert.equal(await page.locator('#modal').isVisible(),false);
for(let p of solutions[i]){await page.locator('.piece').nth(p.id).click();for(let k=0;k<p.r;k++)await page.locator('#rotate').click();let pos=await at(p.x,p.y);await page.mouse.click(pos.x,pos.y)}
assert.equal(await page.evaluate(()=>placed.length),solutions[i].length,'all pieces placed level '+i);
await page.screenshot({path:__dirname+'/screenshots/level-'+(i+1)+'.png'});
await page.locator('#check').click();assert.equal(await page.locator('#modal').isVisible(),true,'level '+i+' passes via actual clicks');await page.locator('#again').click();assert.equal(await page.evaluate(()=>placed.length),0);
}
await page.evaluate(()=>start(0));let box=await page.locator('.piece').first().boundingBox(),dest=await at(2,5);await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(dest.x,dest.y,{steps:12});await page.mouse.up();assert.equal(await page.evaluate(()=>placed.length),1,'drag from tray');await page.locator('#undo').click();assert.equal(await page.evaluate(()=>placed.length),0);await page.locator('#hint').click();await page.locator('#hint').click();assert.equal(await page.evaluate(()=>showHint),true);
await page.setViewportSize({width:844,height:390});await page.screenshot({path:__dirname+'/screenshots/phone-landscape.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.setViewportSize({width:390,height:844});await page.screenshot({path:__dirname+'/screenshots/phone-portrait.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.locator('#homeBtn').click();await page.reload();assert.equal(await page.locator('#levels button small').filter({hasText:'已完成'}).count(),5);assert.deepEqual(errors,[]);console.log('PASS five level click-throughs, replay, drag, undo, hints, progress persistence, portrait/landscape layout; no JS errors');
}finally{if(browser)await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
