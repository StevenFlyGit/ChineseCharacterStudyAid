import {useLesson} from './LessonContext';
import glyph0 from 'hanzi-writer-data/赢.json';
import glyph1 from 'hanzi-writer-data/营.json';
import glyph2 from 'hanzi-writer-data/迎.json';
import glyph3 from 'hanzi-writer-data/盈.json';
import glyph4 from 'hanzi-writer-data/影.json';
import glyph5 from 'hanzi-writer-data/竟.json';
import glyph6 from 'hanzi-writer-data/竞.json';
import glyph7 from 'hanzi-writer-data/嬴.json';
import glyph8 from 'hanzi-writer-data/羸.json';
import glyph9 from 'hanzi-writer-data/镜.json';
import glyph10 from 'hanzi-writer-data/境.json';
import glyph11 from 'hanzi-writer-data/锐.json';
import glyph12 from 'hanzi-writer-data/锦.json';
import glyph13 from 'hanzi-writer-data/景.json';
import glyph14 from 'hanzi-writer-data/静.json';
import glyph15 from 'hanzi-writer-data/惊.json';
import glyph16 from 'hanzi-writer-data/藏.json';
import glyph17 from 'hanzi-writer-data/葬.json';
import glyph18 from 'hanzi-writer-data/茂.json';
import glyph19 from 'hanzi-writer-data/蔽.json';
import glyph20 from 'hanzi-writer-data/苍.json';
import glyph21 from 'hanzi-writer-data/仓.json';
import glyph22 from 'hanzi-writer-data/舱.json';
import glyph23 from 'hanzi-writer-data/脏.json';
import glyph24 from 'hanzi-writer-data/臧.json';
import glyph25 from 'hanzi-writer-data/警.json';
import glyph26 from 'hanzi-writer-data/敬.json';
import glyph27 from 'hanzi-writer-data/誓.json';
import glyph28 from 'hanzi-writer-data/誉.json';
import glyph29 from 'hanzi-writer-data/井.json';
import glyph30 from 'hanzi-writer-data/擎.json';
const files:Record<string,{strokes:string[];medians:number[][][]}>= {'赢':glyph0,'营':glyph1,'迎':glyph2,'盈':glyph3,'影':glyph4,'竟':glyph5,'竞':glyph6,'嬴':glyph7,'羸':glyph8,'镜':glyph9,'境':glyph10,'锐':glyph11,'锦':glyph12,'景':glyph13,'静':glyph14,'惊':glyph15,'藏':glyph16,'葬':glyph17,'茂':glyph18,'蔽':glyph19,'苍':glyph20,'仓':glyph21,'舱':glyph22,'脏':glyph23,'臧':glyph24,'警':glyph25,'敬':glyph26,'誓':glyph27,'誉':glyph28,'井':glyph29,'擎':glyph30};
export const glyphData=(char:string)=>files[char];
const data=glyphData;
export const pieceBounds=['220 25 560 330','330 305 360 210','45 500 305 455','335 485 280 470','510 445 470 510'];
export function Glyph({char:providedChar,focus=-1,placed,outline=false,colored=false,celebrate=false}:{char?:string;focus?:number;placed?:string[];outline?:boolean;colored?:boolean;celebrate?:boolean}){
 const lesson=useLesson(),char=providedChar||lesson.char;
 return <svg className={'glyph '+(celebrate?'celebrate':'')} viewBox="0 0 1024 1024" role="img" aria-label={char+'字字形'}><g transform="translate(0 900) scale(1 -1)">{char===lesson.char?lesson.components.map((part,i)=><g key={part.id} className="glyph-group" style={{fill:colored?part.color:'currentColor',opacity:placed?(placed.includes(part.id)?1:.13):focus>=0?(focus===i?1:.2):outline?.16:1}}>{part.strokeIndices.map(n=>data(lesson.char).strokes[n]).map((d,n)=><path d={d} key={n}/>)}</g>):data(char).strokes.map((d,i)=><path key={i} d={d} fill="currentColor"/>)}</g></svg>;
}
export function Piece({index}:{index:number}){
 const lesson=useLesson(),part=lesson.components[index];
 const points=part.strokeIndices.flatMap(i=>data(lesson.char).medians[i]);
 const xs=points.map(p=>p[0]),ys=points.map(p=>900-p[1]);
 const bounds=lesson.char==='赢'?pieceBounds[index]:`${Math.min(...xs)-75} ${Math.min(...ys)-75} ${Math.max(...xs)-Math.min(...xs)+150} ${Math.max(...ys)-Math.min(...ys)+150}`;
 return <svg viewBox={bounds} aria-hidden="true" className="piece"><g transform="translate(0 900) scale(1 -1)" fill="currentColor">{part.strokeIndices.map(n=>data(lesson.char).strokes[n]).map((d,i)=><path key={i} d={d}/>)}</g></svg>;
}
export function Sketch({index,small=false}:{index:number;small?:boolean}){
 const lesson=useLesson(),color=lesson.components[index].color;
 const drawings=[
 <g key="hat"><path d="M53 109 67 61Q100 40 133 61L148 109" fill="#f2dfb7"/><path d="M38 112Q100 128 162 112L155 104Q100 115 45 104Z" fill="#d3bc8b"/><path d="M63 80Q100 94 139 80" fill="none"/><path d="m148 54 5-9m10 24 11-2" strokeWidth="2"/></g>,
 <g key="call"><path d="M40 90Q40 54 93 53Q149 51 149 89Q150 125 104 126L75 145 79 123Q40 118 40 90Z" fill="#f5ddd0"/><path d="M75 88Q95 106 114 87" fill="none"/><path d="m162 68 11-8m-9 27h14m-17 16 11 8" fill="none"/></g>,
 <g key="moon"><path d="M126 41Q101 94 151 116Q98 156 59 114Q24 69 79 41Q101 32 126 41Z" fill="#f2e2a7"/><path d="m150 41 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#e1c772" strokeWidth="2"/><path d="M111 143h44m-26 9h37" fill="none" strokeWidth="2"/></g>,
 <g key="shell"><path d="M44 105Q27 69 54 58Q50 29 78 38Q100 15 120 39Q149 32 146 60Q177 77 153 108L110 141H90Z" fill="#dce9e7"/><path d="m55 71 41 63m-15-85 18 86m24-85-18 86m43-63-39 63" fill="none" strokeWidth="2"/><path d="M86 137h28" fill="none"/></g>,
 <g key="person"><path d="M63 148h101" fill="none" strokeWidth="2"/><circle cx="90" cy="54" r="17" fill="#eee0ed"/><path d="M89 73 85 106l-27 27m28-27 34 33M87 86l-24 13m26-12 23 9" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="m132 71 15 3-6-13m-8 12 21-19" fill="none" strokeWidth="2"/></g>
 ];

 const scene=lesson.char==='镜'?[
 <g><ellipse cx="100" cy="84" rx="45" ry="59" fill="#dce9e7"/><ellipse cx="100" cy="84" rx="35" ry="49" fill="#f7f5ed"/><path d="m80 62 27-14m-20 40 34-19" fill="none"/><path d="M100 143v17m-25 0h50"/></g>,
 <g><rect x="67" y="29" width="66" height="104" rx="25" fill="#dce9e7"/><path d="M100 133v20m-40 0h80"/><path d="m78 55 28-13m-23 48 36-25" fill="none"/></g>,
 <g><circle cx="100" cy="80" r="29" fill="#f2e2a7"/><path d="M100 29v12m0 78v12M49 80h12m78 0h12M63 43l9 9m56 56 9 9m-74 0 9-9m56-56 9-9" fill="none"/><path d="M42 150h115"/></g>,
 <g><circle cx="100" cy="65" r="26" fill="#f2dfb7"/><path d="M89 71q11 14 22 0M65 147v-28q35-45 70 0v28" fill="none"/><circle cx="90" cy="59" r="2"/><circle cx="110" cy="59" r="2"/></g>
 ]:lesson.char==='藏'?[
 <g><path d="M35 141q9-70 28 0q11-105 27 0q14-75 28 0q20-110 35 0" fill="#dce9d4"/></g>,
 <g><path d="M57 145V45q45-28 86 0v100Z" fill="#f2dfb7"/><path d="M100 34v111" fill="none"/><circle cx="120" cy="93" r="3"/></g>,
 <g><rect x="50" y="74" width="100" height="65" rx="9" fill="#f2dfb7"/><path d="M48 75q50-48 104 0Z" fill="#eee0ed"/><path d="M50 91h100"/><rect x="93" y="83" width="14" height="20" rx="3" fill="#f7f5ed"/></g>,
 <g><rect x="64" y="76" width="72" height="54" rx="8" fill="#f2dfb7"/><path d="M49 144Q15 93 47 49q55-47 112 0q34 54-6 99" fill="none" strokeWidth="6"/><path d="m139 143 17 4 5-18" fill="none"/></g>
 ]:[
 <g><path d="M20 143h160M33 140l9-26 11 26m4 0 12-35 8 35m11 0 8-20 9 20" fill="none"/><path d="M135 155V41"/><rect x="94" y="34" width="80" height="56" rx="9" fill="#f2dfb7"/></g>,
 <g><path d="M37 70q0-34 60-34t60 34q0 35-54 35l-31 20 5-23q-40-1-40-32Z" fill="#dce9e7"/><text x="98" y="77" textAnchor="middle" stroke="none" fill={color} fontSize="17">一句话</text></g>,
 <g><rect x="40" y="38" width="118" height="106" rx="12" fill="#f2dfb7"/><path d="M60 65h77m-77 24h52m-52 24h77" fill="none"/><path d="m124 119 39-52 10 8-40 53-17 7Z" fill="#dce9e7"/></g>,
 <g><rect x="29" y="25" width="142" height="61" rx="10" fill="#f2dfb7"/><text x="100" y="50" textAnchor="middle" stroke="none" fill={color} fontSize="16">过马路</text><text x="100" y="73" textAnchor="middle" stroke="none" fill={color} fontSize="16">慢慢走</text><path d="M100 86v28M25 144h150M48 124v33m33-33v33m33-33v33m33-33v33" fill="none"/></g>
 ];
 return <svg className={'sketch '+(small?'small':'')} viewBox="0 0 200 180" aria-hidden="true" style={{color}}><g stroke={color} strokeWidth="3" strokeLinejoin="round">{lesson.char==='赢'?drawings[index]:scene[index]}</g></svg>;
}
