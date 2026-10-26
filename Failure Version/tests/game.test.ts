import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialGame,transition,parseSaved} from '../src/game.ts';
// @ts-ignore JavaScript boundary is tested independently.
import {validateRequest,validateResponse,requestIntent} from '../server/intent.mjs';
test('all three routes complete the learning loop and require correct targets',()=>{
 for(const char of ['桥','船','鸟'] as const){let g=transition({...initialGame},{type:'START'});assert.equal(transition(g,{type:'USE',char:'雨',target:'sky'}),g);g=transition(g,{type:'WRITTEN',char:'木'});g=transition(g,{type:'WRITTEN',char:'林'});g=transition(g,{type:'USE',char:'林',target:'forest'});assert.equal(transition(g,{type:'USE',char:'雨',target:'river'}),g);g=transition(g,{type:'WRITTEN',char:'雨'});g=transition(g,{type:'USE',char:'雨',target:'sky'});g=transition(g,{type:'WRITTEN',char});g=transition(g,{type:'USE',char,target:'river'});assert.equal(g.stage,'garden');assert.equal(transition(g,{type:'USE',char,target:'river'}),g);g=transition(g,{type:'USE',char:'雨',target:'flowers'});assert.equal(g.stage,'complete');assert.deepEqual(g.used,['木','林','雨',char]);}
});
test('save parser rejects malformed state and preserves valid progress',()=>{assert.equal(parseSaved('{').stage,'welcome');assert.equal(parseSaved('{"version":1,"stage":"evil"}').stage,'welcome');const g=transition(initialGame,{type:'START'});assert.deepEqual(parseSaved(JSON.stringify(g)),g);});
test('unwritten characters cannot be used and writing is idempotent',()=>{
 let g=transition(initialGame,{type:'START'});g=transition(g,{type:'WRITTEN',char:'木'});
 assert.equal(transition(g,{type:'USE',char:'林',target:'forest'}),g);
 for(const char of ['林','雨','桥','船','鸟'] as const)g=transition(g,{type:'WRITTEN',char});
 assert.equal(g.written.length,6);assert.deepEqual(transition(g,{type:'WRITTEN',char:'木'}),g);
 assert.equal(g.stage,'combine');
});
test('legacy saves preserve adventure without marking unwritten characters learned',()=>{
 const legacy={...initialGame,stage:'cross',used:['木','林','雨'],written:undefined};
 assert.deepEqual(parseSaved(JSON.stringify(legacy)).written,[]);
 assert.equal(parseSaved(JSON.stringify({...initialGame,written:['火']})).stage,'welcome');
});
test('AI output cannot supply arbitrary actions or change character mapping',()=>{assert.throws(()=>validateResponse({reply:'执行',action:'run_code'}));assert.equal(validateResponse({reply:'坐小船吧！',action:'use_boat',character:'火'}).character,'船');assert.throws(()=>validateRequest({input:'船',stage:'trace'}));assert.equal(validateRequest({input:'船',stage:'cross',learned:['木','火']}).learned.length,1);});
test('compatible provider contract parses fenced JSON and rejects failures',async()=>{let body;const mock=async(_url,opts)=>{body=JSON.parse(opts.body);return {ok:true,json:async()=>({choices:[{message:{content:'```json\n{"reply":"找大鸟帮忙吧！","action":"call_bird"}\n```'}}]})};};const r=await requestIntent(validateRequest({input:'飞过去',stage:'cross'}),{baseUrl:'https://test.invalid/v1',model:'test',key:'test'},mock);assert.equal(r.character,'鸟');assert.equal(body.messages.length,2);await assert.rejects(requestIntent({}, {baseUrl:'https://test.invalid',model:'test',key:'test'},async()=>({ok:false})));});

