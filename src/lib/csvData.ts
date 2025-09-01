import { Users, User } from "lucide-react";

export interface PortfolioData {
  name: string;
  title: string;
  specialization: string;
  education: string;
  cgpa: string;
  email: string;
  phone: string;
  address: string;
  github_username: string;
  github_link: string;
  linkedin_username: string;
  linkedin_link: string;
  leetcode_username: string;
  leetcode_link: string;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    type: string;
    duration: string;
    category: string;
    github: string | null;
    live: string | null;
  }>;
  certifications: Array<{
    title: string;
    provider: string;
    date: string;
    certificateId: string;
    link: string;
    level: string;
  }>;
}

export const parseCSVData = (csvText: string): PortfolioData => {
  try {
    const lines = csvText.trim().split('\n');
    const data: Record<string, string> = {};
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const firstCommaIndex = line.indexOf(',');
      if (firstCommaIndex !== -1) {
        const field = line.substring(0, firstCommaIndex);
        const value = line.substring(firstCommaIndex + 1);
        data[field] = value;
      }
    }

    const projects = [];
    const certifications = [];

    // Parse projects
    for (let i = 1; i <= 10; i++) {
      const title = data[`project${i}_title`];
      if (title) {
        projects.push({
          title,
          description: data[`project${i}_description`] || '',
          tech: (data[`project${i}_tech`] || '').split(',').map(t => t.trim()).filter(t => t),
          type: data[`project${i}_type`] || '',
          duration: data[`project${i}_duration`] || '',
          category: data[`project${i}_category`] || '',
          github: data[`project${i}_github`] || null,
          live: data[`project${i}_live`] || null,
        });
      }
    }

    // Parse certifications
    for (let i = 1; i <= 10; i++) {
      const title = data[`cert${i}_title`];
      if (title) {
        certifications.push({
          title,
          provider: data[`cert${i}_provider`] || '',
          date: data[`cert${i}_date`] || '',
          certificateId: data[`cert${i}_id`] || '',
          link: data[`cert${i}_link`] || '',
          level: data[`cert${i}_level`] || '',
        });
      }
    }

    return {
      name: data.name || 'PREM KUMAR K',
      title: data.title || 'Computer Science & Engineering Student',
      specialization: data.specialization || 'Specializing in Cloud Computing',
      education: data.education || 'SRM Institute of Science and Technology, Ramapuram | Class of 2027',
      cgpa: data.cgpa || '8.44',
      email: data.email || 'premkumark182005@gmail.com',
      phone: data.phone || '+91 7358266257',
      address: data.address || 'Chennai, Tamil Nadu',
      github_username: data.github_username || 'premkumark20',
      github_link: data.github_link || 'https://github.com/premkumark20',
      linkedin_username: data.linkedin_username || 'premkumar-k-506922299',
      linkedin_link: data.linkedin_link || 'https://www.linkedin.com/in/premkumar-k-506922299/',
      leetcode_username: data.leetcode_username || 'premkumark20',
      leetcode_link: data.leetcode_link || 'https://leetcode.com/u/premkumark20/',
      projects,
      certifications,
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return getDefaultData();
  }
};

const getDefaultData = (): PortfolioData => ({
  name: 'PREM KUMAR K',
  title: 'Computer Science & Engineering Student',
  specialization: 'Specializing in Cloud Computing',
  education: 'SRM Institute of Science and Technology, Ramapuram | Class of 2027',
  cgpa: '8.44',
  email: 'premkumark182005@gmail.com',
  phone: '+91 7358266257',
  address: 'Chennai, Tamil Nadu',
  github_username: 'premkumark20',
  github_link: 'https://github.com/premkumark20',
  linkedin_username: 'premkumar-k-506922299',
  linkedin_link: 'https://www.linkedin.com/in/premkumar-k-506922299/',
  leetcode_username: 'premkumark20',
  leetcode_link: 'https://leetcode.com/u/premkumark20/',
  projects: [
    {
      title: "Trip Budget Management System",
      description: "A comprehensive web-based application that allows users to plan trips by setting budgets, recording expenses, and tracking spending across categories to ensure cost-effective travel. Features real-time expense tracking and visual budget comparisons.",
      tech: ["Python (Flask)", "HTML/CSS", "Render", "Web Development"],
      type: "Team Project",
      duration: "Oct 2024 - Dec 2025",
      category: "Web Development / Expense Management",
      github: "https://github.com/Premkumark20/Trip_Budget_System",
      live: "https://trip-budget-system.onrender.com/",
    },
    {
      title: "Payroll Management System",
      description: "A secure client-server Payroll Management System with role-based access for employees and administrators. Features attendance tracking, automated salary generation, and comprehensive payroll report generation.",
      tech: ["Python (Flask)", "SQLite", "HTML/CSS", "PythonAnywhere"],
      type: "Team Project",
      duration: "Feb 2025 - Apr 2025",
      category: "Web Development / Payroll Automation",
      github: "https://github.com/Premkumark20/payroll-dbms",
      live: "https://premkumark20.github.io/payroll-dbms",
    },
    {
      title: "SmartBank ATM System",
      description: "A terminal-based ATM system with secure login, balance inquiry, deposit, withdrawal, and transaction history features. Integrated with MySQL for real-time data handling and includes transaction logging with security features.",
      tech: ["Python", "MySQL", "CLI", "Database Management"],
      type: "Self Project",
      duration: "May 2023 - Oct 2023",
      category: "Banking and Financial Systems",
      github: null,
      live: null,
    }
  ],
  certifications: [
    {
      title: "Python (Basic)",
      provider: "HackerRank",
      date: "May 2025",
      certificateId: "FCBD185CAAF2",
      link: "https://www.hackerrank.com/certificates/fcbd185caaf2",
      level: "Basic",
    },
    {
      title: "SQL (Advanced)",
      provider: "HackerRank",
      date: "May 2025",
      certificateId: "0EF7C15C6361",
      link: "https://www.hackerrank.com/certificates/0ef7c15c6361",
      level: "Advanced",
    },
    {
      title: "Problem Solving (Basic)",
      provider: "HackerRank",
      date: "Oct 2024",
      certificateId: "D10E8DA3EEF5",
      link: "https://www.hackerrank.com/certificates/d10e8da3eef5",
      level: "Basic",
    }
  ],
});

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  try {
    // Cloud storage CSV URL - replace with your Google Drive or OneDrive share link
    // For Google Drive: Use the direct download link format
    // For OneDrive: Use the direct download link format
    const CSV_URL = process.env.VITE_CSV_URL || '/data/portfolio.csv';
    
    // Add cache-busting parameter to ensure fresh data
    const cacheBuster = new Date().getTime();
    const csvUrl = CSV_URL.includes('http') 
      ? `${CSV_URL}&cachebust=${cacheBuster}`
      : `${CSV_URL}?v=${cacheBuster}`;
    
    const response = await fetch(csvUrl, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      console.warn(`CSV fetch failed with status ${response.status}, using default data`);
      return getDefaultData();
    }
    
    const csvText = await response.text();
    if (!csvText.trim()) {
      console.warn('CSV file is empty, using default data');
      return getDefaultData();
    }
    
    const parsedData = parseCSVData(csvText);
    console.log('Successfully loaded portfolio data from CSV');
    return parsedData;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    console.log('Falling back to default data');
    return getDefaultData();
  }
};