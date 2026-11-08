"""30s real browser interaction capture; Chrome frames streamed directly to ffmpeg.
No scripted DOM state changes or visual simulations are used. File/localhost navigation is
restricted here, so ES module imports/exports are stripped only for sandbox injection.
"""
import os,re,time,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SYLLOGISM_DEMO_OUTPUT',str(ROOT/'test-artifacts')))
OUT.mkdir(parents=True,exist_ok=True)
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="src/styles.css"\s*/>','',html)
html=re.sub(r'<script type="module" src="src/app.js"></script>','',html)
css=(ROOT/'src/styles.css').read_text()
def module(path):
    code=(ROOT/path).read_text()
    return re.sub(r'^import .*?;\s*$', '', code, flags=re.MULTILINE).replace('export ','')
js='\n'.join(module(p) for p in ['src/engine.mjs','src/architecture.mjs','src/metamorphosis.mjs','src/app.js'])
FPS=20
FRAMES=600
OUTPUT=OUT/'Syllogism_v0.3_30s_real_browser_demo.mp4'
ffmpeg=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',str(FPS),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','21','-preset','veryfast','-movflags','+faststart',str(OUTPUT)],stdin=subprocess.PIPE)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1366,'height':768},device_scale_factor=1,reduced_motion='no-preference')
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html)
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  start=time.monotonic()
  def move(target):
   r=page.locator(target).bounding_box()
   if r:page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2,steps=5)
  for frame in range(FRAMES):
   # Real mouse and keyboard events. Event schedule never directly alters app state.
   if frame==37:move('#applicantName');page.locator('#applicantName').click()
   if frame in (47,51,55,59,63):page.keyboard.type('Avery'[(frame-47)//4])
   if frame==74:move('#submitApplication');page.locator('#submitApplication').click()
   if frame==154:move('#notToken')
   if frame==170:page.locator('#notToken').click()
   if frame==208:move('#notSlot')
   if frame==226:page.locator('#notSlot').click()
   if frame==365:move('#enterExit')
   if frame==398:page.locator('#enterExit').click()
   if frame==560:move('#restartButton')
   jpeg=page.screenshot(type='jpeg',quality=82,animations='allow',caret='hide')
   ffmpeg.stdin.write(jpeg)
   target=start+(frame+1)/FPS
   remaining=target-time.monotonic()
   if remaining>0:time.sleep(remaining)
  assert not errors,errors
  assert page.locator('body').get_attribute('data-act')=='escaped'
  print('Real browser interaction completed; captured frames:',FRAMES,'elapsed seconds:',round(time.monotonic()-start,2))
  page.close();browser.close()
finally:
 if ffmpeg.stdin:ffmpeg.stdin.close()
 code=ffmpeg.wait(timeout=45)
 if code!=0:raise RuntimeError('ffmpeg exited '+str(code))
print('Video:',OUTPUT,'size:',OUTPUT.stat().st_size)
