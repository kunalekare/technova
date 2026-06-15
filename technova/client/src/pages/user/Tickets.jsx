import { Helmet } from 'react-helmet-async';

const Tickets = () => {
  return (
    <>
      <Helmet>
        <title>Support Tickets — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Support Tickets</h1>
            <p className="text-surface-400 text-sm">Get help with your projects and orders</p>
          </div>
          <button className="btn-primary">New Ticket</button>
        </div>

        <div className="glass-card p-12 text-center">
          <p className="text-surface-400">You don't have any active support tickets.</p>
        </div>
      </div>
    </>
  );
};

export default Tickets;
