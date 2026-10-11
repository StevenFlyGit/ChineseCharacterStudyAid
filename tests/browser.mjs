import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import lesson from '../shared/lesson.json' with {type:'json'};
import {localStory} from '../shared/story.mjs';
const url=process.env.TEST_URL||'http://127.0.0.1:5193';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
await mkdir('test-output',{recursive:true});
const failures=[];
async function run(name,fn){try{await fn();console.log('PASS '+name);}catch(e){failures.push(name);console.error('FAIL '+name+': '+e.stack);}}
async function nextToAssembly(page){await page.getByRole('textbox',{name:'输入一个汉字',exact:true}).fill('赢');await page.getByRole('button',{name:'帮我认识',exact:true}).click();for(let i=0;i<10;i++)await page.locator('.footer-actions .primary-button').click();await page.locator('main[data-stage="assemble"]').waitFor();}
async function assemble(page,touch=false){for(const c of lesson.components){if(touch){await page.getByTestId('tile-'+c.id).tap();await page.getByTestId('slot-'+c.id).tap();}else{await page.getByTestId('tile-'+c.id).click();await page.getByTestId('slot-'+c.id).click();}}await page.locator('main[data-stage="reunite"]').waitFor();await page.getByRole('button',{name:'我记住了，试试看',exact:true}).click();}
try{
 for(const width of [360,390,430]){
 await run('手机'+width+'：触摸完整流程、错误、刷新、求助、无API请求',async()=>{
 const ctx=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],api=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/'))api.push(r.url());});
 await page.goto(url);await page.getByRole('button',{name:'关闭声音',exact:true}).click();await page.screenshot({path:'test-output/mobile-'+width+'-welcome.png'});
 await nextToAssembly(page);
 await page.getByTestId('tile-wang').tap();await page.getByTestId('slot-kou').tap();
 assert.match(await page.locator('.notice').innerText(),/再看看/);assert.equal(await page.getByTestId('tile-wang').getAttribute('aria-pressed'),'true');
 await page.getByTestId('slot-wang').tap();await page.reload();
 assert.equal(await page.getByTestId('tile-wang').isDisabled(),true);
 await page.screenshot({path:'test-output/mobile-'+width+'-assembly.png'});
 for(const c of lesson.components.slice(1)){await page.getByTestId('tile-'+c.id).tap();await page.getByTestId('slot-'+c.id).tap();}
 await page.getByRole('button',{name:'我记住了，试试看',exact:true}).click();
 await page.getByRole('button',{name:'辨认营',exact:true}).tap();assert.match(await page.locator('.notice').innerText(),/字形/);
 await page.getByRole('button',{name:'重看刚才的字',exact:true}).tap();await page.getByRole('button',{name:'收起提示，再试试',exact:true}).tap();await page.getByRole('button',{name:'辨认赢',exact:true}).tap();
 await page.locator('main[data-stage="result"]').waitFor();assert.match(await page.locator('.results').innerText(),/查看提示后辨认/);assert.match(await page.locator('.results').innerText(),/经过 2 次尝试/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(api,[]);assert.deepEqual(errors,[]);
 await page.screenshot({path:'test-output/mobile-'+width+'-result.png'});await ctx.close();
 });
 }
 await run('桌面展示与普通话音频内联',async()=>{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.screenshot({path:'test-output/desktop-welcome.png'});await page.getByRole('textbox',{name:'输入一个汉字',exact:true}).fill('赢');await page.getByRole('button',{name:'帮我认识',exact:true}).click();
 await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);assert.equal(await page.locator('.technical-note').count(),0);await ctx.close();
 });
 await run('真实接口未配置可回退；成功、无效、超时与取消响应',async()=>{
 const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();await page.goto(url);
 await page.getByRole('button',{name:'陪伴者设置',exact:true}).click();await page.getByRole('button',{name:'真实 API',exact:true}).click();
 await page.getByRole('button',{name:'请求短故事',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-testid="source-label"]')?.textContent.includes('本地回退'));
 assert.match(await page.locator('.api-status').innerText(),/配置|暂时/);
 await page.route('**/api/story',route=>route.fulfill({json:{...localStory,source:'api'}}));await page.getByRole('button',{name:'请求短故事',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-testid="source-label"]')?.textContent.includes('真实 API'));
 await page.unroute('**/api/story');await page.route('**/api/story',route=>route.fulfill({json:{intro:'invalid',lines:[]}}));await page.getByRole('button',{name:'请求短故事',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-testid="source-label"]')?.textContent.includes('本地回退'));
 await page.unroute('**/api/story');await page.route('**/api/story',async route=>{await new Promise(r=>setTimeout(r,4000));await route.fulfill({json:{...localStory,source:'api'}}).catch(()=>{});});
 await page.getByRole('button',{name:'请求短故事',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.api-status')?.textContent.includes('超过三秒'),{},{timeout:5000});assert.match(await page.locator('[data-testid="source-label"]').innerText(),/本地回退/);
 await page.getByRole('button',{name:'请求短故事',exact:true}).click();await page.getByRole('button',{name:'本地脚本',exact:true}).click();await page.waitForTimeout(4200);assert.match(await page.locator('[data-testid="source-label"]').innerText(),/本地脚本/);
 await page.keyboard.press('Control+h');assert.match(await page.locator('.api-status').innerText(),/真实 API 模式/);await ctx.close();
 });
 await run('动画预览不覆盖记录；返回恢复原阶段',async()=>{
 const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();await page.goto(url);await page.getByRole('textbox',{name:'输入一个汉字',exact:true}).fill('赢');await page.getByRole('button',{name:'帮我认识',exact:true}).click();
 const saved=await page.evaluate(()=>localStorage.getItem('mindglyph:session:v1'));
 await page.getByRole('button',{name:'陪伴者设置',exact:true}).click();await page.getByRole('button',{name:'动画预览 · 不保存成绩',exact:true}).click();
 await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>localStorage.getItem('mindglyph:session:v1')),saved);
 await page.getByRole('button',{name:'陪伴者设置',exact:true}).click();await page.getByRole('button',{name:'返回原来的学习',exact:true}).click();await page.locator('main[data-stage="focus"]').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('mindglyph:session:v1')),saved);await ctx.close();
 });
 await run('本地HTML直接打开：无外部请求、音频可用、完整辨认',async()=>{
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 await page.goto(pathToFileURL(path.resolve('docs/心音字灵-离线演示.html')).href);await nextToAssembly(page);await assemble(page);await page.getByRole('button',{name:'辨认赢',exact:true}).click();await page.locator('main[data-stage="result"]').waitFor();
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.match(await page.locator('.results').innerText(),/首次找到/);await page.screenshot({path:'test-output/offline-result.png'});await ctx.close();
 });
 await run('路演自动故事、暂停保留时钟、等待操作并实际完成',async()=>{
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await ctx.newPage();await page.goto(url);await page.getByRole('button',{name:'关闭声音',exact:true}).click();await page.getByRole('button',{name:'一分钟路演',exact:true}).click();
 await page.waitForTimeout(600);await page.getByRole('button',{name:'暂停演示',exact:true}).click();const clock=await page.locator('.timer').innerText();await page.waitForTimeout(1200);assert.equal(await page.locator('.timer').innerText(),clock);assert.equal(await page.locator('main').getAttribute('data-stage'),'welcome');
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await page.locator('main[data-stage="assemble"]').waitFor({timeout:38000});assert.equal(await page.locator('.tile.placed').count(),0);
 await page.waitForTimeout(1100);assert.equal(await page.locator('main').getAttribute('data-stage'),'assemble');await assemble(page);await page.getByRole('button',{name:'辨认赢',exact:true}).click();await page.locator('main[data-stage="result"]').waitFor();await ctx.close();
 });
}finally{await browser.close();}
if(failures.length){console.error('失败：'+failures.join('、'));process.exitCode=1;}else console.log('浏览器验收全部通过。API成功场景使用受控响应，不代表真实供应商联调。');
