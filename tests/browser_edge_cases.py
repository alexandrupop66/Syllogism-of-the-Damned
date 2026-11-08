"""Browser adversarial/negative checks in the same isolated Chrome source harness."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="src/styles.css"\s*/>','',html)
html=re.sub(r'<script type="module" src="src/app.js"></script>','',html)
css=(ROOT/'src/styles.css').read_text()
def source(path):
 text=(ROOT/path).read_text();text=re.sub(r'^import .*?;\s*$', '', text,flags=re.MULTILINE)
 return text.replace('export ','')
js='\n'.join(source(p) for p in ['src/engine.mjs','src/architecture.mjs','src/metamorphosis.mjs','src/app.js'])
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1366,'height':768},reduced_motion='reduce')
 errors=[];network=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('request',lambda r:network.append(r.url))
 p.set_content(html);p.add_style_tag(content=css);p.add_script_tag(content=js)
 # An angle-bracket name is preserved only as text; it never becomes markup.
 unsafe='<img src=x onerror=alert(1)>'
 p.locator('#applicantName').fill(unsafe)
 p.locator('#submitApplication').click()
 p.wait_for_function("document.body.dataset.act==='fracture'")
 p.locator('#notSlot').click()
 assert p.locator('body').get_attribute('data-rule')=='locked'
 assert p.locator('#enterExit').is_hidden()
 p.locator('#notToken').focus()
 p.keyboard.press('Enter')
 assert p.locator('#notToken').get_attribute('aria-pressed')=='true'
 p.keyboard.press('Escape')
 assert p.locator('#notToken').get_attribute('aria-pressed')=='false'
 # Dropping the word outside the target cannot rewrite it.
 r=p.locator('#notToken').bounding_box()
 p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2)
 p.mouse.down();p.mouse.move(r['x']-60,r['y']-30,steps=7);p.mouse.up()
 assert p.locator('body').get_attribute('data-rule')=='locked'
 p.locator('#notToken').click()
 p.locator('#notSlot').click()
 assert p.locator('body').get_attribute('data-rule')=='rewritten'
 p.locator('#enterExit').click()
 p.wait_for_function("document.body.dataset.act==='escaped'")
 assert p.locator('#escapeName').inner_text()==unsafe
 assert p.locator('#escapeName img').count()==0
 assert not errors,errors
 assert not network,network
 p.locator('#restartButton').click()
 assert p.locator('body').get_attribute('data-act')=='form'
 assert p.locator('#applicantName').input_value()==''
 print('PASS: injection is text-only, invalid drop rejected, selection cancelled, no external requests, replay resets.')
 p.close();b.close()
