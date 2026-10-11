import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
await mkdir('docs/screenshots',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto('http://127.0.0.1:5193');await page.screenshot({path:'docs/screenshots/desktop.png'});await context.close();
 const phone=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),p=await phone.newPage();
 await p.goto('http://127.0.0.1:5193');await p.screenshot({path:'docs/screenshots/mobile-welcome.png'});
 await p.getByRole('button',{name:'关闭声音',exact:true}).click();await p.getByRole('textbox',{name:'输入一个汉字',exact:true}).fill('赢');await p.getByRole('button',{name:'帮我认识',exact:true}).click();
 for(let i=0;i<5;i++)await p.locator('.footer-actions .primary-button').click();
 await p.screenshot({path:'docs/screenshots/mobile-story.png'});
 for(let i=0;i<5;i++)await p.locator('.footer-actions .primary-button').click();
 await p.screenshot({path:'docs/screenshots/mobile-assemble.png'});
 console.log('已保存展示截图');await phone.close();
}finally{await browser.close();}
