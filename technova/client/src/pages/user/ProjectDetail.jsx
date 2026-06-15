import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Project Details — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-white">Project Details</h1>
        <div className="glass-card p-6">
          <p className="text-surface-400">Details for project ID: {id}</p>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
