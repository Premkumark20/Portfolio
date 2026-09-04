# Portfolio Website Requirements

## System Requirements
- **Node.js**: >= 18.0.0
- **Package Manager**: pnpm >= 8.0.0 *(uses shared package store at `D:\Libraries\pnpm-store`)*
- **Version Control**: Git

---

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/premkumark20/Portfolio.git
   cd Portfolio
   ```

2. **Configure pnpm shared store**:
   ```bash
   pnpm config set store-dir D:\Libraries\pnpm-store
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://rakwmqpwfdlydhtazfzp.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_USERNAME=yourusername
   VITE_ADMIN_PASSWORD=yourpassword
   ```

5. **Start development server**:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:5173` in your browser.

6. **Build for production**:
   ```bash
   pnpm build
   ```

7. **Build for GitHub Pages**:
   ```bash
   pnpm build:gh-pages
   ```

8. **Preview production build**:
   ```bash
   pnpm preview
   ```

---

## Environment Variables

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Yes | Supabase Project URL for cloud sync | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase Anonymous API key | `eyJhbGciOi...` |
| `VITE_ADMIN_USERNAME` | Yes | Default admin username fallback | yourusername |
| `VITE_ADMIN_PASSWORD` | Yes | Default admin password fallback | yourpassword|
| `DEPLOY_TARGET` | Optional | Set to `gh-pages` for GitHub Pages base path | `gh-pages` |

---

## Security & Authentication Architecture

1. **Salted Cryptographic Hashing (`salt:hash`)**:
   - All credentials, temporary passes, and recovery keys use salted SHA-256 (`${salt}:${sha256(salt + ':' + password)}`) to eliminate vulnerability to rainbow table and dictionary attacks.
   - Dynamic 16-hex random salts are generated via `crypto.getRandomValues` for custom credentials and temporary passes.

2. **Built-in Authentication Accounts**:
   - **Default Administrator**: yourusername / yourpassword (Salt: `default_auth`)
   - **Master Recovery Fail-safe**: `youradmin` / `youradminpassword` (Salt: `master_recovery`) — always available for recovery if custom credentials are forgotten.

3. **Temporary Access Passes**:
   - Time-limited access passes (1 hour to 30 days) with granular permission levels:
     - **Read-Only**: Allows viewing content without editing permissions.
     - **Can Edit**: Allows modifications.
   - Auto-logout and cloud sync polling every 2–3 seconds upon revocation or expiration.

4. **Accidental Deletion Protection**:
   - Centered confirmation modal container across all sections (Resumes, Projects, Education, Work Experience, Services, Skills, Certifications, and Security).

---

## Dependencies

### Core Framework
- React ^18.3.1
- React DOM ^18.3.1
- TypeScript ^5.8.3
- Vite ^5.4.21

### UI Components, 3D & Styling
- Tailwind CSS ^3.4.17
- Radix UI Components (Dialog, Dropdown, Tabs, Tooltips)
- Lucide React ^0.462.0 (Icons)
- Framer Motion ^11.18.2
- Three.js ^0.170.0 & @types/three (WebGL dynamic canvas)
- Tailwindcss Animate ^1.0.7

### Data Management & Cloud Sync
- @supabase/supabase-js ^2.48.1 (PostgreSQL real-time sync)
- js-sha256 ^0.11.0 (Salted cryptographic hashing)
- TanStack React Query ^5.85.5
- React Hook Form ^7.61.1
- Zod ^3.25.76 (Validation)

### Utilities & Document Processing
- pdfjs-dist ^3.11.174 (Client-side vector PDF canvas rendering)
- Sonner ^1.7.4 (Toast notifications)
- Date-fns ^3.6.0
- CLSX ^2.1.1 & Tailwind Merge ^2.6.0

---

## Deployment Platforms
- **GitHub Pages**: [https://premkumark20.github.io/Portfolio/](https://premkumark20.github.io/Portfolio/)
- **Netlify**: [https://pkportfolioapp.netlify.app/](https://pkportfolioapp.netlify.app/)
