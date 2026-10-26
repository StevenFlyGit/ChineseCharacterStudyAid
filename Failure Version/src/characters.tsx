import type { CharacterJson } from 'hanzi-writer';
import type { Hanzi } from './game';
import wood from 'hanzi-writer-data/木.json';
import forest from 'hanzi-writer-data/林.json';
import rain from 'hanzi-writer-data/雨.json';
import bridge from 'hanzi-writer-data/桥.json';
import boat from 'hanzi-writer-data/船.json';
import bird from 'hanzi-writer-data/鸟.json';
export const characterData:Record<Hanzi,CharacterJson>={木:wood,林:forest,雨:rain,桥:bridge,船:boat,鸟:bird};
export const strokeNames:Record<Hanzi,string[]>={木:['横','竖','撇','捺'],林:['横','竖','撇','点','横','竖','撇','捺'],雨:['横','竖','横折钩','竖','点','点','点','点'],桥:['横','竖','撇','点','撇','横','撇','捺','撇','竖'],船:['撇','竖撇','横折钩','点','横','点','撇','横折弯','竖','横折','横'],鸟:['撇','横折钩','点','竖折折钩','横']};
export const writingTitles:Record<Hanzi,string>={木:'写一个木，种一棵树',林:'写一个林，唤醒树林',雨:'写一个雨，让水滴落下',桥:'写一个桥，连接两岸',船:'写一个船，划向对岸',鸟:'写一个鸟，请朋友帮忙'};
export function HanziGlyph({char}:{char:Hanzi}){return <svg className="hanzi-glyph" viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">{characterData[char].strokes.map((d,i)=><path key={i} d={d}/>)}</g></svg>;}
