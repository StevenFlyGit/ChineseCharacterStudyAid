import lessons from './lessons.json' with {type:'json'};
export {lessons};
export function getLesson(id='ying-v1'){return lessons.find(l=>l.id===id)||lessons[0];}
export function storyFor(lesson){return {intro:lesson.intro,lines:lesson.components.map(c=>({id:c.id,text:c.line})),outro:lesson.outro,source:'local'};}
