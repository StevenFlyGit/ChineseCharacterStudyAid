export type Component={id:string;char:string;label:string;line:string;color:string;position:string;strokeIndices:number[];displayName?:string;focusText?:string;slot?:number[]};
export type Lesson={id:string;version:number;char:string;pinyin:string;definition:string;intro:string;outro:string;strokeCount:number;choices:string[];defaultChoices:string[];components:Component[]};
export const lessons:Lesson[];
export function getLesson(id?:string):Lesson;
export function storyFor(lesson:Lesson):import('./story.mjs').Story;
