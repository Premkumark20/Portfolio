import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = (import.meta as any).env?.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

export function capitalizeWords(str: string): string {
  if (!str) return '';

  // Handle comma-separated lists (e.g., tags "react, typeScript, tailwindcss")
  if (str.includes(',')) {
    return str
      .split(',')
      .map(s => capitalizeWords(s.trim()))
      .filter(Boolean)
      .join(', ');
  }

  const techDictionary: Record<string, string> = {
    'html': 'HTML',
    'css': 'CSS',
    'js': 'JS',
    'ts': 'TS',
    'sql': 'SQL',
    'api': 'API',
    'apis': 'APIs',
    'ml': 'ML',
    'ai': 'AI',
    'ui': 'UI',
    'ux': 'UX',
    'rest': 'REST',
    'restful': 'RESTful',
    'json': 'JSON',
    'csv': 'CSV',
    'sih': 'SIH',
    'srm': 'SRM',
    'gpa': 'GPA',
    'cgpa': 'CGPA',
    'cbse': 'CBSE',
    'typescript': 'TypeScript',
    'tailwindcss': 'TailwindCSS',
    'javascript': 'JavaScript',
    'react': 'React',
    'node.js': 'Node.js',
    'next.js': 'Next.js',
    'express.js': 'Express.js',
    'vue.js': 'Vue.js',
    'python': 'Python',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'docker': 'Docker',
    'fastapi': 'FastAPI',
    'pytorch': 'PyTorch',
  };

  const monthsDictionary: Record<string, string> = {
    'jan': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'apr': 'Apr',
    'may': 'May', 'jun': 'Jun', 'jul': 'Jul', 'aug': 'Aug',
    'sep': 'Sep', 'oct': 'Oct', 'nov': 'Nov', 'dec': 'Dec',
    'january': 'January', 'february': 'February', 'march': 'March',
    'april': 'April', 'june': 'June', 'july': 'July',
    'august': 'August', 'september': 'September', 'october': 'October',
    'november': 'November', 'december': 'December'
  };

  const capWord = (w: string): string => {
    if (!w) return '';
    const lower = w.toLowerCase();

    if (techDictionary[lower]) return techDictionary[lower];
    if (monthsDictionary[lower]) return monthsDictionary[lower];

    if (w.includes("'")) {
      const parts = w.split("'");
      return capWord(parts[0]) + "'" + parts.slice(1).join("'").toLowerCase();
    }

    if (w.includes('.') && !w.endsWith('.')) {
      const parts = w.split('.');
      return parts.map(p => capWord(p)).join('.');
    }

    if (w.includes('-')) {
      const parts = w.split('-');
      return parts.map(p => capWord(p)).join('-');
    }

    if (w.includes('/')) {
      const parts = w.split('/');
      return parts.map(p => capWord(p)).join(' / ');
    }

    return w.charAt(0).toUpperCase() + w.slice(1);
  };

  return str
    .split(/\s+/)
    .map(w => capWord(w))
    .join(' ');
}


