import {readFile,writeFile,mkdir} from 'node:fs/promises';
await mkdir('public/fonts',{recursive:true});
const files=['src/App.tsx','src/game.ts','src/Trace.tsx'];
const text=[...new Set((await Promise.all(files.map(p=>readFile(p,'utf8')))).join('').match(/[\u3400-\u9fff]/g))].join('');
const url=`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700;900&text=${encodeURIComponent(text)}`;
const response=await fetch(url);if(!response.ok)throw new Error('Font stylesheet unavailable');
const css=await response.text();const urls=[...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1]))];let local=css;
for(let i=0;i<urls.length;i++){const result=await fetch(urls[i]);if(!result.ok)throw new Error('Font download failed');const file=`noto-serif-sc-${i}.woff2`;await writeFile(`public/fonts/${file}`,Buffer.from(await result.arrayBuffer()));local=local.replaceAll(urls[i],`/fonts/${file}`);}
await writeFile('src/font.css',local);
const license=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/OFL.txt');if(!license.ok)throw new Error('Font license unavailable');await writeFile('public/fonts/OFL.txt',await license.text());console.log(`Local font subsets saved: ${urls.length}`);
