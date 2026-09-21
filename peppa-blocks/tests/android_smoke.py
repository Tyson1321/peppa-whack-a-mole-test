"""Run against an already booted emulator; confirm real WebView startup and a native tap."""
import subprocess, time, re, xml.etree.ElementTree as ET
from pathlib import Path
out=Path('tests/screenshots');out.mkdir(parents=True,exist_ok=True)
def adb(*args): return subprocess.check_output(['adb',*args],stderr=subprocess.STDOUT).decode()
def dump():
 adb('shell','uiautomator','dump','/sdcard/window.xml')
 return adb('shell','cat','/sdcard/window.xml')
adb('install','-r','app/build/outputs/apk/debug/app-debug.apk')
adb('shell','am','start','-W','-n','com.family.blocks/.MainActivity')
xml=''
for _ in range(15):
 time.sleep(2);xml=dump()
 if '河上的小小工程师' in xml: break
else: raise AssertionError('Android WebView did not show level menu: '+xml)
(out/'android-menu.xml').write_text(xml)
with (out/'android-menu.png').open('wb') as f: subprocess.run(['adb','exec-out','screencap','-p'],stdout=f,check=True)
node=next(n for n in ET.fromstring(xml).iter('node') if '河上的小小工程师' in (n.get('text','')+n.get('content-desc','')))
x1,y1,x2,y2=map(int,re.findall(r'\d+',node.get('bounds')))
adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2))
for _ in range(10):
 time.sleep(2);xml=dump()
 if '请大家试一试' in xml: break
else: raise AssertionError('Native tap did not open level: '+xml)
(out/'android-level.xml').write_text(xml)
with (out/'android-level.png').open('wb') as f: subprocess.run(['adb','exec-out','screencap','-p'],stdout=f,check=True)
assert adb('shell','pidof','com.family.blocks').strip().isdigit()
print('ANDROID_SMOKE_OK: APK installed, offline menu rendered, native tap opened first level')

# Exercise all chapter controls with native Android taps. DevTools only reads
# geometry/state and opens the chapter; placements use adb input, not place().
import json, urllib.request, websocket
pid=adb('shell','pidof','com.family.blocks').strip()
adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid)
targets=json.load(urllib.request.urlopen('http://127.0.0.1:9222/json'))
ws=websocket.create_connection(targets[0]['webSocketDebuggerUrl'],suppress_origin=True,timeout=20)
seq=0
def evaluate(code):
 global seq
 seq+=1;ws.send(json.dumps({'id':seq,'method':'Runtime.evaluate','params':{'expression':code,'returnByValue':True}}))
 while True:
  msg=json.loads(ws.recv())
  if msg.get('id')==seq:
   if 'exceptionDetails' in msg.get('result',{}):raise AssertionError(msg['result']['exceptionDetails'])
   return msg['result']['result'].get('value')
evaluate('window.qaErrors=[];window.addEventListener("error",e=>qaErrors.push(e.message));sound=false')
root=ET.fromstring(dump())
wv=next(n for n in root.iter('node') if n.get('class')=='android.webkit.WebView')
wx,wy,wr,wb=map(int,re.findall(r'\d+',wv.get('bounds')))
ratio=(wr-wx)/evaluate('innerWidth')
def tap_css(x,y):adb('shell','input','tap',str(round(wx+x*ratio)),str(round(wy+y*ratio)))
def click(selector):
 point=evaluate('(()=>{let e=document.querySelector('+json.dumps(selector)+');e.scrollIntoView({block:"nearest"});let r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()')
 tap_css(*point)
solutions=json.loads(Path('tests/solutions.json').read_text())
for i,blocks in enumerate(solutions):
 evaluate('start('+str(i)+');reset()')
 for p in blocks:
  click('#tray button:nth-child('+str(p['id']+1)+')')
  for _ in range(p['r']):click('#rotate')
  point=evaluate('(()=>{let r=canvas.getBoundingClientRect();return [r.left+geom.ox+('+str(p['x'])+'+.45)*geom.s,r.top+geom.oy+('+str(p['y'])+'+.45)*geom.s]})()')
  tap_css(*point)
 assert evaluate('placed.length')==len(blocks),('missing native placements',i,evaluate('placed'))
 click('#check')
 for _ in range(30):
  time.sleep(.3)
  if not evaluate('testing'):break
 assert evaluate('won'),('native trial failed',i,evaluate('document.getElementById("status").textContent'))
 evaluate('document.getElementById("modal").hidden=true;draw()')
 with (out/('android-chapter-'+str(i+1)+'.png')).open('wb') as f:subprocess.run(['adb','exec-out','screencap','-p'],stdout=f,check=True)
assert evaluate('qaErrors')==[],evaluate('qaErrors')
ws.close()
print('ANDROID_FIVE_CHAPTERS_OK: native taps placed and rotated every solution; all animated trials passed')
