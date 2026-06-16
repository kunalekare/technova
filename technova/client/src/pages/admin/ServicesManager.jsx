import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, fetchCategories } from '../../redux/slices/serviceSlice';
import { HiPlus, HiPencilAlt, HiTrash, HiCheck, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ServicesManager = () => {
  const dispatch = useDispatch();
  const { services, categories, loading } = useSelector((state) => state.services);
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'categories'

  useEffect(() => {
    dispatch(fetchServices({ limit: 100 })); // fetch all for admin
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Service Catalogue — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Service Catalogue</h1>
            <p className="text-surface-400 text-sm mt-1">Manage service offerings and categories.</p>
          </div>
          <button className="btn-primary" onClick={() => toast('Service Editor coming soon!')}>
            <HiPlus className="w-5 h-5 mr-1" /> Add {activeTab === 'services' ? 'Service' : 'Category'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10">
          {['services', 'categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-surface-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="glass-card overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-surface-400">Loading...</div>
          ) : activeTab === 'services' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-surface-300">Service</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Category</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Pricing Tier</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services?.map((s) => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={s.coverImage} alt="" className="w-12 h-8 object-cover rounded border border-white/10" />
                        <div>
                          <p className="text-sm font-medium text-white">{s.title}</p>
                          <p className="text-xs text-surface-400">★ {s.avgRating?.toFixed(1)} ({s.totalReviews})</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-surface-300">{s.category?.name}</td>
                    <td className="p-4 text-sm text-surface-300">
                      Starts at ${s.pricingTiers?.[0]?.price}
                    </td>
                    <td className="p-4">
                      {s.isActive ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Active</span>
                      ) : (
                        <span className="text-xs text-surface-400 bg-surface-500/10 px-2 py-1 rounded-md border border-surface-500/20">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-surface-400 hover:text-primary-400 transition-colors">
                        <HiPencilAlt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-surface-300">Category Name</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Slug</th>
                  <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories?.map((c) => (
                  <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white" dangerouslySetInnerHTML={{ __html: c.icon }} />
                        <p className="text-sm font-medium text-white">{c.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-surface-400">{c.slug}</td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-surface-400 hover:text-primary-400 transition-colors">
                        <HiPencilAlt className="w-4 h-4" />
                      </button>
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

export default ServicesManager;
