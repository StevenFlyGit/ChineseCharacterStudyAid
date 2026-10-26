import {MsEdgeTTS,OUTPUT_FORMAT} from 'msedge-tts';
import {mkdir,copyFile,stat} from 'node:fs/promises';
const tracks={welcome:'我的小岛需要一点魔法。你愿意帮帮我吗？',trace:'从圆点开始，跟着笔画写一个木吧。',combine:'一棵树有点孤单。把两个木放在一起，会发生什么？',rain:'树林回来了！可是河里还没有水，让天空下点雨吧。',cross:'家就在对岸。你想用什么办法帮我过河？',garden:'花园有点渴。你还记得哪个字能带来水吗？',complete:'谢谢你！每一个学会的字，都让我的世界变得更美。','combine-success':'两个木，组成林。把林放进小岛吧。','char-木':'木。树木。一棵树，给小狐狸乘凉。','char-林':'林。成片的树木。两棵木，变成一片林。','char-雨':'雨。从云里落下的水滴。雨落下来，花草喝到水。','char-桥':'桥。架在河上，供人通过的建筑。走过小桥，就能到对岸。','char-船':'船。在水上航行的交通工具。坐上小船，慢慢划过河。','char-鸟':'鸟。长着羽毛的动物，多数会飞。故事里的大鸟带狐狸飞过河。'};
await mkdir('public/audio',{recursive:true});
for(const [name,text] of Object.entries(tracks)){
 if(!process.argv.includes('--force')){try{await stat(`public/audio/${name}.mp3`);continue;}catch{}}
 await mkdir(`test-output/audio-${name}`,{recursive:true});
 const tts=new MsEdgeTTS();try{await tts.setMetadata('zh-CN-XiaoxiaoNeural',OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);const {audioFilePath}=await tts.toFile(`test-output/audio-${name}`,text,{rate:.85});await copyFile(audioFilePath,`public/audio/${name}.mp3`);console.log(`${name}: ${(await stat(`public/audio/${name}.mp3`)).size} bytes`);}finally{tts.close();}
}
