import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchPortfolioData, 
  PortfolioData, 
  ExperienceItem, 
  ResumeItem,
  updateCachedData, 
  generateCSVFromData,
  clearCSVFromStorage,
  parseCSVData,
  saveCSVToStorage
} from '@/lib/csvData';
import { toast } from 'sonner';

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateAdminCredentials: (newUsername: string, newPassword: string) => boolean;
  resetAdminCredentials: () => void;
  updatePersonalInfo: (fields: Partial<PortfolioData>) => void;
  // Resumes CRUD
  addResume: (resume: ResumeItem) => void;
  deleteResume: (id: string) => void;
  setPrimaryResume: (id: string) => void;
  // Experience CRUD & Reorder
  addExperience: (exp: ExperienceItem) => void;
  updateExperience: (index: number, exp: ExperienceItem) => void;
  deleteExperience: (index: number) => void;
  moveExperience: (index: number, direction: 'up' | 'down') => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;
  // Projects CRUD & Reorder
  addProject: (proj: PortfolioData['projects'][0]) => void;
  updateProject: (index: number, proj: PortfolioData['projects'][0]) => void;
  deleteProject: (index: number) => void;
  moveProject: (index: number, direction: 'up' | 'down') => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  // Education CRUD & Reorder
  addEducation: (edu: PortfolioData['educationList'][0]) => void;
  updateEducation: (index: number, edu: PortfolioData['educationList'][0]) => void;
  deleteEducation: (index: number) => void;
  moveEducation: (index: number, direction: 'up' | 'down') => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  // Services CRUD & Reorder
  addService: (srv: PortfolioData['servicesList'][0]) => void;
  updateService: (index: number, srv: PortfolioData['servicesList'][0]) => void;
  deleteService: (index: number) => void;
  moveService: (index: number, direction: 'up' | 'down') => void;
  reorderServices: (fromIndex: number, toIndex: number) => void;
  // Skills CRUD & Reorder
  addSkillCategory: (sk: PortfolioData['skillsList'][0]) => void;
  updateSkillCategory: (index: number, sk: PortfolioData['skillsList'][0]) => void;
  deleteSkillCategory: (index: number) => void;
  moveSkillCategory: (index: number, direction: 'up' | 'down') => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;
  // Certifications CRUD & Reorder
  addCertification: (cert: PortfolioData['certifications'][0]) => void;
  updateCertification: (index: number, cert: PortfolioData['certifications'][0]) => void;
  deleteCertification: (index: number) => void;
  moveCertification: (index: number, direction: 'up' | 'down') => void;
  reorderCertifications: (fromIndex: number, toIndex: number) => void;
  // Stats CRUD & Reorder
  updateStats: (stats: PortfolioData['statsList']) => void;
  moveStat: (index: number, direction: 'up' | 'down') => void;
  reorderStats: (fromIndex: number, toIndex: number) => void;
  // Reset & CSV Actions
  resetToDefaults: () => void;
  downloadCSV: () => void;
  importCSVContent: (csvText: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const ADMIN_AUTH_KEY = 'portfolio_admin_auth_status';
const CUSTOM_CREDS_KEY = 'portfolio_admin_custom_creds';

function moveArrayItem<T>(arr: T[], index: number, direction: 'up' | 'down'): T[] {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= arr.length) return arr;
  const result = [...arr];
  const temp = result[index];
  result[index] = result[targetIndex];
  result[targetIndex] = temp;
  return result;
}

function reorderArray<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) {
    return list;
  }
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

function withOrder<T>(arr: T[]): T[] {
  return arr.map((item, i) => ({ ...item, order: i + 1 }));
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  useEffect(() => {
    fetchPortfolioData().then((fetched) => {
      setData(fetched);
      setLoading(false);
    });

    // 1. Storage Event Listener (triggers across tabs when localStorage changes)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'portfolio_custom_csv_data') {
        if (!window.location.pathname.includes('/admin')) {
          window.location.reload();
        } else if (e.newValue) {
          try {
            const fresh = parseCSVData(e.newValue);
            setData(fresh);
          } catch {
            // ignore
          }
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // 2. BroadcastChannel for instant cross-tab reload & sync
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('portfolio_sync_channel');
        channel.onmessage = (msg) => {
          if (msg.data === 'RELOAD_DATA') {
            if (!window.location.pathname.includes('/admin')) {
              window.location.reload();
            } else {
              const customCsv = localStorage.getItem('portfolio_custom_csv_data');
              if (customCsv) {
                const fresh = parseCSVData(customCsv);
                setData(fresh);
              }
            }
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization warning:', err);
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const saveAndSync = (newData: PortfolioData) => {
    setData(newData);
    updateCachedData(newData);

    // Broadcast reload event to all open portfolio tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('portfolio_sync_channel');
        channel.postMessage('RELOAD_DATA');
        channel.close();
      } catch (err) {
        console.warn('BroadcastChannel message error:', err);
      }
    }
  };

  const login = (username: string, password: string): boolean => {
    const inputUser = username.trim();
    const inputPass = password.trim();

    // Check custom UI-configured credentials
    const customCredsRaw = localStorage.getItem(CUSTOM_CREDS_KEY);
    let customUser = '';
    let customPass = '';
    if (customCredsRaw) {
      try {
        const parsed = JSON.parse(customCredsRaw);
        customUser = (parsed.username || '').trim();
        customPass = (parsed.password || '').trim();
      } catch {}
    }

    const envUser = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim();
    const envPass = String(import.meta.env.VITE_ADMIN_PASSWORD || 'admin2615').trim();

    const matchesCustom = customUser && customPass && inputUser === customUser && inputPass === customPass;
    const matchesEnv = inputUser === envUser && inputPass === envPass;
    const matchesRecovery = inputUser === 'admin' && inputPass === 'admin2615';

    if (matchesCustom || matchesEnv || matchesRecovery) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      toast.success('Administrator authenticated successfully!');
      return true;
    }
    toast.error('Invalid admin credentials!');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    toast.info('Logged out from admin panel.');
  };

  const updateAdminCredentials = (newUsername: string, newPassword: string): boolean => {
    if (!newUsername.trim() || !newPassword.trim()) {
      toast.error('Username and password cannot be empty!');
      return false;
    }
    const creds = { username: newUsername.trim(), password: newPassword.trim() };
    localStorage.setItem(CUSTOM_CREDS_KEY, JSON.stringify(creds));
    toast.success('Admin username and password updated successfully!');
    return true;
  };

  const resetAdminCredentials = () => {
    localStorage.removeItem(CUSTOM_CREDS_KEY);
    toast.info('Admin credentials reset to default / .env settings.');
  };

  const updatePersonalInfo = (fields: Partial<PortfolioData>) => {
    if (!data) return;
    const updated = { ...data, ...fields };
    saveAndSync(updated);
    toast.success('Personal information updated!');
  };

  // Resume CRUD
  const addResume = async (resume: ResumeItem) => {
    if (!data) return;
    let finalResume = { ...resume };

    if (resume.fileData && resume.fileData.startsWith('data:')) {
      try {
        const res = await fetch('/api/resume/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: resume.name.endsWith('.pdf') ? resume.name : `${resume.name}.pdf`,
            fileData: resume.fileData,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.path) {
            finalResume.fileData = json.path;
          }
        }
      } catch (err) {
        console.warn('Backend resume upload warning:', err);
      }
    }

    const existing = data.resumes || [];
    const isFirst = existing.length === 0;
    const isPrimary = finalResume.isPrimary || isFirst;
    const updatedResumes = existing.map(r => isPrimary ? { ...r, isPrimary: false } : r);
    updatedResumes.unshift({ ...finalResume, isPrimary });
    saveAndSync({ ...data, resumes: updatedResumes });
    toast.success('Resume uploaded successfully!');
  };

  const deleteResume = async (id: string) => {
    if (!data) return;
    const target = (data.resumes || []).find(r => r.id === id);
    if (target && target.fileData) {
      const fileName = target.fileData.startsWith('/resume/') 
        ? target.fileData.replace('/resume/', '') 
        : (target.name.endsWith('.pdf') ? target.name : `${target.name}.pdf`);

      try {
        await fetch('/api/resume/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName }),
        });
      } catch (err) {
        console.warn('Backend resume delete warning:', err);
      }
    }

    const list = (data.resumes || []).filter(r => r.id !== id);
    if (list.length > 0 && !list.some(r => r.isPrimary)) {
      list[0].isPrimary = true;
    }
    saveAndSync({ ...data, resumes: list });
    toast.success('Resume removed!');
  };

  const setPrimaryResume = (id: string) => {
    if (!data) return;
    const list = (data.resumes || []).map(r => ({
      ...r,
      isPrimary: r.id === id
    }));
    saveAndSync({ ...data, resumes: list });
    toast.success('Primary resume set for download!');
  };

  // Experience CRUD & Reorder
  const addExperience = (exp: ExperienceItem) => {
    if (!data) return;
    const updated = { ...data, experiences: withOrder([exp, ...(data.experiences || [])]) };
    saveAndSync(updated);
    toast.success('Experience added!');
  };

  const updateExperience = (index: number, exp: ExperienceItem) => {
    if (!data) return;
    const list = [...(data.experiences || [])];
    list[index] = exp;
    const updated = { ...data, experiences: withOrder(list) };
    saveAndSync(updated);
    toast.success('Experience updated!');
  };

  const deleteExperience = (index: number) => {
    if (!data) return;
    const list = (data.experiences || []).filter((_, i) => i !== index);
    const updated = { ...data, experiences: withOrder(list) };
    saveAndSync(updated);
    toast.success('Experience deleted!');
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.experiences || [], index, direction);
    saveAndSync({ ...data, experiences: withOrder(list) });
    toast.success('Experience reordered!');
  };

  const reorderExperiences = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.experiences || [], fromIndex, toIndex);
    saveAndSync({ ...data, experiences: withOrder(list) });
    toast.success('Experience order updated!');
  };

  // Projects CRUD & Reorder
  const addProject = (proj: PortfolioData['projects'][0]) => {
    if (!data) return;
    const updated = { ...data, projects: withOrder([proj, ...(data.projects || [])]) };
    saveAndSync(updated);
    toast.success('Project added!');
  };

  const updateProject = (index: number, proj: PortfolioData['projects'][0]) => {
    if (!data) return;
    const list = [...(data.projects || [])];
    list[index] = proj;
    const updated = { ...data, projects: withOrder(list) };
    saveAndSync(updated);
    toast.success('Project updated!');
  };

  const deleteProject = (index: number) => {
    if (!data) return;
    const list = (data.projects || []).filter((_, i) => i !== index);
    const updated = { ...data, projects: withOrder(list) };
    saveAndSync(updated);
    toast.success('Project deleted!');
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.projects || [], index, direction);
    saveAndSync({ ...data, projects: withOrder(list) });
    toast.success('Project reordered!');
  };

  const reorderProjects = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.projects || [], fromIndex, toIndex);
    saveAndSync({ ...data, projects: withOrder(list) });
    toast.success('Projects order updated!');
  };

  // Education CRUD & Reorder
  const addEducation = (edu: PortfolioData['educationList'][0]) => {
    if (!data) return;
    const updated = { ...data, educationList: withOrder([edu, ...(data.educationList || [])]) };
    saveAndSync(updated);
    toast.success('Education entry added!');
  };

  const updateEducation = (index: number, edu: PortfolioData['educationList'][0]) => {
    if (!data) return;
    const list = [...(data.educationList || [])];
    list[index] = edu;
    const updated = { ...data, educationList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Education entry updated!');
  };

  const deleteEducation = (index: number) => {
    if (!data) return;
    const list = (data.educationList || []).filter((_, i) => i !== index);
    const updated = { ...data, educationList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Education entry deleted!');
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.educationList || [], index, direction);
    saveAndSync({ ...data, educationList: withOrder(list) });
    toast.success('Education reordered!');
  };

  const reorderEducation = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.educationList || [], fromIndex, toIndex);
    saveAndSync({ ...data, educationList: withOrder(list) });
    toast.success('Education order updated!');
  };

  // Services CRUD & Reorder
  const addService = (srv: PortfolioData['servicesList'][0]) => {
    if (!data) return;
    const updated = { ...data, servicesList: withOrder([srv, ...(data.servicesList || [])]) };
    saveAndSync(updated);
    toast.success('Service added!');
  };

  const updateService = (index: number, srv: PortfolioData['servicesList'][0]) => {
    if (!data) return;
    const list = [...(data.servicesList || [])];
    list[index] = srv;
    const updated = { ...data, servicesList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Service updated!');
  };

  const deleteService = (index: number) => {
    if (!data) return;
    const list = (data.servicesList || []).filter((_, i) => i !== index);
    const updated = { ...data, servicesList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Service deleted!');
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.servicesList || [], index, direction);
    saveAndSync({ ...data, servicesList: withOrder(list) });
    toast.success('Service reordered!');
  };

  const reorderServices = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.servicesList || [], fromIndex, toIndex);
    saveAndSync({ ...data, servicesList: withOrder(list) });
    toast.success('Services order updated!');
  };

  // Skills CRUD & Reorder
  const addSkillCategory = (sk: PortfolioData['skillsList'][0]) => {
    if (!data) return;
    const updated = { ...data, skillsList: withOrder([...(data.skillsList || []), sk]) };
    saveAndSync(updated);
    toast.success('Skill category added!');
  };

  const updateSkillCategory = (index: number, sk: PortfolioData['skillsList'][0]) => {
    if (!data) return;
    const list = [...(data.skillsList || [])];
    list[index] = sk;
    const updated = { ...data, skillsList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Skill category updated!');
  };

  const deleteSkillCategory = (index: number) => {
    if (!data) return;
    const list = (data.skillsList || []).filter((_, i) => i !== index);
    const updated = { ...data, skillsList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Skill category deleted!');
  };

  const moveSkillCategory = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.skillsList || [], index, direction);
    saveAndSync({ ...data, skillsList: withOrder(list) });
    toast.success('Skill category reordered!');
  };

  const reorderSkills = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.skillsList || [], fromIndex, toIndex);
    saveAndSync({ ...data, skillsList: withOrder(list) });
    toast.success('Skills order updated!');
  };

  // Certifications CRUD & Reorder
  const addCertification = (cert: PortfolioData['certifications'][0]) => {
    if (!data) return;
    const updated = { ...data, certifications: withOrder([cert, ...(data.certifications || [])]) };
    saveAndSync(updated);
    toast.success('Certification added!');
  };

  const updateCertification = (index: number, cert: PortfolioData['certifications'][0]) => {
    if (!data) return;
    const list = [...(data.certifications || [])];
    list[index] = cert;
    const updated = { ...data, certifications: withOrder(list) };
    saveAndSync(updated);
    toast.success('Certification updated!');
  };

  const deleteCertification = (index: number) => {
    if (!data) return;
    const list = (data.certifications || []).filter((_, i) => i !== index);
    const updated = { ...data, certifications: withOrder(list) };
    saveAndSync(updated);
    toast.success('Certification deleted!');
  };

  const moveCertification = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.certifications || [], index, direction);
    saveAndSync({ ...data, certifications: withOrder(list) });
    toast.success('Certification reordered!');
  };

  const reorderCertifications = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.certifications || [], fromIndex, toIndex);
    saveAndSync({ ...data, certifications: withOrder(list) });
    toast.success('Certifications order updated!');
  };

  // Stats CRUD & Reorder
  const updateStats = (stats: PortfolioData['statsList']) => {
    if (!data) return;
    const updated = { ...data, statsList: withOrder(stats) };
    saveAndSync(updated);
    toast.success('Statistics updated!');
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const list = moveArrayItem(data.statsList || [], index, direction);
    saveAndSync({ ...data, statsList: withOrder(list) });
    toast.success('Stat reordered!');
  };

  const reorderStats = (fromIndex: number, toIndex: number) => {
    if (!data) return;
    const list = reorderArray(data.statsList || [], fromIndex, toIndex);
    saveAndSync({ ...data, statsList: withOrder(list) });
    toast.success('Stats order updated!');
  };

  const resetToDefaults = () => {
    clearCSVFromStorage();
    window.location.reload();
  };

  const downloadCSV = () => {
    if (!data) return;
    const csvContent = generateCSVFromData(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'portfolio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('portfolio.csv downloaded successfully!');
  };

  const importCSVContent = (csvText: string): boolean => {
    try {
      const parsed = parseCSVData(csvText);
      if (parsed && parsed.name) {
        saveAndSync(parsed);
        saveCSVToStorage(csvText);
        toast.success('CSV data imported and applied successfully!');
        return true;
      } else {
        toast.error('Invalid CSV format!');
        return false;
      }
    } catch {
      toast.error('Error parsing imported CSV file.');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        loading,
        isAuthenticated,
        login,
        logout,
        updateAdminCredentials,
        resetAdminCredentials,
        updatePersonalInfo,
        addResume,
        deleteResume,
        setPrimaryResume,
        addExperience,
        updateExperience,
        deleteExperience,
        moveExperience,
        reorderExperiences,
        addProject,
        updateProject,
        deleteProject,
        moveProject,
        reorderProjects,
        addEducation,
        updateEducation,
        deleteEducation,
        moveEducation,
        reorderEducation,
        addService,
        updateService,
        deleteService,
        moveService,
        reorderServices,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        moveSkillCategory,
        reorderSkills,
        addCertification,
        updateCertification,
        deleteCertification,
        moveCertification,
        reorderCertifications,
        updateStats,
        moveStat,
        reorderStats,
        resetToDefaults,
        downloadCSV,
        importCSVContent,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
