import { Helmet } from 'react-helmet-async';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile Settings — TechNova</title>
      </Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-bold text-white">Profile Settings</h1>
        <div className="glass-card p-6">
          <p className="text-surface-400">Profile editing form will go here.</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
