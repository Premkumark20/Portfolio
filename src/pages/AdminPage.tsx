import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit2, Check, X, GripVertical, Upload, ExternalLink,
  Briefcase, User, Code2, GraduationCap, Wrench, Sparkles, Award, BarChart3, Eye, EyeOff, Lock, AlertCircle, AlertTriangle,
  FileText, Star, Download, KeyRound, Database, RotateCcw, FileSpreadsheet, Clock, Copy, RefreshCw, UserPlus
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { ExperienceItem, PortfolioData, ResumeItem } from '@/lib/csvData';
import { getAssetUrl } from '@/lib/utils';

export const AdminPage: React.FC = () => {
  useEffect(() => {
    document.title = "Portfolio Admin";
  }, []);

  const {
    data,
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
    reorderExperiences,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    addEducation,
    updateEducation,
    deleteEducation,
    reorderEducation,
    addService,
    updateService,
    deleteService,
    reorderServices,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    reorderSkills,
    addCertification,
    updateCertification,
    deleteCertification,
    reorderCertifications,
    updateStats,
    reorderStats,
    downloadCSV,
    importCSVContent,
    resetToDefaults,
  } = usePortfolio();

  type AdminTabId = 'personal' | 'resumes' | 'projects' | 'education' | 'experience' | 'services' | 'skills' | 'certifications' | 'stats' | 'security';
  const validTabs: AdminTabId[] = ['personal', 'resumes', 'projects', 'education', 'experience', 'services', 'skills', 'certifications', 'stats', 'security'];

  const [activeTab, setActiveTab] = useState<AdminTabId>(() => {
    try {
      const hash = window.location.hash.replace('#', '') as AdminTabId;
      if (hash && validTabs.includes(hash)) return hash;
      const saved = sessionStorage.getItem('portfolio_admin_active_tab') as AdminTabId | null;
      if (saved && validTabs.includes(saved)) return saved;
    } catch {}
    return 'personal';
  });

  const [securitySubSection, setSecuritySubSection] = useState<'security' | 'temporary' | 'backup'>(() => {
    try {
      const saved = sessionStorage.getItem('portfolio_admin_sec_subsection') as any;
      if (saved && ['security', 'temporary', 'backup'].includes(saved)) return saved;
    } catch {}
    return 'security';
  });

  // Persist active tab changes to sessionStorage and URL hash
  useEffect(() => {
    try {
      sessionStorage.setItem('portfolio_admin_active_tab', activeTab);
      window.history.replaceState(null, '', `#${activeTab}`);
    } catch {}
  }, [activeTab]);

  // Persist security sub-section changes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('portfolio_admin_sec_subsection', securitySubSection);
    } catch {}
  }, [securitySubSection]);

  // Prevent temporary user from accessing security tab
  useEffect(() => {
    if (isTempUser && activeTab === 'security') {
      setActiveTab('personal');
    }
  }, [isTempUser, activeTab]);

  // Temporary Security State
  const [tempUsername, setTempUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [tempDurationHours, setTempDurationHours] = useState(24);
  const [tempPermissionSelect, setTempPermissionSelect] = useState<'read' | 'edit'>('read');
  const [showTempPass, setShowTempPass] = useState(false);
  const [tempError, setTempError] = useState('');
  const [copiedTempId, setCopiedTempId] = useState<string | null>(null);

  // Form visibility & Auto-scroll Reference
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Authentication State
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Reset authentication form inputs whenever logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthUsername('');
      setAuthPassword('');
      setAuthError('');
      setShowAuthPassword(false);
    }
  }, [isAuthenticated]);

  // Center Delete Confirmation Dialog State (for all admin sections)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const confirmDelete = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    itemName?: string
  ) => {
    setDeleteDialog({
      isOpen: true,
      title,
      message,
      itemName,
      onConfirm,
    });
  };

  const handleExecuteDelete = async () => {
    if (deleteDialog?.onConfirm) {
      await deleteDialog.onConfirm();
    }
    setDeleteDialog(null);
  };

  // Close confirmation dialog on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deleteDialog?.isOpen) {
        setDeleteDialog(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteDialog?.isOpen]);

  // Security Credentials Management State
  const [secUsername, setSecUsername] = useState('premkumar');
  const [secPassword, setSecPassword] = useState('');
  const [secConfirmPassword, setSecConfirmPassword] = useState('');
  const [showSecPass, setShowSecPass] = useState(false);
  const [secError, setSecError] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('portfolio_admin_custom_creds');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username) setSecUsername(parsed.username);
      }
    } catch {}
  }, []);

  // Resume Upload Form State
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeFileContent, setResumeFileContent] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isResumePrimary, setIsResumePrimary] = useState(true);

  // Personal Info Form State
  const [personalForm, setPersonalForm] = useState({
    name: '',
    title: '',
    specialization: '',
    statusBadge: '',
    email: '',
    phone: '',
    github_link: '',
    linkedin_link: '',
    heroTagsInput: '',
    bioSummary: '',
  });
  const [personalSaved, setPersonalSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setPersonalForm({
        name: data.name || '',
        title: data.title || '',
        specialization: data.specialization || '',
        statusBadge: data.statusBadge || '',
        email: data.email || '',
        phone: data.phone || '',
        github_link: data.github_link || '',
        linkedin_link: data.linkedin_link || '',
        heroTagsInput: data.heroTags ? data.heroTags.join(', ') : '',
        bioSummary: data.bioSummary || '',
      });
    }
  }, [data?.name, data?.title, data?.specialization, data?.statusBadge, data?.email, data?.phone, data?.github_link, data?.linkedin_link, data?.heroTags, data?.bioSummary]);

  const handleSavePersonalInfo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const heroTags = personalForm.heroTagsInput
      ? personalForm.heroTagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    updatePersonalInfo({
      name: personalForm.name,
      title: personalForm.title,
      specialization: personalForm.specialization,
      statusBadge: personalForm.statusBadge,
      email: personalForm.email,
      phone: personalForm.phone,
      github_link: personalForm.github_link,
      linkedin_link: personalForm.linkedin_link,
      heroTags,
      bioSummary: personalForm.bioSummary,
    });
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 3000);
  };

  // Stats Form State
  const [statsForm, setStatsForm] = useState<PortfolioData['statsList']>([]);
  const [statsSaved, setStatsSaved] = useState(false);

  useEffect(() => {
    if (data?.statsList) {
      setStatsForm(data.statsList);
    }
  }, [data?.statsList]);

  const handleSaveStats = () => {
    updateStats(statsForm);
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 3000);
  };

  // Editing Indexes & Form States
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [expForm, setExpForm] = useState<ExperienceItem & { tagsInput?: string }>({
    role: '', company: '', location: '', duration: '', summary: '', tags: [], tagsInput: '', gradient: 'from-blue-600 to-indigo-600'
  });

  const [editingProjIdx, setEditingProjIdx] = useState<number | null>(null);
  const [projForm, setProjForm] = useState<PortfolioData['projects'][0] & { techInput?: string }>({
    title: '', description: '', tech: [], techInput: '', type: 'Self Project', duration: '2025', category: 'Web Development', github: '', live: '', progress: 80
  });

  const [editingEduIdx, setEditingEduIdx] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<PortfolioData['educationList'][0]>({
    type: 'Degree', institution: '', location: '', degree: '', specialization: '', period: '', score: '', statusBadge: 'Completed', isPrimary: false
  });

  const [editingSrvIdx, setEditingSrvIdx] = useState<number | null>(null);
  const [srvForm, setSrvForm] = useState<PortfolioData['servicesList'][0] & { techInput?: string }>({
    title: '', desc: '', tech: [], techInput: ''
  });

  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<PortfolioData['skillsList'][0] & { skillsInput?: string }>({
    category: '', skills: [], skillsInput: ''
  });

  const [editingCertIdx, setEditingCertIdx] = useState<number | null>(null);
  const [certForm, setCertForm] = useState<PortfolioData['certifications'][0]>({
    title: '', provider: '', date: '', certificateId: '', link: '', level: 'Professional'
  });

  // Auto Scroll helper to bring form into view smoothly
  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  // Handle Login Submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const ok = await login(authUsername, authPassword);
    if (ok) {
      setAuthUsername('');
      setAuthPassword('');
      setAuthError('');
      setShowAuthPassword(false);
    } else {
      setAuthError('Invalid administrator credentials or expired temporary pass.');
    }
  };

  // Handle Logout & Explicitly Reset Login Form Inputs
  const handleLogout = () => {
    setAuthUsername('');
    setAuthPassword('');
    setAuthError('');
    setShowAuthPassword(false);
    logout();
  };

  const generateRandomTempCreds = () => {
    const randomUser = `temp_${Math.random().toString(36).substring(2, 7)}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#%';
    let randomPass = '';
    for (let i = 0; i < 10; i++) {
      randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempUsername(randomUser);
    setTempPassword(randomPass);
    setShowTempPass(true);
  };

  const handleCreateTempPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setTempError('');
    if (data?.tempCredential && Date.now() <= data.tempCredential.expiresAt) {
      setTempError('An active temporary pass already exists. You can generate a new pass only after it expires or is deleted.');
      return;
    }
    if (!tempUsername.trim() || !tempPassword.trim()) {
      setTempError('Temporary username and password cannot be empty.');
      return;
    }
    if (tempDurationHours < 1 || tempDurationHours > 720) {
      setTempError('Validity must be between 1 hour and 30 days (720 hours).');
      return;
    }
    const ok = await createTempCredential(tempUsername, tempPassword, tempDurationHours, tempPermissionSelect);
    if (ok) {
      setTempUsername('');
      setTempPassword('');
      setTempPermissionSelect('read');
      setShowTempPass(false);
    }
  };

  // Resume File Upload Reader
  const handleResumeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    if (!resumeTitle) {
      setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setResumeFileContent(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Certificate Upload Handler
  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCertForm(prev => ({ ...prev, link: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Render Login Page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0b0f24] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1px] mb-3 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#070a18] rounded-[15px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white">Admin Authentication</h2>
            <p className="text-xs text-gray-400 mt-1">Enter credentials to open admin dashboard in this tab.</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Username</label>
              <input
                type="text"
                required
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showAuthPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* Fixed Top Header Bar & Tabs Container */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080c1e]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-[#080c1e] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white">Admin Panel</h1>
              </div>
              <p className="text-xs text-gray-400">
                {isTempUser ? (canEdit ? 'Editor Mode' : 'Read-Only Mode') : 'Manage & Update Portfolio'}
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#050816] p-1.5 rounded-2xl border border-white/10">
            {[
              { id: 'personal', label: 'Personal & Bio', icon: User },
              { id: 'resumes', label: 'Resumes', icon: FileText },
              { id: 'projects', label: 'Projects', icon: Code2 },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'experience', label: 'Work Experience', icon: Briefcase },
              { id: 'services', label: 'Services', icon: Wrench },
              { id: 'skills', label: 'Skills', icon: Sparkles },
              { id: 'certifications', label: 'Certifications', icon: Award },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
              ...(!isTempUser ? [{ id: 'security', label: 'Security', icon: KeyRound }] : []),
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setShowForm(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Controls: Logout and Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-300 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Log out from Admin Panel"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => window.close()}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Close Tab"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Select (inside fixed header so tabs remain fixed on mobile too) */}
        <div className="lg:hidden px-4 py-2.5 bg-[#050816]/95 border-t border-white/5 flex overflow-x-auto gap-2 scrollbar-none">
          {[
            { id: 'personal', label: 'Personal & Bio' },
            { id: 'resumes', label: 'Resumes' },
            { id: 'projects', label: 'Projects' },
            { id: 'education', label: 'Education' },
            { id: 'experience', label: 'Work Experience' },
            { id: 'services', label: 'Services' },
            { id: 'skills', label: 'Skills' },
            { id: 'certifications', label: 'Certifications' },
            { id: 'stats', label: 'Stats' },
            ...(!isTempUser ? [{ id: 'security', label: 'Security' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setShowForm(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-gray-400 bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area - padded so content starts right below fixed header on mobile and desktop */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-8 flex-1 space-y-6 pt-32 lg:pt-24">

        {/* Access Level Notice */}
        {isTempUser && (
          <div className={`py-2 px-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
            canEdit 
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}>
            {canEdit ? <Edit2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> : <Eye className="w-3.5 h-3.5 shrink-0 text-amber-400" />}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              canEdit 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {canEdit ? 'Can Edit' : 'Read-Only'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">
              {canEdit ? 'You can modify portfolio content.' : 'Content editing is disabled.'}
            </span>
          </div>
        )}

        {/* 1. PERSONAL & BIO TAB */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSavePersonalInfo} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Personal Information & Profile</span>
              </h2>
            </div>

            <fieldset disabled={!canEdit} className="p-6 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs disabled:opacity-80">
              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={personalForm.name}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Title / Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={personalForm.title}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Specializing in Cloud & AI"
                  value={personalForm.specialization}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Status Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Open to Work • Backend Roles"
                  value={personalForm.statusBadge}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, statusBadge: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="e.g. alex.johnson@example.com"
                  value={personalForm.email}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={personalForm.phone}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">GitHub Link</label>
                <input
                  type="text"
                  placeholder="e.g. https://github.com/alexjohnson"
                  value={personalForm.github_link}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, github_link: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">LinkedIn Link</label>
                <input
                  type="text"
                  placeholder="e.g. https://linkedin.com/in/alexjohnson"
                  value={personalForm.linkedin_link}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, linkedin_link: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Hero Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, Docker, PostgreSQL, AWS"
                  value={personalForm.heroTagsInput}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, heroTagsInput: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Bio Summary</label>
                <textarea
                  rows={4}
                  placeholder="e.g. I build scalable web applications with modern technologies..."
                  value={personalForm.bioSummary}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, bioSummary: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>
            </fieldset>

            <div className="flex items-center justify-between pt-2">
              {personalSaved ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Personal information updated successfully!</span>
                </div>
              ) : (
                <span />
              )}
              {canEdit && (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Save Changes</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* 2. RESUMES TAB */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Resume Management & Primary Selector</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Upload multiple resume versions and mark the active primary resume visitors will download.</p>
              </div>

              {canEdit && (!showForm ? (
                <button
                  onClick={() => {
                    setResumeTitle('');
                    setResumeFileContent('');
                    setResumeFileName('');
                    setIsResumePrimary(false);
                    setShowForm(true);
                    scrollToForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Resume</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {/* Resume Upload Form */}
            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs animate-fade-in scroll-mt-24">
                <h3 className="font-bold text-blue-400 uppercase tracking-wider">
                  Upload Resume Document
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Resume Name / Version Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson - Software Engineer Resume"
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Select Resume File (PDF / DOC / DOCX)</label>
                    <label className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-gray-300 flex items-center justify-between cursor-pointer transition-all">
                      <span className="truncate">{resumeFileName || 'Choose File...'}</span>
                      <Upload className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileSelect} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="setAsPrimary"
                    checked={isResumePrimary}
                    onChange={(e) => setIsResumePrimary(e.target.checked)}
                    className="w-4 h-4 rounded bg-black/40 border-white/20 text-blue-600"
                  />
                  <label htmlFor="setAsPrimary" className="text-gray-300 text-xs font-semibold cursor-pointer">
                    Set as Primary Resume for Download on Portfolio Site
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!resumeTitle || !resumeFileContent) return;
                      const newResume: ResumeItem = {
                        id: `resume-${Date.now()}`,
                        name: resumeTitle,
                        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        fileData: resumeFileContent,
                        isPrimary: isResumePrimary,
                      };
                      addResume(newResume);
                      setResumeTitle('');
                      setResumeFileContent('');
                      setResumeFileName('');
                      setIsResumePrimary(true);
                      setShowForm(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Upload & Save Resume</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Uploaded Resumes */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400">Uploaded Resumes ({data.resumes?.length || 0})</h4>
              {(!data.resumes || data.resumes.length === 0) ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-gray-400">
                  No resume files uploaded yet. Click "Upload New Resume" to upload PDF/DOC files.
                </div>
              ) : (
                data.resumes.map((res) => (
                  <div
                    key={res.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                      res.isPrimary ? 'bg-blue-600/15 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${res.isPrimary ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{res.name}</span>
                          {res.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[10px] font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-blue-300 text-blue-300" />
                              <span>Primary Resume</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Uploaded: {res.uploadDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* View Resume Icon Button */}
                      <a
                        href={getAssetUrl(res.fileData)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-all flex items-center justify-center"
                        title="View / Preview Resume"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      {/* Set Primary Resume Icon Button */}
                      {canEdit && (
                        res.isPrimary ? (
                          <button
                            disabled
                            className="p-2.5 rounded-xl bg-blue-600 border border-blue-400 text-white cursor-default shadow-md shadow-blue-600/30 opacity-90 flex items-center justify-center"
                            title="Primary Resume Active"
                          >
                            <Star className="w-4 h-4 fill-white text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setPrimaryResume(res.id)}
                            className="p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 transition-all flex items-center justify-center"
                            title="Set as Primary Resume"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )
                      )}

                      {/* Download Resume Icon Button */}
                      <a
                        href={getAssetUrl(res.fileData)}
                        download={res.name.endsWith('.pdf') ? res.name : `${res.name}.pdf`}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all flex items-center justify-center"
                        title="Download Resume File"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      {/* Delete Resume Icon Button */}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => confirmDelete(
                            'Delete Resume',
                            'Are you sure you want to delete this resume? This action cannot be undone.',
                            () => deleteResume(res.id),
                            res.name
                          )}
                          className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all flex items-center justify-center cursor-pointer"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span>Projects Management & Drag Arrangement</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Drag cards using the 3-line handle to rearrange display order.</p>
              </div>

              {canEdit && (!showForm ? (
                <button
                  onClick={() => {
                    setEditingProjIdx(null);
                    setProjForm({ title: '', description: '', tech: [], techInput: '', type: 'Self Project', duration: '2025', category: 'Web Development', github: '', live: '', progress: 80 });
                    setShowForm(true);
                    scrollToForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {/* Form Section with Auto Scroll Ref */}
            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs animate-fade-in scroll-mt-24">
                <h3 className="font-bold text-blue-400 uppercase tracking-wider">
                  {editingProjIdx !== null ? `Edit Project #${editingProjIdx + 1}` : 'Create New Project'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AI-Powered Task Manager"
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Project Type</label>
                    <input
                      type="text"
                      placeholder="Self Project"
                      value={projForm.type}
                      onChange={(e) => setProjForm({ ...projForm, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="Web Development"
                      value={projForm.category}
                      onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Duration / Timeline</label>
                    <input
                      type="text"
                      placeholder="2025"
                      value={projForm.duration}
                      onChange={(e) => setProjForm({ ...projForm, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Built a task manager app with real-time sync, notifications, and team collaboration features."
                      value={projForm.description}
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vue.js, Node.js, MongoDB, Redis"
                      value={projForm.techInput ?? projForm.tech.join(', ')}
                      onChange={(e) => setProjForm({ ...projForm, techInput: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">GitHub Link</label>
                    <input
                      type="text"
                      placeholder="e.g. https://github.com/username/repo"
                      value={projForm.github || ''}
                      onChange={(e) => setProjForm({ ...projForm, github: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Live Demo Link</label>
                    <input
                      type="text"
                      placeholder="e.g. https://myapp.vercel.app"
                      value={projForm.live || ''}
                      onChange={(e) => setProjForm({ ...projForm, live: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!projForm.title) return;
                      const techList = (projForm.techInput ?? projForm.tech.join(', ')).split(',').map(t => t.trim()).filter(Boolean);
                      const { techInput, ...projToSave } = projForm;
                      const finalProj = { ...projToSave, tech: techList };
                      if (editingProjIdx !== null) {
                        updateProject(editingProjIdx, finalProj);
                        setEditingProjIdx(null);
                      } else {
                        addProject(finalProj);
                      }
                      setShowForm(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProjIdx !== null ? 'Save Project' : 'Add Project'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* List with 3-Line Drag Handle Icon */}
            <div className="space-y-3">
              {(data.projects || []).map((proj, idx) => (
                <div
                  key={idx}
                  draggable={canEdit}
                  onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                  onDrop={() => {
                    if (!canEdit) return;
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderProjects(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 text-xs ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {canEdit && (
                      <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag up/down to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <span className="font-bold text-white text-sm">{proj.title}</span>
                      <p className="text-gray-400 mt-0.5">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.tech.map((t, ti) => (
                          <span key={ti} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProjIdx(idx);
                          setProjForm({ ...proj, techInput: proj.tech ? proj.tech.join(', ') : '' });
                          setShowForm(true);
                          scrollToForm();
                        }}
                        className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                        title="Edit & Auto Scroll to Form"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(
                          'Delete Project',
                          'Are you sure you want to delete this project? This action cannot be undone.',
                          () => deleteProject(idx),
                          proj.title
                        )}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span>Education & Qualifications</span>
                </h2>
              </div>

              {canEdit && (!showForm ? (
                <button
                  onClick={() => {
                    setEditingEduIdx(null);
                    setEduForm({ type: 'Degree', institution: '', location: '', degree: '', specialization: '', period: '', score: '', statusBadge: 'Completed', isPrimary: false });
                    setShowForm(true);
                    scrollToForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs animate-fade-in scroll-mt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science and Engineering"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. SRM Institute of Science and Technology"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Period</label>
                    <input
                      type="text"
                      placeholder="e.g. 2023 - 2027"
                      value={eduForm.period}
                      onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Score</label>
                    <input
                      type="text"
                      placeholder="e.g. 8.56 CGPA"
                      value={eduForm.score}
                      onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Under Graduate, State Board Higher Secondary Education, State Board Secondary Education"
                      value={eduForm.specialization}
                      onChange={(e) => setEduForm({ ...eduForm, specialization: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">Cancel</button>
                  <button
                    onClick={() => {
                      if (!eduForm.degree) return;
                      if (editingEduIdx !== null) {
                        updateEducation(editingEduIdx, eduForm);
                        setEditingEduIdx(null);
                      } else {
                        addEducation(eduForm);
                      }
                      setShowForm(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Education</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(data.educationList || []).map((edu, idx) => (
                <div
                  key={idx}
                  draggable={canEdit}
                  onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                  onDrop={() => {
                    if (!canEdit) return;
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderEducation(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 text-xs ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {canEdit && (
                      <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{edu.degree}</div>
                      <div className="text-gray-400">{edu.institution} • {edu.period}</div>
                      {edu.specialization && (
                        <div className="text-xs text-blue-400 font-medium mt-1">Category: {edu.specialization}</div>
                      )}
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingEduIdx(idx); setEduForm(edu); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(
                          'Delete Education',
                          'Are you sure you want to delete this education entry? This action cannot be undone.',
                          () => deleteEducation(idx),
                          edu.institution ? `${edu.degree} - ${edu.institution}` : edu.degree
                        )}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. WORK EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span>Work Experience Management</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Drag three-line handles to rearrange experiences.</p>
              </div>

              {canEdit && (!showForm ? (
                <button
                  onClick={() => {
                    setEditingExpIdx(null);
                    setExpForm({ role: '', company: '', location: '', duration: '', summary: '', tags: [], tagsInput: '', gradient: 'from-blue-600 to-indigo-600' });
                    setShowForm(true);
                    scrollToForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Experience</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {/* Form Section */}
            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in scroll-mt-24">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {editingExpIdx !== null ? `Edit Experience #${editingExpIdx + 1}` : 'Create New Experience'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1">Role / Position</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Developer Intern"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. TechNova Labs"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Tamil Nadu"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2025 - Apr 2025"
                      value={expForm.duration}
                      onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Built responsive UI components..."
                      value={expForm.summary}
                      onChange={(e) => setExpForm({ ...expForm, summary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, TailwindCSS"
                      value={expForm.tagsInput ?? expForm.tags.join(', ')}
                      onChange={(e) => setExpForm({ ...expForm, tagsInput: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!expForm.role || !expForm.company) return;
                      const tagsList = (expForm.tagsInput ?? expForm.tags.join(', ')).split(',').map(t => t.trim()).filter(Boolean);
                      const { tagsInput, ...expToSave } = expForm;
                      const finalExp = { ...expToSave, tags: tagsList };
                      if (editingExpIdx !== null) {
                        updateExperience(editingExpIdx, finalExp);
                        setEditingExpIdx(null);
                      } else {
                        addExperience(finalExp);
                      }
                      setShowForm(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingExpIdx !== null ? 'Save Changes' : 'Add Experience'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* List with Drag Handle */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400">Experiences ({data.experiences?.length || 0})</h4>
              {(!data.experiences || data.experiences.length === 0) ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-gray-400">
                  No work experience entries added yet.
                </div>
              ) : (
                data.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    draggable={canEdit}
                    onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                    onDrop={() => {
                      if (!canEdit) return;
                      if (draggedIdx !== null && draggedIdx !== idx) {
                        reorderExperiences(draggedIdx, idx);
                      }
                      setDraggedIdx(null);
                    }}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                      draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {canEdit && (
                        <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                          <GripVertical className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{exp.role}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">{exp.company}</span>
                        </div>
                        <div className="text-xs text-gray-400 flex gap-2 mt-0.5">
                          <span>{exp.location}</span>
                          <span>•</span>
                          <span>{exp.duration}</span>
                        </div>
                      </div>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingExpIdx(idx);
                            setExpForm({ ...exp, tagsInput: exp.tags ? exp.tags.join(', ') : '' });
                            setShowForm(true);
                            scrollToForm();
                          }}
                          className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                          title="Edit & Scroll Up"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(
                            'Delete Work Experience',
                            'Are you sure you want to delete this work experience entry? This action cannot be undone.',
                            () => deleteExperience(idx),
                            exp.company ? `${exp.role} at ${exp.company}` : exp.role
                          )}
                          className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 6. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <span>Services Offered</span>
              </h2>

              {canEdit && (!showForm ? (
                <button onClick={() => { setEditingSrvIdx(null); setSrvForm({ title: '', desc: '', tech: [], techInput: '' }); setShowForm(true); scrollToForm(); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs animate-fade-in scroll-mt-24">
                <div>
                  <label className="block text-gray-300 mb-1">Service Title</label>
                  <input type="text" placeholder="e.g. UI/UX Design & Prototyping" value={srvForm.title} onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea rows={2} placeholder="e.g. Creating intuitive and beautiful user interfaces for web and mobile applications." value={srvForm.desc} onChange={(e) => setSrvForm({ ...srvForm, desc: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-mono">Technologies (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Figma, Adobe XD, Tailwind CSS, Framer Motion" value={srvForm.techInput ?? srvForm.tech.join(', ')} onChange={(e) => setSrvForm({ ...srvForm, techInput: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!srvForm.title) return;
                    const techList = (srvForm.techInput ?? srvForm.tech.join(', ')).split(',').map(t => t.trim()).filter(Boolean);
                    const { techInput, ...srvToSave } = srvForm;
                    const finalSrv = { ...srvToSave, tech: techList };
                    if (editingSrvIdx !== null) { updateService(editingSrvIdx, finalSrv); setEditingSrvIdx(null); }
                    else { addService(finalSrv); }
                    setShowForm(false);
                  }} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Save Service</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(data.servicesList || []).map((srv, idx) => (
                <div
                  key={idx}
                  draggable={canEdit}
                  onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                  onDrop={() => {
                    if (!canEdit) return;
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderServices(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between text-xs ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {canEdit && (
                      <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{srv.title}</div>
                      <div className="text-gray-400">{srv.desc}</div>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingSrvIdx(idx); setSrvForm({ ...srv, techInput: srv.tech ? srv.tech.join(', ') : '' }); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(
                          'Delete Service',
                          'Are you sure you want to delete this service? This action cannot be undone.',
                          () => deleteService(idx),
                          srv.title
                        )}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Technical Skills Categories</span>
              </h2>

              {canEdit && (!showForm ? (
                <button onClick={() => { setEditingSkillIdx(null); setSkillForm({ category: '', skills: [], skillsInput: '' }); setShowForm(true); scrollToForm(); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Category</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs animate-fade-in scroll-mt-24">
                <div>
                  <label className="block text-gray-300 mb-1">Category Name</label>
                  <input type="text" placeholder="e.g. DevOps & Cloud" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Skills (Comma-separated)</label>
                  <input type="text" placeholder="e.g. AWS, Kubernetes, Terraform, CI/CD, Ansible" value={skillForm.skillsInput ?? skillForm.skills.join(', ')} onChange={(e) => setSkillForm({ ...skillForm, skillsInput: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!skillForm.category) return;
                    const skillsList = (skillForm.skillsInput ?? skillForm.skills.join(', ')).split(',').map(s => s.trim()).filter(Boolean);
                    const { skillsInput, ...skillToSave } = skillForm;
                    const finalSkill = { ...skillToSave, skills: skillsList };
                    if (editingSkillIdx !== null) { updateSkillCategory(editingSkillIdx, finalSkill); setEditingSkillIdx(null); }
                    else { addSkillCategory(finalSkill); }
                    setShowForm(false);
                  }} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Save Category</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(data.skillsList || []).map((sk, idx) => (
                <div
                  key={idx}
                  draggable={canEdit}
                  onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                  onDrop={() => {
                    if (!canEdit) return;
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderSkills(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between text-xs ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {canEdit && (
                      <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{sk.category}</div>
                      <div className="text-gray-400 mt-0.5">{sk.skills.join(', ')}</div>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingSkillIdx(idx); setSkillForm({ ...sk, skillsInput: sk.skills ? sk.skills.join(', ') : '' }); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(
                          'Delete Skill Category',
                          'Are you sure you want to delete this skill category and all its skills? This action cannot be undone.',
                          () => deleteSkillCategory(idx),
                          sk.category
                        )}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span>Certifications & Achievements</span>
              </h2>

              {canEdit && (!showForm ? (
                <button onClick={() => { setEditingCertIdx(null); setCertForm({ title: '', provider: '', date: '', certificateId: '', link: '', level: 'Professional' }); setShowForm(true); scrollToForm(); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              ))}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs animate-fade-in scroll-mt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Title</label>
                    <input type="text" placeholder="e.g. AWS Solutions Architect Associate" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Provider</label>
                    <input type="text" placeholder="e.g. Amazon Web Services" value={certForm.provider} onChange={(e) => setCertForm({ ...certForm, provider: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Date</label>
                    <input type="text" placeholder="e.g. March 2024" value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Certificate URL / Link</label>
                    <input type="text" placeholder="https://... or PDF link" value={certForm.link} onChange={(e) => setCertForm({ ...certForm, link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Or Upload Certificate File (PDF / Image)</label>
                    <label className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-gray-300 flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>{certForm.link && certForm.link.startsWith('data:') ? 'Certificate File Loaded (Click to Replace)' : 'Choose PDF / Image File'}</span>
                      <input type="file" accept=".pdf,image/*" onChange={handleCertFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs font-semibold">Cancel</button>
                  <button onClick={() => {
                    if (!certForm.title) return;
                    if (editingCertIdx !== null) { updateCertification(editingCertIdx, certForm); setEditingCertIdx(null); }
                    else { addCertification(certForm); }
                    setShowForm(false);
                  }} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Save Certification</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(data.certifications || []).map((cert, idx) => (
                <div
                  key={idx}
                  draggable={canEdit}
                  onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                  onDrop={() => {
                    if (!canEdit) return;
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderCertifications(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between text-xs ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {canEdit && (
                      <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{cert.title}</span>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-[10px]">
                            <ExternalLink className="w-3 h-3" />
                            <span>View Link</span>
                          </a>
                        )}
                      </div>
                      <div className="text-gray-400">{cert.provider} • {cert.date}</div>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingCertIdx(idx); setCertForm(cert); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(
                          'Delete Certification',
                          'Are you sure you want to delete this certification? This action cannot be undone.',
                          () => deleteCertification(idx),
                          cert.title
                        )}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Statistics & Highlights</span>
              </h2>
            </div>

            <div className="space-y-3">
              {(statsForm || []).map((stat, idx) => (
                <div
                  key={idx}
                  draggable={canEdit}
                  onDragStart={(e) => { if (!canEdit) return; setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => { if (canEdit) e.preventDefault(); }}
                  onDrop={() => {
                    if (!canEdit) return;
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      const reordered = [...statsForm];
                      const [moved] = reordered.splice(draggedIdx, 1);
                      reordered.splice(idx, 0, moved);
                      setStatsForm(reordered);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-4 text-xs ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {canEdit && (
                    <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div>
                      <label className="block text-gray-400 mb-1">Label</label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        placeholder="e.g. Projects Built"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...statsForm];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setStatsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 disabled:opacity-80"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Value</label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        placeholder="e.g. 20+"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...statsForm];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setStatsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 disabled:opacity-80"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Subtext</label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        placeholder="e.g. Web & Mobile Applications"
                        value={stat.subtext}
                        onChange={(e) => {
                          const updated = [...statsForm];
                          updated[idx] = { ...updated[idx], subtext: e.target.value };
                          setStatsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 disabled:opacity-80"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              {statsSaved ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Statistics & Highlights updated successfully!</span>
                </div>
              ) : (
                <span />
              )}
              {canEdit && (
                <button
                  onClick={handleSaveStats}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Save Changes</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 10. SECURITY & DATA BACKUP TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Top Header & Sub-section Switcher on Top-Left */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Security & Data Management</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Manage admin credentials, temporary sharing passes, and cloud data backup.</p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10 self-start sm:self-auto flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSecuritySubSection('security')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    securitySubSection === 'security'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Admin Security</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSecuritySubSection('temporary')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    securitySubSection === 'temporary'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Temporary Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSecuritySubSection('backup')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    securitySubSection === 'backup'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Data Backup</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: ADMIN SECURITY */}
            {securitySubSection === 'security' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6 max-w-2xl">
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">New Admin Username</label>
                    <input
                      type="text"
                      value={secUsername}
                      onChange={(e) => setSecUsername(e.target.value)}
                      placeholder="Enter new admin username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">New Admin Password</label>
                    <div className="relative">
                      <input
                        type={showSecPass ? 'text' : 'password'}
                        value={secPassword}
                        onChange={(e) => setSecPassword(e.target.value)}
                        placeholder="Enter new admin password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecPass(!showSecPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showSecPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      value={secConfirmPassword}
                      onChange={(e) => setSecConfirmPassword(e.target.value)}
                      placeholder="Confirm new admin password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {secError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{secError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={async () => {
                      setSecError('');
                      if (!secUsername.trim() || !secPassword.trim()) {
                        setSecError('Username and password cannot be empty.');
                        return;
                      }
                      if (secPassword !== secConfirmPassword) {
                        setSecError('Passwords do not match.');
                        return;
                      }
                      const ok = await updateAdminCredentials(secUsername, secPassword);
                      if (ok) {
                        setSecPassword('');
                        setSecConfirmPassword('');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Update Admin Credentials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => confirmDelete(
                      'Reset Admin Credentials',
                      'Are you sure you want to reset admin credentials back to default (.env / default accounts)? Your custom username and password will be cleared.',
                      () => {
                        resetAdminCredentials();
                        setSecUsername('premkumar');
                        setSecPassword('');
                        setSecConfirmPassword('');
                      },
                      'Default Credentials'
                    )}
                    className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Default / .env</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Emergency Master Recovery</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    If you ever lose access, master recovery login remains accessible using <code className="text-blue-300 font-mono">admin</code> / <code className="text-blue-300 font-mono">admin2615</code>.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 2: TEMPORARY SECURITY & SHARING PASS */}
            {securitySubSection === 'temporary' && (() => {
              const activePass = data?.tempCredential;
              const isPassExpired = activePass ? Date.now() > activePass.expiresAt : false;
              const hasActivePass = Boolean(activePass && !isPassExpired);

              return (
                <div className="space-y-6 max-w-3xl">
                  {/* If pass is active, show ONLY the Active Temporary Pass card */}
                  {hasActivePass && activePass ? (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Clock className="w-5 h-5 text-indigo-400" />
                          <span>Active Temporary Sharing Pass</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Only one temporary pass is allowed at a time. Delete this pass or wait until it expires to generate a new one.
                        </p>
                      </div>

                      {(() => {
                        const remainingMs = activePass.expiresAt - Date.now();
                        const remainingHours = Math.max(0, Math.floor(remainingMs / (3600 * 1000)));
                        const remainingDays = Math.floor(remainingHours / 24);

                        const formattedExpiry = new Date(activePass.expiresAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        });

                        const handleCopy = () => {
                          const u = activePass.plainUsername || 'Temporary User';
                          const p = activePass.plainPassword || '';
                          const permLabel = activePass.permission === 'edit' ? 'Can Edit' : 'Read-Only';
                          const shareText = `Username: ${u}\nPassword: ${p}\nPermission: ${permLabel}\nValid until: ${formattedExpiry}`;
                          navigator.clipboard.writeText(shareText);
                          setCopiedTempId(activePass.id);
                          setTimeout(() => setCopiedTempId(null), 2500);
                        };

                        return (
                          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{activePass.plainUsername || 'Temporary User'}</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                                  Active ({remainingDays > 0 ? `${remainingDays}d ${remainingHours % 24}h left` : `${remainingHours}h left`})
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  activePass.permission === 'edit'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                }`}>
                                  {activePass.permission === 'edit' ? 'Can Edit' : 'Read-Only'}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                                {activePass.plainPassword && (
                                  <span>Password: <code className="text-indigo-300 font-mono">{activePass.plainPassword}</code></span>
                                )}
                                <span>Expires: <strong className="text-gray-200">{formattedExpiry}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                              {/* Read / Edit Permission Toggle */}
                              <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10">
                                <button
                                  type="button"
                                  onClick={() => updateTempPermission('read')}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    activePass.permission !== 'edit'
                                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                                      : 'text-gray-400 hover:text-white border border-transparent'
                                  }`}
                                  title="Change guest permission to Read-Only"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Read</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateTempPermission('edit')}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    activePass.permission === 'edit'
                                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                      : 'text-gray-400 hover:text-white border border-transparent'
                                  }`}
                                  title="Change guest permission to Can Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={handleCopy}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                {copiedTempId === activePass.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-gray-300" />
                                    <span>Copy Share Details</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  confirmDelete(
                                    'Delete Temporary Pass',
                                    'Are you sure you want to delete this temporary access pass? The user will be immediately logged out.',
                                    () => deleteTempCredential(),
                                    activePass.plainUsername || 'Active Pass'
                                  )
                                }
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                title="Delete Pass"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Generator Form */
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <UserPlus className="w-5 h-5 text-indigo-400" />
                          <span>Generate Temporary Sharing Access</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Create temporary username and password for reviewers or clients. Only hashes and expiration are saved in CSV and Supabase.
                        </p>
                      </div>

                      <form onSubmit={handleCreateTempPass} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Temporary Username */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-gray-300 font-semibold">Temporary Username</label>
                              <button
                                type="button"
                                onClick={generateRandomTempCreds}
                                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Auto Generate</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              value={tempUsername}
                              onChange={(e) => setTempUsername(e.target.value)}
                              placeholder="e.g. reviewer_guest"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          {/* Temporary Password */}
                          <div>
                            <label className="block text-gray-300 font-semibold mb-1">Temporary Password</label>
                            <div className="relative">
                              <input
                                type={showTempPass ? 'text' : 'password'}
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                placeholder="Enter or generate password"
                                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowTempPass(!showTempPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                                title={showTempPass ? 'Hide password' : 'Show password'}
                              >
                                {showTempPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Validity Period Selector (1 hour to 30 days) */}
                        <div>
                          <label className="block text-gray-300 mb-1.5 font-semibold flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <span>Validity Period (1 Hour to 30 Days)</span>
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                            {[
                              { hours: 1, label: '1h' },
                              { hours: 6, label: '6h' },
                              { hours: 12, label: '12h' },
                              { hours: 24, label: '1 Day' },
                              { hours: 72, label: '3 Days' },
                              { hours: 168, label: '7 Days' },
                              { hours: 336, label: '14 Days' },
                              { hours: 720, label: '30 Days' },
                            ].map(({ hours, label }) => (
                              <button
                                key={hours}
                                type="button"
                                onClick={() => setTempDurationHours(hours)}
                                className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                                  tempDurationHours === hours
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                    : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            Access automatically expires after {tempDurationHours} hours ({tempDurationHours >= 24 ? `${Math.round(tempDurationHours / 24)} days` : `${tempDurationHours} hours`}).
                          </p>
                        </div>

                        {/* Access Permission Selector (Read or Edit) */}
                        <div>
                          <label className="block text-gray-300 mb-1.5 font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <span>Access Permission (Read or Edit)</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2 max-w-xs">
                            <button
                              type="button"
                              onClick={() => setTempPermissionSelect('read')}
                              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                                tempPermissionSelect === 'read'
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                                  : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Read-Only</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTempPermissionSelect('edit')}
                              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                                tempPermissionSelect === 'edit'
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                                  : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Can Edit</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            {tempPermissionSelect === 'read'
                              ? 'Guest can view dashboard content, but cannot add, edit, or delete items.'
                              : 'Guest has full permission to add, edit, and reorder portfolio content.'}
                          </p>
                        </div>

                        {tempError && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{tempError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Generate Temporary Pass</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* If pass expired, show the expired pass card below generator so admin can delete it */}
                  {isPassExpired && activePass && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-red-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-400" />
                          <span>Previous Pass (Expired)</span>
                        </h4>
                      </div>
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-300 text-sm">{activePass.plainUsername || 'Temporary User'}</span>
                            <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold">
                              Expired
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Expired on: {new Date(activePass.expiresAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            confirmDelete(
                              'Delete Expired Pass',
                              'Are you sure you want to delete this expired pass?',
                              () => deleteTempCredential(),
                              activePass.plainUsername || 'Expired Pass'
                            )
                          }
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer self-end sm:self-auto"
                          title="Delete Expired Pass"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* SECTION 3: DATA BACKUP (DOWNLOAD SUPABASE DATA) */}
            {securitySubSection === 'backup' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span>Supabase Cloud Data Backup</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Download the latest updated data directly from Supabase.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-xs text-gray-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>Download Updated Data</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Fetches current Supabase cloud content and exports as <code className="text-blue-300 font-mono">portfolio.csv</code>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={downloadCSV}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV from Supabase</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-gray-300">Factory Reset</div>
                    <p className="text-[11px] text-gray-400">Restore original defaults.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => confirmDelete(
                      'Reset All Data',
                      'Are you sure you want to reset all portfolio data to factory defaults? All your custom modifications will be replaced with default data.',
                      () => resetToDefaults(),
                      'All Portfolio Content'
                    )}
                    className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Center Delete Confirmation Modal Container */}
      {deleteDialog?.isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDeleteDialog(null)}
        >
          <div 
            className="relative w-full max-w-md bg-[#0b0f24] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              onClick={() => setDeleteDialog(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Center Warning Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 p-[1px] mx-auto mb-4 shadow-lg shadow-red-500/25">
              <div className="w-full h-full bg-[#070a18] rounded-[15px] flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-extrabold text-white mb-2">
              {deleteDialog.title}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {deleteDialog.message}
            </p>

            {/* Optional Item Name Display */}
            {deleteDialog.itemName && (
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/90 truncate mb-5 flex items-center justify-center gap-2">
                <span className="text-gray-400">Target:</span>
                <span className="text-red-300 truncate max-w-[260px]">{deleteDialog.itemName}</span>
              </div>
            )}

            {/* Action Buttons: Cancel and Delete */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold cursor-pointer transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
