import { useEffect, useId, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { ArrowLeft, Play, RotateCcw, Volume2 } from 'lucide-react';
import { dictionary } from './game';
import type { Hanzi } from './game';
import { characterData,HanziGlyph,strokeNames,writingTitles } from './characters';
import { createWriterTarget } from './writerTarget';
type Props={char:Hanzi;onComplete:()=>void;onClose:()=>void;onAttempt:()=>void;onSpeak:(text:string,track?:string)=>void};
export default function Trace({char,onComplete,onClose,onAttempt,onSpeak}:Props){
 const host=useRef<HTMLDivElement>(null);const writer=useRef<HanziWriter|null>(null);const callbacks=useRef({onAttempt,onSpeak});callbacks.current={onAttempt,onSpeak};
 const [mode,setMode]=useState<'demo'|'practice'|'done'>('demo');const [index,setIndex]=useState(0);const [message,setMessage]=useState('先看一遍笔顺，再跟着写。');const [session,setSession]=useState(0);const [demo,setDemo]=useState(true);const [size,setSize]=useState(280);const arrowId=useId().replace(/:/g,'');const data=characterData[char];const word=dictionary[char];
 useEffect(()=>{
  const element=host.current!;let alive=true;const managed=createWriterTarget(element);const width=element.clientWidth;setSize(width);
  const w=HanziWriter.create(element,char,{width,height:width,padding:22,showCharacter:false,showOutline:true,outlineColor:'#d8d0bd',strokeColor:'#67844b',highlightColor:'#92a86b',drawingColor:'#c87843',drawingWidth:7,strokeAnimationSpeed:1.6,delayBetweenStrokes:220,strokeFadeDuration:160,drawingFadeDuration:180,charDataLoader:()=>data,rendererOverride:{createRenderTarget:()=>managed.target}});
  writer.current=w;setMode('demo');setIndex(0);setMessage('先看一遍笔顺，再跟着写。');
  function practise(){if(!alive)return;setMode('practice');setIndex(0);setMessage(`第 1 笔：${strokeNames[char][0]}，从橙色圆点开始。`);void w.quiz({leniency:1.3,acceptBackwardsStrokes:false,showHintAfterMisses:1,markStrokeCorrectAfterMisses:false,highlightOnComplete:false,onMistake:()=>{if(!alive)return;setMessage('慢慢来，沿着提示的方向再写一次。');callbacks.current.onAttempt();},onCorrectStroke:s=>{if(!alive)return;const next=s.strokeNum+1;setIndex(next);if(next<data.strokes.length)setMessage(`第 ${next+1} 笔：${strokeNames[char][next]}，从橙色圆点开始。`);},onComplete:()=>{if(!alive)return;setMode('done');setMessage(`你写出了“${char}”！带着字卡回到小岛吧。`);callbacks.current.onSpeak(`${char}。${word.meaning}`,`char-${char}`);}});}
  if(demo)void w.animateCharacter().then(practise);else practise();
  const observer=new ResizeObserver(()=>{const next=element.clientWidth;if(next>0){setSize(next);w.updateDimensions({width:next,height:next,padding:22});}});observer.observe(element);
  return()=>{alive=false;observer.disconnect();w.cancelQuiz();w.pauseAnimation();managed.dispose();if(writer.current===w)writer.current=null;};
 },[char,session,data,word.meaning,demo]);
 const scale=HanziWriter.getScalingTransform(size,size,22);const median=data.medians[Math.min(index,data.medians.length-1)];const guide=median.map(([x,y])=>[scale.x+x*scale.scale,size-scale.y-y*scale.scale]);
 return <div className="trace-content"><div className="modal-title"><button className="icon-button" aria-label="返回小岛" onClick={onClose}><ArrowLeft size={22}/></button><div><span className="eyebrow">汉字小魔法 · {data.strokes.length} 笔</span><h2>{writingTitles[char]}</h2></div></div>
 <div className="trace-layout"><div className="trace-left"><div className={`trace-pad writer-pad ${mode==='demo'?'is-demo':''}`} data-testid="trace-pad" data-character={char} data-mode={mode} data-stroke={index} role="img" aria-label={`${char}字楷体描摹区，共${data.strokes.length}笔`}>
 <svg className="writing-grid" viewBox="0 0 300 300" aria-hidden="true"><path d="M150 8V292M8 150H292M15 15L285 285M285 15L15 285" stroke="#d7c39e" strokeDasharray="5 5" fill="none"/></svg><div ref={host} className="writer-host"/>
 {mode==='practice'&&index<data.strokes.length&&<svg className="writing-guide" viewBox={`0 0 ${size} ${size}`} aria-hidden="true"><defs><marker id={arrowId} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L4 2.5L0 5" fill="none" stroke="#fff3c9" strokeWidth="1.5"/></marker></defs><path d={data.strokes[index]} transform={scale.transform} fill="#87a15d" opacity=".48"/><polyline points={guide.map(p=>p.join(',')).join(' ')} fill="none" stroke="#fff2c4" strokeWidth="2" markerEnd={`url(#${arrowId})`}/><circle cx={guide[0][0]} cy={guide[0][1]} r="7" fill="#ec914b" stroke="#ffe4a9" strokeWidth="2"/></svg>}
 </div><div className="stroke-progress"><span>{mode==='demo'?'笔顺演示':mode==='done'?'书写完成':`第 ${index+1} / ${data.strokes.length} 笔`}</span><div className="stroke-dots">{data.strokes.map((_,i)=><span className={mode==='done'||i<index?'finished':i===index&&mode==='practice'?'active':''} key={i}/>)}</div></div><p className="trace-instruction" aria-live="polite">{message}</p></div>
 <div className="trace-friend"><img src="/assets/fox.webp" alt="陪你写字的小狐狸"/><div className="speech-bubble">每一笔，<br/>都有小魔法！</div><div className="knowledge"><strong><HanziGlyph char={char}/><small>{word.pinyin}</small><button className="text-icon" aria-label={`听${char}的读音`} onClick={()=>onSpeak(`${char}。${word.meaning}`,`char-${char}`)}><Volume2 size={17}/></button></strong><span>{word.meaning}{word.example}</span></div></div></div>
 <div className="trace-actions"><button className="secondary-button" onClick={()=>{setDemo(true);setSession(s=>s+1);}}><Play size={17}/>再看笔顺</button><button className="secondary-button" disabled={mode==='demo'} onClick={()=>{setDemo(false);setSession(s=>s+1);}}><RotateCcw size={17}/>重新写</button>{mode==='done'&&<button className="primary-button" onClick={onComplete}>获得“{char}”字卡 ✦</button>}</div>
 </div>;
}

