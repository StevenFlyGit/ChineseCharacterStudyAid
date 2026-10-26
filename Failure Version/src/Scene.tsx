import { useEffect, useState } from 'react';
import type { Game, Route } from './game';

export function ToolPicture({kind}:{kind:Route|'rain'|'tree'|'forest'}){
 if(kind==='forest')return <span className="tool-picture forest-picture" aria-hidden="true"><img src="/assets/tree-clay.webp" alt=""/><img src="/assets/tree-clay.webp" alt=""/></span>;
 return <img className="tool-picture" src={`/assets/${kind}-clay.webp`} alt="" aria-hidden="true"/>;
}

export default function Scene({game,busy,target,onTarget}:{game:Game;busy:boolean;target:string|null;onTarget:(target:string)=>void}){
 const [mobile,setMobile]=useState(()=>window.matchMedia('(max-width:600px)').matches);
 useEffect(()=>{for(const name of ['island-clay-wet','tree-clay','bridge-clay','boat-clay','bird-clay','garden-clay']){const image=new Image();image.src=`/assets/${name}.webp`;}},[]);
 useEffect(()=>{const media=window.matchMedia('(max-width:600px)');const listener=()=>setMobile(media.matches);media.addEventListener('change',listener);return()=>media.removeEventListener('change',listener);},[]);
 const forest=['rain','cross','garden','complete'].includes(game.stage);
 const tree=game.stage==='combine'||forest;
 const wet=['cross','garden','complete'].includes(game.stage);
 const home=['garden','complete'].includes(game.stage);
 const destinations:Record<string,{x:number;y:number;label:string}>={forest:{x:275,y:355,label:'让树林长出来'},sky:{x:580,y:245,label:'让这里下雨'},river:{x:625,y:mobile?440:365,label:'帮狐狸过河'},flowers:{x:375,y:mobile?453:365,label:'给花园浇水'}};
 const d=target?destinations[target]:null;
 return <div className={`scene stage-${game.stage} ${busy?'is-animating':''} ${wet?'is-wet':''} ${home?'is-home':''} ${game.stage==='complete'?'is-complete':''}`}>
 <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="world" role="img" aria-label={game.stage==='garden'?'小狐狸家的花园':`黏土浮空小岛，${wet?'河水已经恢复':'河床干涸'}，${forest?'树林已经恢复':'树木等待恢复'}`}>
 <image href="/assets/island-clay-dry.webp" width="1200" height="800"/>
 {wet&&<image className="river-grow" href="/assets/island-clay-wet.webp" width="1200" height="800"/>}
 {tree&&<g className="tree-grow" style={{transformOrigin:'225px 305px'}}><image href="/assets/tree-clay.webp" x="110" y="52" width="245" height="265"/></g>}
 {forest&&<g className="tree-grow" style={{transformOrigin:'360px 290px',animationDelay:'.15s'}}><image href="/assets/tree-clay.webp" x="277" y="128" width="172" height="180"/></g>}
 {forest&&<g className="tree-grow" style={{transformOrigin:'135px 360px',animationDelay:'.25s'}}><image href="/assets/tree-clay.webp" x="79" y="219" width="140" height="145"/></g>}
 {wet&&<g className="water-ripples" opacity=".45">{[0,1,2,3].map(i=><path className="water-line" key={i} d={`M${596+i*5} ${320+i*51}q19 8 43 0`} fill="none" stroke="#fff2d3" strokeWidth="2" style={{animationDelay:`${i*.3}s`}}/>)}</g>}
 {game.route==='bridge'&&<g className="bridge-appear"><image href="/assets/bridge-clay.webp" x="510" y="295" width="250" height="125" transform="translate(640 385) skewY(-20) translate(-640 -385)"/></g>}
 {game.route==='boat'&&<g className="boat-travel"><image href="/assets/boat-clay.webp" x="646" y="404" width="170" height="108"/></g>}
 {game.route==='bird'&&<g className="bird-travel"><image href="/assets/bird-clay.webp" x="718" y="233" width="200" height="177"/></g>}
 <g className={`fox-position ${home?'fox-home':''} ${game.route??''}`}><ellipse cx="312" cy="467" rx="44" ry="12" fill="#725634" opacity=".2"/><image href="/assets/fox.webp" x="245" y="333" width="145" height="150" className="fox-sprite"/></g>
 {(game.stage==='garden'||game.stage==='complete')&&<g className={`garden ${game.stage==='complete'?'flower-bloom':'flower-wilt'}`} style={{transformOrigin:'345px 450px'}}><image href="/assets/garden-clay.webp" x="260" y="333" width="180" height="150"/></g>}
 {wet&&<g className="rain-drops">{Array.from({length:15},(_,i)=><path key={i} d={`M${430+i*23} ${170+(i%4)*19}q-8 15 0 15t0-15`} fill="#94c4d2" style={{animationDelay:`${i*.09}s`}}/>)}</g>}
 </svg>
 {d&&!busy&&<button className={`scene-target target-${target}`} style={{left:`${d.x/12}%`,top:`${d.y/8}%`}} onClick={()=>onTarget(target!)} data-target={target} aria-label={d.label}><span>{target==='sky'?'☁':target==='forest'?'✦':target==='flowers'?'❀':'↓'}</span><small>{d.label}</small></button>}
 {busy&&<div className="magic-word" aria-live="polite">✦</div>}
 </div>;
}



