from pathlib import Path
from playwright.sync_api import sync_playwright
BASE = Path(__file__).resolve().parents[1]
def check(page, width, height):
    errs=[]
    page.on('pageerror', lambda e: errs.append(str(e)))
    html=(BASE/'index.html').read_text().replace('<link rel="stylesheet" href="src/bureau.css">','').replace('<script type="module" src="src/bureau-app.js"></script>','')
    page.set_content(html)
    page.add_style_tag(content=(BASE/'src/bureau.css').read_text())
    engine=(BASE/'src/bureau-engine.mjs').read_text().replace('export const ','const ').replace('export function ','function ')
    app=(BASE/'src/bureau-app.js').read_text().split('\n',1)[1]
    page.add_script_tag(content=engine+'\n'+app)
    page.wait_for_selector('#ruleRows .class-token')
    assert page.locator('#doorResult').inner_text()=='REFUSED'
    assert page.locator('#ruleRows .class-token').count()==2
    viewport=page.evaluate('({sw:document.documentElement.scrollWidth, sh:document.documentElement.scrollHeight, cw:innerWidth, ch:innerHeight})')
    if width>=960:
        assert viewport['sw']<=viewport['cw'] and viewport['sh']<=viewport['ch'],viewport
    page.locator('[data-slot="0"]').focus()
    page.keyboard.press('Enter')
    page.keyboard.press('Escape')
    assert page.locator('[data-slot="0"]').get_attribute('aria-pressed')=='false'
    page.locator('[data-slot="0"]').click()
    page.locator('[data-slot="1"]').click()
    assert page.locator('#doorResult').inner_text()=='PROVEN'
    page.locator('#undoButton').click()
    assert page.locator('#doorResult').inner_text()=='REFUSED'
    page.locator('[data-slot="0"]').click()
    page.locator('[data-slot="1"]').click()
    page.locator('#submitCase').click()
    assert page.locator('#doorResult').inner_text()=='RELEASED'
    page.locator('#nextButton').click()
    assert page.locator('#doorResult').inner_text()=='REFUSED'
    assert page.locator('#ruleRows .class-token').count()==3
    # A contradiction refuses to submit, but it can be undone.
    page.locator('[data-slot="1"]').click();page.locator('[data-slot="2"]').click()
    assert page.locator('#doorResult').inner_text()=='CONTRADICTION'
    page.locator('#submitCase').click()
    assert page.locator('#doorResult').inner_text()=='CONTRADICTION'
    page.locator('#undoButton').click()
    assert page.locator('#doorResult').inner_text()=='REFUSED'
    # First swap O1 ESCAPEE and tray VISITOR, then O3 WITNESS and CLERK.
    if width>=860:
        page.locator('[data-slot="0"]').drag_to(page.locator('[data-slot="3"]'))
    else:
        page.locator('[data-slot="0"]').click();page.locator('[data-slot="3"]').click()
    page.locator('[data-slot="1"]').click();page.locator('[data-slot="2"]').click()
    assert page.locator('#doorResult').inner_text()=='PROVEN'
    page.locator('#submitCase').click()
    assert page.locator('#doorResult').inner_text()=='RELEASED'
    page.locator('#replayButton').click()
    assert page.locator('#caseIndex').inner_text()=='CASE 01 / 02'
    assert not errs,errs
    return viewport
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(1366,768),(1024,768),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        try:
            data=check(page,width,height)
            print('PASS',width,height,data)
            page.screenshot(path=str(BASE/f'docs/screenshot_{width}x{height}.png'),full_page=True)
        finally:page.close()
    browser.close()
