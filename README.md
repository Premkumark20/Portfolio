# ⚡ Prem Kumar K — Full Stack Developer Portfolio

An interactive, high-performance portfolio website engineered with **React 18**, **TypeScript**, **Three.js**, **Framer Motion**, and **Tailwind CSS**. Features a built-in **Admin Panel** with real-time **Supabase cloud sync**, enabling seamless cross-device content management.

[![Live Portfolio](https://img.shields.io/badge/Live-Portfolio-00F2FE?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pkportfolioapp.netlify.app/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://pkportfolioapp.netlify.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🌐 Live Demo & Deployment

**🚀 Explore Live Portfolio → [https://pkportfolioapp.netlify.app](https://pkportfolioapp.netlify.app)**

---

## 👨‍💻 About Prem Kumar K

I am a **Full Stack Developer** and Computer Science & Engineering undergraduate at **SRM Institute of Science and Technology, Chennai**. I specialize in building secure backend microservices, responsive web user interfaces, REST APIs, and AI-powered solutions.

- 🎓 **Education**: B.Tech CSE at SRM IST, Ramapuram (CGPA: 8.56/10)
- 💻 **Core Stack**: Python (FastAPI, Flask), React, TypeScript, PostgreSQL, Docker, Tailwind CSS
- 🔐 **Focus Areas**: System Security (JWT, RBAC, AES-256), Cloud Computing & Interactive Web Engineering

---

## ✨ Key Technical Features & Architectural Highlights

### 🛡️ 1. Admin Panel with Cross-Device Cloud Sync & Tab Persistence
- **Password-Protected Admin Dashboard**: Secure login with environment-variable-based credentials or custom database credentials.
- **Supabase Real-Time Sync**: All edits (CRUD + reordering) are instantly saved to **Supabase PostgreSQL** and reflected across all devices (mobile, laptop, other browsers) without redeployment.
- **Full CRUD + Reordering**: Create, update, delete, and drag-to-reorder across all sections — Personal Info, Resumes, Experiences, Projects, Education, Services, Skills, Certifications, and Stats.
- **Tab Persistence**: Preserves active admin sections across refreshes via `sessionStorage` and URL hash fragments while defaulting to `Personal & Bio` on login.

### 🔤 2. Smart Global Auto-Capitalization System (`capitalizeWords`)
- **Intelligent Title Casing**: Automatically formats text across all Admin input fields, CRUD context methods, CSV parsing, and portfolio rendering.
- **Tech Stack Dictionary**: Preserves custom casing for technology terms and acronyms (`HTML`, `CSS`, `JavaScript`, `TypeScript`, `TailwindCSS`, `React`, `FastAPI`, `Flask`, `PostgreSQL`, `Docker`, `SQL`, `API`, `UI/UX`, `SIH`, `SRM`, etc).

### 💼 3. Interactive Work Experience Section & Detail Modals
- **Responsive 3-Column Grid**: Styled with interactive 3D `TiltCard` components matching section layout aesthetics.
- **Clickable Experience Cards**: Card clicks launch a responsive lightbox modal (via React `createPortal`) presenting full role duties, dates, location, and technology tags.
- **Expandable Toggle**: Includes a "View All Experiences" button for smooth list expansion.

### 🚀 4. Project Showcase & Live Demo Links
- **Live Demo Integration**: Added `liveUrl` support to render a prominent `Live Demo ↗` button on both project cards and detail modals alongside GitHub repository links.
- **Category Badges & Tech Stack Tags**: Standardized progress indicators and tech stack tags.

### 🕹️ 5. Interactive 3D Spatial Tilt Physics (`<TiltCard>`)
- **Real-time Cursor Tracking**: Cards dynamically rotate along spatial X and Y axes (`rotateX`, `rotateY`) based on cursor offsets relative to element centers.
- **Z-Axis Elevation**: Lifts cards into 3D space (`translateZ(10px) scale(1.015)`) on hover.
- **Smooth Viewport Entries**: High-precision 3D entry transitions (`transformPerspective: 1000`, custom `cubic-bezier` easing) trigger smoothly on scroll.

### 📄 6. Client-Side PDF Canvas Viewer (PDF.js) & Physical Resume Management
- **Inline Certificate Previews**: Uses Mozilla's `pdfjs-dist` to fetch and render PDF certificates client-side directly on HTML5 `<canvas>` elements.
- **Physical Resume File Renaming**: Renames physical PDF files on disk (`/public/resume/` & `/dist/resume/`) via local server API while updating CSV metadata.
- **Streamlined Edit UI**: Clean toggle UI in Admin with inline inputs, `Check` save buttons, and single `X` cancel controls.

### 🌐 7. Stacking Context & Portal Overlays
- **React Portals**: Modal overlays (Projects detail lightbox, Experience detail modal, Certifications PDF viewer) are rendered directly to `document.body` via `createPortal`, avoiding CSS stacking context clipping.

### 🎨 8. Fluid Organic Hero Design
- **Morphing Profile Shape**: Blob-shaped portrait frame featuring continuous fluid `@keyframes morph` animations and flowing neon gradient borders.
- **WebGL Particle Canvas**: Background powered by Three.js rendering thousands of animated dynamic nodes.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React 18.3.1 | Component-driven UI architecture |
| **Language** | TypeScript 5.8.3 | End-to-end static typing & interface contracts |
| **Build System** | Vite 5.4.21 | High-speed HMR development server & bundling |
| **Package Manager** | pnpm | Fast, disk-efficient package management |
| **Styling** | Tailwind CSS 3.4 | Utility-first custom glassmorphism & responsive layouts |
| **Animations** | Framer Motion & Three.js | Spatial motion transitions & WebGL background scene |
| **Cloud Database** | Supabase (PostgreSQL) | Real-time cross-device portfolio data sync |
| **Deployment** | Netlify | CI/CD auto-deploy on git push |
| **PDF Processing** | PDF.js (`pdfjs-dist`) | Client-side vector canvas PDF rendering |
| **Icons & UI** | Lucide React & Radix UI | Accessible primitives & SVG icon suite |

---

## 🚀 Featured Projects

### 1. 🔐 Secure File Sharing System using Blockchain & ML
- **Description**: Cloud storage platform using FastAPI integrating AES encryption, SHA-256 hashing, Ethereum blockchain, JWT authentication, Redis, PostgreSQL, MinIO, Docker, and ML-based anomaly detection.
- **Stack**: Python, FastAPI, Docker, Redis, Ethereum, PostgreSQL, MinIO, JWT
- **GitHub**: [Premkumark20](https://github.com/Premkumark20)

### 2. 🌾 AI-Based Crop Recommendation Platform (AgriSense)
- **Description**: AI-powered agricultural platform integrating Google Gemini API for crop disease detection, multilingual recommendations, weather forecasting, and intelligent farming insights.
- **Stack**: React, Python, Gemini API, JWT, MySQL

### 3. 🧮 Trip Budget Management System
- **Description**: Full-stack application for managing group trip expenses, budget limits, and real-time split calculations.
- **Stack**: Python (Flask), REST API, HTML/CSS, Render
- **GitHub**: [Trip_Budget_System](https://github.com/Premkumark20/Trip_Budget_System)
- **Live Demo**: [https://trip-budget-system.onrender.com/](https://trip-budget-system.onrender.com/)

### 4. 💼 Payroll Management System
- **Description**: Enterprise payroll system featuring Role-Based Access Control (RBAC), automated salary generation, and attendance management.
- **Stack**: Python (Flask), SQLite, Role Security, PythonAnywhere
- **GitHub**: [payroll-dbms](https://github.com/Premkumark20/payroll-dbms)
- **Live Demo**: [https://premkumark20.github.io/payroll-dbms](https://premkumark20.github.io/payroll-dbms)

---

## 💻 Local Setup & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Premkumark20/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies** *(uses pnpm)*
   ```bash
   pnpm install
   ```

3. **Configure environment variables** — create a `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_ADMIN_USERNAME=yourusername
   VITE_ADMIN_PASSWORD=yourpassword
   ```

4. **Launch dev server**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Production build**
   ```bash
   pnpm build
   ```

6. **Build for GitHub Pages**
   ```bash
   pnpm build:gh-pages
   ```

---

## 🗄️ Supabase Database Setup

Run this SQL once in your **Supabase SQL Editor**:

```sql
create table if not exists portfolio_data (
  id text primary key default 'main',
  content text not null,
  updated_at timestamp default now()
);

alter table portfolio_data enable row level security;

drop policy if exists "Allow public read" on portfolio_data;
create policy "Allow public read" on portfolio_data for select using (true);

drop policy if exists "Allow admin write" on portfolio_data;
create policy "Allow admin write" on portfolio_data for all using (true);
```

Then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your deployment environment variables.

---

## 🔐 Admin Panel & Security Architecture

Access the full admin dashboard at `/admin` (opens in a new tab from the footer, or navigate directly).

### Authentication & Access Control:
- **Salted SHA-256 Cryptographic Hashes**: Passwords and temporary credentials use salted hashing (`salt:hash`), protecting against rainbow table and dictionary lookup attacks.
- **Default Administrator**: `yourusername` / `yourpassword` (Salt: `default_auth`).
- **Master Recovery Fail-safe**: `youradmin` / `youradminpassword` (Salt: `master_recovery`) — recovery access if custom credentials are forgotten.
- **Custom Admin Credentials**: Change credentials at any time in the Security tab; synced to Supabase with dynamically generated cryptographic salts.
- **Temporary Sharing Passes**: Generate time-bounded passes (1 hour to 30 days) with configurable permissions (**Read-Only** or **Can Edit**). Automatically revoked upon expiration.
- **Deletion Safeguards**: Confirmation modals prevent accidental deletions across all sections.

### Features & Sections:
| Section | Operations |
| :--- | :--- |
| Personal & Bio | Edit name, title, links, hero tags, bio summary (Auto Title Case) |
| Resumes | Upload PDF/DOC files, set primary resume, rename files on physical disk |
| Projects | Add, edit, delete, drag-to-reorder, add Live Demo URLs |
| Education | Add, edit, delete, drag-to-reorder, set category badges |
| Work Experience | Add, edit, delete, drag-to-reorder, clickable detail lightbox |
| Services | Add, edit, delete, drag-to-reorder, tech stack tags |
| Skills | Add categories & skills, drag-to-reorder |
| Certifications | Add, upload PDF/image, drag-to-reorder, inline canvas preview |
| Stats | Edit label, value, subtext, drag-to-reorder |
| Security | Change admin credentials, generate/manage temporary passes, cloud backup |

All changes are **instantly synced to Supabase** and reflected on all devices.

---

## 📁 Repository Structure

```
Portfolio/
├── public/
│   ├── data/
│   │   └── portfolio.csv            # Static fallback CSV data
│   └── resume/                      # Uploaded resume PDF files
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminAuthModal.tsx   # Login modal for inline admin
│   │   │   └── AdminDashboardModal.tsx  # Inline admin panel
│   │   ├── ui/
│   │   │   └── TiltCard.tsx         # Reusable 3D mouse tilt component
│   │   ├── About.tsx                # About Me & statistics section
│   │   ├── Certifications.tsx       # PDF.js inline viewer & cert lightbox
│   │   ├── Contact.tsx              # Contact form & social channels
│   │   ├── Education.tsx            # 3D timeline qualifications
│   │   ├── Experience.tsx           # Clickable 3D cards & detail lightbox
│   │   ├── Footer.tsx               # Footer with centered copyright
│   │   ├── Hero.tsx                 # Morphing profile & quick actions
│   │   ├── Projects.tsx             # Project detail modals & Live Demo links
│   │   ├── Services.tsx             # Engineering domain capabilities
│   │   ├── Skills.tsx               # Technical competencies grid
│   │   └── ThreeBackground.tsx      # WebGL particle background
│   ├── context/
│   │   └── PortfolioContext.tsx      # Global state, CRUD, Supabase sync
│   ├── lib/
│   │   ├── csvData.ts               # CSV parse, generate, Supabase fetch/save
│   │   ├── utils.ts                 # capitalizeWords & getAssetUrl helpers
│   │   └── supabaseClient.ts        # Supabase client initialization
│   ├── pages/
│   │   ├── AdminPage.tsx            # Full admin dashboard page (/admin)
│   │   └── Index.tsx                # Main portfolio page
│   ├── App.tsx                      # React router & global context
│   ├── index.css                    # Custom keyframes & styling rules
│   └── main.tsx                     # DOM root entry
├── .env                             # Environment variables (not committed)
├── index.html                       # Favicon & SEO metadata
├── tailwind.config.ts
├── vite.config.ts                   # Dev server + /api/portfolio/save endpoint
└── README.md
```

---

## 📞 Contact Information

- **Email**: [premkumark182005@gmail.com](mailto:premkumark182005@gmail.com)
- **LinkedIn**: [Prem Kumar K](https://www.linkedin.com/in/premkumar-k-506922299/)
- **GitHub**: [Premkumark20](https://github.com/Premkumark20)
- **Location**: Poonamallee, Chennai, Tamil Nadu, India

---

*Built with ❤️ by Prem Kumar K*
