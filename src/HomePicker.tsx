import {useRef,useState} from 'react';
import type {FormEvent} from 'react';
import {ArrowRight,BookOpen,Sparkles} from 'lucide-react';
import {Glyph} from './Glyph';

export const RECENT_KEY='mindglyph:recent:v1';
const recommendations=[{char:'镜',hint:'镜子',ready:true},{char:'藏',hint:'捉迷藏',ready:true},{char:'警',hint:'警察',ready:true},{char:'赢',hint:'五个小部分',ready:true}];

export function readRecent():string[]{
 try{const value:unknown=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]');return Array.isArray(value)?[...new Set(value.filter((c):c is string=>['赢','镜','藏','警'].includes(c)))].slice(0,6):[];}catch{return [];}
}

export default function HomePicker({recent,onLearn,disabled}:{recent:string[];onLearn:(char:string)=>void;disabled:boolean}){
 const [input,setInput]=useState(''),[notice,setNotice]=useState('');
 const composing=useRef(false);
 function learn(raw:string){
  const char=raw.trim();
  if(Array.from(char).length!==1||!/\p{Script=Han}/u.test(char)){setNotice('请输入一个汉字，我们一次认识一个。');return;}
  if(!['赢','镜','藏','警'].includes(char)){setNotice('“'+char+'”的学习内容还在准备中，先试试“赢”吧。');return;}
  setNotice('');onLearn(char);
 }
 function submit(event:FormEvent){event.preventDefault();if(!composing.current)learn(input);}
 function choose(char:string){setInput(char);learn(char);}
 return <div className="home-picker">
  <form className="character-form" onSubmit={submit}>
   <label className="sr-only" htmlFor="character-input">输入一个汉字</label>
   <div className="character-input-row">
    <input id="character-input" placeholder="输入一个汉字" value={input} disabled={disabled} autoComplete="off" autoCapitalize="off" spellCheck={false} enterKeyHint="go" aria-describedby="character-input-note" onChange={e=>{setInput(e.target.value);setNotice('');}} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={()=>{composing.current=false;}} onKeyDown={e=>{if(e.key==='Enter'&&(e.nativeEvent.isComposing||composing.current))e.preventDefault();}}/>
    <button className="primary-button" type="submit" disabled={disabled}>帮我认识<ArrowRight size={18}/></button>
   </div>
   <p id="character-input-note" className={'character-input-note '+(notice?'has-notice':'')} role={notice?'status':undefined}>{notice||'还不会输入？请爸爸妈妈帮忙，或点下面的字。'}</p>
  </form>
  <section className="home-section" aria-labelledby="recommended-title">
   <div className="home-section-heading"><h2 id="recommended-title">先试试这些字</h2><Sparkles size={17}/></div>
   <div className="home-characters">{recommendations.map(item=><button type="button" key={item.char} aria-label={'认识'+item.char} disabled={disabled} className={'character-choice '+(item.ready?'ready':'')+(input.trim()===item.char?' selected':'')} onClick={()=>choose(item.char)}><Glyph char={item.char}/><span className="character-hint">{item.hint}</span><small>{item.ready?'可以开始':'准备中'}</small></button>)}</div>
  </section>
  <section className="home-section recent-section" aria-labelledby="recent-title">
   <div className="home-section-heading"><h2 id="recent-title">最近认识的字</h2><BookOpen size={17}/></div>
   {recent.length?<><div className="recent-characters">{recent.map(char=><button type="button" key={char} aria-label={'再认识'+char} disabled={disabled} onClick={()=>choose(char)}><Glyph char={char}/><ArrowRight size={14}/></button>)}</div><p className="recent-note">再看一遍，让它慢慢变熟悉。</p></>:<div className="recent-empty"><p>你认识过的字，会留在这里。</p><span>选一个字，开始今天的小发现。</span></div>}
  </section>
 </div>;
}
