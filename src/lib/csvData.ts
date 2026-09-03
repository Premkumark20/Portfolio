import { Users, User } from "lucide-react";
import { supabase } from "./supabaseClient";
import { DEFAULT_PORTFOLIO_CSV } from "@/data/defaultPortfolioCsv";

export interface ExperienceItem {
  id?: string;
  order?: number;
  role: string;
  company: string;
  location: string;
  duration: string;
  summary: string;
  tags: string[];
  gradient?: string;
}

export interface ResumeItem {
  id: string;
  name: string;
  uploadDate: string;
  fileData: string;
  isPrimary: boolean;
}

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
  resumes?: ResumeItem[];
  experiences: ExperienceItem[];
  projects: Array<{
    order?: number;
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
    order?: number;
    title: string;
    provider: string;
    date: string;
    certificateId: string;
    link: string;
    level: string;
  }>;
  educationList: Array<{
    order?: number;
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
    order?: number;
    title: string;
    desc: string;
    tech: string[];
  }>;
  skillsList: Array<{
    order?: number;
    category: string;
    skills: string[];
  }>;
  statsList: Array<{
    order?: number;
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

    const resumes: ResumeItem[] = [];
    const experiences: ExperienceItem[] = [];
    const projects = [];
    const certifications = [];
    const educationList = [];
    const servicesList = [];
    const skillsList = [];
    const statsList = [];

    // Parse resumes
    for (let i = 1; i <= 10; i++) {
      const name = data[`resume${i}_name`];
      if (name) {
        resumes.push({
          id: `resume-${i}`,
          name,
          uploadDate: data[`resume${i}_date`] || '',
          fileData: data[`resume${i}_file`] || '',
          isPrimary: data[`resume${i}_primary`] === 'true',
        });
      }
    }

    if (resumes.length === 0) {
      resumes.push({
        id: 'resume-1',
        name: 'Prem_Kumar_Resume.pdf',
        uploadDate: 'May 2025',
        fileData: '/resume/Prem_Kumar_Resume.pdf',
        isPrimary: true,
      });
    }

    // Parse experiences
    for (let i = 1; i <= 15; i++) {
      const role = data[`exp${i}_role`];
      if (role) {
        const rawOrder = parseInt(data[`exp${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        experiences.push({
          id: `exp-${i}`,
          order,
          role,
          company: data[`exp${i}_company`] || '',
          location: data[`exp${i}_location`] || '',
          duration: data[`exp${i}_duration`] || '',
          summary: data[`exp${i}_summary`] || '',
          tags: (data[`exp${i}_tags`] || '').split(',').map(t => t.trim()).filter(Boolean),
          gradient: data[`exp${i}_gradient`] || 'from-primary to-primary-glow',
        });
      }
    }
    experiences.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Parse projects
    for (let i = 1; i <= 15; i++) {
      const title = data[`project${i}_title`];
      if (title) {
        const rawOrder = parseInt(data[`project${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        const rawProgress = parseInt(data[`project${i}_progress`], 10);
        const progress = !isNaN(rawProgress) ? rawProgress : Math.max(50, 90 - (i - 1) * 10);

        projects.push({
          order,
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
    projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Parse certifications
    for (let i = 1; i <= 15; i++) {
      const title = data[`cert${i}_title`];
      if (title) {
        const rawOrder = parseInt(data[`cert${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        certifications.push({
          order,
          title,
          provider: data[`cert${i}_provider`] || '',
          date: data[`cert${i}_date`] || '',
          certificateId: data[`cert${i}_id`] || '',
          link: data[`cert${i}_link`] || '',
          level: data[`cert${i}_level`] || '',
        });
      }
    }
    certifications.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Parse education items
    for (let i = 1; i <= 15; i++) {
      const degree = data[`edu${i}_degree`];
      if (degree) {
        const rawOrder = parseInt(data[`edu${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        let score = data[`edu${i}_score`] || '';
        if (i === 1 && data.cgpa) {
          score = score.includes('CGPA') ? `${data.cgpa} CGPA` : data.cgpa;
        }
        educationList.push({
          order,
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
    educationList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Parse services
    for (let i = 1; i <= 15; i++) {
      const title = data[`service${i}_title`];
      if (title) {
        const rawOrder = parseInt(data[`service${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        servicesList.push({
          order,
          title,
          desc: data[`service${i}_desc`] || '',
          tech: (data[`service${i}_tech`] || '').split(',').map(t => t.trim()).filter(t => t),
        });
      }
    }
    servicesList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Parse skills
    for (let i = 1; i <= 15; i++) {
      const category = data[`skill${i}_title`];
      if (category) {
        const rawOrder = parseInt(data[`skill${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        skillsList.push({
          order,
          category,
          skills: (data[`skill${i}_items`] || '').split(',').map(s => s.trim()).filter(s => s),
        });
      }
    }
    skillsList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Parse stats
    for (let i = 1; i <= 10; i++) {
      const label = data[`stat${i}_label`];
      if (label) {
        const rawOrder = parseInt(data[`stat${i}_order`], 10);
        const order = !isNaN(rawOrder) ? rawOrder : i;
        statsList.push({
          order,
          label,
          value: data[`stat${i}_value`] || '',
          subtext: data[`stat${i}_subtext`] || '',
        });
      }
    }
    statsList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
      resumes,
      experiences,
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

export const generateCSVFromData = (data: PortfolioData): string => {
  const lines: string[] = ['field,value'];

  const addLine = (field: string, value: any) => {
    if (value === null || value === undefined) {
      lines.push(`${field},`);
      return;
    }
    const valStr = String(value);
    if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n')) {
      lines.push(`${field},"${valStr.replace(/"/g, '""')}"`);
    } else {
      lines.push(`${field},${valStr}`);
    }
  };

  addLine('name', data.name);
  addLine('title', data.title);
  addLine('specialization', data.specialization);
  addLine('education', data.education);
  addLine('cgpa', data.cgpa);
  addLine('email', data.email);
  addLine('phone', data.phone);
  addLine('address', data.address);
  addLine('github_username', data.github_username);
  addLine('github_link', data.github_link);
  addLine('linkedin_username', data.linkedin_username);
  addLine('linkedin_link', data.linkedin_link);
  addLine('leetcode_username', data.leetcode_username);
  addLine('leetcode_link', data.leetcode_link);
  addLine('status_badge', data.statusBadge);
  addLine('hero_tags', data.heroTags ? data.heroTags.join(', ') : '');
  addLine('bio_summary', data.bioSummary);

  // Resumes
  (data.resumes || []).forEach((res, i) => {
    const idx = i + 1;
    addLine(`resume${idx}_name`, res.name);
    addLine(`resume${idx}_date`, res.uploadDate);
    addLine(`resume${idx}_file`, res.fileData);
    addLine(`resume${idx}_primary`, res.isPrimary ? 'true' : 'false');
  });

  // Stats
  (data.statsList || []).forEach((stat, i) => {
    const idx = i + 1;
    addLine(`stat${idx}_order`, idx);
    addLine(`stat${idx}_label`, stat.label);
    addLine(`stat${idx}_value`, stat.value);
    addLine(`stat${idx}_subtext`, stat.subtext);
  });

  // Services
  (data.servicesList || []).forEach((srv, i) => {
    const idx = i + 1;
    addLine(`service${idx}_order`, idx);
    addLine(`service${idx}_title`, srv.title);
    addLine(`service${idx}_desc`, srv.desc);
    addLine(`service${idx}_tech`, srv.tech ? srv.tech.join(', ') : '');
  });

  // Skills
  (data.skillsList || []).forEach((sk, i) => {
    const idx = i + 1;
    addLine(`skill${idx}_order`, idx);
    addLine(`skill${idx}_title`, sk.category);
    addLine(`skill${idx}_items`, sk.skills ? sk.skills.join(', ') : '');
  });

  // Projects
  (data.projects || []).forEach((proj, i) => {
    const idx = i + 1;
    addLine(`project${idx}_order`, idx);
    addLine(`project${idx}_title`, proj.title);
    addLine(`project${idx}_description`, proj.description);
    addLine(`project${idx}_tech`, proj.tech ? proj.tech.join(', ') : '');
    addLine(`project${idx}_type`, proj.type);
    addLine(`project${idx}_duration`, proj.duration);
    addLine(`project${idx}_category`, proj.category);
    addLine(`project${idx}_github`, proj.github || '');
    addLine(`project${idx}_live`, proj.live || '');
    addLine(`project${idx}_progress`, proj.progress);
  });

  // Certifications
  (data.certifications || []).forEach((cert, i) => {
    const idx = i + 1;
    addLine(`cert${idx}_order`, idx);
    addLine(`cert${idx}_title`, cert.title);
    addLine(`cert${idx}_provider`, cert.provider);
    addLine(`cert${idx}_date`, cert.date);
    addLine(`cert${idx}_id`, cert.certificateId);
    addLine(`cert${idx}_link`, cert.link);
    addLine(`cert${idx}_level`, cert.level);
  });

  // Education
  (data.educationList || []).forEach((edu, i) => {
    const idx = i + 1;
    addLine(`edu${idx}_order`, idx);
    addLine(`edu${idx}_type`, edu.type);
    addLine(`edu${idx}_institution`, edu.institution);
    addLine(`edu${idx}_location`, edu.location);
    addLine(`edu${idx}_degree`, edu.degree);
    addLine(`edu${idx}_specialization`, edu.specialization);
    addLine(`edu${idx}_period`, edu.period);
    addLine(`edu${idx}_score`, edu.score);
    addLine(`edu${idx}_status`, edu.statusBadge);
  });

  // Experiences
  (data.experiences || []).forEach((exp, i) => {
    const idx = i + 1;
    addLine(`exp${idx}_order`, idx);
    addLine(`exp${idx}_role`, exp.role);
    addLine(`exp${idx}_company`, exp.company);
    addLine(`exp${idx}_location`, exp.location);
    addLine(`exp${idx}_duration`, exp.duration);
    addLine(`exp${idx}_summary`, exp.summary);
    addLine(`exp${idx}_tags`, exp.tags ? exp.tags.join(', ') : '');
    addLine(`exp${idx}_gradient`, exp.gradient || '');
  });

  return lines.join('\n');
};

const STORAGE_KEY = 'portfolio_custom_csv_data';

export const saveCSVToStorage = (csvText: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, csvText);
  } catch (err) {
    console.error('Error saving CSV to localStorage:', err);
  }
};

export const loadCSVFromStorage = (): string | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || !raw.trim()) return null;
    const parsed = parseCSVData(raw);
    if (!parsed.name || !parsed.name.trim()) {
      console.warn('Disregarding invalid or empty CSV from localStorage.');
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return raw;
  } catch (err) {
    console.error('Error loading CSV from localStorage:', err);
    return null;
  }
};

export const clearCSVFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing CSV from localStorage:', err);
  }
};

let _defaultParsedData: PortfolioData | null = null;

export const getDefaultData = (): PortfolioData => {
  if (!_defaultParsedData) {
    _defaultParsedData = parseCSVData(DEFAULT_PORTFOLIO_CSV);
  }
  return _defaultParsedData;
};

export const getInitialPortfolioData = (): PortfolioData => {
  const customCsv = loadCSVFromStorage();
  if (customCsv && customCsv.trim()) {
    const parsed = parseCSVData(customCsv);
    if (parsed.name && parsed.name.trim()) {
      _cachedData = parsed;
      return parsed;
    }
    clearCSVFromStorage();
  }
  const defaultData = getDefaultData();
  _cachedData = defaultData;
  return defaultData;
};

// ── Singleton cache ──────────────────────────────────────────────────────────
let _cachedData: PortfolioData | null = null;
let _fetchPromise: Promise<PortfolioData> | null = null;

let _supabaseReachable = true;

export const saveCSVToServer = async (csvText: string) => {
  try {
    await fetch('/api/portfolio/save', {
      method: 'POST',
      headers: { 'Content-Type': 'text/csv' },
      body: csvText,
    });
  } catch (err) {
    console.warn('Could not persist CSV to server endpoint:', err);
  }
};

export const saveCSVToSupabase = async (csvText: string) => {
  if (!supabase || !_supabaseReachable) return;
  try {
    const { error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 'main', content: csvText, updated_at: new Date().toISOString() });
    if (error) {
      _supabaseReachable = false;
      console.info('Supabase project paused or unreachable. Data is safely stored locally.');
    } else {
      console.log('Portfolio CSV saved to Supabase cloud database.');
    }
  } catch (err: any) {
    _supabaseReachable = false;
    console.info('Supabase project paused or unreachable. Data is safely stored locally.');
  }
};

export const updateCachedData = (newData: PortfolioData) => {
  _cachedData = newData;
  const csv = generateCSVFromData(newData);
  saveCSVToStorage(csv);
  saveCSVToServer(csv);
  saveCSVToSupabase(csv);
};

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  if (_cachedData && _cachedData.name) return _cachedData;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = _doFetch();
  _cachedData = await _fetchPromise;
  return _cachedData;
};

const _doFetch = async (): Promise<PortfolioData> => {
  // 1. Check valid custom stored CSV first
  const customCsv = loadCSVFromStorage();
  if (customCsv && customCsv.trim()) {
    const localData = parseCSVData(customCsv);
    if (localData.name && localData.name.trim()) {
      console.log('Portfolio data loaded from custom stored CSV.');
      _cachedData = localData;
      return localData;
    }
  }

  // 2. Instant fetch static portfolio.csv file (from dist/public /data/portfolio.csv)
  try {
    const cacheBuster = `${Date.now()}`;
    const base = (import.meta as any).env?.BASE_URL || './';
    const urls = [
      `${base}data/portfolio.csv?v=${cacheBuster}`,
      `/data/portfolio.csv?v=${cacheBuster}`,
      `./data/portfolio.csv?v=${cacheBuster}`,
      `data/portfolio.csv?v=${cacheBuster}`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          if (text && text.trim() && text.includes('field') && text.includes('name')) {
            const parsed = parseCSVData(text);
            if (parsed.name && parsed.name.trim()) {
              console.log('Portfolio data loaded from local CSV file:', url);
              _cachedData = parsed;
              return parsed;
            }
          }
        }
      } catch {}
    }
  } catch (error) {
    console.warn('Local CSV fetch error:', error);
  }

  // 3. Fallback: Query Supabase only if local CSV was unavailable and Supabase is reachable
  if (supabase && _supabaseReachable) {
    try {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase fetch timed out')), 2000)
      );

      const fetchPromise = (async () => {
        const { data: row, error } = await supabase
          .from('portfolio_data')
          .select('content')
          .eq('id', 'main')
          .maybeSingle();

        if (error || !row?.content) return null;
        return row.content;
      })();

      const content = await Promise.race([fetchPromise, timeoutPromise]);
      if (content && typeof content === 'string' && content.trim()) {
        const supabaseData = parseCSVData(content);
        if (supabaseData.name && supabaseData.name.trim()) {
          console.log('Portfolio data loaded from Supabase Cloud Database.');
          _cachedData = supabaseData;
          return supabaseData;
        }
      }
    } catch (err: any) {
      _supabaseReachable = false;
      console.info('Supabase cloud fetch skipped/unavailable, using bundled portfolio data.');
    }
  }

  // 4. Default guaranteed fallback loaded from bundled portfolio.csv
  const fallback = getDefaultData();
  _cachedData = fallback;
  return fallback;
};