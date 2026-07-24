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
  statusBadge: string;
  heroTags: string[];
  bioSummary: string;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    type: string;
    duration: string;
    category: string;
    github: string | null;
    live: string | null;
    progress: number;
  }>;
  certifications: Array<{
    title: string;
    provider: string;
    date: string;
    certificateId: string;
    link: string;
    level: string;
  }>;
  educationList: Array<{
    type: string;
    institution: string;
    location: string;
    degree: string;
    specialization: string;
    period: string;
    score: string;
    statusBadge: string;
    isPrimary: boolean;
  }>;
  servicesList: Array<{
    title: string;
    desc: string;
    tech: string[];
  }>;
  skillsList: Array<{
    category: string;
    skills: string[];
  }>;
  statsList: Array<{
    label: string;
    value: string;
    subtext: string;
  }>;
}

export const parseCSVData = (csvText: string): PortfolioData => {
  try {
    const lines = csvText.trim().split('\n');
    const data: Record<string, string> = {};
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const firstCommaIndex = line.indexOf(',');
      if (firstCommaIndex !== -1) {
        const field = line.substring(0, firstCommaIndex).trim();
        let value = line.substring(firstCommaIndex + 1).trim();
        // Clean trailing commas added by Google Sheets export (e.g. "PREM,,,,,,,,")
        value = value.replace(/,+$/, '').trim();
        // Strip wrapping quotes if exported with quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1).trim();
        }
        data[field] = value;
      }
    }

    const projects = [];
    const certifications = [];
    const educationList = [];
    const servicesList = [];
    const skillsList = [];
    const statsList = [];

    // Parse projects
    for (let i = 1; i <= 10; i++) {
      const title = data[`project${i}_title`];
      if (title) {
        const rawProgress = parseInt(data[`project${i}_progress`], 10);
        const progress = !isNaN(rawProgress) ? rawProgress : Math.max(50, 90 - (i - 1) * 10);

        projects.push({
          title,
          description: data[`project${i}_description`] || '',
          tech: (data[`project${i}_tech`] || '').split(',').map(t => t.trim()).filter(t => t),
          type: data[`project${i}_type`] || '',
          duration: data[`project${i}_duration`] || '',
          category: data[`project${i}_category`] || '',
          github: data[`project${i}_github`] || null,
          live: data[`project${i}_live`] || null,
          progress,
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

    // Parse education items
    for (let i = 1; i <= 10; i++) {
      const degree = data[`edu${i}_degree`];
      if (degree) {
        let score = data[`edu${i}_score`] || '';
        if (i === 1 && data.cgpa) {
          score = score.includes('CGPA') ? `${data.cgpa} CGPA` : data.cgpa;
        }
        educationList.push({
          type: data[`edu${i}_type`] || (i === 1 ? 'Degree' : i === 2 ? 'High School' : 'Secondary School'),
          institution: data[`edu${i}_institution`] || '',
          location: data[`edu${i}_location`] || '',
          degree,
          specialization: data[`edu${i}_specialization`] || '',
          period: data[`edu${i}_period`] || '',
          score,
          statusBadge: data[`edu${i}_status`] || (i === 1 ? 'Currently Enrolled' : 'Completed'),
          isPrimary: i === 1,
        });
      }
    }

    // Parse services
    for (let i = 1; i <= 10; i++) {
      const title = data[`service${i}_title`];
      if (title) {
        servicesList.push({
          title,
          desc: data[`service${i}_desc`] || '',
          tech: (data[`service${i}_tech`] || '').split(',').map(t => t.trim()).filter(t => t),
        });
      }
    }

    // Parse skills
    for (let i = 1; i <= 10; i++) {
      const category = data[`skill${i}_title`];
      if (category) {
        skillsList.push({
          category,
          skills: (data[`skill${i}_items`] || '').split(',').map(s => s.trim()).filter(s => s),
        });
      }
    }

    // Parse stats
    for (let i = 1; i <= 10; i++) {
      const label = data[`stat${i}_label`];
      if (label) {
        statsList.push({
          label,
          value: data[`stat${i}_value`] || '',
          subtext: data[`stat${i}_subtext`] || '',
        });
      }
    }

    const heroTags = (data.hero_tags || '').split(',').map(t => t.trim()).filter(Boolean);

    return {
      name: data.name || '',
      title: data.title || '',
      specialization: data.specialization || '',
      education: data.education || '',
      cgpa: data.cgpa || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      github_username: data.github_username || '',
      github_link: data.github_link || '',
      linkedin_username: data.linkedin_username || '',
      linkedin_link: data.linkedin_link || '',
      leetcode_username: data.leetcode_username || '',
      leetcode_link: data.leetcode_link || '',
      statusBadge: data.status_badge || '',
      heroTags,
      bioSummary: data.bio_summary || '',
      projects,
      certifications,
      educationList,
      servicesList,
      skillsList,
      statsList,
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return getDefaultData();
  }
};

const getDefaultData = (): PortfolioData => ({
  name: '',
  title: '',
  specialization: '',
  education: '',
  cgpa: '',
  email: '',
  phone: '',
  address: '',
  github_username: '',
  github_link: '',
  linkedin_username: '',
  linkedin_link: '',
  leetcode_username: '',
  leetcode_link: '',
  statusBadge: '',
  heroTags: [],
  bioSummary: '',
  projects: [],
  certifications: [],
  educationList: [],
  servicesList: [],
  skillsList: [],
  statsList: [],
});

// ── Singleton cache ──────────────────────────────────────────────────────────
// The portfolio data is fetched ONCE per page-load and shared by every
// component (Navigation, Hero, About, Footer …). No component ever triggers a
// second network request.
let _cachedData: PortfolioData | null = null;
let _fetchPromise: Promise<PortfolioData> | null = null;

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  // Return in-memory cache immediately (fastest path)
  if (_cachedData) return _cachedData;

  // If a fetch is already in-flight, reuse that promise
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = _doFetch();
  _cachedData = await _fetchPromise;
  return _cachedData;
};

const _doFetch = async (): Promise<PortfolioData> => {
  const cacheBuster = `${Date.now()}`;

  // ── 1. Local static CSV (always bundled with the site — fastest, always works) ──
  try {
    const base = (import.meta as any).env?.BASE_URL || './';
    const localCsvUrl = `${base}data/portfolio.csv?v=${cacheBuster}`;
    const res = await fetch(localCsvUrl, { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim()) {
        console.log('Portfolio data loaded from local CSV.');
        const localData = parseCSVData(text);
        // Update cache with local data so components render immediately
        _cachedData = localData;

        // ── 2. Background refresh from Google Sheets (updates cache silently) ──
        _refreshFromSheets();

        return localData;
      }
    }
  } catch {
    console.warn('Local CSV fetch failed, trying Google Sheets directly...');
  }

  // ── 3. Direct Google Sheets fetch if local CSV unavailable ──
  const driveResult = await _fetchFromSheets();
  if (driveResult) return driveResult;

  // ── 4. Last resort empty defaults ──
  return getDefaultData();
};

const _fetchFromSheets = async (): Promise<PortfolioData | null> => {
  const driveUrl = (import.meta as any).env?.VITE_CSV_URL || (process as any).env?.VITE_CSV_URL;
  if (!driveUrl || !driveUrl.trim().startsWith('http')) return null;

  let targetUrl = driveUrl.trim();
  if (targetUrl.includes('docs.google.com/spreadsheets/d/')) {
    if (!targetUrl.includes('/pub?') && !targetUrl.includes('/export?')) {
      const match = targetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      if (match?.[1]) {
        targetUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
      }
    }
  }

  const fullUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
  const fetchOpts: RequestInit = {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0', 'Pragma': 'no-cache' },
  };

  const tryFetch = async (url: string): Promise<PortfolioData> => {
    const res = await fetch(url, fetchOpts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text?.trim() || (!text.includes('field') && !text.includes('name'))) throw new Error('Invalid CSV');
    console.log('Portfolio data loaded from Google Sheets via:', url);
    return parseCSVData(text);
  };

  try {
    return await Promise.any([
      fullUrl,
      `https://corsproxy.io/?${encodeURIComponent(fullUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`,
    ].map(tryFetch));
  } catch {
    console.warn('All Google Sheets candidates failed.');
    return null;
  }
};

// Silently refreshes the cache from Google Sheets in the background
// after local data has already been served to components.
const _refreshFromSheets = async () => {
  const fresh = await _fetchFromSheets();
  if (fresh) {
    _cachedData = fresh;
    console.log('Cache updated with latest Google Sheets data.');
  }
};