import { Helmet } from 'react-helmet-async';

const Wishlist = () => {
  return (
    <>
      <Helmet>
        <title>My Wishlist — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-white">My Wishlist</h1>
        <div className="glass-card p-12 text-center">
          <p className="text-surface-400">You haven't saved any services yet.</p>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
