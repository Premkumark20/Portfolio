import React, { useState } from 'react';
import { 
  ShieldCheck, LogOut, Download, Upload, RotateCcw, Plus, Trash2, Edit2, Check, X,
  Briefcase, User, Code2, GraduationCap, Wrench, Sparkles, Award, BarChart3,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { ExperienceItem, PortfolioData } from '@/lib/csvData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    data,
    logout,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    moveExperience,
    addProject,
    updateProject,
    deleteProject,
    moveProject,
    addEducation,
    updateEducation,
    deleteEducation,
    moveEducation,
    addService,
    updateService,
    deleteService,
    moveService,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    moveSkillCategory,
    addCertification,
    updateCertification,
    deleteCertification,
    moveCertification,
    updateStats,
    moveStat,
    resetToDefaults,
    downloadCSV,
    importCSVContent,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'experience' | 'personal' | 'projects' | 'education' | 'services' | 'skills' | 'certifications' | 'stats'>('experience');

  // Form states
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [expForm, setExpForm] = useState<ExperienceItem>({
    role: '',
    company: '',
    location: '',
    duration: '',
    summary: '',
    tags: [],
    gradient: 'from-primary to-primary-glow',
  });

  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projForm, setProjForm] = useState<PortfolioData['projects'][0]>({
    title: '',
    description: '',
    tech: [],
    type: 'Self Project',
    duration: '2025',
    category: 'Web Development',
    github: '',
    live: '',
    progress: 80,
  });

  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<PortfolioData['educationList'][0]>({
    type: 'Degree',
    institution: '',
    location: '',
    degree: '',
    specialization: '',
    period: '',
    score: '',
    statusBadge: 'Completed',
    isPrimary: false,
  });

  const [editingSrvIndex, setEditingSrvIndex] = useState<number | null>(null);
  const [srvForm, setSrvForm] = useState<PortfolioData['servicesList'][0]>({
    title: '',
    desc: '',
    tech: [],
  });

  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<PortfolioData['skillsList'][0]>({
    category: '',
    skills: [],
  });

  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [certForm, setCertForm] = useState<PortfolioData['certifications'][0]>({
    title: '',
    provider: '',
    date: '',
    certificateId: '',
    link: '',
    level: 'Professional',
  });

  if (!isOpen || !data) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importCSVContent(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-lg animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#080c1e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-[#080c1e] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Admin Management Panel</h2>
              <p className="text-xs text-gray-400">Manage all portfolio sections & CSV data persistence</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={downloadCSV}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Export portfolio.csv"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <label className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={resetToDefaults}
              className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Reset to initial data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#050816] border-b border-white/10 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'personal', label: 'Personal & Bio', icon: User },
            { id: 'projects', label: 'Projects', icon: Code2 },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'experience', label: 'Work Experience', icon: Briefcase },
            { id: 'services', label: 'Services', icon: Wrench },
            { id: 'skills', label: 'Skills', icon: Sparkles },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'stats', label: 'Stats', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: PERSONAL & BIO */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Personal Information & Hero Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Title / Headline</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Specialization</label>
                  <input
                    type="text"
                    value={data.specialization}
                    onChange={(e) => updatePersonalInfo({ specialization: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Status Badge</label>
                  <input
                    type="text"
                    value={data.statusBadge}
                    onChange={(e) => updatePersonalInfo({ statusBadge: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Phone</label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">GitHub Link</label>
                  <input
                    type="text"
                    value={data.github_link}
                    onChange={(e) => updatePersonalInfo({ github_link: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">LinkedIn Link</label>
                  <input
                    type="text"
                    value={data.linkedin_link}
                    onChange={(e) => updatePersonalInfo({ linkedin_link: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 mb-1 font-semibold">Hero Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={data.heroTags ? data.heroTags.join(', ') : ''}
                    onChange={(e) => updatePersonalInfo({ heroTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 mb-1 font-semibold">Bio Summary</label>
                  <textarea
                    rows={4}
                    value={data.bioSummary}
                    onChange={(e) => updatePersonalInfo({ bioSummary: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span>Projects Management</span>
                </h3>
                <button
                  onClick={() => {
                    setEditingProjectIndex(null);
                    setProjForm({
                      title: '',
                      description: '',
                      tech: [],
                      type: 'Self Project',
                      duration: '2025',
                      category: 'Web Development',
                      github: '',
                      live: '',
                      progress: 80,
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Form */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 text-xs">
                <h4 className="font-bold text-blue-400 uppercase tracking-wider">
                  {editingProjectIndex !== null ? `Edit Project #${editingProjectIndex + 1}` : 'Create New Project'}
                </h4>
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
                      placeholder="e.g. Minor Project / Hackathon"
                      value={projForm.type}
                      onChange={(e) => setProjForm({ ...projForm, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Cloud Security & AI"
                      value={projForm.category}
                      onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Duration / Timeline</label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2026 - May 2026"
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
                      value={projForm.tech.join(', ')}
                      onChange={(e) => setProjForm({ ...projForm, tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
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
                  <button
                    onClick={() => {
                      if (!projForm.title) return;
                      if (editingProjectIndex !== null) {
                        updateProject(editingProjectIndex, projForm);
                        setEditingProjectIndex(null);
                      } else {
                        addProject(projForm);
                      }
                      setProjForm({
                        title: '',
                        description: '',
                        tech: [],
                        type: 'Self Project',
                        duration: '2025',
                        category: 'Web Development',
                        github: '',
                        live: '',
                        progress: 80,
                      });
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProjectIndex !== null ? 'Save Project' : 'Add Project'}</span>
                  </button>
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {(data.projects || []).map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{proj.title}</span>
                      <p className="text-gray-400 mt-1">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.tech.map((t, ti) => (
                          <span key={ti} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, 'up')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === (data.projects || []).length - 1}
                        onClick={() => moveProject(idx, 'down')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === (data.projects || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProjectIndex(idx);
                          setProjForm(proj);
                        }}
                        className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(idx)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span>Education & Qualifications Management</span>
                </h3>
                <button
                  onClick={() => {
                    setEditingEduIndex(null);
                    setEduForm({
                      type: 'Degree',
                      institution: '',
                      location: '',
                      degree: '',
                      specialization: '',
                      period: '',
                      score: '',
                      statusBadge: 'Completed',
                      isPrimary: false,
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              </div>

              {/* Form */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Degree / Qualification</label>
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
                    <label className="block text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={eduForm.location}
                      onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Period / Years</label>
                    <input
                      type="text"
                      value={eduForm.period}
                      onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Score / CGPA</label>
                    <input
                      type="text"
                      value={eduForm.score}
                      onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Category / Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Under Graduate, State Board Secondary Education..."
                      value={eduForm.specialization}
                      onChange={(e) => setEduForm({ ...eduForm, specialization: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                      list="edu-category-suggestions"
                    />
                    <datalist id="edu-category-suggestions">
                      <option value="Under Graduate" />
                      <option value="State Board Higher Secondary Education" />
                      <option value="State Board Secondary Education" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Status Badge</label>
                    <input
                      type="text"
                      value={eduForm.statusBadge}
                      onChange={(e) => setEduForm({ ...eduForm, statusBadge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (!eduForm.degree) return;
                      if (editingEduIndex !== null) {
                        updateEducation(editingEduIndex, eduForm);
                        setEditingEduIndex(null);
                      } else {
                        addEducation(eduForm);
                      }
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Education</span>
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {(data.educationList || []).map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{edu.degree}</div>
                      <div className="text-gray-400">{edu.institution} • {edu.period}</div>
                      {edu.specialization && (
                        <div className="text-purple-400 text-xs font-semibold mt-0.5">{edu.specialization}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveEducation(idx, 'up')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === (data.educationList || []).length - 1}
                        onClick={() => moveEducation(idx, 'down')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === (data.educationList || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingEduIndex(idx);
                          setEduForm(edu);
                        }}
                        className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEducation(idx)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300"
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

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span>Work Experience Management</span>
                </h3>
                <button
                  onClick={() => {
                    setEditingExperienceIndex(null);
                    setExpForm({
                      role: '',
                      company: '',
                      location: '',
                      duration: '',
                      summary: '',
                      tags: [],
                      gradient: 'from-primary to-primary-glow',
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Experience</span>
                </button>
              </div>

              {/* Form for Create / Update Experience */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {editingExperienceIndex !== null ? `Edit Experience #${editingExperienceIndex + 1}` : 'Create New Experience'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1">Role / Position</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Developer Intern"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. TechNova Labs"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Tamil Nadu"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2025 - Apr 2025"
                      value={expForm.duration}
                      onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Summary / Key Contributions</label>
                    <textarea
                      rows={2}
                      placeholder="Built responsive UI components with React and Tailwind..."
                      value={expForm.summary}
                      onChange={(e) => setExpForm({ ...expForm, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, TailwindCSS, Vite"
                      value={expForm.tags.join(', ')}
                      onChange={(e) => setExpForm({ ...expForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {editingExperienceIndex !== null && (
                    <button
                      onClick={() => setEditingExperienceIndex(null)}
                      className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!expForm.role || !expForm.company) return;
                      if (editingExperienceIndex !== null) {
                        updateExperience(editingExperienceIndex, expForm);
                        setEditingExperienceIndex(null);
                      } else {
                        addExperience(expForm);
                      }
                      setExpForm({
                        role: '',
                        company: '',
                        location: '',
                        duration: '',
                        summary: '',
                        tags: [],
                        gradient: 'from-primary to-primary-glow',
                      });
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingExperienceIndex !== null ? 'Save Changes' : 'Add Experience'}</span>
                  </button>
                </div>
              </div>

              {/* Experience Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400">Current Experiences ({data.experiences?.length || 0})</h4>
                {(data.experiences || []).map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{exp.role}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">{exp.company}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex gap-3">
                        <span>{exp.location}</span>
                        <span>•</span>
                        <span>{exp.duration}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{exp.summary}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.tags.map((t, ti) => (
                          <span key={ti} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveExperience(idx, 'up')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === (data.experiences || []).length - 1}
                        onClick={() => moveExperience(idx, 'down')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === (data.experiences || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingExperienceIndex(idx);
                          setExpForm(exp);
                        }}
                        className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExperience(idx)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300"
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

          {/* TAB 5: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-400" />
                  <span>Services Offered</span>
                </h3>
                <button
                  onClick={() => {
                    setEditingSrvIndex(null);
                    setSrvForm({ title: '', desc: '', tech: [] });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">Service Title</label>
                  <input
                    type="text"
                    value={srvForm.title}
                    onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={srvForm.desc}
                    onChange={(e) => setSrvForm({ ...srvForm, desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Technologies / Features (Comma-separated)</label>
                  <input
                    type="text"
                    value={srvForm.tech.join(', ')}
                    onChange={(e) => setSrvForm({ ...srvForm, tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!srvForm.title) return;
                    if (editingSrvIndex !== null) {
                      updateService(editingSrvIndex, srvForm);
                      setEditingSrvIndex(null);
                    } else {
                      addService(srvForm);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Service
                </button>
              </div>

              <div className="space-y-3">
                {(data.servicesList || []).map((srv, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{srv.title}</div>
                      <div className="text-gray-400">{srv.desc}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveService(idx, 'up')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === (data.servicesList || []).length - 1}
                        onClick={() => moveService(idx, 'down')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === (data.servicesList || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingSrvIndex(idx); setSrvForm(srv); }} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteService(idx)} className="p-1.5 rounded-lg bg-red-500/20 text-red-300" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span>Technical Skills Categories</span>
                </h3>
                <button
                  onClick={() => {
                    setEditingSkillIndex(null);
                    setSkillForm({ category: '', skills: [] });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Category</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Skill Items (Comma-separated)</label>
                  <input
                    type="text"
                    value={skillForm.skills.join(', ')}
                    onChange={(e) => setSkillForm({ ...skillForm, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!skillForm.category) return;
                    if (editingSkillIndex !== null) {
                      updateSkillCategory(editingSkillIndex, skillForm);
                      setEditingSkillIndex(null);
                    } else {
                      addSkillCategory(skillForm);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Category
                </button>
              </div>

              <div className="space-y-3">
                {(data.skillsList || []).map((sk, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{sk.category}</div>
                      <div className="text-gray-400 mt-1">{sk.skills.join(', ')}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSkillCategory(idx, 'up')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === (data.skillsList || []).length - 1}
                        onClick={() => moveSkillCategory(idx, 'down')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === (data.skillsList || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingSkillIndex(idx); setSkillForm(sk); }} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteSkillCategory(idx)} className="p-1.5 rounded-lg bg-red-500/20 text-red-300" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span>Certifications & Achievements</span>
                </h3>
                <button
                  onClick={() => {
                    setEditingCertIndex(null);
                    setCertForm({ title: '', provider: '', date: '', certificateId: '', link: '', level: 'Professional' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Provider / Organization</label>
                    <input
                      type="text"
                      value={certForm.provider}
                      onChange={(e) => setCertForm({ ...certForm, provider: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Date</label>
                    <input
                      type="text"
                      value={certForm.date}
                      onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Certificate Link</label>
                    <input
                      type="text"
                      value={certForm.link}
                      onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!certForm.title) return;
                    if (editingCertIndex !== null) {
                      updateCertification(editingCertIndex, certForm);
                      setEditingCertIndex(null);
                    } else {
                      addCertification(certForm);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Certification
                </button>
              </div>

              <div className="space-y-3">
                {(data.certifications || []).map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{cert.title}</div>
                      <div className="text-gray-400">{cert.provider} • {cert.date}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveCertification(idx, 'up')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === (data.certifications || []).length - 1}
                        onClick={() => moveCertification(idx, 'down')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          idx === (data.certifications || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingCertIndex(idx); setCertForm(cert); }} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteCertification(idx)} className="p-1.5 rounded-lg bg-red-500/20 text-red-300" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Achievement Numbers & Highlights</span>
              </h3>

              <div className="space-y-3">
                {(data.statsList || []).map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Stat #{idx + 1} Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...data.statsList];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          updateStats(updated);
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
                          const updated = [...data.statsList];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          updateStats(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 font-mono">Subtext</label>
                      <input
                        type="text"
                        value={stat.subtext}
                        onChange={(e) => {
                          const updated = [...data.statsList];
                          updated[idx] = { ...updated[idx], subtext: e.target.value };
                          updateStats(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 sm:col-span-3 pt-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveStat(idx, 'up')}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                      >
                        <ChevronUp className="w-3.5 h-3.5" /> Move Up
                      </button>
                      <button
                        disabled={idx === (data.statsList || []).length - 1}
                        onClick={() => moveStat(idx, 'down')}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          idx === (data.statsList || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/10 border-white/15 text-gray-200 hover:bg-blue-600/30 hover:text-blue-300'
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" /> Move Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
