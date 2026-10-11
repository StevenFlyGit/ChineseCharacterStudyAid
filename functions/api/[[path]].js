export function onRequest(){return Response.json({error:'接口不存在'},{status:404,headers:{'Cache-Control':'no-store'}});}
