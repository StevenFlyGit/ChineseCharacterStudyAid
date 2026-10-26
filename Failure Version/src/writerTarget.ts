// Scoped pointer listeners and capture support fingers/styluses without
// leaving document listeners behind after a practice panel closes.
type BoundEvent={getPoint:()=>{x:number;y:number};preventDefault:()=>void};
export function createWriterTarget(host:HTMLElement){
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');const defs=document.createElementNS(ns,'defs');svg.appendChild(defs);host.appendChild(svg);
 const removers:(()=>void)[]=[];
 class Target{
  node:SVGElement;svg:SVGElement;defs:SVGDefsElement;
  constructor(node:SVGElement){this.node=node;this.svg=node;this.defs=defs;}
  createSubRenderTarget(){const g=document.createElementNS(ns,'g');this.svg.appendChild(g);return new Target(g);}
  getBoundingClientRect(){return this.node.getBoundingClientRect();}
  updateDimensions(width:string|number,height:string|number){this.node.setAttribute('width',String(width));this.node.setAttribute('height',String(height));}
  point(e:PointerEvent){const r=svg.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
  _getMousePoint(e:MouseEvent){const r=svg.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
  _getTouchPoint(e:TouchEvent){const r=svg.getBoundingClientRect();return {x:e.touches[0].clientX-r.left,y:e.touches[0].clientY-r.top};}
  _eventify<T extends Event>(e:T,point:(event:T)=>{x:number;y:number}){return {getPoint:()=>point.call(this,e),preventDefault:()=>e.preventDefault()};}
  listen(type:string,handler:(e:PointerEvent)=>void){const listener=handler as EventListener;svg.addEventListener(type,listener);removers.push(()=>svg.removeEventListener(type,listener));}
  addPointerStartListener(callback:(e:BoundEvent)=>void){this.listen('pointerdown',e=>{if(!e.isPrimary)return;svg.setPointerCapture(e.pointerId);callback({getPoint:()=>this.point(e),preventDefault:()=>e.preventDefault()});});}
  addPointerMoveListener(callback:(e:BoundEvent)=>void){this.listen('pointermove',e=>{if(!e.isPrimary)return;callback({getPoint:()=>this.point(e),preventDefault:()=>e.preventDefault()});});}
  addPointerEndListener(callback:()=>void){this.listen('pointerup',()=>callback());this.listen('pointercancel',()=>callback());}
 }
 return {target:new Target(svg),dispose:()=>{removers.forEach(f=>f());svg.remove();}};
}
