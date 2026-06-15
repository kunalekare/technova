import { Helmet } from 'react-helmet-async';

const ServicesManager = () => {
  return (
    <>
      <Helmet>
        <title>Service Catalogue — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-white">Service Catalogue</h1>
        <div className="glass-card p-12 text-center text-surface-400">
          CRUD interface for Categories and Services.
        </div>
      </div>
    </>
  );
};

export default ServicesManager;
