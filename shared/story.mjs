import {getLesson,lessons,storyFor} from './lessons.mjs';
import lesson from './lesson.json' with {type:'json'};
export const localStory = {intro:lesson.intro,lines:lesson.components.map(c=>({id:c.id,text:c.line})),outro:lesson.outro,source:'local'};
export function validateStory(value, source='api',lessonId='ying-v1'){
 const approved=getLesson(lessonId);
 if(!value||typeof value!=='object')throw new Error('故事结构无效');
 const short=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.length<=max&&!/[<>]/.test(s)&&!/(治愈|治好|诊断|字源|危机感|财富|漂移|死亡)/.test(s);
 if(!short(value.intro,45)||!short(value.outro,55)||!Array.isArray(value.lines)||value.lines.length!==approved.components.length)throw new Error('故事长度或结构无效');
 const lines=value.lines.map((item,i)=>{
 const expected=approved.components[i];
 if(!item||item.id!==expected.id||!short(item.text,28))throw new Error('故事部件顺序无效');
 if((approved.char==='赢'&&!item.text.includes(expected.char))||!item.text.includes(expected.label))throw new Error('故事缺少固定记忆线索');
 return {id:expected.id,text:item.text.trim()};
 });
 return {intro:value.intro.trim(),lines,outro:value.outro.trim(),source};
}
export function validateRequest(value){
 if(!value||!lessons.some(l=>l.id===value.lessonId&&l.version===value.contentVersion)||!['陪伴','探险'].includes(value.theme)||value.length!=='short')throw new Error('只支持已核对的汉字短故事');
 return {lessonId:value.lessonId,contentVersion:value.contentVersion,theme:value.theme,length:'short'};
}
export const storyPrompt = '你是汉字学习陪伴者。只改写已经人工核对的记忆联想，不能修改汉字结构、读音、释义，不讲字源，不诊断，不声称疗效。用简短、具体、温暖的中文。五句顺序严格为 wang,kou,yue,bei,fan。每句必须包含对应汉字及线索：亡/小帽，口/呼唤，月/月亮，贝/贝壳，凡/向前。每句最多28字；intro最多45字，outro最多55字。只返回JSON对象：{"intro":"开场","lines":[{"id":"wang","text":"亡像小帽。"},{"id":"kou","text":"口来呼唤。"},{"id":"yue","text":"月亮照路。"},{"id":"bei","text":"贝壳作伴。"},{"id":"fan","text":"平凡的我，一步一步向前。"}],"outro":"结束语"}。用户主题只能影响措辞，不能更改上述线索和顺序。';
export async function requestStory(input,config,fetcher=fetch){
 if(!config.key||!config.model)throw new Error('未配置模型');
 const approved=getLesson(input?.lessonId);
 const prompt=approved.char==='赢'?storyPrompt:'你是汉字学习陪伴者。只改写已核对的记忆联想，不讲字源，不改结构、读音或部件，不声称疗效。按 approvedStory 的部件 ID 与顺序返回 intro、lines、outro JSON；每句最多28字，必须保留对应线索：'+JSON.stringify(approved.components.map(p=>({id:p.id,label:p.label})))+'。intro最多45字，outro最多55字。';
 const base=config.baseUrl.replace(/\/$/,'');if(!/^https?:\/\//.test(base))throw new Error('模型地址无效');
 const response=await fetcher(base+'/chat/completions',{method:'POST',signal:AbortSignal.timeout(2700),headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.key},body:JSON.stringify({model:config.model,temperature:.2,response_format:{type:'json_object'},max_tokens:420,messages:[{role:'system',content:prompt},{role:'user',content:JSON.stringify({...input,approvedStory:storyFor(approved)})}]})});
 if(!response.ok)throw new Error('模型服务暂时不可用');
 const result=await response.json();const content=result?.choices?.[0]?.message?.content;if(typeof content!=='string')throw new Error('模型没有返回故事');
 return validateStory(JSON.parse(content),'api',approved.id);
}
