export type Stage = 'welcome'|'trace'|'combine'|'rain'|'cross'|'garden'|'complete';
export type Hanzi = '木'|'林'|'雨'|'桥'|'船'|'鸟';
export type Route = 'bridge'|'boat'|'bird';
export type Action = 'build_bridge'|'use_boat'|'call_bird'|'clarify'|'unsupported';
export type Game = {version:1;stage:Stage;used:Hanzi[];written:Hanzi[];route:Route|null;sound:boolean;attempts:number};
export const initialGame:Game = {version:1,stage:'welcome',used:[],written:[],route:null,sound:true,attempts:0};
export const stages:Stage[]=['welcome','trace','combine','rain','cross','garden','complete'];
export const dictionary:Record<Hanzi,{pinyin:string;meaning:string;example:string}>={
  木:{pinyin:'mù',meaning:'树木。',example:'一棵树，给小狐狸乘凉。'},
  林:{pinyin:'lín',meaning:'成片的树木。',example:'两棵木，变成一片林。'},
  雨:{pinyin:'yǔ',meaning:'从云里落下的水滴。',example:'雨落下来，花草喝到水。'},
  桥:{pinyin:'qiáo',meaning:'架在河上、供人通过的建筑。',example:'走过小桥，就能到对岸。'},
  船:{pinyin:'chuán',meaning:'在水上航行的交通工具。',example:'坐上小船，慢慢划过河。'},
  鸟:{pinyin:'niǎo',meaning:'长着羽毛的动物，多数会飞。',example:'故事里的大鸟带狐狸飞过河。'}
};
export const actionCharacters:Partial<Record<Action,Hanzi>>={build_bridge:'桥',use_boat:'船',call_bird:'鸟'};
export const prompts:Record<Stage,string>={welcome:'我的小岛需要一点魔法。你愿意帮帮我吗？',trace:'从圆点开始，跟着笔画写一个“木”吧。',combine:'一棵树有点孤单。把两个“木”放在一起，会发生什么？',rain:'树林回来了！可是河里还没有水，让天空下点雨吧。',cross:'家就在对岸。你想用什么办法帮我过河？',garden:'花园有点渴。你还记得哪个字能带来水吗？',complete:'谢谢你！每一个学会的字，都让我的世界变得更美。'};
export type Event={type:'START'}|{type:'WRITTEN';char:Hanzi}|{type:'USE';char:Hanzi;target:string}|{type:'ATTEMPT'}|{type:'SOUND'};
export function transition(game:Game,event:Event):Game {
  if(event.type==='SOUND')return {...game,sound:!game.sound};
  if(event.type==='ATTEMPT')return {...game,attempts:game.attempts+1};
  if(event.type==='START'&&game.stage==='welcome')return {...game,stage:'trace'};
  if(event.type==='WRITTEN'){const written=[...new Set([...game.written,event.char])];return game.stage==='trace'&&event.char==='木'?{...game,stage:'combine',used:[...new Set([...game.used,'木' as Hanzi])],written}:{...game,written};}
  if(event.type!=='USE')return game;
  const {char,target}=event;
  if(!game.written.includes(char))return game;
  const add=(stage:Stage,route=game.route):Game=>({...game,stage,route,used:[...new Set([...game.used,char])]});
  if(game.stage==='combine'&&char==='林'&&target==='forest')return add('rain');
  if(game.stage==='rain'&&char==='雨'&&target==='sky')return add('cross');
  if(game.stage==='cross'&&target==='river'&&['桥','船','鸟'].includes(char))return add('garden',char==='桥'?'bridge':char==='船'?'boat':'bird');
  if(game.stage==='garden'&&char==='雨'&&target==='flowers')return add('complete');
  return game;
}
export function parseSaved(value:string|null):Game {
  try{const g=JSON.parse(value??'null');const validChar=(c:unknown)=>typeof c==='string'&&Object.hasOwn(dictionary,c);if(g?.version!==1||!stages.includes(g.stage)||!Array.isArray(g.used)||!g.used.every(validChar)||![null,'bridge','boat','bird'].includes(g.route)||typeof g.sound!=='boolean'||!Number.isInteger(g.attempts)||g.attempts<0||g.written!==undefined&&(!Array.isArray(g.written)||!g.written.every(validChar)))return {...initialGame};return {version:1,stage:g.stage,used:[...new Set(g.used)] as Hanzi[],written:[...new Set(g.written??[])] as Hanzi[],route:g.route,sound:g.sound,attempts:g.attempts};}catch{return {...initialGame};}
}

