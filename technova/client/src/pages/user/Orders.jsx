import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { format } from 'date-fns';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order || { orders: [], loading: false });

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>My Orders — TechNova</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Order History</h1>
          <p className="text-surface-400 text-sm">Track your payments and invoices</p>
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-surface-400">Loading orders...</div>
          ) : orders?.length === 0 ? (
            <div className="p-8 text-center text-surface-400">You haven't placed any orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-sm font-semibold text-surface-300">Order ID</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Service</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Date</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Amount</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-sm font-medium text-white">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-sm text-surface-300">{order.service?.title || 'Custom Service'}</td>
                      <td className="p-4 text-sm text-surface-400">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                      <td className="p-4 text-sm font-semibold text-primary-400">${order.amount}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          order.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
