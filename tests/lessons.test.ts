import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {lessons,storyFor} from '../shared/lessons.mjs';
import {fresh,reducer,restore} from '../src/game';
import {validateRequest,validateStory} from '../shared/story.mjs';
const require=createRequire(import.meta.url);
for(const lesson of lessons){
 test(lesson.char+'：真实笔画无遗漏、课程完整且答案独立',()=>{
 const glyph=require('hanzi-writer-data/'+lesson.char+'.json');
 assert.deepEqual(lesson.components.flatMap(p=>p.strokeIndices).sort((a,b)=>a-b),Array.from({length:glyph.strokes.length},(_,i)=>i));
 assert.equal(lesson.choices.length,9);assert.equal(new Set(lesson.choices).size,9);assert.equal(lesson.defaultChoices.length,9);
 assert.ok(lesson.defaultChoices.includes(lesson.char));assert.equal(validateStory(storyFor(lesson),'api',lesson.id).lines.length,lesson.components.length);
 assert.equal(validateRequest({lessonId:lesson.id,contentVersion:1,theme:'陪伴',length:'short'}).lessonId,lesson.id);
 let s=reducer(fresh(),{type:'START',lessonId:lesson.id});
 assert.equal(s.stage,'focus');s=reducer(s,{type:'NEXT'});for(const p of lesson.components)s=reducer(s,{type:'NEXT'});
 assert.equal(s.stage,'assemble');for(const p of lesson.components){s=reducer(s,{type:'SELECT',id:p.id});s=reducer(s,{type:'PLACE',id:p.id});}
 assert.equal(s.stage,'reunite');s=restore(JSON.stringify(s));assert.equal(s.lessonId,lesson.id);assert.equal(s.stage,'recognize');
 s=reducer(s,{type:'ANSWER',char:lesson.choices.find(c=>c!==lesson.char)!});assert.equal(s.stage,'recognize');
 s=reducer(s,{type:'ANSWER',char:lesson.char});assert.equal(s.stage,'result');assert.equal(s.firstRecognitionCorrect,false);
 });
}
test('旧赢字存档兼容；切课不会遗留已拼字块或成绩',()=>{
 const legacy={...fresh(),lessonId:undefined};assert.equal(restore(JSON.stringify(legacy)).lessonId,'ying-v1');
 let s={...fresh(),placed:['wang'],recognitionAttempts:3};s=reducer(s,{type:'START',lessonId:'cang-v1'});assert.deepEqual(s.placed,[]);assert.equal(s.recognitionAttempts,0);
 assert.deepEqual(restore(JSON.stringify({...fresh(),lessonId:'unknown'})),fresh());
});
