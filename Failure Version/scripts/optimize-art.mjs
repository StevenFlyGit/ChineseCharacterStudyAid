import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
const assets={ 'island-clay-dry':1536,'island-clay-wet':1536,'tree-clay':600,'bridge-clay':600,'boat-clay':500,'bird-clay':500,'rain-clay':300,'garden-clay':500,'logo-clay':700,'clay-texture':512 };
await mkdir('public/assets',{recursive:true});
for(const [name,width] of Object.entries(assets)){
 const output=`public/assets/${name}.webp`;
 await sharp(`art/source/${name}.png`).resize({width,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(output);
 console.log(`${name}: ${Math.round((await stat(output)).size/1024)} KB`);
}
await sharp('public/assets/fox.png').resize({width:500,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile('public/assets/fox.webp');
