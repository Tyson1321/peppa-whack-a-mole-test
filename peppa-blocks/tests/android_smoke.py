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
 if '小河上的桥' in xml: break
else: raise AssertionError('Android WebView did not show level menu: '+xml)
(out/'android-menu.xml').write_text(xml)
with (out/'android-menu.png').open('wb') as f: subprocess.run(['adb','exec-out','screencap','-p'],stdout=f,check=True)
node=next(n for n in ET.fromstring(xml).iter('node') if '小河上的桥' in (n.get('text','')+n.get('content-desc','')))
x1,y1,x2,y2=map(int,re.findall(r'\d+',node.get('bounds')))
adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2))
for _ in range(10):
 time.sleep(2);xml=dump()
 if '搭好啦' in xml: break
else: raise AssertionError('Native tap did not open level: '+xml)
(out/'android-level.xml').write_text(xml)
with (out/'android-level.png').open('wb') as f: subprocess.run(['adb','exec-out','screencap','-p'],stdout=f,check=True)
assert adb('shell','pidof','com.family.blocks').strip().isdigit()
print('ANDROID_SMOKE_OK: APK installed, offline menu rendered, native tap opened first level')
