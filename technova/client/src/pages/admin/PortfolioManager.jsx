import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminPortfolios, deletePortfolio } from '../../redux/slices/portfolioSlice';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';

const PortfolioManager = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.portfolio || { items: [], loading: false });
  
  useEffect(() => {
    dispatch(fetchAdminPortfolios());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Portfolio Management — TechNova Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Portfolio Cases</h1>
            <p className="text-surface-400 text-sm mt-1">Manage case studies and past work.</p>
          </div>
          <button className="btn-primary">
            <HiPlus className="w-5 h-5 mr-1" /> Add Case Study
          </button>
        </div>

        <div className="glass-card overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-surface-400">Loading portfolio...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-surface-400">No case studies found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-surface-300">Project</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Category</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Client</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Featured</th>
                  <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] && <img src={p.images[0]} className="w-12 h-12 rounded object-cover border border-white/10" />}
                        <p className="text-sm font-medium text-white">{p.title}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-surface-300">{p.category?.name}</td>
                    <td className="p-4 text-sm text-surface-300">{p.client}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-medium border ${p.isFeatured ? 'text-primary-400 bg-primary-500/10 border-primary-500/20' : 'text-surface-400 bg-surface-500/10 border-surface-500/20'}`}>
                        {p.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-surface-400 hover:text-primary-400 transition-colors">
                          <HiPencilAlt className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-surface-400 hover:text-red-400 transition-colors" onClick={() => dispatch(deletePortfolio(p._id))}>
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

export default PortfolioManager;
