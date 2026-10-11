import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base:'./',optimizeDeps:{entries:['index.html']},server:{port:5193,strictPort:true,proxy:{'/api':'http://127.0.0.1:3019'}},build:{assetsInlineLimit:300000,cssCodeSplit:false,chunkSizeWarningLimit:1000}});
