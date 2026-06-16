import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlusCircle, HiX, HiUpload, HiCalendar,
  HiCurrencyRupee, HiDocumentText, HiFilter
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { fetchMyProjects, createProject, resetCreateSuccess, clearProjectError } from '../../redux/slices/projectSlice';
import { fetchServices } from '../../redux/slices/serviceSlice';
import ProjectCard from '../../components/dashboard/ProjectCard';

const statusFilters = ['all', 'new', 'in_review', 'proposal_sent', 'in_progress', 'completed', 'on_hold', 'cancelled'];

const Projects = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, loading, createSuccess, error } = useSelector((state) => state.project);
  const { services } = useSelector((state) => state.services);

  const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    serviceId: searchParams.get('service') || '',
    title: '',
    requirements: '',
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
        <title>My Projects — TechNova</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">My Projects</h1>
            <p className="text-surface-400 text-sm mt-1">Manage and track all your submitted projects</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setSearchParams(showForm ? {} : { new: 'true' }); }}
            className={showForm ? 'btn-secondary text-sm !px-5 !py-2.5' : 'btn-primary text-sm !px-5 !py-2.5'}
          >
            {showForm ? (
              <><HiX className="w-4 h-4 mr-2" /> Cancel</>
            ) : (
              <><HiPlusCircle className="w-4 h-4 mr-2" /> Submit New Project</>
            )}
          </button>
        </div>

        {/* New Project Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
                <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <HiDocumentText className="w-5 h-5 text-primary-400" />
                  Project Requirement Form
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">
                      Service Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.serviceId}
                      onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Select a service</option>
                      {services?.map(s => (
                        <option key={s._id} value={s._id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="input-field"
                      placeholder="e.g., E-Commerce Website Redesign"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">
                    Requirements <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Describe your project requirements, features needed, design preferences, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">
                      <HiCalendar className="inline w-4 h-4 mr-1 text-surface-400" />
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">
                      <HiCurrencyRupee className="inline w-4 h-4 mr-1 text-surface-400" />
                      Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="input-field"
                      placeholder="e.g., 50000"
                      min="0"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">
                    <HiUpload className="inline w-4 h-4 mr-1 text-surface-400" />
                    Attachments (max 5 files)
                  </label>
                  <div className="border-2 border-dashed border-surface-600/50 rounded-xl p-6 text-center hover:border-primary-500/30 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="project-files"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                    />
                    <label htmlFor="project-files" className="cursor-pointer">
                      <HiUpload className="w-8 h-8 text-surface-500 mx-auto mb-2" />
                      <p className="text-sm text-surface-400">
                        Drag & drop files or <span className="text-primary-400 font-medium">browse</span>
                      </p>
                      <p className="text-xs text-surface-500 mt-1">PDF, DOC, Images, ZIP — up to 10MB each</p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-surface-800/50 rounded-lg px-3 py-2">
                          <span className="text-sm text-surface-300 truncate">{file.name}</span>
                          <button type="button" onClick={() => removeFile(i)} className="text-surface-400 hover:text-red-400 ml-2">
                            <HiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Project'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <HiFilter className="w-4 h-4 text-surface-500 flex-shrink-0" />
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === s
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Projects List */}
        {loading && !projects.length ? (
          <div className="glass-card p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <HiDocumentText className="w-12 h-12 text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400 font-medium">
              {filter === 'all' ? "You don't have any projects yet." : `No ${filter.replace('_', ' ')} projects.`}
            </p>
            <p className="text-surface-500 text-sm mt-1">Submit your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
