import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
	return {
		// Correct base path for GitHub Pages deployment
		base: command === 'build' ? '/Portfolio/' : './',
		server: {
			host: true,
			port: 5173,
		},
		plugins: [
			react(),
			mode === 'development' &&
			componentTagger(),
		].filter(Boolean),
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
