import { Helmet } from 'react-helmet-async';

const Projects = () => {
  return (
    <>
      <Helmet>
        <title>My Projects — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-white">My Projects</h1>
        <div className="glass-card p-12 text-center">
          <p className="text-surface-400">You don't have any active projects.</p>
        </div>
      </div>
    </>
  );
};

export default Projects;
