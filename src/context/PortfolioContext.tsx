import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchPortfolioData, 
  PortfolioData, 
  ExperienceItem, 
  ResumeItem,
  TempCredential,
  updateCachedData, 
  generateCSVFromData,
  clearCSVFromStorage,
  parseCSVData,
  saveCSVToStorage,
  getInitialPortfolioData,
  getDefaultData
} from '@/lib/csvData';
import { 
  createSaltedHash,
  verifySaltedHash,
  DEFAULT_USER_HASH, 
  DEFAULT_PASS_HASH, 
  DEFAULT_ADMIN_USER_HASH, 
  DEFAULT_ADMIN_PASS_HASH,
  LEGACY_DEFAULT_USER_HASH,
  LEGACY_DEFAULT_PASS_HASH,
  LEGACY_DEFAULT_ADMIN_USER_HASH,
  LEGACY_DEFAULT_ADMIN_PASS_HASH
} from '@/lib/hash';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  isAuthenticated: boolean;
  isTempUser: boolean;
  tempPermission: 'read' | 'edit';
  canEdit: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAdminCredentials: (newUsername: string, newPassword: string) => Promise<boolean>;
  resetAdminCredentials: () => Promise<void> | void;
  createTempCredential: (username: string, password: string, durationHours: number, permission?: 'read' | 'edit') => Promise<boolean>;
  updateTempPermission: (permission: 'read' | 'edit') => Promise<boolean>;
  deleteTempCredential: () => Promise<void> | void;
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
const ADMIN_ROLE_KEY = 'portfolio_admin_role';
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
  const [data, setData] = useState<PortfolioData>(getInitialPortfolioData);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });
  const [isTempUser, setIsTempUser] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_ROLE_KEY) === 'temp';
  });

  const tempPermission: 'read' | 'edit' = data?.tempCredential?.permission || 'read';
  const canEdit: boolean = isAuthenticated ? (!isTempUser || tempPermission === 'edit') : false;

  useEffect(() => {
    fetchPortfolioData().then((fetched) => {
      if (fetched && fetched.name) {
        setData(fetched);
        if (sessionStorage.getItem(ADMIN_ROLE_KEY) === 'temp') {
          if (!fetched.tempCredential || Date.now() > fetched.tempCredential.expiresAt) {
            logout();
            toast.error('Your access was deleted or expired.');
          }
        }
      }
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
            if (sessionStorage.getItem(ADMIN_ROLE_KEY) === 'temp') {
              if (!fresh.tempCredential || Date.now() > fresh.tempCredential.expiresAt) {
                logout();
                toast.error('Your access was deleted or expired.');
              }
            }
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
                if (sessionStorage.getItem(ADMIN_ROLE_KEY) === 'temp') {
                  if (!fresh.tempCredential || Date.now() > fresh.tempCredential.expiresAt) {
                    logout();
                    toast.error('Your access was deleted or expired.');
                  }
                }
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

  // Real-time automatic logout for temporary credentials when expired or deleted
  useEffect(() => {
    if (!isAuthenticated || !isTempUser) return;

    // Local clock expiration check every 2 seconds
    const checkLocalExpiry = () => {
      if (data?.tempCredential && Date.now() > data.tempCredential.expiresAt) {
        logout();
        toast.error('Your access has expired.');
        return false;
      }
      const customCsv = localStorage.getItem('portfolio_custom_csv_data');
      if (customCsv) {
        try {
          const parsed = parseCSVData(customCsv);
          if (!parsed.tempCredential || Date.now() > parsed.tempCredential.expiresAt) {
            logout();
            toast.error('Your access was deleted or expired.');
            return false;
          }
        } catch {}
      }
      return true;
    };

    checkLocalExpiry();
    const localTimer = setInterval(checkLocalExpiry, 2000);

    // Cloud revocation and permission sync check every 3 seconds
    const checkCloudStatus = async () => {
      if (!supabase) return;
      try {
        const { data: row, error } = await supabase
          .from('portfolio_data')
          .select('content')
          .eq('id', 'main')
          .maybeSingle();

        if (!error && row?.content) {
          const fresh = parseCSVData(row.content);
          // If pass was deleted in Supabase or expired
          if (!fresh.tempCredential || Date.now() > fresh.tempCredential.expiresAt) {
            logout();
            toast.error('Your access was deleted or revoked by the administrator.');
            return;
          }

          // If temp user hash changed (admin generated a different pass)
          if (data?.tempCredential && fresh.tempCredential.userHash !== data.tempCredential.userHash) {
            logout();
            toast.error('Your access was revoked by the administrator.');
            return;
          }

          // If admin toggled read/edit permission in cloud, update state live
          if (fresh.tempCredential && data?.tempCredential && fresh.tempCredential.permission !== data.tempCredential.permission) {
            setData(fresh);
            toast.info(`Access permission updated: ${fresh.tempCredential.permission === 'edit' ? 'Can Edit' : 'Read-Only'}`);
          }
        } else if (!error && !row) {
          logout();
          toast.error('Your access was deleted.');
        }
      } catch (err) {
        console.warn('Cloud pass polling check error:', err);
      }
    };

    const cloudTimer = setInterval(checkCloudStatus, 3000);

    return () => {
      clearInterval(localTimer);
      clearInterval(cloudTimer);
    };
  }, [isAuthenticated, isTempUser, data?.tempCredential]);

  const saveAndSync = async (newData: PortfolioData): Promise<boolean> => {
    setData(newData);
    const cloudOk = await updateCachedData(newData);

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
    return cloudOk;
  };

  const checkTempCredentials = async (
    inputUser: string,
    inputPass: string,
    sourceData?: PortfolioData | null
  ): Promise<boolean> => {
    const target = sourceData || data;
    const cred = target?.tempCredential;
    if (!cred || !cred.userHash || !cred.passHash) return false;
    
    const userValid = await verifySaltedHash(inputUser, cred.userHash);
    const passValid = await verifySaltedHash(inputPass, cred.passHash);
    if (!userValid || !passValid) return false;

    // Check validity
    if (Date.now() > cred.expiresAt) {
      toast.error('Access pass has expired!');
      return false;
    }

    setIsAuthenticated(true);
    setIsTempUser(true);
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    sessionStorage.setItem(ADMIN_ROLE_KEY, 'temp');
    toast.success('Access granted successfully!');
    return true;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const inputUser = username.trim();
    const inputPass = password.trim();
    if (!inputUser || !inputPass) {
      toast.error('Username and password are required!');
      return false;
    }

    // 1. Master Administrator Account (admin / admin2615) - ALWAYS usable fail-safe
    const isMaster = (
      (await verifySaltedHash(inputUser, DEFAULT_ADMIN_USER_HASH) && await verifySaltedHash(inputPass, DEFAULT_ADMIN_PASS_HASH)) ||
      (await verifySaltedHash(inputUser, LEGACY_DEFAULT_ADMIN_USER_HASH) && await verifySaltedHash(inputPass, LEGACY_DEFAULT_ADMIN_PASS_HASH)) ||
      (inputUser === 'admin' && inputPass === 'admin2615')
    );

    if (isMaster) {
      setIsAuthenticated(true);
      setIsTempUser(false);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem(ADMIN_ROLE_KEY, 'admin');
      toast.success('Administrator authenticated successfully!');
      return true;
    }

    // 2. Check Custom Admin Credentials (stored in data/CSV or localStorage)
    const customCredsRaw = localStorage.getItem(CUSTOM_CREDS_KEY);
    let localCustomUserHash = '';
    let localCustomPassHash = '';
    if (customCredsRaw) {
      try {
        const parsed = JSON.parse(customCredsRaw);
        localCustomUserHash = parsed.userHash || '';
        localCustomPassHash = parsed.passHash || '';
      } catch {}
    }

    const activeCustomUserHash = data?.adminUserHash || localCustomUserHash;
    const activeCustomPassHash = data?.adminPassHash || localCustomPassHash;

    // Check active custom credentials locally first
    if (activeCustomUserHash && activeCustomPassHash) {
      const isCustomValid = 
        await verifySaltedHash(inputUser, activeCustomUserHash) &&
        await verifySaltedHash(inputPass, activeCustomPassHash);
      if (isCustomValid) {
        setIsAuthenticated(true);
        setIsTempUser(false);
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_ROLE_KEY, 'admin');
        toast.success('Administrator authenticated successfully!');
        return true;
      }
    }

    // 3. Check Temporary Credentials against local data
    if (await checkTempCredentials(inputUser, inputPass)) {
      return true;
    }

    // 4. Live Supabase Fallback Check:
    // Query Supabase cloud directly for live cross-device credentials verification
    let cloudHasCustom = false;
    if (supabase) {
      try {
        const { data: row, error } = await supabase
          .from('portfolio_data')
          .select('content')
          .eq('id', 'main')
          .maybeSingle();

        if (!error && row?.content) {
          const fresh = parseCSVData(row.content);
          if (fresh.name) {
            saveCSVToStorage(row.content);
            setData(fresh);

            // Check custom admin credentials with fresh cloud data
            if (fresh.adminUserHash && fresh.adminPassHash) {
              cloudHasCustom = true;
              const isCloudCustomValid =
                await verifySaltedHash(inputUser, fresh.adminUserHash) &&
                await verifySaltedHash(inputPass, fresh.adminPassHash);
              if (isCloudCustomValid) {
                setIsAuthenticated(true);
                setIsTempUser(false);
                sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
                sessionStorage.setItem(ADMIN_ROLE_KEY, 'admin');
                toast.success('Administrator authenticated successfully!');
                return true;
              }
            }

            // Check temporary credentials with fresh cloud data
            if (await checkTempCredentials(inputUser, inputPass, fresh)) {
              return true;
            }
          }
        }
      } catch (err) {
        console.warn('Supabase live credentials verification error:', err);
      }
    }

    // 5. Check fresh static portfolio.csv (handles direct file updates on disk or GitHub pages deployment)
    let staticHasCustom = false;
    try {
      const res = await fetch(`/data/portfolio.csv?v=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        if (text && text.includes('field') && text.includes('name')) {
          const parsed = parseCSVData(text);
          if (parsed.adminUserHash && parsed.adminPassHash) {
            staticHasCustom = true;
            const isStaticCustomValid =
              await verifySaltedHash(inputUser, parsed.adminUserHash) &&
              await verifySaltedHash(inputPass, parsed.adminPassHash);
            if (isStaticCustomValid) {
              setData(parsed);
              saveCSVToStorage(text);
              setIsAuthenticated(true);
              setIsTempUser(false);
              sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
              sessionStorage.setItem(ADMIN_ROLE_KEY, 'admin');
              toast.success('Administrator authenticated successfully!');
              return true;
            }
          }
        }
      }
    } catch {}

    // 6. If custom admin credentials are configured (locally, in cloud, or in CSV),
    // the old default credentials MUST NOT work! Only the updated credentials are valid.
    const hasCustomCreds = Boolean(
      (activeCustomUserHash && activeCustomPassHash) ||
      cloudHasCustom ||
      staticHasCustom
    );

    if (hasCustomCreds) {
      toast.error('Invalid administrator credentials or expired pass!');
      return false;
    }

    // 7. Default account (premkumar / premkumarofficial) works when NO custom credentials have been configured (or after "Reset to Default")
    const isDefault = (
      (await verifySaltedHash(inputUser, DEFAULT_USER_HASH) && await verifySaltedHash(inputPass, DEFAULT_PASS_HASH)) ||
      (await verifySaltedHash(inputUser, LEGACY_DEFAULT_USER_HASH) && await verifySaltedHash(inputPass, LEGACY_DEFAULT_PASS_HASH)) ||
      (inputUser === 'premkumar' && inputPass === 'premkumarofficial')
    );

    if (isDefault) {
      setIsAuthenticated(true);
      setIsTempUser(false);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem(ADMIN_ROLE_KEY, 'admin');
      toast.success('Administrator authenticated successfully!');
      return true;
    }

    // Optional: .env credentials fallback
    const envUser = (import.meta.env.VITE_ADMIN_USERNAME || '').trim();
    const envPass = String(import.meta.env.VITE_ADMIN_PASSWORD || '').trim();
    if (envUser && envPass) {
      if (inputUser === envUser && inputPass === envPass) {
        setIsAuthenticated(true);
        setIsTempUser(false);
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_ROLE_KEY, 'admin');
        toast.success('Administrator authenticated successfully!');
        return true;
      }
    }

    toast.error('Invalid administrator credentials or expired pass!');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsTempUser(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_ROLE_KEY);
    toast.info('Logged out from admin panel.');
  };

  const updateAdminCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
    if (!data) return false;
    const u = newUsername.trim();
    const p = newPassword.trim();
    if (!u || !p) {
      toast.error('Username and password cannot be empty!');
      return false;
    }

    const userHash = await createSaltedHash(u);
    const passHash = await createSaltedHash(p);

    const updated: PortfolioData = {
      ...data,
      adminUserHash: userHash,
      adminPassHash: passHash,
    };

    localStorage.setItem(CUSTOM_CREDS_KEY, JSON.stringify({
      username: u,
      userHash,
      passHash,
    }));

    await saveAndSync(updated);
    toast.success('Admin credentials updated and synced to cloud with salted hashes!');
    return true;
  };

  const resetAdminCredentials = async () => {
    if (!data) return;
    localStorage.removeItem(CUSTOM_CREDS_KEY);
    const updated: PortfolioData = {
      ...data,
      adminUserHash: '',
      adminPassHash: '',
    };
    await saveAndSync(updated);
    toast.info('Admin credentials reset to default / .env settings.');
  };

  const createTempCredential = async (
    username: string, 
    password: string, 
    durationHours: number,
    permission: 'read' | 'edit' = 'read'
  ): Promise<boolean> => {
    if (!data) return false;
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) {
      toast.error('Temporary username and password cannot be empty!');
      return false;
    }

    // Enforce only one temporary pass can exist. Can generate another only after expire or delete.
    if (data.tempCredential && Date.now() < data.tempCredential.expiresAt) {
      toast.error('An active temporary pass already exists. You can generate a new pass only after it expires or is deleted.');
      return false;
    }

    if (durationHours < 1 || durationHours > 720) {
      toast.error('Validity must be between 1 hour and 30 days (720 hours)!');
      return false;
    }

    const userHash = await createSaltedHash(u);
    const passHash = await createSaltedHash(p);
    const now = Date.now();
    const expiresAt = now + durationHours * 3600 * 1000;

    let durationLabel = `${durationHours}h`;
    if (durationHours >= 24) {
      const days = Math.round(durationHours / 24);
      durationLabel = `${days} day${days > 1 ? 's' : ''}`;
    }

    // Cache plain credentials locally for the admin who generated it
    try {
      localStorage.setItem('portfolio_temp_plain_cache', JSON.stringify({
        userHash,
        passHash,
        username: u,
        password: p,
      }));
    } catch {}

    const newTemp: TempCredential = {
      id: `temp-${now}`,
      userHash,
      passHash,
      createdAt: now,
      expiresAt,
      durationLabel,
      permission,
      plainUsername: u,
      plainPassword: p,
    };

    const updated = { ...data, tempCredential: newTemp };
    await saveAndSync(updated);
    toast.success(`Temporary access pass created! [${permission === 'edit' ? 'Can Edit' : 'Read-Only'}, ${durationLabel}].`);
    return true;
  };

  const updateTempPermission = async (permission: 'read' | 'edit'): Promise<boolean> => {
    if (!data || !data.tempCredential) return false;
    const updatedTemp: TempCredential = {
      ...data.tempCredential,
      permission,
    };
    const updated = { ...data, tempCredential: updatedTemp };
    await saveAndSync(updated);
    toast.success(`Temporary pass permission set to: ${permission === 'edit' ? 'Can Edit' : 'Read-Only'}`);
    return true;
  };

  const deleteTempCredential = async () => {
    if (!data) return;
    try {
      localStorage.removeItem('portfolio_temp_plain_cache');
    } catch {}
    const updated = { ...data, tempCredential: null };
    await saveAndSync(updated);
    toast.info('Temporary access pass deleted.');
  };

  const checkCanEdit = (): boolean => {
    if (!canEdit) {
      toast.error('Editing is disabled (Read-Only mode).');
      return false;
    }
    return true;
  };

  const updatePersonalInfo = (fields: Partial<PortfolioData>) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, ...fields };
    saveAndSync(updated);
    toast.success('Personal information updated!');
  };

  // Resume CRUD
  const addResume = async (resume: ResumeItem) => {
    if (!checkCanEdit()) return;
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
    if (!checkCanEdit()) return;
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
    if (!checkCanEdit()) return;
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
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, experiences: withOrder([exp, ...(data.experiences || [])]) };
    saveAndSync(updated);
    toast.success('Experience added!');
  };

  const updateExperience = (index: number, exp: ExperienceItem) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = [...(data.experiences || [])];
    list[index] = exp;
    const updated = { ...data, experiences: withOrder(list) };
    saveAndSync(updated);
    toast.success('Experience updated!');
  };

  const deleteExperience = (index: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = (data.experiences || []).filter((_, i) => i !== index);
    const updated = { ...data, experiences: withOrder(list) };
    saveAndSync(updated);
    toast.success('Experience deleted!');
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.experiences || [], index, direction);
    saveAndSync({ ...data, experiences: withOrder(list) });
    toast.success('Experience reordered!');
  };

  const reorderExperiences = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.experiences || [], fromIndex, toIndex);
    saveAndSync({ ...data, experiences: withOrder(list) });
    toast.success('Experience order updated!');
  };

  // Projects CRUD & Reorder
  const addProject = (proj: PortfolioData['projects'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, projects: withOrder([proj, ...(data.projects || [])]) };
    saveAndSync(updated);
    toast.success('Project added!');
  };

  const updateProject = (index: number, proj: PortfolioData['projects'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = [...(data.projects || [])];
    list[index] = proj;
    const updated = { ...data, projects: withOrder(list) };
    saveAndSync(updated);
    toast.success('Project updated!');
  };

  const deleteProject = (index: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = (data.projects || []).filter((_, i) => i !== index);
    const updated = { ...data, projects: withOrder(list) };
    saveAndSync(updated);
    toast.success('Project deleted!');
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.projects || [], index, direction);
    saveAndSync({ ...data, projects: withOrder(list) });
    toast.success('Project reordered!');
  };

  const reorderProjects = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.projects || [], fromIndex, toIndex);
    saveAndSync({ ...data, projects: withOrder(list) });
    toast.success('Projects order updated!');
  };

  // Education CRUD & Reorder
  const addEducation = (edu: PortfolioData['educationList'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, educationList: withOrder([edu, ...(data.educationList || [])]) };
    saveAndSync(updated);
    toast.success('Education entry added!');
  };

  const updateEducation = (index: number, edu: PortfolioData['educationList'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = [...(data.educationList || [])];
    list[index] = edu;
    const updated = { ...data, educationList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Education entry updated!');
  };

  const deleteEducation = (index: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = (data.educationList || []).filter((_, i) => i !== index);
    const updated = { ...data, educationList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Education entry deleted!');
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.educationList || [], index, direction);
    saveAndSync({ ...data, educationList: withOrder(list) });
    toast.success('Education reordered!');
  };

  const reorderEducation = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.educationList || [], fromIndex, toIndex);
    saveAndSync({ ...data, educationList: withOrder(list) });
    toast.success('Education order updated!');
  };

  // Services CRUD & Reorder
  const addService = (srv: PortfolioData['servicesList'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, servicesList: withOrder([srv, ...(data.servicesList || [])]) };
    saveAndSync(updated);
    toast.success('Service added!');
  };

  const updateService = (index: number, srv: PortfolioData['servicesList'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = [...(data.servicesList || [])];
    list[index] = srv;
    const updated = { ...data, servicesList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Service updated!');
  };

  const deleteService = (index: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = (data.servicesList || []).filter((_, i) => i !== index);
    const updated = { ...data, servicesList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Service deleted!');
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.servicesList || [], index, direction);
    saveAndSync({ ...data, servicesList: withOrder(list) });
    toast.success('Service reordered!');
  };

  const reorderServices = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.servicesList || [], fromIndex, toIndex);
    saveAndSync({ ...data, servicesList: withOrder(list) });
    toast.success('Services order updated!');
  };

  // Skills CRUD & Reorder
  const addSkillCategory = (sk: PortfolioData['skillsList'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, skillsList: withOrder([...(data.skillsList || []), sk]) };
    saveAndSync(updated);
    toast.success('Skill category added!');
  };

  const updateSkillCategory = (index: number, sk: PortfolioData['skillsList'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = [...(data.skillsList || [])];
    list[index] = sk;
    const updated = { ...data, skillsList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Skill category updated!');
  };

  const deleteSkillCategory = (index: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = (data.skillsList || []).filter((_, i) => i !== index);
    const updated = { ...data, skillsList: withOrder(list) };
    saveAndSync(updated);
    toast.success('Skill category deleted!');
  };

  const moveSkillCategory = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.skillsList || [], index, direction);
    saveAndSync({ ...data, skillsList: withOrder(list) });
    toast.success('Skill category reordered!');
  };

  const reorderSkills = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.skillsList || [], fromIndex, toIndex);
    saveAndSync({ ...data, skillsList: withOrder(list) });
    toast.success('Skills order updated!');
  };

  // Certifications CRUD & Reorder
  const addCertification = (cert: PortfolioData['certifications'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, certifications: withOrder([cert, ...(data.certifications || [])]) };
    saveAndSync(updated);
    toast.success('Certification added!');
  };

  const updateCertification = (index: number, cert: PortfolioData['certifications'][0]) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = [...(data.certifications || [])];
    list[index] = cert;
    const updated = { ...data, certifications: withOrder(list) };
    saveAndSync(updated);
    toast.success('Certification updated!');
  };

  const deleteCertification = (index: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = (data.certifications || []).filter((_, i) => i !== index);
    const updated = { ...data, certifications: withOrder(list) };
    saveAndSync(updated);
    toast.success('Certification deleted!');
  };

  const moveCertification = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.certifications || [], index, direction);
    saveAndSync({ ...data, certifications: withOrder(list) });
    toast.success('Certification reordered!');
  };

  const reorderCertifications = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.certifications || [], fromIndex, toIndex);
    saveAndSync({ ...data, certifications: withOrder(list) });
    toast.success('Certifications order updated!');
  };

  // Stats CRUD & Reorder
  const updateStats = (stats: PortfolioData['statsList']) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const updated = { ...data, statsList: withOrder(stats) };
    saveAndSync(updated);
    toast.success('Statistics updated!');
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = moveArrayItem(data.statsList || [], index, direction);
    saveAndSync({ ...data, statsList: withOrder(list) });
    toast.success('Stat reordered!');
  };

  const reorderStats = (fromIndex: number, toIndex: number) => {
    if (!checkCanEdit()) return;
    if (!data) return;
    const list = reorderArray(data.statsList || [], fromIndex, toIndex);
    saveAndSync({ ...data, statsList: withOrder(list) });
    toast.success('Stats order updated!');
  };

  const resetToDefaults = async () => {
    if (!checkCanEdit()) return;
    clearCSVFromStorage();
    if (supabase) {
      try {
        await supabase.from('portfolio_data').delete().eq('id', 'main');
      } catch (err) {
        console.warn('Supabase reset warning:', err);
      }
    }
    setData(getDefaultData());
    window.location.reload();
  };

  const downloadCSV = async () => {
    let csvContent = '';
    // 1. Fetch latest updated data directly from Supabase if available
    if (supabase) {
      try {
        const { data: row, error } = await supabase
          .from('portfolio_data')
          .select('content')
          .eq('id', 'main')
          .maybeSingle();

        if (!error && row?.content && row.content.trim()) {
          csvContent = row.content;
        }
      } catch (err) {
        console.warn('Could not fetch from Supabase for download, using current data:', err);
      }
    }

    // 2. Fallback to current memory data if Supabase was empty or offline
    if (!csvContent && data) {
      csvContent = generateCSVFromData(data);
    }

    if (!csvContent) {
      toast.error('No portfolio data available to download.');
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'portfolio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded latest updated data from Supabase!');
  };

  const importCSVContent = (csvText: string): boolean => {
    if (!checkCanEdit()) return false;
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
        isTempUser,
        tempPermission,
        canEdit,
        login,
        logout,
        updateAdminCredentials,
        resetAdminCredentials,
        createTempCredential,
        updateTempPermission,
        deleteTempCredential,
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
