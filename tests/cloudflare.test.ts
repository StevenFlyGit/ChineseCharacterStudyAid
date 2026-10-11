import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/story.js';
const input={lessonId:'ying-v1',contentVersion:1,theme:'陪伴',length:'short'};
const request=(body:unknown)=>new Request('https://example.invalid/api/story',{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}});
test('Cloudflare 接口未配置时返回明确 JSON，并允许前端回退',async()=>{const r=await onRequest({request:request(input),env:{}});assert.equal(r.status,503);assert.equal((await r.json()).code,'NOT_CONFIGURED');assert.equal(r.headers.get('Cache-Control'),'no-store');});
test('Cloudflare 拒绝错误方法、无效内容和超过 4KB 的请求',async()=>{assert.equal((await onRequest({request:new Request('https://example.invalid/api/story'),env:{}})).status,405);assert.equal((await onRequest({request:request({}),env:{}})).status,400);assert.equal((await onRequest({request:request({padding:'字'.repeat(1500)}),env:{}})).status,413);});
