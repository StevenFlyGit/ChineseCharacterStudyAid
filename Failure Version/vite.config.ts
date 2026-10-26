import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({mode})=>{const env=loadEnv(mode,process.cwd(),'');return {plugins:[react()],resolve:{preserveSymlinks:true},server:{port:5188,strictPort:true,proxy:{'/api':`http://127.0.0.1:${env.PORT||3018}`}},build:{sourcemap:true}};});
