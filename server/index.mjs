import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {requestStory,validateRequest} from '../shared/story.mjs';
const app=express();const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
app.disable('x-powered-by');app.use(express.json({limit:'4kb'}));
app.post('/api/story',async(req,res)=>{
 let input;try{input=validateRequest(req.body);}catch{return res.status(400).json({error:'请求内容无效'});}
 const config={key:process.env.AI_API_KEY||'',model:process.env.AI_MODEL||'',baseUrl:process.env.AI_BASE_URL||'https://api.openai.com/v1'};
 if(!config.key||!config.model)return res.status(503).json({error:'真实 API 尚未配置，请使用本地故事。',code:'NOT_CONFIGURED'});
 try{return res.json(await requestStory(input,config));}catch{return res.status(502).json({error:'真实故事暂时不可用，已保留本地故事。',code:'MODEL_UNAVAILABLE'});}
});
app.use('/api',(_req,res)=>res.status(404).json({error:'接口不存在'}));
app.use(express.static(path.join(root,'dist')));
app.use((error,_req,res,_next)=>res.status(error.status===413?413:400).json({error:'请求格式无效'}));
const port=Number(process.env.PORT||3019);app.listen(port,'127.0.0.1',()=>console.log('心音字灵服务：http://127.0.0.1:'+port));
