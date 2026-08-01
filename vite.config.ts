import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

function resumeStoragePlugin() {
  return {
    name: 'resume-storage-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/resume/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const { fileName, fileData } = JSON.parse(body);
              if (!fileName || !fileData) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing fileName or fileData' }));
                return;
              }

              const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
              const base64Data = fileData.replace(/^data:.*?;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');

              // Write to public/resume/
              const publicDir = path.resolve(__dirname, 'public/resume');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }
              const publicFilePath = path.join(publicDir, safeName);
              fs.writeFileSync(publicFilePath, buffer);

              // Write to dist/resume/ if dist exists
              const distDir = path.resolve(__dirname, 'dist/resume');
              if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
                if (!fs.existsSync(distDir)) {
                  fs.mkdirSync(distDir, { recursive: true });
                }
                fs.writeFileSync(path.join(distDir, safeName), buffer);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: `/resume/${safeName}` }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if ((req.url === '/api/resume/delete' || req.url?.startsWith('/api/resume/delete')) && (req.method === 'DELETE' || req.method === 'POST')) {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              let fileName = '';
              if (body) {
                try {
                  const parsed = JSON.parse(body);
                  fileName = parsed.fileName || parsed.file;
                } catch {}
              }
              if (!fileName && req.url) {
                const urlObj = new URL(req.url, 'http://localhost');
                fileName = urlObj.searchParams.get('fileName') || urlObj.searchParams.get('file') || '';
              }

              if (fileName) {
                const safeName = path.basename(fileName);
                
                const publicFilePath = path.resolve(__dirname, 'public/resume', safeName);
                if (fs.existsSync(publicFilePath)) {
                  fs.unlinkSync(publicFilePath);
                }

                const distFilePath = path.resolve(__dirname, 'dist/resume', safeName);
                if (fs.existsSync(distFilePath)) {
                  fs.unlinkSync(distFilePath);
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

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
			resumeStoragePlugin(),
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
