import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit2, Check, X, GripVertical, Upload, ExternalLink,
  Briefcase, User, Code2, GraduationCap, Wrench, Sparkles, Award, BarChart3, Eye, EyeOff, Lock, AlertCircle,
  FileText, Star, Download, KeyRound
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
    login,
    updateAdminCredentials,
    resetAdminCredentials,
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
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'personal' | 'resumes' | 'projects' | 'education' | 'experience' | 'services' | 'skills' | 'certifications' | 'stats' | 'security'>('personal');

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

  // Security Credentials Management State
  const [secUsername, setSecUsername] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [secConfirmPassword, setSecConfirmPassword] = useState('');
  const [showSecPass, setShowSecPass] = useState(false);
  const [secError, setSecError] = useState('');

  // Resume Upload Form State
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeFileContent, setResumeFileContent] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isResumePrimary, setIsResumePrimary] = useState(false);

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
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const ok = login(authUsername, authPassword);
    if (!ok) {
      setAuthError('Invalid administrator credentials.');
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
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#080c1e]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1px]">
            <div className="w-full h-full bg-[#080c1e] rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-400">Manage & Update Portfolio</p>
          </div>
        </div>

        {/* Tab Navigation */}
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
            { id: 'security', label: 'Security', icon: KeyRound },
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

        {/* Close Tab */}
        <button
          onClick={() => window.close()}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Close Tab"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </header>

      {/* Mobile Tab Select */}
      <div className="lg:hidden p-4 bg-[#050816] border-b border-white/10 flex overflow-x-auto gap-2">
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
          { id: 'security', label: 'Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setShowForm(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-8 flex-1 space-y-6">

        {/* 1. PERSONAL & BIO TAB */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSavePersonalInfo} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Personal Information & Profile</span>
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={personalForm.name}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Title / Headline</label>
                <input
                  type="text"
                  value={personalForm.title}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Specialization</label>
                <input
                  type="text"
                  value={personalForm.specialization}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Status Badge</label>
                <input
                  type="text"
                  value={personalForm.statusBadge}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, statusBadge: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  value={personalForm.email}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Phone</label>
                <input
                  type="text"
                  value={personalForm.phone}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">GitHub Link</label>
                <input
                  type="text"
                  value={personalForm.github_link}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, github_link: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">LinkedIn Link</label>
                <input
                  type="text"
                  value={personalForm.linkedin_link}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, linkedin_link: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Hero Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={personalForm.heroTagsInput}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, heroTagsInput: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Bio Summary</label>
                <textarea
                  rows={4}
                  value={personalForm.bioSummary}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, bioSummary: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {personalSaved ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Personal information updated successfully!</span>
                </div>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Save Changes</span>
              </button>
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

              {!showForm ? (
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
              )}
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
                      placeholder="e.g. Prem Kumar - Software Engineer Resume"
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
                      {res.isPrimary ? (
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
                      <button
                        onClick={() => deleteResume(res.id)}
                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all flex items-center justify-center"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

              {!showForm ? (
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
              )}
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
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
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
                      value={projForm.description}
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      value={projForm.techInput ?? projForm.tech.join(', ')}
                      onChange={(e) => setProjForm({ ...projForm, techInput: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">GitHub Link</label>
                    <input
                      type="text"
                      value={projForm.github || ''}
                      onChange={(e) => setProjForm({ ...projForm, github: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Live Demo Link</label>
                    <input
                      type="text"
                      value={projForm.live || ''}
                      onChange={(e) => setProjForm({ ...projForm, live: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
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
                  draggable
                  onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderProjects(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 text-xs cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag up/down to reorder">
                      <GripVertical className="w-5 h-5" />
                    </div>

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
                      onClick={() => deleteProject(idx)}
                      className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

              {!showForm ? (
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
              )}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs animate-fade-in scroll-mt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Degree</label>
                    <input
                      type="text"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Institution</label>
                    <input
                      type="text"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Period</label>
                    <input
                      type="text"
                      value={eduForm.period}
                      onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Score</label>
                    <input
                      type="text"
                      value={eduForm.score}
                      onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
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
                  draggable
                  onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderEducation(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 text-xs cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{edu.degree}</div>
                      <div className="text-gray-400">{edu.institution} • {edu.period}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingEduIdx(idx); setEduForm(edu); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteEducation(idx)} className="p-2 rounded-xl bg-red-500/20 text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
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

              {!showForm ? (
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
              )}
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
                    draggable
                    onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIdx !== null && draggedIdx !== idx) {
                        reorderExperiences(draggedIdx, idx);
                      }
                      setDraggedIdx(null);
                    }}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing ${
                      draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                        <GripVertical className="w-5 h-5" />
                      </div>

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
                        onClick={() => deleteExperience(idx)}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

              {!showForm ? (
                <button onClick={() => { setEditingSrvIdx(null); setSrvForm({ title: '', desc: '', tech: [], techInput: '' }); setShowForm(true); scrollToForm(); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              )}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs animate-fade-in scroll-mt-24">
                <div>
                  <label className="block text-gray-300 mb-1">Service Title</label>
                  <input type="text" value={srvForm.title} onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea rows={2} value={srvForm.desc} onChange={(e) => setSrvForm({ ...srvForm, desc: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-mono">Technologies (Comma-separated)</label>
                  <input type="text" value={srvForm.techInput ?? srvForm.tech.join(', ')} onChange={(e) => setSrvForm({ ...srvForm, techInput: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
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
                  draggable
                  onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderServices(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between text-xs cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{srv.title}</div>
                      <div className="text-gray-400">{srv.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingSrvIdx(idx); setSrvForm({ ...srv, techInput: srv.tech ? srv.tech.join(', ') : '' }); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteService(idx)} className="p-2 rounded-xl bg-red-500/20 text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
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

              {!showForm ? (
                <button onClick={() => { setEditingSkillIdx(null); setSkillForm({ category: '', skills: [], skillsInput: '' }); setShowForm(true); scrollToForm(); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Category</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              )}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs animate-fade-in scroll-mt-24">
                <div>
                  <label className="block text-gray-300 mb-1">Category Name</label>
                  <input type="text" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Skills (Comma-separated)</label>
                  <input type="text" value={skillForm.skillsInput ?? skillForm.skills.join(', ')} onChange={(e) => setSkillForm({ ...skillForm, skillsInput: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
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
                  draggable
                  onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderSkills(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between text-xs cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{sk.category}</div>
                      <div className="text-gray-400 mt-0.5">{sk.skills.join(', ')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingSkillIdx(idx); setSkillForm({ ...sk, skillsInput: sk.skills ? sk.skills.join(', ') : '' }); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteSkillCategory(idx)} className="p-2 rounded-xl bg-red-500/20 text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
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

              {!showForm ? (
                <button onClick={() => { setEditingCertIdx(null); setCertForm({ title: '', provider: '', date: '', certificateId: '', link: '', level: 'Professional' }); setShowForm(true); scrollToForm(); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              ) : (
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl bg-gray-700 text-white text-xs font-semibold flex items-center gap-1">
                  <X className="w-4 h-4" />
                  <span>Hide Form</span>
                </button>
              )}
            </div>

            {showForm && (
              <div ref={formRef} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs animate-fade-in scroll-mt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Title</label>
                    <input type="text" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Provider</label>
                    <input type="text" value={certForm.provider} onChange={(e) => setCertForm({ ...certForm, provider: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Date</label>
                    <input type="text" value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white" />
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
                  draggable
                  onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      reorderCertifications(draggedIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between text-xs cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                      <GripVertical className="w-5 h-5" />
                    </div>
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
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingCertIdx(idx); setCertForm(cert); setShowForm(true); scrollToForm(); }} className="p-2 rounded-xl bg-blue-500/20 text-blue-300"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteCertification(idx)} className="p-2 rounded-xl bg-red-500/20 text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
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
                  draggable
                  onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIdx !== null && draggedIdx !== idx) {
                      const reordered = [...statsForm];
                      const [moved] = reordered.splice(draggedIdx, 1);
                      reordered.splice(idx, 0, moved);
                      setStatsForm(reordered);
                    }
                    setDraggedIdx(null);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-4 text-xs cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx ? 'bg-blue-600/20 border-blue-500 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-gray-400 hover:text-white transition-colors p-1" title="Drag to reorder">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div>
                      <label className="block text-gray-400 mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...statsForm];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setStatsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...statsForm];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setStatsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Subtext</label>
                      <input
                        type="text"
                        value={stat.subtext}
                        onChange={(e) => {
                          const updated = [...statsForm];
                          updated[idx] = { ...updated[idx], subtext: e.target.value };
                          setStatsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
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
              <button
                onClick={handleSaveStats}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* 10. SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-400" />
                  <span>Admin Security & Credential Management</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Update your admin login username and password dynamically.</p>
              </div>
            </div>

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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
                  onClick={() => {
                    setSecError('');
                    if (!secUsername.trim() || !secPassword.trim()) {
                      setSecError('Username and password cannot be empty.');
                      return;
                    }
                    if (secPassword !== secConfirmPassword) {
                      setSecError('Passwords do not match.');
                      return;
                    }
                    const ok = updateAdminCredentials(secUsername, secPassword);
                    if (ok) {
                      setSecPassword('');
                      setSecConfirmPassword('');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Admin Credentials</span>
                </button>

                <button
                  onClick={() => {
                    resetAdminCredentials();
                    setSecUsername('');
                    setSecPassword('');
                    setSecConfirmPassword('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                >
                  <span>Reset to Default / .env</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <div className="font-bold text-gray-200">How Credential Storage Works</div>
                <p className="text-[11px] text-gray-400">
                  Updating credentials here saves them to browser storage so your new login works instantly.
                  Due to browser web security rules, client-side web apps cannot directly overwrite files on disk (<code className="text-blue-400 font-mono">.env</code>).
                </p>
                {secUsername && (
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-400">
                    <div>VITE_ADMIN_USERNAME={secUsername}</div>
                    <div>VITE_ADMIN_PASSWORD={secPassword || '••••••••'}</div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Emergency Recovery Option</span>
                </div>
                <p className="text-[11px] text-gray-300">
                  If you ever forget your custom credentials, master emergency login remains available using <code className="text-blue-300 font-mono">admin</code> / <code className="text-blue-300 font-mono">admin2615</code>.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPage;
