import json,re,os
from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="src/styles.css"\s*/>','',html)
html=re.sub(r'<script type="module" src="src/app.js"></script>','',html)
css=(root/'src/styles.css').read_text()
engine=(root/'src/engine.mjs').read_text().replace('export ','')
morph=(root/'src/metamorphosis.mjs').read_text().replace('export ','')
app=(root/'src/app.js').read_text()
app=re.sub(r'^import .*?;\s*$', '', app, flags=re.MULTILINE)
js='\n'.join([engine,morph,app])
report=[]
capture_dir=Path(os.environ.get('SYLLOGISM_TEST_OUTPUT', str(root / 'test-artifacts')))
capture_dir.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for label,w,h,reduced in [('desktop',1366,768,False),('small-desktop',1024,768,False),('mobile',390,844,False),('reduced',1366,768,True)]:
  p=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce' if reduced else 'no-preference',device_scale_factor=1)
  errors=[];warnings=[]
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.on('console',lambda msg:warnings.append(msg.text) if msg.type=='warning' else None)
  p.set_content(html)
  p.add_style_tag(content=css)
  p.add_script_tag(content=js)
  assert p.locator('body').get_attribute('data-act')=='form'
  # Invalid input must fail closed and remain on the same form.
  p.locator('#applicantName').fill('A')
  p.locator('#submitApplication').click()
  assert p.locator('body').get_attribute('data-act') == 'form'
  assert 'at least two' in p.locator('#nameError').inner_text()
  p.locator('#applicantName').fill('Avery')
  p.locator('#submitApplication').click()
  if not reduced:
   p.wait_for_timeout(460)
   if label=='desktop':p.screenshot(path=str(capture_dir/'mid-transition.png'))
   active=p.locator('.metamorph-shard').count()
  else:active=0
  p.wait_for_function("document.body.dataset.act === 'fracture'",timeout=6500)
  p.wait_for_timeout(360)
  p.screenshot(path=str(capture_dir/f'{label}-fracture.png'))
  dim=p.evaluate('''() => ({inner:innerHeight, scroll:document.documentElement.scrollHeight, horizontal:document.documentElement.scrollWidth, ghosts:document.querySelectorAll('.metamorph-shard').length, focus:document.activeElement?.id, state:document.body.dataset.act})''')
  # Keyboard path for the first fragment, pointer path for the remaining pieces.
  p.locator('[data-piece="identity"]').focus()
  p.keyboard.press('Enter')
  p.locator('[data-piece="consent"]').click()
  p.locator('[data-piece="authority"]').click()
  assert p.locator('body').get_attribute('data-act')=='verdict'
  assert p.locator('#verdictName').inner_text() == 'Avery'
  p.locator('#openDoorButton').click()
  assert p.locator('body').get_attribute('data-act')=='escaped'
  p.locator('#restartButton').click()
  assert p.locator('body').get_attribute('data-act')=='form'
  assert not errors, errors
  assert dim['ghosts'] == 0
  assert dim['horizontal'] <= w
  if w >= 1024: assert dim['scroll'] <= h
  report.append({'mode':label,'activeDuringTransition':active,'dimension':dim,'errors':errors,'warnings':warnings})
  p.close()
 b.close()
(capture_dir/'browser-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
