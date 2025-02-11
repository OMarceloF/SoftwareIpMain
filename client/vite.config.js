import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Se for um projeto React

export default defineConfig({
  plugins: [react()], // Remova se não for React
  build: {
    outDir: 'dist' // Garante que o output vá para 'dist'
  }
});
