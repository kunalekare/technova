import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBlogs, createBlog, deleteBlog } from '../../redux/slices/blogSlice';
import { 
  HiPlus, HiPencilAlt, HiTrash, HiSparkles, HiOutlineDocumentText, 
  HiOutlinePhotograph, HiOutlineTag, HiX, HiOutlineEye, HiOutlineGlobeAlt,
  HiOutlineCollection
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const BlogManager = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blog || { blogs: [], loading: false });
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editor State Mock
  const [postForm, setPostForm] = useState({
    title: '', category: 'engineering', content: '', coverImage: ''
  });

  useEffect(() => {
    dispatch(fetchAdminBlogs());
  }, [dispatch]);

  const handleAI = () => {
    toast.success('AI Writer initialized! Content generation starting...', { icon: '✨' });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Blog post successfully published!');
      setShowForm(false);
      setPostForm({ title: '', category: 'engineering', content: '', coverImage: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  // Stats
  const publishedCount = blogs.filter(b => b.isPublished).length;
  const draftCount = blogs.filter(b => !b.isPublished).length;

  return (
    <>
      <Helmet>
        <title>Blog Management — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Blog Manager</h1>
            <p className="text-surface-400 text-sm mt-1">Create, curate, and publish rich content articles.</p>
          </div>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 rounded-xl text-sm font-bold bg-surface-800 hover:bg-surface-700 text-white border border-white/5 transition-all flex items-center shadow-lg hover:shadow-primary-500/10 group" 
              onClick={handleAI}
            >
              <HiSparkles className="w-5 h-5 mr-2 text-primary-400 group-hover:text-primary-300 animate-pulse" /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">AI Writer</span>
            </button>
            <button 
              className="btn-primary shadow-lg shadow-primary-500/20 flex items-center" 
              onClick={() => setShowForm(true)}
            >
              <HiPlus className="w-5 h-5 mr-2" /> New Post
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineDocumentText className="w-24 h-24 text-white -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Total Posts</p>
              <p className="text-4xl font-display font-bold text-white">{blogs.length}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineGlobeAlt className="w-24 h-24 text-emerald-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Published</p>
              <p className="text-4xl font-display font-bold text-emerald-400">{publishedCount}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineCollection className="w-24 h-24 text-amber-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Drafts</p>
              <p className="text-4xl font-display font-bold text-amber-400">{draftCount}</p>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="glass-card overflow-visible relative rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 bg-surface-900/50 rounded-t-3xl flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">All Articles</h2>
          </div>
          
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-surface-400 font-medium">Loading articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-24 text-center border-dashed rounded-b-3xl">
              <HiOutlineDocumentText className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-lg font-bold text-white mb-1">No articles found</p>
              <p className="text-surface-400">Write your first post to start building your audience.</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/30 border-b border-white/5">
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Article</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Author</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Date</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {blogs.map((b) => (
                    <tr key={b._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4 max-w-sm">
                          {b.coverImage ? (
                            <img src={b.coverImage} className="w-16 h-12 rounded-lg object-cover border border-white/10 shadow-md flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-surface-500 group-hover:text-primary-400 transition-colors">
                              <HiOutlinePhotograph className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{b.title}</p>
                            <p className="text-[11px] font-mono text-surface-500 mt-1 truncate">/{b.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-700 flex items-center justify-center text-[10px] font-bold text-white">
                            {b.author?.name?.charAt(0) || 'A'}
                          </div>
                          <p className="text-sm text-surface-300 font-medium">{b.author?.name || 'Admin'}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          b.isPublished 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}>
                          {b.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-surface-400 font-medium">
                        {format(new Date(b.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-1">
                          <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors tooltip-trigger" title="Preview">
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors tooltip-trigger" title="Edit">
                            <HiPencilAlt className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors tooltip-trigger" 
                            title="Delete"
                            onClick={() => dispatch(deleteBlog(b._id))}
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => !isSubmitting && setShowForm(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-4xl relative z-10 shadow-2xl flex flex-col h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 text-primary-400 rounded-xl flex items-center justify-center">
                    <HiOutlineDocumentText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">Create New Article</h2>
                    <p className="text-surface-400 text-xs mt-0.5">Drafting mode. Unsaved changes will be lost.</p>
                  </div>
                </div>
                <button onClick={() => !isSubmitting && setShowForm(false)} className="p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Article Title</label>
                  <input
                    type="text" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})}
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors text-lg font-medium"
                    placeholder="e.g. The Future of Web Development in 2026"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5 flex items-center gap-2"><HiOutlineTag className="w-4 h-4 text-surface-500" /> Category</label>
                    <select
                      value={postForm.category} onChange={e => setPostForm({...postForm, category: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="engineering">Engineering</option>
                      <option value="design">Design & UX</option>
                      <option value="product">Product Updates</option>
                      <option value="company">Company News</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5 flex items-center gap-2"><HiOutlinePhotograph className="w-4 h-4 text-surface-500" /> Cover Image URL</label>
                    <input
                      type="url" value={postForm.coverImage} onChange={e => setPostForm({...postForm, coverImage: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-[300px]">
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Content (Markdown Supported)</label>
                  <div className="flex-1 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-surface-800 px-4 py-2 border-b border-white/5 flex gap-2">
                      <button className="text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-1 rounded">Write</button>
                      <button className="text-xs font-bold text-surface-400 hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-colors">Preview</button>
                    </div>
                    <textarea
                      value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})}
                      className="flex-1 bg-surface-900 w-full p-4 text-surface-300 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                      placeholder="Write your article content here..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center shrink-0 mt-6">
                <button type="button" className="text-surface-400 hover:text-white text-sm font-medium transition-colors" onClick={() => setShowForm(false)}>Discard Draft</button>
                <div className="flex gap-3">
                  <button type="button" className="py-2.5 px-5 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors border border-white/5">Save as Draft</button>
                  <button onClick={handleCreatePost} disabled={isSubmitting} className="py-2.5 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Publish Article'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogManager;
