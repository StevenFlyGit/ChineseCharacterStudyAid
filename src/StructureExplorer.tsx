import lesson from '../shared/lesson.json' with {type:'json'};
import {Piece} from './Glyph';

export default function StructureExplorer({focus,disabled,onSelect}:{focus:number;disabled:boolean;onSelect:(index:number)=>void}){
 return <div className="focus-art">
  <div className="structure-board" role="group" aria-label="赢字的五个部分">
   {lesson.components.map((part,index)=><button type="button" key={part.id} className={'structure-part part-'+part.id+(focus===index?' active':'')} aria-label={'查看'+part.char+'部件'} aria-pressed={focus===index} disabled={disabled} onClick={()=>onSelect(index)} style={{'--part-color':part.color} as React.CSSProperties}><Piece index={index}/></button>)}
  </div>
  <p className="structure-tip">点字块，听听它的名字和位置</p>
 </div>;
}
