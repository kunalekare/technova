import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlusCircle, HiX, HiUpload, HiCalendar,
  HiCurrencyRupee, HiDocumentText, HiFilter, HiOutlineCubeTransparent
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { fetchMyProjects, createProject, resetCreateSuccess, clearProjectError } from '../../redux/slices/projectSlice';
import { fetchServices } from '../../redux/slices/serviceSlice';
import ProjectCard from '../../components/dashboard/ProjectCard';

const statusFilters = ['all', 'new', 'in_review', 'proposal_sent', 'in_progress', 'completed', 'on_hold', 'cancelled'];

const Projects = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, loading, createSuccess, error } = useSelector((state) => state.project);
  const { services } = useSelector((state) => state.services);

  const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
  const [filter, setFilter] = useState('all');
  
  // Safely extract AI predefined scope if available
  const predefinedDesc = location.state?.description ? `[Original Request]:\n${location.state.description}\n\n` : '';
  const predefinedScope = location.state?.predefinedScope ? `[AI Architecture Blueprint]:\n${JSON.stringify(location.state.predefinedScope, null, 2)}` : '';
  
  const [form, setForm] = useState({
    serviceId: searchParams.get('service') || '',
    title: location.state?.predefinedScope ? 'AI Scoped Custom Project' : '',
    requirements: predefinedDesc + predefinedScope,
    budget: '',
    deadline: '',
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    dispatch(fetchMyProjects());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      toast.success('Project submitted successfully!');
      dispatch(resetCreateSuccess());
      setShowForm(false);
      setForm({ serviceId: '', title: '', requirements: '', budget: '', deadline: '' });
      setFiles([]);
      setSearchParams({});
    }
    if (error) {
      toast.error(error);
      dispatch(clearProjectError());
    }
  }, [createSuccess, error, dispatch, setSearchParams]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.title || !form.requirements) {
      toast.error('Please fill in all required fields');
      return;
    }
    const formData = new FormData();
    formData.append('serviceId', form.serviceId);
    formData.append('title', form.title);
    formData.append('requirements', form.requirements);
    if (form.budget) formData.append('budget', form.budget);
    if (form.deadline) formData.append('deadline', form.deadline);
    files.forEach(file => formData.append('files', file));

    dispatch(createProject(formData));
  };

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <>
      <Helmet>
        <title>My Projects | TechNova</title>
      </Helmet>
      
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-surface-900/50 p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
              <HiOutlineCubeTransparent className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">My Projects</h1>
              <p className="text-surface-400 text-sm mt-1">Manage, track, and request new digital operations.</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setSearchParams(showForm ? {} : { new: 'true' }); }}
            className={`transition-all duration-300 ${showForm ? 'btn-outline text-sm !px-6 !py-3' : 'btn-primary text-sm !px-6 !py-3 shadow-lg shadow-primary-500/20'}`}
          >
            {showForm ? (
              <><HiX className="w-5 h-5 mr-2" /> Cancel Request</>
            ) : (
              <><HiPlusCircle className="w-5 h-5 mr-2" /> Submit New Project</>
            )}
          </button>
        </div>

        {/* New Project Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-10 space-y-8 rounded-3xl border-primary-500/20 relative shadow-2xl">
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
                
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3 relative z-10 border-b border-white/5 pb-4">
                  <HiDocumentText className="w-6 h-6 text-primary-400" />
                  Project Specification Document
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-surface-300 mb-2">
                      Service Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={form.serviceId}
                        onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                        className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer shadow-inner"
                        required
                      >
                        <option value="">-- Select a core service --</option>
                        {services?.map(s => (
                          <option key={s._id} value={s._id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-300 mb-2">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors shadow-inner"
                      placeholder="e.g., Enterprise E-Commerce Redesign"
                      required
                    />
                  </div>
                </div>

                <div className="relative z-10">
                  <label className="block text-sm font-bold text-surface-300 mb-2 flex items-center justify-between">
                    <span>Requirements Payload <span className="text-red-400">*</span></span>
                    {location.state?.predefinedScope && <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">Auto-filled by AI Scoper</span>}
                  </label>
                  <textarea
                    rows={8}
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    className={`w-full bg-surface-900 border ${location.state?.predefinedScope ? 'border-purple-500/30' : 'border-white/10'} rounded-xl p-4 text-surface-300 focus:border-primary-500 outline-none transition-colors resize-y shadow-inner font-mono text-sm leading-relaxed`}
                    placeholder="Describe your architecture requirements, user flows, and technical preferences..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-surface-300 mb-2">
                      <HiCalendar className="inline w-5 h-5 mr-1.5 text-surface-400" />
                      Target Deadline
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors shadow-inner [color-scheme:dark]"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-300 mb-2">
                      <HiCurrencyRupee className="inline w-5 h-5 mr-1.5 text-surface-400" />
                      Estimated Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors shadow-inner"
                      placeholder="e.g., 150000"
                      min="0"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="relative z-10 border-t border-white/5 pt-8">
                  <label className="block text-sm font-bold text-surface-300 mb-2">
                    <HiUpload className="inline w-5 h-5 mr-1.5 text-surface-400" />
                    Asset Attachments
                  </label>
                  <div className="border-2 border-dashed border-white/10 bg-surface-900/50 rounded-2xl p-8 text-center hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                    />
                    <div className="w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <HiUpload className="w-8 h-8 text-surface-400 group-hover:text-primary-400 transition-colors" />
                    </div>
                    <p className="text-base text-surface-300 font-medium">
                      Drag & drop project files or <span className="text-primary-400 font-bold">browse local system</span>
                    </p>
                    <p className="text-xs text-surface-500 mt-2 font-medium">Accepts PDF, DOC, Images, ZIP — up to 10MB each (Max 5)</p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface-800 border border-white/5 rounded-xl px-4 py-3 hover:border-red-500/30 transition-colors group">
                          <span className="text-sm font-medium text-surface-300 truncate pr-4">{file.name}</span>
                          <button type="button" onClick={() => removeFile(i)} className="text-surface-500 hover:text-red-400 transition-colors p-1 bg-surface-900 rounded-md group-hover:bg-red-500/10">
                            <HiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button type="submit" disabled={loading} className="btn-primary !px-10 !py-4 text-lg w-full sm:w-auto shadow-lg shadow-primary-500/25">
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Transmitting...
                      </span>
                    ) : (
                      'Initialize Project'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="bg-surface-900/50 p-2 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <div className="pl-2 pr-4 border-r border-white/10 flex items-center text-surface-500 font-bold text-sm shrink-0">
              <HiFilter className="w-5 h-5 mr-2" />
              Filter Board
            </div>
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  filter === s
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                }`}
              >
                {s === 'all' ? 'All Pipelines' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {loading && !projects.length ? (
          <div className="glass-card p-20 text-center rounded-3xl border border-white/5">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-surface-400 font-medium text-lg">Fetching your pipelines...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
            <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
              <HiDocumentText className="w-12 h-12 text-surface-500 -rotate-3" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white relative z-10">
              {filter === 'all' ? "No projects in the pipeline." : `No ${filter.replace('_', ' ')} projects found.`}
            </h3>
            <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">Submit a new project request to kickstart your next big digital operation.</p>
            {filter === 'all' && (
              <button onClick={() => { setShowForm(true); setSearchParams({ new: 'true' }); }} className="mt-8 btn-primary relative z-10 shadow-lg shadow-primary-500/20">
                <HiPlusCircle className="w-5 h-5 mr-2" /> Start First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
