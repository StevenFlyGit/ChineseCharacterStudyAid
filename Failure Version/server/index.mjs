import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
import {validateRequest,requestIntent} from './intent.mjs';
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'8kb'}));
const configured=()=>Boolean(process.env.AI_BASE_URL&&process.env.AI_MODEL&&process.env.AI_API_KEY);
let lastSuccess=null;
app.get('/api/status',(_req,res)=>res.json({configured:configured(),lastSuccess,mode:configured()?'ready':'offline'}));
const limits=new Map();
setInterval(()=>limits.clear(),60000).unref();
app.post('/api/intent',async(req,res)=>{
  const ip=req.ip??'local';const count=(limits.get(ip)??0)+1;limits.set(ip,count);
  if(count>20)return res.status(429).json({error:'先休息一下，再试试吧。',offline:true});
  let input;try{input=validateRequest(req.body);}catch(e){return res.status(400).json({error:e.message});}
  if(!configured())return res.status(503).json({error:'AI 还没有连接，你仍然可以直接选字帮助小狐狸。',offline:true});
  try{const result=await requestIntent(input,{baseUrl:process.env.AI_BASE_URL,model:process.env.AI_MODEL,key:process.env.AI_API_KEY});lastSuccess=new Date().toISOString();res.json({...result,source:'ai'});}
  catch(e){console.warn('[intent] Request failed:',e.name);res.status(502).json({error:'小狐狸暂时没听清。你可以再试一次，或直接选一个字。',offline:true});}
});
app.use('/api',(_req,res)=>res.status(404).json({error:'接口不存在'}));
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(existsSync(path.join(root,'dist'))){app.use(express.static(path.join(root,'dist')));app.get('/{*path}',(_req,res)=>res.sendFile(path.join(root,'dist/index.html')));}
app.use((err,_req,res,_next)=>res.status(400).json({error:err.type==='entity.too.large'?'输入太长了。':'请求格式无效。'}));
app.listen(Number(process.env.PORT)||3018,process.env.HOST||'127.0.0.1',()=>console.log('字有引力 API: http://localhost:'+(process.env.PORT||3018)));
