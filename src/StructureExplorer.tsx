import {useLesson} from './LessonContext';
import {Piece} from './Glyph';

export default function StructureExplorer({focus,disabled,onSelect}:{focus:number;disabled:boolean;onSelect:(index:number)=>void}){
 const lesson=useLesson();
 return <div className="focus-art">
  <div className={'structure-board structure-'+lesson.char} role="group" aria-label={lesson.char+'字的'+lesson.components.length+'个部分'}>
   {lesson.components.map((part,index)=><button type="button" key={part.id} className={'structure-part part-'+part.id+(focus===index?' active':'')} aria-label={'查看'+part.char+'部件'} aria-pressed={focus===index} disabled={disabled} onClick={()=>onSelect(index)} style={{'--part-color':part.color} as React.CSSProperties}><Piece index={index}/></button>)}
  </div>
  <p className="structure-tip">字块分开了，点一点，看清它的位置</p>
 </div>;
}
