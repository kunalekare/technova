import { Helmet } from 'react-helmet-async';

const ProjectsManager = () => {
  return (
    <>
      <Helmet>
        <title>All Projects — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-white">All Projects</h1>
        <div className="glass-card p-12 text-center text-surface-400">
          Global view of all projects and team assignments.
        </div>
      </div>
    </>
  );
};

export default ProjectsManager;
