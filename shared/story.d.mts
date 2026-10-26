export type Story={intro:string;lines:{id:string;text:string}[];outro:string;source:'local'|'api'};
export const localStory:Story;
export function validateStory(value:unknown,source?:'local'|'api',lessonId?:string):Story;
export function validateRequest(value:unknown):{lessonId:string;contentVersion:number;theme:string;length:string};
export const storyPrompt:string;
export function requestStory(input:unknown,config:{key:string;model:string;baseUrl:string},fetcher?:typeof fetch):Promise<Story>;
