import ying from 'hanzi-writer-data/赢.json';
import ying2 from 'hanzi-writer-data/营.json';
import ying3 from 'hanzi-writer-data/迎.json';
import mirror from 'hanzi-writer-data/镜.json';
import hide from 'hanzi-writer-data/藏.json';
import police from 'hanzi-writer-data/警.json';
import lesson from '../shared/lesson.json' with {type:'json'};
const data:Record<string,{strokes:string[]}>={'赢':ying,'营':ying2,'迎':ying3,'镜':mirror,'藏':hide,'警':police};
export const pieceBounds=['220 25 560 330','330 305 360 210','45 500 305 455','335 485 280 470','510 445 470 510'];
export function Glyph({char='赢',focus=-1,placed,outline=false,colored=false,celebrate=false}:{char?:string;focus?:number;placed?:string[];outline?:boolean;colored?:boolean;celebrate?:boolean}){
 return <svg className={'glyph '+(celebrate?'celebrate':'')} viewBox="0 0 1024 1024" role="img" aria-label={char+'字字形'}><g transform="translate(0 900) scale(1 -1)">{char==='赢'?lesson.components.map((part,i)=><g key={part.id} className="glyph-group" style={{fill:colored?part.color:'currentColor',opacity:placed?(placed.includes(part.id)?1:.13):focus>=0?(focus===i?1:.2):outline?.16:1}}>{ying.strokes.slice(part.start,part.end).map((d,n)=><path d={d} key={n}/>)}</g>):data[char].strokes.map((d,i)=><path key={i} d={d} fill="currentColor"/>)}</g></svg>;
}
export function Piece({index}:{index:number}){
 const part=lesson.components[index];
 return <svg viewBox={pieceBounds[index]} aria-hidden="true" className="piece"><g transform="translate(0 900) scale(1 -1)" fill="currentColor">{ying.strokes.slice(part.start,part.end).map((d,i)=><path key={i} d={d}/>)}</g></svg>;
}
export function Sketch({index,small=false}:{index:number;small?:boolean}){
 const color=lesson.components[index].color;
 const drawings=[
 <g key="hat"><path d="M53 109 67 61Q100 40 133 61L148 109" fill="#f2dfb7"/><path d="M38 112Q100 128 162 112L155 104Q100 115 45 104Z" fill="#d3bc8b"/><path d="M63 80Q100 94 139 80" fill="none"/><path d="m148 54 5-9m10 24 11-2" strokeWidth="2"/></g>,
 <g key="call"><path d="M40 90Q40 54 93 53Q149 51 149 89Q150 125 104 126L75 145 79 123Q40 118 40 90Z" fill="#f5ddd0"/><path d="M75 88Q95 106 114 87" fill="none"/><path d="m162 68 11-8m-9 27h14m-17 16 11 8" fill="none"/></g>,
 <g key="moon"><path d="M126 41Q101 94 151 116Q98 156 59 114Q24 69 79 41Q101 32 126 41Z" fill="#f2e2a7"/><path d="m150 41 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#e1c772" strokeWidth="2"/><path d="M111 143h44m-26 9h37" fill="none" strokeWidth="2"/></g>,
 <g key="shell"><path d="M44 105Q27 69 54 58Q50 29 78 38Q100 15 120 39Q149 32 146 60Q177 77 153 108L110 141H90Z" fill="#dce9e7"/><path d="m55 71 41 63m-15-85 18 86m24-85-18 86m43-63-39 63" fill="none" strokeWidth="2"/><path d="M86 137h28" fill="none"/></g>,
 <g key="person"><path d="M63 148h101" fill="none" strokeWidth="2"/><circle cx="90" cy="54" r="17" fill="#eee0ed"/><path d="M89 73 85 106l-27 27m28-27 34 33M87 86l-24 13m26-12 23 9" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="m132 71 15 3-6-13m-8 12 21-19" fill="none" strokeWidth="2"/></g>
 ];
 return <svg className={'sketch '+(small?'small':'')} viewBox="0 0 200 180" aria-hidden="true" style={{color}}><g stroke={color} strokeWidth="3" strokeLinejoin="round">{drawings[index]}</g></svg>;
}
