import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBlogs, createBlog, updateBlog, deleteBlog } from '../../redux/slices/blogSlice';
import { HiPlus, HiPencilAlt, HiTrash, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const BlogManager = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blog || { blogs: [], loading: false });
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAdminBlogs());
  }, [dispatch]);

  const handleAI = () => {
    toast('AI Writer coming soon! Will use OpenAI to generate content.', { icon: '✨' });
  };

  return (
    <>
      <Helmet>
        <title>Blog Management — TechNova Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Blog Manager</h1>
            <p className="text-surface-400 text-sm mt-1">Create, edit, and publish content.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={handleAI}>
              <HiSparkles className="w-5 h-5 mr-1 text-primary-400" /> AI Writer
            </button>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              <HiPlus className="w-5 h-5 mr-1" /> New Post
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card p-6 border-primary-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Create Blog Post</h3>
            <p className="text-surface-400 text-sm mb-4">Rich text editor integration required here. For now, use the full dashboard for management view.</p>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Close Editor</button>
          </div>
        )}

        <div className="glass-card overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-surface-400">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center text-surface-400">No blog posts found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-surface-300">Title</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Author</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {b.coverImage && <img src={b.coverImage} className="w-12 h-8 rounded object-cover border border-white/10" />}
                        <p className="text-sm font-medium text-white max-w-xs truncate">{b.title}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-surface-300">{b.author?.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-medium border ${b.isPublished ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                        {b.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-surface-400">{format(new Date(b.createdAt), 'MMM d, yyyy')}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-surface-400 hover:text-primary-400 transition-colors">
                          <HiPencilAlt className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-surface-400 hover:text-red-400 transition-colors" onClick={() => dispatch(deleteBlog(b._id))}>
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogManager;
