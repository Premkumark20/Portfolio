import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
	return {
		// Base path will be set via command line for gh-pages deployment
		base: command === 'build' ? '/portfolio/' : './',
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
