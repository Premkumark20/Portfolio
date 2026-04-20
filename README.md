# 🚀 Prem Kumar K - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Showcasing my skills, projects, and experience as a Computer Science & Engineering student specializing in Cloud Computing.

[![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)](https://pkportfolioapp.netlify.app/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC)](https://tailwindcss.com/)

## 🌐 Live Demo

**View Portfolio → [https://premkumark20.github.io/Portfolio/](https://premkumark20.github.io/Portfolio/)**

## 📋 Table of Contents

- [About Me](#about-me)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Projects Showcased](#projects-showcased)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Contact](#contact)

## 👨‍💻 About Me

I'm **Prem Kumar K**, a passionate Computer Science & Engineering student at SRM Institute of Science and Technology, Ramapuram, specializing in Cloud Computing. With a strong academic foundation (CGPA: 8.44/10) and hands-on experience in web development, I love building innovative solutions that solve real-world problems.

### 🎯 What I Do
- **Web Development**: Building responsive web applications using Python Flask, HTML, CSS, and JavaScript
- **Database Management**: Designing and implementing database systems using MySQL and SQLite
- **Cloud Computing**: Learning and implementing cloud-based solutions and deployment strategies

### 📊 Quick Stats
- **CGPA**: 8.53/10
- **Projects**: 3+ completed
- **Certifications**: 3+ earned
- **Specialization**: Cloud Computing

## ✨ Features

- 🎨 **Modern UI/UX**: Beautiful, responsive design with smooth animations
- 📱 **Mobile-First**: Fully responsive across all devices
- ⚡ **Fast Performance**: Built with Vite for optimal loading speeds
- 🎯 **Interactive Elements**: Smooth scrolling, hover effects, and dynamic content
- 📊 **Data-Driven**: Portfolio content managed through CSV files
- 🌙 **Theme Support**: Dark/light mode compatibility
- 🔍 **SEO Optimized**: Meta tags and structured content
- 📄 **Resume Download**: Direct access to downloadable resume

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS 3.4.17** - Styling
- **Vite 5.4.19** - Build tool
- **React Router DOM 6.30.1** - Routing

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form handling

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Projects Showcased

### 1. Trip Budget Management System
- **Description**: A comprehensive web-based application for trip planning with budget tracking
- **Tech Stack**: Python (Flask), HTML/CSS, Render
- **Features**: Real-time expense tracking, visual budget comparisons
- **Live Demo**: [View Project](https://trip-budget-system.onrender.com/)
- **GitHub**: [Source Code](https://github.com/Premkumark20/Trip_Budget_System)

### 2. Payroll Management System
- **Description**: Secure client-server system with role-based access control
- **Tech Stack**: Python (Flask), SQLite, HTML/CSS, PythonAnywhere
- **Features**: Attendance tracking, automated salary generation, payroll reports
- **Live Demo**: [View Project](https://premkumark20.pythonanywhere.com/)
- **GitHub**: [Source Code](https://github.com/Premkumark20/payroll-dbms)

### 3. SmartBank ATM System
- **Description**: Terminal-based ATM system with secure banking operations
- **Tech Stack**: Python, MySQL, CLI
- **Features**: Secure login, balance inquiry, deposit/withdrawal, transaction history
- **GitHub**: [Source Code](https://github.com/Premkumark20/SmartBank-ATM-System)
- **Type**: Self Project

## 🏆 Certifications

- **Python (Basic)** - HackerRank (May 2025)
- **SQL (Advanced)** - HackerRank (May 2025)
- **Problem Solving (Basic)** - HackerRank (Oct 2024)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Premkumark20/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Usage

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Deployment to GitHub Pages
```bash
# Build and deploy to GitHub Pages
npm run build
npm run deploy
```

### Customization
1. Update portfolio data in `public/data/portfolio.csv`
2. Replace profile image in `public/images/profile.jpg`
3. Update resume in `public/resume/` directory
4. Modify components in `src/components/` as needed

## 📁 Project Structure

```
Portfolio/
├── public/
│   ├── data/
│   │   └── portfolio.csv          # Portfolio data
│   ├── images/
│   │   └── profile.jpg            # Profile image
│   └── resume/
│       └── resume.pdf             # Resume file
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── About.tsx             # About section
│   │   ├── Certifications.tsx    # Certifications section
│   │   ├── Contact.tsx           # Contact section
│   │   ├── Education.tsx         # Education section
│   │   ├── Experience.tsx        # Experience section
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Navigation.tsx        # Navigation component
│   │   ├── Projects.tsx          # Projects section
│   │   └── Skills.tsx            # Skills section
│   ├── lib/
│   │   ├── csvData.ts            # CSV data fetching
│   │   └── utils.ts              # Utility functions
│   ├── pages/
│   │   ├── Index.tsx             # Main page
│   │   └── NotFound.tsx          # 404 page
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts           # Tailwind configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

- **Email**: premkumark182005@gmail.com
- **Phone**: +91 7358266257
- **Location**: Chennai, Tamil Nadu, India
- **LinkedIn**: [Prem Kumar K](https://www.linkedin.com/in/premkumar-k-506922299/)
- **GitHub**: [Premkumark20](https://github.com/Premkumark20)
- **LeetCode**: [premkumark20](https://leetcode.com/u/premkumark20/)
- **Portfolio**: [https://premkumark20.github.io/Portfolio/](https://premkumark20.github.io/Portfolio/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **Star this repository if you found it helpful!**

*Built with ❤️ by Prem Kumar K*

---
