import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
let html=await readFile('dist/index.html','utf8');
for(const match of [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)]){
 const js=await readFile('dist/'+match[1].replace(/^\.\//,''),'utf8');
 html=html.replace(match[0],()=>'<script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script>');
}
for(const match of [...html.matchAll(/<link[^>]*href="([^"]+\.css)"[^>]*>/g)]){
 const css=await readFile('dist/'+match[1].replace(/^\.\//,''),'utf8');
 html=html.replace(match[0],()=>'<style>'+css+'</style>');
}
html=html.replace(/<link[^>]*rel="modulepreload"[^>]*>/g,'');
const license=await readFile('public/licenses/ARPHICPL.TXT','utf8');
html=html.replace('</head>',()=> '<!-- Glyph data: Hanzi Writer Data / Make Me a Hanzi. Arphic Public License. '+license.replace(/-->/g,'-- >')+' --></head>');
await mkdir('docs',{recursive:true});await writeFile('docs/心音字灵-离线演示.html',html);await copyFile('docs/心音字灵-离线演示.html','dist/离线演示.html');console.log('已生成自包含离线演示 HTML');
