import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
	return {
		// Use environment variable to determine deployment target
		base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/Portfolio/' : './',
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
