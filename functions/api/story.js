import {requestStory,validateRequest} from '../../shared/story.mjs';
const json=(body,status=200,headers={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});

async function readInput(request){
 const reader=request.body?.getReader();
 if(!reader)throw new Error('EMPTY_BODY');
 const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw new Error('TOO_LARGE');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 return validateRequest(JSON.parse(new TextDecoder().decode(bytes)));
}

export async function onRequest({request,env}){
 if(request.method!=='POST')return json({error:'请使用 POST 请求'},405,{Allow:'POST'});
 let input;try{input=await readInput(request);}catch(error){return json({error:'请求内容无效'},error.message==='TOO_LARGE'?413:400);}
 const config={key:env.AI_API_KEY||'',model:env.AI_MODEL||'',baseUrl:env.AI_BASE_URL||'https://api.openai.com/v1'};
 if(!config.key||!config.model)return json({error:'真实 API 尚未配置，请使用本地故事。',code:'NOT_CONFIGURED'},503);
 try{return json(await requestStory(input,config));}catch{return json({error:'真实故事暂时不可用，已保留本地故事。',code:'MODEL_UNAVAILABLE'},502);}
}
