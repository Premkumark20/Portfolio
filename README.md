# ⚡ Prem Kumar K - Full Stack Developer Portfolio

An interactive, high-performance portfolio website engineered with **React 18**, **TypeScript**, **Three.js**, **Framer Motion**, and **Tailwind CSS**. Showcasing full-stack engineering expertise, REST API security, 3D interactive spatial components, and production-ready applications.

[![Live Portfolio](https://img.shields.io/badge/Live-Portfolio-00F2FE?style=for-the-badge&logo=googlechrome&logoColor=white)](https://premkumark20.github.io/Portfolio/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

---

## 🌐 Live Demo & Deployment

**🚀 Explore Live Portfolio → [https://premkumark20.github.io/Portfolio/](https://premkumark20.github.io/Portfolio/)**

---

## 👨‍💻 About Prem Kumar K

I am a **Full Stack Developer** and Computer Science & Engineering undergraduate at **SRM Institute of Science and Technology, Chennai**. I specialize in building secure backend microservices, responsive web user interfaces, REST APIs, and AI-powered solutions.

- 🎓 **Education**: B.Tech CSE at SRM IST, Ramapuram (CGPA: 8.5/10)
- 💻 **Core Stack**: Python (FastAPI, Flask), React, TypeScript, SQL (PostgreSQL, SQLite), Docker, Tailwind CSS
- 🔐 **Focus Areas**: System Security (JWT, RBAC, AES-256), Cloud Computing, & Interactive Web Engineering

---

## ✨ Key Technical Features & Architectural Highlights

### 🕹️ 1. Interactive 3D Spatial Tilt Physics (`<TiltCard>`)
- **Real-time Cursor Tracking**: Cards dynamically rotate along spatial X and Y axes (`rotateX`, `rotateY`) based on cursor offsets relative to element centers.
- **Z-Axis Elevation**: Lifts cards into 3D space (`translateZ(10px) scale(1.015)`) on hover.
- **Smooth Viewport Entries**: High-precision 3D entry transitions (`transformPerspective: 1000`, custom `cubic-bezier` easing) trigger smoothly on scroll.

### 📄 2. Client-Side PDF Canvas Viewer (PDF.js)
- **Inline Certificate Previews**: Uses Mozilla's `pdfjs-dist` to fetch and render PDF certificates client-side directly on HTML5 `<canvas>` elements.
- **Cross-Browser & Mobile Support**: Completely bypasses mobile browser fallback limitations (like iOS/Android forcing PDF downloads), delivering smooth on-page previews.

### 🌐 3. Stacking Context & Portal Overlays
- **React Portals**: Modal overlays (`Projects` details and `Certifications` PDF viewer) are rendered directly to `document.body` via `createPortal`, completely avoiding CSS stacking context clipping bugs on scroll.

### 🎨 4. Fluid Organic Hero Design
- **Morphing Profile Shape**: Blob-shaped portrait frame featuring continuous fluid `@keyframes morph` animations and flowing neon gradient borders.
- **WebGL Particle Canvas**: Background powered by Three.js rendering thousands of animated dynamic nodes.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React 18.3.1 | Component-driven UI architecture |
| **Language** | TypeScript 5.8.3 | End-to-end static typing & interface contracts |
| **Build System** | Vite 5.4.19 | High-speed HMR development server & bundling |
| **Styling** | Tailwind CSS 3.4.17 | Utility-first custom glassmorphism & responsive layouts |
| **Animations** | Framer Motion & Three.js | Spatial motion transitions & WebGL background scene |
| **PDF Processing** | PDF.js (`pdfjs-dist`) | Client-side vector canvas PDF rendering |
| **Icons & UI** | Lucide React & Radix UI | Accessible primitives & SVG icon suite |

---

## 🚀 Featured Projects

### 1. 🧮 Trip Budget Management System
- **Description**: Full-stack application for managing group trip expenses, budget limits, and real-time split calculations.
- **Stack**: Python (Flask), REST API, HTML/CSS, Render
- **GitHub**: [Trip_Budget_System Repository](https://github.com/Premkumark20/Trip_Budget_System)
- **Live Demo**: [https://trip-budget-system.onrender.com/](https://trip-budget-system.onrender.com/)

### 2. 💼 Payroll Management System
- **Description**: Enterprise client-server payroll system featuring Role-Based Access Control (RBAC), automated salary generation, and attendance management.
- **Stack**: Python (Flask), SQLite, Role Security, PythonAnywhere
- **GitHub**: [payroll-dbms Repository](https://github.com/Premkumark20/payroll-dbms)
- **Live Demo**: [https://premkumark20.pythonanywhere.com/](https://premkumark20.pythonanywhere.com/)

### 3. 🏧 SmartBank ATM Terminal System
- **Description**: Terminal-based banking software engine implementing secure login, PIN validation, deposit/withdrawal logs, and transaction audit trails.
- **Stack**: Python, MySQL, CLI Engine
- **GitHub**: [SmartBank-ATM-System Repository](https://github.com/Premkumark20/SmartBank-ATM-System)

---

## 💻 Local Setup & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Premkumark20/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Launch dev server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Verify TypeScript & Production Build**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📁 Repository Structure

```
Portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── TiltCard.tsx         # Reusable 3D mouse tilt & scroll component
│   │   ├── About.tsx                 # About Me & statistics metrics
│   │   ├── Certifications.tsx        # PDF.js inline viewer & cert lightbox
│   │   ├── Contact.tsx               # Direct message form & social channels
│   │   ├── Education.tsx             # Dynamic 3D timeline qualifications
│   │   ├── Hero.tsx                  # Morphing organic portrait & quick actions
│   │   ├── Projects.tsx             # Project detail modals & progress bars
│   │   ├── Services.tsx             # Engineering domain capabilities
│   │   ├── Skills.tsx               # Technical competencies grid
│   │   └── ThreeBackground.tsx      # WebGL particle background
│   ├── pages/
│   ├── App.tsx                       # React router & global context
│   ├── index.css                     # Custom keyframes & styling rules
│   └── main.tsx                      # DOM root entry
├── index.html                        # Favicon & SEO metadata
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 📞 Contact Information

- **Email**: [premkumark182005@gmail.com](mailto:premkumark182005@gmail.com)
- **Phone / WhatsApp**: +91 7358266257
- **LinkedIn**: [Prem Kumar K](https://www.linkedin.com/in/premkumar-k-506922299/)
- **GitHub**: [Premkumark20](https://github.com/Premkumark20)
- **Location**: Poonamallee, Chennai, Tamil Nadu, India

---

*Built with ❤️ by Prem Kumar K*
