// Optional repeatable end-to-end checks. Run with npm run dev in another terminal.
// Uses a disposable browser context, not the user's saved browser progress.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
await mkdir('test-output',{recursive:true});
try{
 for(const [char,width] of [['桥',1280],['船',390],['鸟',360]]){
  const context=await browser.newContext({viewport:{width,height:width===1280?800:844},reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:5188');
  await page.getByRole('button',{name:'关闭声音',exact:true}).click();
  await page.getByRole('button',{name:'帮助小狐狸',exact:true}).click();
  await writeCharacter(page,'木');
  await page.getByRole('button',{name:'把一个木放入组合槽',exact:true}).click();await page.getByRole('button',{name:'把一个木放入组合槽',exact:true}).click();
  await page.getByRole('button',{name:'选择林',exact:true}).click();await writeCharacter(page,'林');
  await page.getByRole('button',{name:'让树林长出来',exact:true}).click();
  await page.getByRole('button',{name:'选择雨',exact:true}).click();await writeCharacter(page,'雨');await page.getByRole('button',{name:'让这里下雨',exact:true}).click();
  await page.getByRole('button',{name:`选择${char}`,exact:true}).click();await writeCharacter(page,char);await page.getByRole('button',{name:'帮狐狸过河',exact:true}).click();
  await page.getByRole('button',{name:'选择木',exact:true}).click();await page.getByRole('button',{name:'给花园浇水',exact:true}).click();assert.match(await page.getByRole('heading',{level:1}).innerText(),/花园/);
  await page.getByRole('button',{name:'选择雨',exact:true}).click();await page.getByRole('button',{name:'给花园浇水',exact:true}).click();
  await page.getByRole('button',{name:'再玩一次',exact:true}).click();await page.getByRole('button',{name:'继续这次冒险',exact:true}).click();
  await page.reload();assert.match(await page.getByRole('heading',{level:1}).innerText(),/生机/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  await page.screenshot({path:`test-output/route-${char}-${width}.jpg`,fullPage:true});await context.close();console.log(`PASS: ${char}, ${width}px, tracing → transfer → persistence`);
 }
}finally{await browser.close();}

async function writeCharacter(page,char){
 await page.waitForFunction(()=>document.querySelector('[data-testid="trace-pad"]')?.dataset.mode==='practice');
 const {default:data}=await import(`hanzi-writer-data/${char}.json`,{with:{type:'json'}});
 const {default:HanziWriter}=await import('hanzi-writer');
 const box=await page.locator('.writer-host').boundingBox();assert.ok(box);
 const scale=HanziWriter.getScalingTransform(box.width,box.width,22);
 for(let i=0;i<data.medians.length;i++){
  const points=data.medians[i].map(([x,y])=>[box.x+scale.x+x*scale.scale,box.y+box.width-scale.y-y*scale.scale]);
  await page.mouse.move(...points[0]);await page.mouse.down();
  for(const p of points.slice(1))await page.mouse.move(...p,{steps:4});
  await page.mouse.up();
  await page.waitForFunction(n=>Number(document.querySelector('[data-testid="trace-pad"]').dataset.stroke)>n,i);
 }
 assert.equal(await page.getByTestId('trace-pad').getAttribute('data-mode'),'done');
 await page.getByRole('button',{name:`获得“${char}”字卡 ✦`,exact:true}).click();
}
