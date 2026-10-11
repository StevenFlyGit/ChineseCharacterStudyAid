export const STAGES=['welcome','focus','story','assemble','reunite','recognize','result'] as const;
export type Stage=typeof STAGES[number];
export type Session={version:1;stage:Stage;focus:number;placed:string[];selected:string|null;attempts:number;recognitionAttempts:number;helpCount:number;recognitionHelp:boolean;firstRecognitionCorrect:boolean|null;preview:boolean;notice:string};
export const IDS=['wang','kou','yue','bei','fan'];
export function fresh(preview=false):Session{return {version:1,stage:'welcome',focus:0,placed:[],selected:null,attempts:0,recognitionAttempts:0,helpCount:0,recognitionHelp:false,firstRecognitionCorrect:null,preview,notice:''};}
export type Action={type:'RESUME';session:Session}|{type:'FOCUS';index:number}|{type:'START';preview?:boolean}|{type:'NEXT'}|{type:'BACK'}|{type:'SELECT';id:string}|{type:'PLACE';id:string}|{type:'HELP'}|{type:'ANSWER';char:string}|{type:'RESET';preview?:boolean}|{type:'NOTICE';text:string};
export function reducer(s:Session,a:Action):Session{
 if(a.type==='RESUME')return restore(JSON.stringify(a.session));
 if(a.type==='FOCUS')return (s.stage==='focus'||s.stage==='story')&&Number.isInteger(a.index)&&a.index>=0&&a.index<5?{...s,focus:a.index,notice:''}:s;
 if(a.type==='RESET')return fresh(a.preview);
 if(a.type==='START')return {...fresh(a.preview),stage:'focus'};
 if(a.type==='NOTICE')return {...s,notice:a.text};
 if(a.type==='NEXT'){
 if(s.stage==='focus')return {...s,stage:'story',focus:0,notice:''};
 if(s.stage==='story')return s.focus<4?{...s,focus:s.focus+1,notice:''}:{...s,stage:'assemble',focus:0,notice:''};
 if(s.stage==='reunite')return {...s,stage:'recognize',notice:''};
 return s;
 }
 if(a.type==='BACK'){
 if(s.stage==='focus')return {...s,stage:'welcome',focus:0,notice:''};
 if(s.stage==='story'){if(s.focus>0)return {...s,focus:s.focus-1,notice:''};return {...s,stage:'focus',focus:0,notice:''};}
 if(s.stage==='assemble')return {...s,stage:'story',focus:4,selected:null,notice:''};
 return s;
 }
 if(a.type==='SELECT')return s.stage==='assemble'&&IDS.includes(a.id)&&!s.placed.includes(a.id)?{...s,selected:a.id,notice:''}:s;
 if(a.type==='PLACE'){
 if(s.stage!=='assemble'||!s.selected||!IDS.includes(a.id)||s.placed.includes(a.id))return s;
 if(a.id!==s.selected)return {...s,attempts:s.attempts+1,notice:'再看看位置，我们一起放回去。'};
 const placed=[...s.placed,a.id];return {...s,placed,selected:null,stage:placed.length===5?'reunite':'assemble',notice:''};
 }
 if(a.type==='HELP')return {...s,helpCount:s.helpCount+1,recognitionHelp:s.recognitionHelp||s.stage==='recognize',notice:s.stage==='recognize'?'看看刚才的字，再试一次。':'一块一块来，需要帮助也没关系。'};
 if(a.type==='ANSWER'){
 if(s.stage!=='recognize'||!['赢','营','迎'].includes(a.char))return s;
 const count=s.recognitionAttempts+1,first=s.firstRecognitionCorrect??(a.char==='赢');
 return {...s,recognitionAttempts:count,firstRecognitionCorrect:first,stage:a.char==='赢'?'result':'recognize',notice:a.char==='赢'?'':'再看看字形。需要的话，可以重看刚才的字。'};
 }
 return s;
}
export function restore(raw:string|null):Session{
 try{
 const s=JSON.parse(raw||'null');
 if(!s||s.version!==1||s.preview!==false||!STAGES.includes(s.stage)||!Number.isInteger(s.focus)||s.focus<0||s.focus>4||!Array.isArray(s.placed)||new Set(s.placed).size!==s.placed.length||!s.placed.every((id:unknown)=>typeof id==='string'&&IDS.includes(id)))return fresh();
 for(const field of ['attempts','recognitionAttempts','helpCount'])if(!Number.isInteger(s[field])||s[field]<0||s[field]>10000)return fresh();
 if(typeof s.recognitionHelp!=='boolean'||![true,false,null].includes(s.firstRecognitionCorrect))return fresh();
 if(['reunite','recognize','result'].includes(s.stage)&&s.placed.length!==5)return fresh();
 if(s.stage==='result'&&s.recognitionAttempts<1)return fresh();
 return {...fresh(),...s,selected:null,notice:'',stage:s.stage==='reunite'?'recognize':s.stage};
 }catch{return fresh();}
}
