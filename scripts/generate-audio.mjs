import {MsEdgeTTS,OUTPUT_FORMAT} from 'msedge-tts';
import {mkdir,writeFile} from 'node:fs/promises';
import lesson from '../shared/lesson.json' with {type:'json'};
const tracks={intro:lesson.intro,assemble:'选一块，再点它的位置。',reunite:'五个部分，组成了赢。赢，在比赛中获胜。',recognize:'找一找，哪个是刚才的字？',result:lesson.outro,'help-recognize':'这是刚才的赢。看一看，再来试试。'};
for(const c of lesson.components){tracks['focus-'+c.id]=c.char+'。在'+c.position+'。';tracks['story-'+c.id]=c.line;}
await mkdir('src/audio',{recursive:true});
for(const [name,text] of Object.entries(tracks)){
 const tts=new MsEdgeTTS();let timeout;
 try{
 await tts.setMetadata('zh-CN-XiaoxiaoNeural',OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
 const {audioStream}=tts.toStream(text,{rate:.85});
 const chunks=[];
 await Promise.race([new Promise((resolve,reject)=>{audioStream.on('data',chunk=>chunks.push(chunk));audioStream.on('end',resolve);audioStream.on('error',reject);}),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('音频生成超时')),15000);})]);
 const data=Buffer.concat(chunks);if(data.length<400)throw new Error('音频为空');await writeFile('src/audio/'+name+'.mp3',data);console.log(name+': '+data.length+' bytes');
 }finally{clearTimeout(timeout);tts.close();}
}
