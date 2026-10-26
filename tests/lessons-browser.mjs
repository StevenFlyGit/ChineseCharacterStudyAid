import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {lessons} from '../shared/lessons.mjs';
const browser=await chromium.launch({channel:'msedge',headless:true});
await mkdir('test-output',{recursive:true});
try{for(const width of [360,390,430]){for(const lesson of lessons){
 const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5194');await page.getByRole('button',{name:'关闭声音',exact:true}).click();
 await page.getByRole('button',{name:'认识'+lesson.char,exact:true}).tap();
 await page.locator('main[data-stage="focus"]').waitFor();
 assert.equal(await page.getByRole('button',{name:/查看.*部件/}).count(),lesson.components.length);
 for(const c of lesson.components){const button=page.getByRole('button',{name:'查看'+c.char+'部件',exact:true});await button.tap();assert.equal(await button.getAttribute('aria-pressed'),'true');}
 const boxes=await page.getByRole('button',{name:/查看.*部件/}).evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,'字块点击区域必须分离');}await page.screenshot({path:'test-output/'+lesson.id+'-'+width+'-structure.png'});
 await page.locator('.footer-actions .primary-button').click();for(const c of lesson.components){assert.equal(await page.locator('.story-line').innerText(),c.line);await page.locator('.footer-actions .primary-button').click();}
 await page.locator('main[data-stage="assemble"]').waitFor();
 const first=lesson.components[0],second=lesson.components[1];await page.getByTestId('tile-'+first.id).tap();await page.getByTestId('slot-'+second.id).tap();assert.match(await page.locator('.notice').innerText(),/再看看/);
 await page.getByTestId('slot-'+first.id).tap();await page.reload();assert.equal(await page.getByTestId('tile-'+first.id).isDisabled(),true);
 for(const c of lesson.components.slice(1)){await page.getByTestId('tile-'+c.id).tap();await page.getByTestId('slot-'+c.id).tap();}
 await page.getByRole('button',{name:'我记住了，试试看',exact:true}).click();assert.equal(await page.locator('.recognition-options button').count(),9);
 const order=await page.locator('.recognition-options button').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));await page.getByRole('button',{name:'辨认'+lesson.defaultChoices.find(c=>c!==lesson.char),exact:true}).tap();assert.deepEqual(await page.locator('.recognition-options button').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label'))),order);

 await page.screenshot({path:'test-output/'+lesson.id+'-'+width+'-recognition.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.getByRole('button',{name:'重看刚才的字',exact:true}).tap();assert.match(await page.locator('.recognition-hint').innerText(),new RegExp(lesson.char));await page.getByRole('button',{name:'收起提示，再试试',exact:true}).click();await page.getByRole('button',{name:'辨认'+lesson.char,exact:true}).tap();
 await page.locator('main[data-stage="result"]').waitFor();assert.match(await page.locator('.results').innerText(),/查看提示后辨认/);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mindglyph:session:v1')).lessonId),lesson.id);assert.deepEqual(errors,[]);
 await page.getByRole('button',{name:'再一起学一次',exact:true}).click();const next=lessons.find(l=>l.id!==lesson.id);await page.getByRole('button',{name:'认识'+next.char,exact:true}).tap();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mindglyph:session:v1')).placed.length),0);
 console.log('PASS '+width+'px '+lesson.char+'：结构、故事、拼回、刷新、9字辨认与切课');await context.close();
}}}finally{await browser.close();}
