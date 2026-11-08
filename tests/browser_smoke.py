"""Isolated Chromium execution of source HTML/CSS/JS.
Browser navigation to localhost/file:// is blocked in this environment. This harness
loads unchanged HTML/CSS and concatenates ES modules after stripping only import/export
syntax; it is not a deployed-site validation. Requires playwright and system Chromium.
"""
import json, re, os
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="src/styles.css"\s*/>','',html)
html=re.sub(r'<script type="module" src="src/app.js"></script>','',html)
css=(root/'src/styles.css').read_text()
def script(p):
 s=(root/p).read_text()
 s=re.sub(r'^import .*?;\s*$', '', s, flags=re.MULTILINE)
 return s.replace('export ','')
js='\n'.join(script(p) for p in ['src/engine.mjs','src/architecture.mjs','src/metamorphosis.mjs','src/app.js'])
output=Path(os.environ.get('SYLLOGISM_TEST_OUTPUT', str(root/'test-artifacts')))
output.mkdir(parents=True,exist_ok=True)
report=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for label,w,h,reduced in [('desktop',1366,768,False),('small-desktop',1024,768,False),('mobile',390,844,False),('reduced',1366,768,True)]:
  page=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce' if reduced else 'no-preference',device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html)
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  assert page.locator('#architecture [data-shard]').count()==32
  assert page.locator('body').get_attribute('data-act')=='form'
  page.locator('#applicantName').fill('A')
  page.locator('#submitApplication').click()
  assert page.locator('body').get_attribute('data-act')=='form'
  assert 'two characters' in page.locator('#nameError').inner_text()
  page.locator('#applicantName').fill('Avery')
  page.locator('#submitApplication').click()
  count=0
  if not reduced:
   page.wait_for_timeout(330)
   count=page.locator('.paper-shard-flight').count()
   if label=='desktop':page.screenshot(path=str(output/'transition.png'))
  page.wait_for_function("document.body.dataset.act==='fracture'",timeout=9000)
  page.wait_for_timeout(850)
  page.screenshot(path=str(output/f'{label}-locked.png'))
  locked=page.evaluate('''() => ({viewH:innerHeight,documentH:document.documentElement.scrollHeight,scrollW:document.documentElement.scrollWidth,fragments:document.querySelectorAll('.paper-shard-flight').length,focus:document.activeElement?.id})''')
  # Reject false completion; user must select word or drag it onto the slot.
  page.locator('#notSlot').click()
  assert page.locator('body').get_attribute('data-rule')=='locked'
  if label=='mobile':
   page.locator('#notToken').click()
   page.locator('#notSlot').click()
  elif label=='small-desktop':
   page.locator('#notToken').drag_to(page.locator('#notSlot'),force=True)
  else:
   page.locator('#notToken').focus()
   page.keyboard.press('Enter')
   assert page.locator('#notToken').get_attribute('aria-pressed')=='true'
   page.locator('#notSlot').focus()
   page.keyboard.press('Enter')
  page.wait_for_function("document.body.dataset.rule==='rewritten'",timeout=5000)
  page.wait_for_timeout(1300 if not reduced else 80)
  assert page.locator('#notToken').is_hidden()
  assert page.locator('#slotText').inner_text()=='NOT'
  assert page.locator('#enterExit').is_visible()
  page.screenshot(path=str(output/f'{label}-rewritten.png'))
  page.locator('#enterExit').click()
  page.wait_for_function("document.body.dataset.act==='escaped'",timeout=5000)
  page.screenshot(path=str(output/f'{label}-escaped.png'))
  page.locator('#restartButton').click()
  assert page.locator('body').get_attribute('data-act')=='form'
  assert page.locator('#applicantName').input_value()==''
  assert not errors,errors
  assert locked['fragments']==0
  assert locked['scrollW']<=w
  if w>=1024:assert locked['documentH']<=h,locked
  report.append({'mode':label,'shardsInFlight':count,'layout':locked,'errors':errors})
  page.close()
 b.close()
(output/'report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
