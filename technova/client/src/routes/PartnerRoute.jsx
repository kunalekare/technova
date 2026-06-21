import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../services/api';

const PartnerRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isPartner, setIsPartner] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      api.get('/partners/my')
        .then(res => {
          if (res.data.data?.partner?.verificationStatus === 'verified') {
            setIsPartner(true);
          } else {
            setIsPartner(false);
          }
        })
        .catch(() => setIsPartner(false))
        .finally(() => setChecking(false));
    } else if (!loading) {
      setChecking(false);
    }
  }, [isAuthenticated, loading]);

  if (loading || checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/partner-portal" replace />;
  }

  if (isPartner === false) {
    // Redirect non-partners or unverified partners to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PartnerRoute;
